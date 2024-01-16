using Microsoft.AspNetCore.Mvc;
using PowerOfControl.Controllers;
using PowerOfControl.Models;
using System.Text;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace PowerOfControl.Services;

public class AccountService
{
    private readonly string LogFilePath = "./Data/account_log.txt";
    private readonly string UserDataFilePath = "./Data/user_data.txt";
    private readonly Logger logger;
    public AccountService()
    {
        logger = new Logger(LogFilePath);
    }

    public bool AuthUser(User user)
    {
        try
        {
            // make user password hash
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.Email = user.Email.ToLower();

            // is this user already exists
            var userExist = FindUser(user.Email);
            if (userExist != null)
            {
                throw new Exception($"User alredy exists: {JsonConvert.SerializeObject(user)}");
            }

            // Saving user data to "db"
            SaveUserToDB(user);

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Autherization error: {ex.Message}");
            return false;
        }
    }

    public bool LoginUser(UserDto userDto)
    {
        string json = JsonConvert.SerializeObject(userDto);

        logger.LogInfo($"Login: {json}");

        return true;
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

    private void SaveUserToDB(User user)
    {
        string json = JsonConvert.SerializeObject(user);
        using (var writer = new StreamWriter(UserDataFilePath, true))
        {
            writer.WriteLine(json);
        }

        logger.LogInfo($"Authorized: {json}");
    }

    private User? FindUser(string request)
    {
        string[] jsonLines = File.ReadAllLines(UserDataFilePath);

        if (jsonLines.Length == 0) return null;

        // compare users db data with user request data
        var storedUser = new User();
        foreach (string line in jsonLines)
        {
            storedUser = JsonConvert.DeserializeObject<User>(line);

            if (storedUser != null && storedUser.Email == request)
            {
                break;
            }
            storedUser = null;
        }

        return storedUser;
    }
}
