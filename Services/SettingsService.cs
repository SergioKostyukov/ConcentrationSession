using System.Threading.Tasks;
using PowerOfControl.Data;
using PowerOfControl.Models;

namespace PowerOfControl.Services;
public class SettingsService
{
    private static readonly string LogFilePath = "./Data/settings_log.txt";
    private readonly Logger logger;

    public SettingsService()
    {
        logger = new Logger(LogFilePath);
    }

    public bool SetDefaultSettings(int user_id)
    {
        try
        {
            SetDefault(user_id);

            logger.LogInfo($"Default settings are set");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Default setting error: {ex.Message}");
            return false;
        }
    }

    public Settings GetSettings(int user_id)
    {
        try
        {
            var actualSettings = FindSettings(user_id);

            logger.LogInfo($"Receiving settings is successful");

            return actualSettings;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error getting settings: {ex.Message}");
            return null;
        }
    }

    public bool UpdateSessionParams(SettingsSessionDto request)
    {
        return false;
    }

    public bool UpdateGoalParams(SettingsGoalDto request)
    {
        return false;
    }

    // ---------------- DATABASE methods ----------------

    // 
    private void SetDefault(int user_id)
    {
        var dbContext = new DataBaseContext();

        var command = "INSERT INTO settings(user_id) " +
            "VALUES (@user_id)";

        var parameters = new Dictionary<string, object>
        {
            { "@user_id", user_id }
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private Settings FindSettings(int user_id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM settings WHERE user_id = @user_id";
        var parameters = new Dictionary<string, object> { { "@user_id", user_id } };

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            if (reader.Read())
            {
                var settings = new Settings
                {
                    work_time = Convert.ToInt16(reader["work_time"]),
                    break_time = Convert.ToInt16(reader["break_time"]),
                    is_notification_sound = Convert.ToBoolean(reader["is_notification_sound"]),
                    day_goal = Convert.ToInt16(reader["day_goal"]),
                    reset_time = TimeSpan.Parse(reader["reset_time"].ToString()),
                    is_weekend = Convert.ToBoolean(reader["is_weekend"])
                };

                return settings;
            }
        }

        return null;
    }
}