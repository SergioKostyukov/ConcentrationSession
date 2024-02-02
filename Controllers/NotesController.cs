﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PowerOfControl.Models;
using PowerOfControl.Services;

namespace PowerOfControl.Controllers;

[Produces("application/json")]
[Route("api/[controller]/[action]")]
[ApiController]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly NotesService _notesService;

    public NotesController(NotesService notesService)
    {
        _notesService = notesService;
    }

    // POST: api/Notes/AddNote
    [Authorize]
    [HttpPost]
    public IActionResult AddNote([FromBody] NoteData note)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Attempt to add a new note
        if (_notesService.CreateNote(note))
        {
            return Ok(new { message = "Note successfully added" });
        }
        else
        {
            return BadRequest(new { message = "Error adding note" });
        }
    }

    // GET: api/Notes/GetNotArchivedNotes
    [Authorize]
    [HttpGet]
    public IActionResult GetNotArchivedNotes()
    {
        var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
            List<NoteDataDto> tasks = _notesService.GetNotArchivedNotes(int.Parse(currentUserID));
            // Attempt to add a new note
            if (tasks != null)
            {
                return Ok(new { message = "Note data get successful", notesList = tasks });
            }
            else
            {
                return Ok(new { message = "There are no notes" });
            }
        }
        else
        {
            return Ok(new { message = "User not authorized" });
        }
    }

    // GET: api/Notes/GetArchivedNotes
    [Authorize]
    [HttpGet]
    public IActionResult GetArchivedNotes()
    {
        var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
            List<NoteDataDto> tasks = _notesService.GetArchivedNotes(int.Parse(currentUserID));
            // Attempt to add a new note
            if (tasks != null)
            {
                return Ok(new { message = "Note data get successful", notesList = tasks });
            }
            else
            {
                return Ok(new { message = "There are no notes" });
            }
        }
        else
        {
            return Ok(new { message = "User not authorized" });
        }
    }

    // PATCH: api/Notes/UpdateNote
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateNote([FromBody] NoteUpdateDto request)
    {
        // Attempt to add a new note
        if (_notesService.UpdateNote(request))
        {
            return Ok(new { message = "Note update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Note update failed" });
        }
    }

    // PATCH: api/Notes/UpdateNotePin
    [Authorize]
    [HttpPatch]
    public IActionResult UpdateNotePin([FromBody] NoteStatusUpdateDto request)
    {
        // Attempt to add a new note
        if (_notesService.UpdatePin(request))
        {
            return Ok(new { message = "Note pin update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Note pin update failed" });
        }
    }

    // POST: api/Notes/CopyNote
    [Authorize]
    [HttpPost]
    public IActionResult CopyNote([FromBody] NoteStatusUpdateDto request)
    {
        // Attempt to add a new note
        if (_notesService.CopyNote(request.id))
        {
            return Ok(new { message = "Note copy successfully" });
        }
        else
        {
            return BadRequest(new { message = "Note copy failed" });
        }
    }

    // PATCH: api/Notes/ArchiveNote
    [Authorize]
    [HttpPatch]
    public IActionResult ArchiveNote([FromBody] NoteStatusUpdateDto request)
    {
        // Attempt to add a new note
        if (_notesService.ArchiveNote(request))
        {
            return Ok(new { message = "Note archive successfully" });
        }
        else
        {
            return BadRequest(new { message = "Note archive failed" });
        }
    }

    // DELETE: api/Notes/DeleteNote
    [Authorize]
    [HttpDelete]
    public IActionResult DeleteNote([FromBody] NoteStatusUpdateDto request)
    {
        // Attempt to add a new note
        if (_notesService.DeleteNote(request.id))
        {
            return Ok(new { message = "Note deleted successfully" });
        }
        else
        {
            return BadRequest(new { message = "Note delete failed" });
        }
    }
}

