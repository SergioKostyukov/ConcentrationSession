namespace PowerOfControl.Services;

// This class implements recording of logs to the corresponding files
public class Logger
{
    private string LogFilePath { get; }

    public Logger(string logFilePath)
    {
        LogFilePath = logFilePath;
    }

    // Logs informational messages
    public void LogInfo(string message)
    {
        LogMessage($"[INFO] {message}");
    }

    // Logs error messages
    public void LogError(string message)
    {
        LogMessage($"[ERROR] {message}");
    }

    // Writes the given message to the log file
    private void LogMessage(string message)
    {
        Console.WriteLine(message);

        try
        {
            // Writes a message to the end of "LogFilePath" file (using true parameter for append mode)
            using StreamWriter writer = new(LogFilePath, true);
            writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error while logging: {ex.Message}");
        }
    }

    // Clears the content of the log file
    public void ClearFileContent()
    {
        try
        {
            File.WriteAllText(LogFilePath, string.Empty);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error clearing file content: {ex.Message}");
        }
    }
}
