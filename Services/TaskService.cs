using System.Threading.Tasks;
using Newtonsoft.Json;
using PowerOfControl.Data;
using PowerOfControl.Models;

namespace PowerOfControl.Services;
public class TaskService
{
    private static readonly string LogFilePath = "./Data/tasks_log.txt";
    private readonly Logger logger;

    public TaskService()
    {
        logger = new Logger(LogFilePath);
    }

    // Method to handle task adding
    public bool CreateTask(TaskDataDto task)
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

    public List<TaskData>? GetArchivedTasks(int user_id)
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

    public bool UpdatePin(TaskPinUpdateDto request)
    {
        try
        {
            UpdateTaskPin(request);

            logger.LogInfo($"Task pin status updated");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task pin status update: {ex.Message}");
            return false;
        }
    }

    public bool DeleteTask(int id)
    {
        try
        {
            DeleteTaskFromDB(id);

            logger.LogInfo($"Task delated");

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError($"Error task delete: {ex.Message}");
            return false;
        }
    }

    // Method to save task data to the DataBase
    private static void SaveTaskToDB(TaskDataDto task)
    {
        var dbContext = new DataBaseContext();

        var command = "INSERT INTO tasks(user_id, name, text, is_archive, notification_time, is_pin) " +
            "VALUES (@user_id, @name, @text, @is_archive, @notification_time, @is_pin)";

        var parameters = new Dictionary<string, object>
        {
            { "@user_id", task.id },
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

    private static List<TaskData> FindArchivedTasks(int id)
    {
        var dbContext = new DataBaseContext();

        var command = "SELECT * FROM tasks WHERE user_id = @id AND is_archive = @request";
        var parameters = new Dictionary<string, object> {
            { "@id", id},
            { "@request", true }
        };

        List<TaskData> tasksList = new();

        using (var reader = dbContext.ExecuteQuery(command, parameters))
        {
            while (reader.Read())
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

                tasksList.Add(task);
            }

            return tasksList;
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

    private static void UpdateTaskPin(TaskPinUpdateDto request)
    {
        var dbContext = new DataBaseContext();

        var command = "UPDATE tasks SET is_pin = @is_pin WHERE id = @id;";

        var parameters = new Dictionary<string, object>
        {
            { "@is_pin", request.is_pin },
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

