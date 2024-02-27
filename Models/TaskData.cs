namespace PowerOfControl.Models;

// class that stores full task information
public class TaskData
{
    public int user_id { get; set; }
    public string name { get; set; }
    public string text { get; set; }
    public bool is_archive { get; set; }
    public DateTime? notification_time { get; set; }
    public bool is_pin { get; set; }
}

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

public class TaskStatusUpdateDto
{
    public int id { get; set; }
    public bool status { get; set; }
}

public class TaskTitleDto
{
    public int id { get; set; }
    public string name { get; set; }
}

public class TaskViewDto
{
    public string name { get; set; }
    public string text { get; set; }
}

public class TaskTextDto
{
	public int id { get; set; }
	public string text { get; set; }
}