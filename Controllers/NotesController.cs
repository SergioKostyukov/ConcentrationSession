using Microsoft.AspNetCore.Authorization;
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

	// POST: api/Notes/CopyNote
	[Authorize]
	[HttpPost]
	public IActionResult CopyNote([FromBody] NoteStatusUpdateDto request)
	{
		if (_notesService.CopyNote(request.id))
		{
			return Ok(new { message = "Note copy successfully" });
		}
		else
		{
			return BadRequest(new { message = "Note copy failed" });
		}
	}

	// GET: api/Notes/GetNoteById
	[Authorize]
	[HttpGet]
	public IActionResult GetNoteById([FromQuery] int id)
	{
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

		if (currentUserID != null)
		{
			NoteViewDto note = _notesService.GetNoteById(id);
			if (note != null)
			{
				return Ok(new { message = "Note data get successful", note = note });
			}
			else
			{
				return Ok(new { message = "There are no such note" });
			}
		}
		else
		{
			return Ok(new { message = "User not authorized" });
		}
	}


	// GET: api/Notes/GetNotArchivedNotes
	[Authorize]
    [HttpGet]
    public IActionResult GetNotArchivedNotes()
    {
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
			// Attempt to find not archived notes
			List<NoteDataDto> notes = _notesService.GetNotArchivedNotes(int.Parse(currentUserID));
			if (notes != null)
            {
                return Ok(new { message = "Note data get successful", notesList = notes });
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
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
			// Attempt to find archived notes
			List<NoteDataDto> notes = _notesService.GetArchivedNotes(int.Parse(currentUserID));
            if (notes != null)
            {
                return Ok(new { message = "Note data get successful", notesList = notes });
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

    // GET: api/Notes/GetTitlesOfNotArchivedNotes
    [Authorize]
    [HttpGet]
    public IActionResult GetTitlesOfNotArchivedNotes()
    {
		// Get user id from request data
		var currentUserID = User.FindFirst("id")?.Value;

        if (currentUserID != null)
        {
			// Attempt to get notes
			List<NoteTitleDto> notesTitles = _notesService.GetTitlesOfNotArchivedNotes(int.Parse(currentUserID));
            if (notesTitles != null)
            {
                return Ok(new { message = "Notes titles get successful", notesList = notesTitles });
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
        if (_notesService.UpdatePin(request))
        {
            return Ok(new { message = "Note pin update successfully" });
        }
        else
        {
            return BadRequest(new { message = "Note pin update failed" });
        }
    }

    // PATCH: api/Notes/ArchiveNote
    [Authorize]
    [HttpPatch]
    public IActionResult ArchiveNote([FromBody] NoteStatusUpdateDto request)
    {
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

