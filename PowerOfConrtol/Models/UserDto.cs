using System.ComponentModel.DataAnnotations;

namespace PowerOfControl.Models;

// class that stores user information at the login stage
public class UserDto
{
    public string TagName { get; set; }

    public string Password { get; set; }
}