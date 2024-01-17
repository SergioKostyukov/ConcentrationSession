using Newtonsoft.Json;
using PowerOfControl.Data;
using PowerOfControl.Models;

namespace PowerOfControl.Services;

public class AccountService
{
    private readonly string LogFilePath = "./Data/account_log.txt";
    private readonly string UserDataFilePath = "./Data/user_data.json";
    private readonly JwtSettings jwtSettings;
    private readonly Logger logger;
    public AccountService(JwtSettings jwtSettings)
    {
        this.jwtSettings = jwtSettings;
        logger = new Logger(LogFilePath);
    }

    public bool AuthorizationUser(User user)
    {
        try
        {
            // make user password hash
            user.password = BCrypt.Net.BCrypt.HashPassword(user.password);
            user.email = user.email.ToLower();
            user.tag_name = user.tag_name.ToLower();

            // is this user already exists
            var userExist = FindUser(user.tag_name);
            if (userExist != null)
            {
                throw new Exception($"User alredy exists: {JsonConvert.SerializeObject(user)}");
            }

            // save user data to DB
            SaveUserToDB(user);

            logger.LogInfo($"New user data saved: {JsonConvert.SerializeObject(user)}");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Autherization error: {ex.Message}");
            return false;
        }
    }

    public bool LoginUser(UserDto request)
    {
        try
        {
            // compare users db data with user request data
            request.tag_name = request.tag_name.ToLower();
            var storedUser = FindUser(request.tag_name);
            if (storedUser == null)
            {
                throw new Exception("User not find");
            }

            // if user was found
            if (BCrypt.Net.BCrypt.Verify(request.password, storedUser.password))
            {
                // create token
                var TokenObj = JwtHelpers.JwtHelpers.GenTokenkey(new UserToken()
                {
                    Id = storedUser.id,
                    UserName = storedUser.user_name,
                    UserTag = storedUser.tag_name,
                    Email = storedUser.email,
                    Notifications = storedUser.notifications,
                }, jwtSettings);

                // save current user data to Redis
                SaveCurrentUser(TokenObj);

                logger.LogInfo($"Login: {JsonConvert.SerializeObject(TokenObj.Token)}");

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

    public bool DeleteUser(UserDto user)
    {
        try
        {
            //// find user
            //var ObjToRemove = FindUser(user.Email);
            //if (ObjToRemove == null)
            //{
            //    throw new Exception($"User not find: {JsonConvert.SerializeObject(user)}");
            //}
            //var lineToRemove = JsonConvert.SerializeObject(ObjToRemove);
            //Console.WriteLine(lineToRemove);

            //string[] lines = File.ReadAllLines(UserDataFilePath);

            //// create new file data
            //var newLines = new StringBuilder();
            //foreach (string line in lines)
            //{
            //    if (line.Normalize() != lineToRemove.Normalize())
            //    {
            //        newLines.AppendLine(line);
            //    }
            //}

            //File.WriteAllText(UserDataFilePath, newLines.ToString());

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Delete error: {ex.Message}");
            return false;
        }
    }

    private void SaveCurrentUser(UserToken token)
    {
        string json = JsonConvert.SerializeObject(token);

        File.AppendAllText(UserDataFilePath, json + Environment.NewLine);
    }

    private static void SaveUserToDB(User user)
    {
        var dbContext = new DataBaseContext();

        var command = $"INSERT INTO users(user_name, tag_name, email, password, notifications) " +
            $"VALUES ('{user.user_name}', '{user.tag_name}', '{user.email}', '{user.password}', '{user.notifications}')";

        dbContext.ExecuteNonQuery(command);
    }

    private static User? FindUser(string request)
    {
        var dbContext = new DataBaseContext();

        var command = $"SELECT * FROM users WHERE tag_name = '{request}'";

        using (var reader = dbContext.ExecuteQuery(command))
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
}
