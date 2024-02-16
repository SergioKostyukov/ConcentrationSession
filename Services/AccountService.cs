using Newtonsoft.Json;
using PowerOfControl.Data;
using PowerOfControl.Models;

namespace PowerOfControl.Services;

public class AccountService
{
    private static readonly string LogFilePath = "./Data/account_log.txt";
    private readonly JwtSettings jwtSettings;
    private readonly Logger logger;
    private readonly SettingsService settingsService;

    public AccountService(JwtSettings jwtSettings, SettingsService settingsService)
    {
        this.jwtSettings = jwtSettings;
        this.settingsService = settingsService;
        logger = new Logger(LogFilePath);
    }

    // Method to handle user authorization
    public bool AuthorizationUser(User user)
    {
        try
        {
            // Hash the user's password
            user.password = BCrypt.Net.BCrypt.HashPassword(user.password);
            user.email = user.email.ToLower();
            user.tag_name = user.tag_name.ToLower();

            // Check if the user already exists
            var userExist = FindUser(user.tag_name);
            if (userExist != null)
            {
                throw new Exception($"User already exists: {JsonConvert.SerializeObject(user)}");
            }

            // Save user data to the database
            SaveUserToDB(user);

            logger.LogInfo($"New user authorized");

            var currUser = FindUser(user.tag_name);
            settingsService.SetDefaultSettings(currUser.id);
            // !!! Add default tasks/habits blocks !!!

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Authorization error: {ex.Message}");
            return false;
        }
    }

    // Method to handle user login
    public LoginResponse LoginUser(UserLoginDto request)
    {
        try
        {
            // Compare users' database data with user request data
            request.tag_name = request.tag_name.ToLower();
            var storedUser = FindUser(request.tag_name);
            if (storedUser == null)
            {
                throw new Exception("User not found");
            }

            // If the user was found, verify the password
            if (BCrypt.Net.BCrypt.Verify(request.password, storedUser.password))
            {
                // Create a token
                var token = CreateToken(storedUser);

                logger.LogInfo($"Login successful");

                var settings = settingsService.GetSettings(storedUser.id);

                return new LoginResponse { Token = token, Settings = settings};
            }
            else
            {
                throw new Exception("Wrong password");
            }
        }
        catch (Exception ex)
        {
            logger.LogError($"Login error: {ex.Message}");
            return new LoginResponse { Token = "", Settings = null }; ;
        }
    }

    // Method to handle user data update 
    public string? UpdateUser(UserDto request, string currentUserTag)
    {
        try
        {
            // update user info in DataBase
            request.email = request.email.ToLower();
            request.tag_name = request.tag_name.ToLower();
            if (currentUserTag != request.tag_name)
            {
                // Check if the user already exists
                var userExist = FindUser(request.tag_name);
                if (userExist != null)
                {
                    throw new Exception($"User with this tag already exists: {JsonConvert.SerializeObject(request.tag_name)}");
                }
            }
            UpdateUserData(request);

            logger.LogInfo($"User data updated successful");

            // Update (create new) token
            var storedUser = FindUser(request.tag_name);
            var token = CreateToken(storedUser);

            logger.LogInfo($"User token updated successful");

            return token;
        }
        catch (Exception ex)
        {
            logger.LogError($"Update user data error: {ex.Message}");
            return "";
        }
    }

    // Method to handle user password update
    public bool UpdatePassword(UpdatePasswordDto request)
    {
        try
        {
            //UserInfo? storedUser = GetCurrentUser();
            //if (storedUser == null)
            //{
            //    throw new Exception("No such user");
            //}

            //// Verify the password
            //if (BCrypt.Net.BCrypt.Verify(request.old_password, storedUser.password))
            //{
            //    // Hash the user's password
            //    request.password = BCrypt.Net.BCrypt.HashPassword(request.password, BCrypt.Net.BCrypt.GenerateSalt());

            //    // Save current user data to Redis
            //    UpdateUserPassword(request);

            //    logger.LogInfo($"Update password successful");

            //    return true;
            //}
            //else
            //{
            //    throw new Exception("Wrong password");
            //}
            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Update user password error: {ex.Message}");
            return false;
        }
    }

    // Method to handle user deletion
    public bool DeleteUser(string id)
    {
        try
        {
            DeleteUserFromDB(id);

            logger.LogInfo($"Delete successful");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Delete error: {ex.Message}");
            return false;
        }
    }

    // Method to get the curr user
    public User? GetCurrentUser(string? tag_name)
    {
        if (tag_name == null) return null;

        var currUserInfo = FindUser(tag_name);

        return currUserInfo;
    }

    // Method to create new token
    private string CreateToken(User storedUser)
    {
        var token = JwtHelpers.JwtHelpers.GenTokenkey(new UserDto()
        {
            id = storedUser.id,
            user_name = storedUser.user_name,
            tag_name = storedUser.tag_name,
            email = storedUser.email,
            notifications = storedUser.notifications,
        }, jwtSettings);

        return token;
    }

    // ---------------- DATABASE methods ----------------

    // Method to find a user in the DataBase
    private static User? FindUser(string request)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM users WHERE tag_name = @request";
        var parameters = new Dictionary<string, object> { { "@request", request } };

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            if (reader.Read())
            {
                var user = new User
                {
                    id = Convert.ToInt16(reader["id"]),
                    tag_name = reader["tag_name"].ToString(),
                    user_name = reader["user_name"].ToString(),
                    email = reader["email"].ToString(),
                    password = reader["password"].ToString(),
                    notifications = Convert.ToBoolean(reader["notifications"])
                };

                return user;
            }
        }

        return null;
    }

    // Method to save user data to the DataBase
    private static void SaveUserToDB(User user)
    {
        var dbContext = new DataBaseContext();

        var command = "INSERT INTO users(user_name, tag_name, email, password, notifications) " +
            "VALUES (@user_name, @tag_name, @email, @password, @notifications)";

        var parameters = new Dictionary<string, object>
        {
            { "@user_name", user.user_name },
            { "@tag_name", user.tag_name },
            { "@email", user.email },
            { "@password", user.password },
            { "@notifications", user.notifications }
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    // Method to update user data in DataBase
    private static void UpdateUserData(UserDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE users SET user_name = @user_name, tag_name = @tag_name, email = @email, notifications = @notifications WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@id", request.id},
            { "@user_name", request.user_name },
            { "@tag_name", request.tag_name },
            { "@email", request.email },
            { "@notifications", request.notifications }
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    // Method to update user password 
    private static void UpdateUserPassword(UpdatePasswordDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE users SET password = @Newpassword WHERE id = @id AND password =@Oldpassword;";

        var parameters = new Dictionary<string, object>
        {
            { "@id", request.id},
            { "@Newpassword", request.password },
            { "@Oldpassword", request.old_password }
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    // Method to delate user data from the DataBase
    private static void DeleteUserFromDB(string id)
    {
        var dbContext = new DataBaseContext();

        var command = "DELETE FROM users WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@id", int.Parse(id)}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }
}
