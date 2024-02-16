using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerOfControl.Models;
using PowerOfControl.Services;

namespace PowerOfControl.Controllers;

[Produces("application/json")]
[Route("api/[controller]/[action]")]
[ApiController]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly SettingsService _settingsService;

    public SettingsController(SettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    // GET: api/Settings/GetSettings
    [Authorize]
    [HttpGet]
    public IActionResult GetSettings()
    {
        var currentUserID = User.FindFirst("id")?.Value;

        var settings = _settingsService.GetSettings(int.Parse(currentUserID));
        if (settings != null)
        {
            return Ok(new { message = "Settings data get successful", settings = settings });
        }
        else
        {
            return Ok(new { message = "User not found" });
        }
    }

    // PATCH: api/Settings/UpdateSessionParams
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateSessionParams(SettingsSessionDto request)
    {
        // Attempt to update session settings data
        if (_settingsService.UpdateSessionParams(request))
        {
            return Ok(new { message = "Session settings data update successfully"});
        }
        else
        {
            return BadRequest(new { message = "Session settings data update failed" });
        }
    }

    // PATCH: api/Settings/UpdateGoalParams
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateGoalParams(SettingsGoalDto request)
    {
        // Attempt to update goal settings data
        if (_settingsService.UpdateGoalParams(request))
        {
            return Ok(new { message = "Goal settings data update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Goal settings data update failed" });
        }
    }

	// PATCH: api/Settings/UpdateOtherParams
	[Authorize]
	[HttpPatch]
	public IActionResult UpdateOtherParams(SettingsOtherDto request)
	{
		// Attempt to update goal settings data
		if (_settingsService.UpdateOtherParams(request))
		{
			return Ok(new { message = "Other settings data update successfully" });
		}
		else
		{
			return BadRequest(new { message = "Other settings data update failed" });
		}
	}
}
