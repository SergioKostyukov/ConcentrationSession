using System.ComponentModel.DataAnnotations;

namespace PowerOfControl.Models;

// class that stores user information at the login stage
public class UserDto
{
    [Required]
    public string tag_name { get; set; }

    [Required]
    public string password { get; set; }
}