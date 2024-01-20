using Microsoft.AspNetCore.Mvc;
using PowerOfControl.Services;
using PowerOfControl.Models;

namespace PowerOfControl.Controllers;

[Produces("application/json")]
[Route("api/[controller]/[action]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly AccountService _authService;

    public AccountController(AccountService authService)
    {
        _authService = authService;
    }

    // GET: api/Account/GetUser
    [HttpGet]
    public IActionResult GetUser()
    {
        // Retrieve current user information
        var user = _authService.GetCurrentUser();
        if (user != null)
        {
            // Create a simplified user DTO for response
            var UserLoginDto = new
            {
                user.tag_name,
                user.user_name,
                user.email,
                user.notifications
            };

            return Ok(new { message = "User data get successful", user = UserLoginDto });
        }
        else
        {
            return Ok(new { message = "User not found" });
        }
    }

    // POST: api/Account/Authorization
    [HttpPost]
    public IActionResult Authorization(User user)
    {
        // Attempt to authorize the user
        if (_authService.AuthorizationUser(user))
        {
            return Ok(new { message = "User authorization successfully" });
        }
        else
        {
            return BadRequest(new { message = "User authorization failed" });
        }
    }

    // POST: api/Account/Login
    [HttpPost]
    public IActionResult Login(UserLoginDto user)
    {
        // Attempt to log in the user
        if (_authService.LoginUser(user))
        {
            return Ok(new { message = "User login successfully" });
        }
        else
        {
            return BadRequest(new { message = "User login failed" });
        }
    }

    // PATCH: api/Account/UpdateUser
    [HttpPatch]
    public IActionResult UpdateUser(UpdateUserDto request)
    {
        // Attempt to update user data
        if (_authService.UpdateUser(request))
        {
            return Ok(new { message = "User data update successfully" });
        }
        else
        {
            return BadRequest(new { message = "User data update failed" });
        }
    }

    // PATCH: api/Account/UpdatePassword
    [HttpPatch]
    public IActionResult UpdatePassword(UpdatePasswordDto request)
    {
        // Attempt to update user password
        if (_authService.UpdatePassword(request))
        {
            return Ok(new { message = "User password update successfully" });
        }
        else
        {
            return BadRequest(new { message = "User password update failed" });
        }
    }

    // DELETE: api/Account/DeleteAccount
    [HttpDelete]
    public IActionResult DeleteAccount()
    {
        // Attempt to delete the user
        if (_authService.DeleteUser())
        {
            return Ok(new { message = "User delete successful" });
        }
        else
        {
            return BadRequest(new { message = "User delete failed" });
        }
    }

    // DELETE: api/Account/Logout
    [HttpDelete]
    public IActionResult Logout()
    {
        // Attempt to log out the user
        if (_authService.LogoutUser())
        {
            return Ok(new { message = "User logout successful" });
        }
        else
        {
            return BadRequest(new { message = "User logout failed" });
        }
    }
}
