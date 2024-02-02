using System.ComponentModel.DataAnnotations;

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

// class that stores user information at the transfer stage
public class UserDto
{
    public int id { get; set; }
    public string tag_name { get; set; }
    public string user_name { get; set; }
    public string email { get; set; }
    public bool notifications { get; set; }
}

public class UserLoginDto
{
    [Required]
    public string tag_name { get; set; }

    [Required]
    public string password { get; set; }
}


public class UpdatePasswordDto
{
    public int id { get; set; }
    public string old_password { get; set; }
    public string password { get; set; }
}