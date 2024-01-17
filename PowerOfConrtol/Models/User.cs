namespace PowerOfControl.Models;

public class User
{
    // class that stores full user information
    public int id { get; set; }
    public string tag_name { get; set; }
    public string user_name { get; set; }
    public string email { get; set; }
    public string password { get; set; }
    public bool notifications { get; set; }
}