using Microsoft.AspNetCore.Mvc;
using PowerOfControl.Services;
using PowerOfControl.Models;

namespace PowerOfControl.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly AccountService _authService;

    public AccountController(AccountService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    public IActionResult Authorization(User user)
    {
        if (_authService.AuthorizationUser(user))
        {
            return Ok(new { message = "User authorization successfully" });
        }
        else
        {
            return BadRequest(new { message = "User authorization failed" });
        }
    }

    [HttpPost]
    public IActionResult Login(UserDto user)
    {
        if (_authService.LoginUser(user))
        {
            return Ok(new { message = "User login successfully" });
        }
        else
        {
            return BadRequest(new { message = "User login failed" });
        }
    }

    [HttpGet]
    public IActionResult GetUser()
    {
        var user = _authService.GetCurrentUser();
        if (user != null)
        {
            var userDto = new
            {
                user.tag_name,
                user.user_name,
                user.email,
                user.notifications
            };

            return Ok(new { message = "User data get successful", user = userDto });
        }
        else
        {
            return Ok(new { message = "User not found" });
        }
    }

    [HttpDelete]
    public IActionResult Delete(UserDto user)
    {
        if (_authService.DeleteUser(user))
        {
            return Ok(new { message = "User delete successfull" });
        }
        else
        {
            return BadRequest(new { message = "User delete failed" });
        }
    }

    [HttpDelete]
    public IActionResult Logout()
    {
        if (_authService.LogoutUser())
        {
            return Ok(new { message = "User logout successfull" });
        }
        else
        {
            return BadRequest(new { message = "User logout failed" });
        }
    }
}