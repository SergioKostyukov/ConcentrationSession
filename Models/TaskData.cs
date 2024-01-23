namespace PowerOfControl.Models;

// class that stores full task information
public class TaskData
{
    public int user_id { get; set; }
    public string name { get; set; }
    public string text { get; set; }
    public bool is_archive { get; set; }
    public DateTime notification_time { get; set; }
    public bool is_pin { get; set; }
}