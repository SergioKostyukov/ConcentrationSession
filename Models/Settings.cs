namespace PowerOfControl.Models;

public class Settings
{
    public int user_id { get; set; }
    public int id { get; set; }
    public int work_time { get; set; }
    public int break_time { get; set; }
    public bool is_notification_sound { get; set; }
    public int day_goal { get; set; }
    public TimeSpan reset_time { get; set; }
    public bool is_weekend { get; set; }
}

public class SettingsSessionDto
{
    public int user_id { get; set; }
    public int work_time { get; set; }
    public int break_time { get; set; }
    public bool is_notification_sound { get; set; }
}

public class SettingsGoalDto
{
    public int user_id { get; set; }
    public int day_goal { get; set; }
    public TimeSpan reset_time { get; set; }
    public bool is_weekend { get; set; }
}