namespace PowerOfControl.Models;

// class that stores full user information
public class User
{
    public int id { get; set; }
    public string tag_name { get; set; }
    public string user_name { get; set; }
    public string email { get; set; }
    public string password { get; set; }
    public bool notifications { get; set; }
}