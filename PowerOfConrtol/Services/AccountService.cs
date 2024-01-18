using Newtonsoft.Json;
using PowerOfControl.Data;
using PowerOfControl.Models;

namespace PowerOfControl.Services;

public class AccountService
{
    private static readonly string LogFilePath = "./Data/account_log.txt";
    private static readonly string UserDataFilePath = "./Data/user_data.json";
    private readonly JwtSettings jwtSettings;
    private readonly Logger logger;

    public AccountService(JwtSettings jwtSettings)
    {
        this.jwtSettings = jwtSettings;
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

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Authorization error: {ex.Message}");
            return false;
        }
    }

    // Method to handle user login
    public bool LoginUser(UserLoginDto request)
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
                var TokenObj = JwtHelpers.JwtHelpers.GenTokenkey(new UserToken()
                {
                    Id = storedUser.id,
                    UserName = storedUser.user_name,
                    UserTag = storedUser.tag_name,
                    Email = storedUser.email,
                    Notifications = storedUser.notifications,
                }, jwtSettings);

                // Save current user data to Redis
                SaveUserToCashe(TokenObj);

                logger.LogInfo($"Login successful");

                return true;
            }
            else
            {
                throw new Exception("Wrong password");
            }
        }
        catch (Exception ex)
        {
            logger.LogError($"Login error: {ex.Message}");
            return false;
        }
    }

    // Method to handle user data update 
    public bool UpdateUser(UpdateUserDto request)
    {
        try
        {
            request.email = request.email.ToLower();
            request.tag_name = request.tag_name.ToLower();

            string data = File.ReadAllText(UserDataFilePath);
            var currentUser = JsonConvert.DeserializeObject<UserToken>(data);

            if (currentUser.UserTag != request.tag_name)
            {
                // Check if the user already exists
                var userExist = FindUser(request.tag_name);
                if (userExist != null)
                {
                    throw new Exception($"User with this tag already exists: {JsonConvert.SerializeObject(request.tag_name)}");
                }
            }

            UpdateUserCasheData(request);

            UpdateUserDataBaseData(request);

            logger.LogInfo($"User data updated successful");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Update user data error: {ex.Message}");
            return false;
        }
    }

    // Method to handle user password update
    public bool UpdatePassword(UpdatePasswordDto request)
    {
        try
        {
            User? storedUser = GetCurrentUser();
            if (storedUser == null)
            {
                throw new Exception("No such user");
            }

            // Verify the password
            if (BCrypt.Net.BCrypt.Verify(request.old_password, storedUser.password))
            {
                // Hash the user's password
                request.password = BCrypt.Net.BCrypt.HashPassword(request.password, BCrypt.Net.BCrypt.GenerateSalt());

                // Save current user data to Redis
                UpdateUserPassword(request);

                logger.LogInfo($"Update password successful");

                return true;
            }
            else
            {
                throw new Exception("Wrong password");
            }
        }
        catch (Exception ex)
        {
            logger.LogError($"Update user password error: {ex.Message}");
            return false;
        }
    }

    // Method to handle user logout
    public bool LogoutUser()
    {
        try
        {
            // Clear user data file
            File.WriteAllText(UserDataFilePath, string.Empty);

            logger.LogInfo($"Logout successful");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Logout error: {ex.Message}");
            return false;
        }
    }

    // Method to handle user deletion
    public bool DeleteUser()
    {
        try
        {
            DeleteUserFromDB();

            DeleteUserFromCashe();

            logger.LogInfo($"Delete successful");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Delete error: {ex.Message}");
            return false;
        }
    }


    // ---------------- CASHE methods ----------------
    // Method to get the user from Cashe
    public User? GetCurrentUser()
    {
        string json = File.ReadAllText(UserDataFilePath);
        if (json == "")
        {
            return null;
        }

        var userFileData = JsonConvert.DeserializeObject<UserToken>(json);

        var user = new User
        {
            id = userFileData.Id,
            user_name = userFileData.UserName,
            tag_name = userFileData.UserTag,
            email = userFileData.Email,
            password = "",
            notifications = userFileData.Notifications
        };

        return user;
    }

    // Method to get the user id from Cashe
    private static int GetUserID()
    {
        string json = File.ReadAllText(UserDataFilePath);
        if (json == "")
        {
            return -1;
        }

        var userFileData = JsonConvert.DeserializeObject<UserToken>(json);

        return userFileData.Id;
    }

    // Method to save user data to the Cashe
    private static void SaveUserToCashe(UserToken token)
    {
        File.WriteAllText(UserDataFilePath, string.Empty);

        string json = JsonConvert.SerializeObject(token);

        File.AppendAllText(UserDataFilePath, json + Environment.NewLine);
    }

    // Method to update user data in Cashe
    private static void UpdateUserCasheData(UpdateUserDto request)
    {
        string data = File.ReadAllText(UserDataFilePath);

        var userFileData = JsonConvert.DeserializeObject<UserToken>(data);

        File.WriteAllText(UserDataFilePath, string.Empty);

        userFileData.UserName = request.user_name;
        userFileData.UserTag = request.tag_name;
        userFileData.Email = request.email;
        userFileData.Notifications = request.notifications;

        string json = JsonConvert.SerializeObject(userFileData);

        File.AppendAllText(UserDataFilePath, json + Environment.NewLine);
    }

    // Method to delete user data from the Cashe
    private static void DeleteUserFromCashe()
    {
        File.WriteAllText(UserDataFilePath, string.Empty);
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
    private static void UpdateUserDataBaseData(UpdateUserDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE users SET user_name = @user_name, tag_name = @tag_name, email = @email, notifications = @notifications WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@id", GetUserID()},
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
            { "@id", GetUserID()},
            { "@Newpassword", request.password },
            { "@Oldpassword", request.old_password }
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    // Method to delate user data from the DataBase
    private static void DeleteUserFromDB()
    {
        var dbContext = new DataBaseContext();

        var command = "DELETE FROM users WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@id", GetUserID()}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }
}
