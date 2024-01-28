using PowerOfControl.Data;
using PowerOfControl.Models;

namespace PowerOfControl.Services;
public class TasksService
{
    private static readonly string LogFilePath = "./Data/tasks_log.txt";
    private readonly Logger logger;

    public TasksService()
    {
        logger = new Logger(LogFilePath);
    }

    public bool CreateTask(TaskData task)
    {
        logger.LogInfo($"Start created");
        try
        {

            SaveTaskToDB(task);

            logger.LogInfo($"New task created");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error adding task: {ex.Message}");
            return false;
        }
    }

    public List<TaskDataDto>? GetNotArchivedTasks(int user_id)
    {
        var userTasks = FindNotArchivedTasks(user_id);

        return userTasks;
    }

    public List<TaskDataDto>? GetArchivedTasks(int user_id)
    {
        var userTasks = FindArchivedTasks(user_id);

        return userTasks;
    }

    public bool UpdateTask(TaskUpdateDto request)
    {
        try
        {
            UpdateTaskData(request);

            logger.LogInfo($"Task data updated");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task data update: {ex.Message}");
            return false;
        }
    }

    public bool UpdatePin(TaskStatusUpdateDto request)
    {
        try
        {
            UpdatePinDB(request);

            logger.LogInfo($"Task pin status updated");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task pin status update: {ex.Message}");
            return false;
        }
    }

    public bool CopyTask(int id)
    {
        try
        {
            logger.LogInfo($"Task copy started {id}");
            TaskData task = FindTask(id);

            logger.LogInfo($"Task finded");

            SaveTaskToDB(task);

            logger.LogInfo($"Task copy finish");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task copy: {ex.Message}");
            return false;
        }
    }

    public bool ArchiveTask(TaskStatusUpdateDto request)
    {
        try
        {
            logger.LogInfo($"Task archive started {request.id} {request.status}");

            ArchiveTaskDB(request);

            logger.LogInfo($"Task archived");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task archive: {ex.Message}");
            return false;
        }
    }

    public bool DeleteTask(int id)
    {
        try
        {
            logger.LogInfo($"Task delete started {id}");

            DeleteTaskFromDB(id);

            logger.LogInfo($"Task deleted");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task delete: {ex.Message}");
            return false;
        }
    }

    private static void SaveTaskToDB(TaskData task)
    {
        var dbContext = new DataBaseContext();

        var command = "INSERT INTO tasks(user_id, name, text, is_archive, notification_time, is_pin) " +
            "VALUES (@user_id, @name, @text, @is_archive, @notification_time, @is_pin)";

        var parameters = new Dictionary<string, object>
        {
            { "@user_id", task.user_id },
            { "@name", task.name },
            { "@text", task.text },
            { "@is_archive", task.is_archive },
            { "@notification_time", task.notification_time },
            { "@is_pin", task.is_pin }
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static List<TaskDataDto> FindNotArchivedTasks(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM tasks WHERE user_id = @id AND is_archive = @request";
        var parameters = new Dictionary<string, object> {
            { "@id", id},
            { "@request", false }
        };

        List<TaskDataDto> tasksList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            while (reader.Read())
            {
                TaskDataDto task = new()
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString(),
                    text = reader["text"].ToString(),
                    is_archive = (bool)reader["is_archive"],
                    notification_time = (DateTime)reader["notification_time"],
                    is_pin = (bool)reader["is_pin"]
                };

                tasksList.Add(task);
            }

            return tasksList;
        }
    }

    private static List<TaskDataDto> FindArchivedTasks(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM tasks WHERE user_id = @id AND is_archive = @request";
        var parameters = new Dictionary<string, object> {
            { "@id", id},
            { "@request", true }
        };

        List<TaskDataDto> tasksList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
            while (reader.Read())
            {
                TaskDataDto task = new()
                {
                    id = (int)reader["id"],
                    name = reader["name"].ToString(),
                    text = reader["text"].ToString(),
                    is_archive = (bool)reader["is_archive"],
                    notification_time = (DateTime)reader["notification_time"],
                    is_pin = (bool)reader["is_pin"]
                };

                tasksList.Add(task);
            }

        return tasksList;
    }

    private TaskData FindTask(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM tasks WHERE id = @id";
        var parameters = new Dictionary<string, object>
        {
            { "@id", id}
        };

        using var reader = dbContext.ExecuteQuery(command, parameters);
        logger.LogInfo($"{reader}");
        if (reader.Read())
        {
            TaskData task = new()
            {
                user_id = (int)reader["user_id"],
                name = reader["name"].ToString(),
                text = reader["text"].ToString(),
                is_archive = (bool)reader["is_archive"],
                notification_time = (DateTime)reader["notification_time"],
                is_pin = (bool)reader["is_pin"]
            };
            return task;
        }
        else
        {
            return null;
        }

    }

    private static void UpdateTaskData(TaskUpdateDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE tasks SET name = @name, text = @text, notification_time = @notification_time, is_pin = @is_pin WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@name", request.name },
            { "@text", request.text },
            { "@notification_time", request.notification_time },
            { "@is_pin", request.is_pin },
            { "@id", request.id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static void UpdatePinDB(TaskStatusUpdateDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE tasks SET is_pin = @is_pin WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@is_pin", request.status },
            { "@id", request.id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static void ArchiveTaskDB(TaskStatusUpdateDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE tasks SET is_archive = @is_archive WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@is_archive", request.status },
            { "@id", request.id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }

    private static void DeleteTaskFromDB(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "DELETE FROM tasks WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@id", id}
        };

        dbContext.ExecuteNonQuery(command, parameters);
    }
}