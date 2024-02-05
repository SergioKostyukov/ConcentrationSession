using PowerOfControl.Data;
using PowerOfControl.Models;

namespace PowerOfControl.Services;
public class NotesService
{
    private static readonly string LogFilePath = "./Data/notes_log.txt";
    private readonly Logger logger;

    public NotesService()
    {
        logger = new Logger(LogFilePath);
    }

    public bool CreateNote(NoteData note)
    {
        logger.LogInfo($"Start created");
        try
        {
            SaveNoteToDB(note);

            logger.LogInfo($"New note created");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error adding note: {ex.Message}");
            return false;
        }
    }

    public List<NoteDataDto>? GetNotArchivedNotes(int user_id)
    {
        var userNotes = FindNotArchivedNotes(user_id);

        return userNotes;
    }

    public List<NoteDataDto>? GetArchivedNotes(int user_id)
    {
        var userNotes = FindArchivedNotes(user_id);

        return userNotes;
    }

    public List<NoteTitleDto>? GetTitlesOfNotArchivedNotes(int user_id)
    {
        var userNotesTitles = FindTitlesOfNotArchivedNotes(user_id);

        return userNotesTitles;
    }

    public NoteViewDto? GetNoteById(int id)
    {
        try
        {
            NoteViewDto note = FindNoteView(id);

            logger.LogInfo($"Note data finded");

            return note;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error note data update: {ex.Message}");
            return null;
        }
    }

    public bool UpdateNote(NoteUpdateDto request)
    {
        try
        {
            UpdateNoteData(request);

            logger.LogInfo($"Note data updated");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error note data update: {ex.Message}");
            return false;
        }
    }

    public bool UpdatePin(NoteStatusUpdateDto request)
    {
        try
        {
            UpdatePinDB(request);

            logger.LogInfo($"Note pin status updated");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error note pin status update: {ex.Message}");
            return false;
        }
    }

    public bool CopyNote(int id)
    {
        try
        {
            logger.LogInfo($"Note copy started {id}");
            NoteData note = FindNote(id);

            logger.LogInfo($"Note finded");

            SaveNoteToDB(note);

            logger.LogInfo($"Note copy finish");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error note copy: {ex.Message}");
            return false;
        }
    }

    public bool ArchiveNote(NoteStatusUpdateDto request)
    {
        try
        {
            logger.LogInfo($"Note archive started {request.id} {request.status}");

            ArchiveNoteDB(request);

            logger.LogInfo($"Note archived");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error note archive: {ex.Message}");
            return false;
        }
    }

    public bool DeleteNote(int id)
    {
        try
        {
            logger.LogInfo($"Note delete started {id}");

            DeleteNoteFromDB(id);

            logger.LogInfo($"Note deleted");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error note delete: {ex.Message}");
            return false;
        }
    }

    private static void SaveNoteToDB(NoteData note)
    {
        var dbContext = new DataBaseContext();

        var command = "INSERT INTO notes(user_id, name, text, is_archive, is_pin) " +
            "VALUES (@user_id, @name, @text, @is_archive, @is_pin)";

        var parameters = new Dictionary<string, object>
        {
            { "@user_id", note.user_id },
            { "@name", note.name },
            { "@text", note.text },
            { "@is_archive", note.is_archive },
            { "@is_pin", note.is_pin }
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static List<NoteDataDto> FindNotArchivedNotes(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM notes WHERE user_id = @id AND is_archive = @request";
        var parameters = new Dictionary<string, object> {
            { "@id", id},
            { "@request", false }
        };

        List<NoteDataDto> notesList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            while (reader.Read())
            {
                NoteDataDto note = new()
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString(),
                    text = reader["text"].ToString(),
                    is_archive = (bool)reader["is_archive"],
                    is_pin = (bool)reader["is_pin"]
                };

                notesList.Add(note);
            }

            return notesList;
        }
    }

    private static List<NoteDataDto> FindArchivedNotes(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM notes WHERE user_id = @id AND is_archive = @request";
        var parameters = new Dictionary<string, object> {
            { "@id", id},
            { "@request", true }
        };

        List<NoteDataDto> notesList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        while (reader.Read())
        {
            NoteDataDto note = new()
            {
                id = (int)reader["id"],
                name = reader["name"].ToString(),
                text = reader["text"].ToString(),
                is_archive = (bool)reader["is_archive"],
                is_pin = (bool)reader["is_pin"]
            };

            notesList.Add(note);
        }

        return notesList;
    }

    private static List<NoteTitleDto> FindTitlesOfNotArchivedNotes(int user_id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT id, name FROM notes WHERE user_id = @user_id AND is_archive = @request";
        var parameters = new Dictionary<string, object> {
            { "@user_id", user_id},
            { "@request", false }
        };

        List<NoteTitleDto> notesList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            while (reader.Read())
            {
                NoteTitleDto note = new()
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString()
                };

                notesList.Add(note);
            }

            return notesList;
        }
    }

    private NoteData FindNote(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM notes WHERE id = @id";
        var parameters = new Dictionary<string, object>
        {
            { "@id", id}
        };

        using var reader = dbContext.ExecuteQuery(command, parameters);
        logger.LogInfo($"{reader}");
        if (reader.Read())
        {
            NoteData note = new()
            {
                user_id = (int)reader["user_id"],
                name = reader["name"].ToString(),
                text = reader["text"].ToString(),
                is_archive = (bool)reader["is_archive"],
                is_pin = (bool)reader["is_pin"]
            };
            return note;
        }
        else
        {
            return null;
        }

    }

    private NoteViewDto FindNoteView(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT name, text FROM notes WHERE id = @id";
        var parameters = new Dictionary<string, object>
        {
            { "@id", id}
        };

        using var reader = dbContext.ExecuteQuery(command, parameters);
        if (reader.Read())
        {
            NoteViewDto note = new()
            {
                name = reader["name"].ToString(),
                text = reader["text"].ToString()
            };
            return note;
        }
        else
        {
            return null;
        }

    }

    private static void UpdateNoteData(NoteUpdateDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE notes SET name = @name, text = @text, is_pin = @is_pin WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@name", request.name },
            { "@text", request.text },
            { "@is_pin", request.is_pin },
            { "@id", request.id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static void UpdatePinDB(NoteStatusUpdateDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE notes SET is_pin = @is_pin WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@is_pin", request.status },
            { "@id", request.id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static void ArchiveNoteDB(NoteStatusUpdateDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE notes SET is_archive = @is_archive WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@is_archive", request.status },
            { "@id", request.id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static void DeleteNoteFromDB(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "DELETE FROM notes WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@id", id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }
}