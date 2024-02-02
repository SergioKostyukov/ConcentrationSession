﻿using Microsoft.AspNetCore.Authorization;
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

    // POST: api/Tasks/GetNotArchivedTasks
    [Authorize]
    [HttpGet]
    public IActionResult GetNotArchivedTasks()
    {
        var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
            List<TaskDataDto> tasks = _notesService.GetNotArchivedTasks(int.Parse(currentUserID));
            // Attempt to add a new task
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

    // POST: api/Tasks/GetArchivedTasks
    [Authorize]
    [HttpGet]
    public IActionResult GetArchivedTasks()
    {
        var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
            List<TaskDataDto> tasks = _notesService.GetArchivedTasks(int.Parse(currentUserID));
            // Attempt to add a new task
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

    // POST: api/Tasks/UpdateTask
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateTask([FromBody] TaskUpdateDto request)
    {
        // Attempt to add a new task
        if (_notesService.UpdateTask(request))
        {
            return Ok(new { message = "Task update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task update failed" });
        }
    }

    // POST: api/Tasks/UpdateTaskPin
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateTaskPin([FromBody] TaskStatusUpdateDto request)
    {
        // Attempt to add a new task
        if (_notesService.UpdatePin(request))
        {
            return Ok(new { message = "Task pin update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task pin update failed" });
        }
    }

    // POST: api/Tasks/CopyTask
    [Authorize]
    [HttpPost]
    public IActionResult CopyTask([FromBody] TaskStatusUpdateDto request)
    {
        // Attempt to add a new task
        if (_notesService.CopyTask(request.id))
        {
            return Ok(new { message = "Task copy successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task copy failed" });
        }
    }

    // POST: api/Tasks/ArchiveTask
    [Authorize]
    [HttpPatch]
    public IActionResult ArchiveTask([FromBody] TaskStatusUpdateDto request)
    {
        // Attempt to add a new task
        if (_notesService.ArchiveTask(request))
        {
            return Ok(new { message = "Task archive successfully" });
        }
        else
        {
            return BadRequest(new { message = "Task archive failed" });
        }
    }

    // POST: api/Tasks/DeleteTask
    [Authorize]
    [HttpDelete]
    public IActionResult DeleteTask([FromBody] TaskStatusUpdateDto request)
    {
        // Attempt to add a new task
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
