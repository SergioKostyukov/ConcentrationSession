namespace PowerOfControl.Models;

// class that stores full task information
public class NoteData
{
    public int user_id { get; set; }
    public string name { get; set; }
    public string text { get; set; }
    public bool is_archive { get; set; }
    public bool is_pin { get; set; }
}

// class that stores task information at the transfer stage
public class NoteDataDto
{
    public int id { get; set; }
    public string name { get; set; }
    public string text { get; set; }
    public bool is_archive { get; set; }
    public bool is_pin { get; set; }
}

public class NoteUpdateDto
{
    public int id { get; set; }
    public string name { get; set; }
    public string text { get; set; }
    public bool is_pin { get; set; }
}

public class NoteStatusUpdateDto
{
    public int id { get; set; }
    public bool status { get; set; }
}