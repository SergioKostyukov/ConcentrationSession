using Newtonsoft.Json;
using Npgsql;
using PowerOfControl.Models;

namespace PowerOfControl.Data;

public class DataBaseContext
{
    private readonly string connectionString;

    public DataBaseContext()
    {
        // Read database connection settings from the configuration file
        string json = File.ReadAllText("./Data/connections.json");
        var connectionSettings = JsonConvert.DeserializeObject<Dictionary<string, DataBaseConnectionSetting>>(json)["PostgreSQL"];

        // Build the connection string
        connectionString = $"Host={connectionSettings.Host};" +
                           $"Username={connectionSettings.Username};" +
                           $"Password={connectionSettings.Password};" +
                           $"Database={connectionSettings.Database}";
    }

    // Open a connection to the PostgreSQL database
    public NpgsqlConnection OpenConnection()
    {
        var connection = new NpgsqlConnection(connectionString);
        connection.Open();
        return connection;
    }

    // Execute a non-query SQL command with parameters
    public void ExecuteNonQuery(string sql)
    {
        var connection = OpenConnection();
        
        var cmd = new NpgsqlCommand(sql, connection);

        // Execute the non-query command
        cmd.ExecuteNonQuery();
    }

    // Execute a query SQL command and return a data reader
    public NpgsqlDataReader ExecuteQuery(string sql)
    {
        var connection = OpenConnection();
        var cmd = new NpgsqlCommand(sql, connection);
        return cmd.ExecuteReader();
    }
}
