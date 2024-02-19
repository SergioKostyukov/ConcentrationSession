using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerOfControl.Models;
using PowerOfControl.Services;

namespace PowerOfControl.Controllers;

[Produces("application/json")]
[Route("api/[controller]/[action]")]
[ApiController]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly TasksService _notesService;

    public TasksController(TasksService tasksService)
    {
        _notesService = tasksService;
    }

    // POST: api/Tasks/AddTask
    [Authorize]
    [HttpPost]
    public IActionResult AddTask([FromBody] TaskData task)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Attempt to add a new task
        if (_notesService.CreateTask(task))
        {
            return Ok(new { message = "Task successfully added" });
        }
        else
        {
            return BadRequest(new { message = "Error adding task" });
        }
    }

    // POST: api/Tasks/CopyTask
    [Authorize]
    [HttpPost]
    public IActionResult CopyTask([FromBody] TaskStatusUpdateDto request)
    {
        if (_notesService.CopyTask(request.id))
        {
            return Ok(new { message = "Task copy successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task copy failed" });
        }
    }

	// GET: api/Tasks/GetHabits
	[Authorize]
	[HttpGet]
	public IActionResult GetHabits()
	{
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

		if (currentUserID != null)
		{
			// Attempt to find habits
			TaskDataDto? habitsList = _notesService.GetHabits(int.Parse(currentUserID));
			if (habitsList != null)
			{
				return Ok(new { message = "Habits data get successful", habits = habitsList });
			}
			else
			{
				return Ok(new { message = "There are no habits" });
			}
		}
		else
		{
			return Ok(new { message = "User not authorized" });
		}
	}

	// GET: api/Tasks/GetTaskById
	[Authorize]
	[HttpGet]
	public IActionResult GetTaskById([FromQuery] int id)
	{
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

		if (currentUserID != null)
		{
			TaskViewDto? task = _notesService.GetTaskById(id);
			if (task != null)
			{
				return Ok(new { message = "Task data get successful", task = task });
			}
			else
			{
				return Ok(new { message = "There are no such task" });
			}
		}
		else
		{
			return Ok(new { message = "User not authorized" });
		}
	}

	// GET: api/Tasks/GetNotArchivedTasks
	[Authorize]
    [HttpGet]
    public IActionResult GetNotArchivedTasks()
    {
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
            // Attempt to find not archived tasks
            List<TaskDataDto>? tasks = _notesService.GetNotArchivedTasks(int.Parse(currentUserID));
            if (tasks != null)
            {
                return Ok(new { message = "Task data get successful", tasksList = tasks });
            }
            else
            {
                return Ok(new { message = "There are no tasks" });
            }
        }
        else
        {
            return Ok(new { message = "User not authorized" });
        }
    }

	// GET: api/Tasks/GetArchivedTasks
	[Authorize]
    [HttpGet]
    public IActionResult GetArchivedTasks()
    {
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
			// Attempt to find archived tasks
            List<TaskDataDto>? tasks = _notesService.GetArchivedTasks(int.Parse(currentUserID));
			if (tasks != null)
            {
                return Ok(new { message = "Task data get successful", tasksList = tasks });
            }
            else
            {
                return Ok(new { message = "There are no tasks" });
            }
        }
        else
        {
            return Ok(new { message = "User not authorized" });
        }
    }

    // GET: api/Tasks/GetTitlesOfNotArchivedTasks
    [Authorize]
    [HttpGet]
    public IActionResult GetTitlesOfNotArchivedTasks()
    {
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
			// Attempt to get tasks
			List<TaskTitleDto>? tasksTitles = _notesService.GetTitlesOfNotArchivedTasks(int.Parse(currentUserID));
            if (tasksTitles != null)
            {
                return Ok(new { message = "Tasks titles get successful", tasksList = tasksTitles });
            }
            else
            {
                return Ok(new { message = "There are no tasks" });
            }
        }
        else
        {
            return Ok(new { message = "User not authorized" });
        }
    }

    // PATCH: api/Tasks/UpdateTask
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateTask([FromBody] TaskUpdateDto request)
    {
        if (_notesService.UpdateTask(request))
        {
            return Ok(new { message = "Task update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task update failed" });
        }
    }

    // PATCH: api/Tasks/UpdateTaskPin
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateTaskPin([FromBody] TaskStatusUpdateDto request)
    {
        if (_notesService.UpdatePin(request))
        {
            return Ok(new { message = "Task pin update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task pin update failed" });
        }
    }

    // PATCH: api/Tasks/ArchiveTask
    [Authorize]
    [HttpPatch]
    public IActionResult ArchiveTask([FromBody] TaskStatusUpdateDto request)
    {
        if (_notesService.ArchiveTask(request))
        {
            return Ok(new { message = "Task archive successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task archive failed" });
        }
    }

    // DELETE: api/Tasks/DeleteTask
    [Authorize]
    [HttpDelete]
    public IActionResult DeleteTask([FromBody] TaskStatusUpdateDto request)
    {
        if (_notesService.DeleteTask(request.id))
        {
            return Ok(new { message = "Task deleted successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task delete failed" });
        }
    }
}
