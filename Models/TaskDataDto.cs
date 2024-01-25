namespace PowerOfControl.Models;

// class that stores task information at the transfer stage
public class TaskDataDto
{
    public int id { get; set; }
    public string name { get; set; }
    public string text { get; set; }
    public bool is_archive { get; set; }
    public DateTime notification_time { get; set; }
    public bool is_pin { get; set; }
}

public class TaskUpdateDto
{
    public int id { get; set; }
    public string name { get; set; }
    public string text { get; set; }
    public DateTime notification_time { get; set; }
    public bool is_pin { get; set; }
}

public class TaskPinUpdateDto
{
    public int id { get; set; }
    public bool is_pin { get; set; }
}