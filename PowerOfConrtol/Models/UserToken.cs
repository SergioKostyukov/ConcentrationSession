namespace PowerOfControl.Models;
public class UserToken
{
    public string Token { get; set; }
    public int Id { get; set; }
    public string UserName { get; set; }
    public string UserTag { get; set; }
    public string Email { get; set; }
    public bool Notifications { get; set; }
    public TimeSpan Validaty { get; set; }
    public DateTime ExpiredTime { get; set; }
}
