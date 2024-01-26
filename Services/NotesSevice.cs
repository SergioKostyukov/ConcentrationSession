using System.Threading.Tasks;
using Newtonsoft.Json;
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

    // Method to handle task adding
    public bool CreateNote(NoteData task)
    {
        logger.LogInfo($"Start created");
        try
        {
            SaveNoteToDB(task);

            logger.LogInfo($"New task created");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error adding task: {ex.Message}");
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
            logger.LogError($"Error task data update: {ex.Message}");
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
            logger.LogError($"Error task pin status update: {ex.Message}");
            return false;
        }
    }

    public bool CopyNote(int id)
    {
        try
        {
            logger.LogInfo($"Note copy started {id}");
            NoteData task = FindNote(id);

            logger.LogInfo($"Note finded");

            SaveNoteToDB(task);

            logger.LogInfo($"Note copy finish");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task copy: {ex.Message}");
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
            logger.LogError($"Error task archive: {ex.Message}");
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
            logger.LogError($"Error task delete: {ex.Message}");
            return false;
        }
    }

    // Method to save task data to the DataBase
    private static void SaveNoteToDB(NoteData task)
    {
        var dbContext = new DataBaseContext();

        var command = "INSERT INTO notes(user_id, name, text, is_archive, is_pin) " +
            "VALUES (@user_id, @name, @text, @is_archive, @is_pin)";

        var parameters = new Dictionary<string, object>
        {
            { "@user_id", task.user_id },
            { "@name", task.name },
            { "@text", task.text },
            { "@is_archive", task.is_archive },
            { "@is_pin", task.is_pin }
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

        List<NoteDataDto> tasksList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            while (reader.Read())
            {
                NoteDataDto task = new()
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString(),
                    text = reader["text"].ToString(),
                    is_archive = (bool)reader["is_archive"],
                    is_pin = (bool)reader["is_pin"]
                };

                tasksList.Add(task);
            }

            return tasksList;
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

        List<NoteDataDto> tasksList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            while (reader.Read())
            {
                NoteDataDto task = new()
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString(),
                    text = reader["text"].ToString(),
                    is_archive = (bool)reader["is_archive"],
                    is_pin = (bool)reader["is_pin"]
                };

                tasksList.Add(task);
            }

            return tasksList;
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
            NoteData task = new()
            {
                user_id = (int)reader["user_id"],
                name = reader["name"].ToString(),
                text = reader["text"].ToString(),
                is_archive = (bool)reader["is_archive"],
                is_pin = (bool)reader["is_pin"]
            };
            return task;
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

