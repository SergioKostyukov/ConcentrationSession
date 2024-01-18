using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using PowerOfControl.Models;

namespace PowerOfControl.JwtHelpers;

public static class JwtHelpers
{
    // Helper method to generate claims for a user
    private static IEnumerable<Claim> GetClaims(this UserToken userAccounts)
    {
        IEnumerable<Claim> claims = new Claim[]
        {
            new Claim(ClaimTypes.Name, userAccounts.UserName),
            new Claim(ClaimTypes.Email, userAccounts.Email),
            new Claim(ClaimTypes.NameIdentifier, userAccounts.Id.ToString()),
            new Claim("UserTag", userAccounts.UserTag),
            new Claim("Notifications", userAccounts.Notifications.ToString()),
            new Claim(ClaimTypes.Expiration, DateTime.UtcNow.AddDays(1).ToString("MMM ddd dd yyyy HH:mm:ss tt"))
        };
        return claims;
    }

    // Generate a JWT token for a given user model and JWT settings
    public static UserToken GenTokenkey(UserToken model, JwtSettings jwtSettings)
    {
        try
        {
            if (model == null) throw new ArgumentException(null, nameof(model));

            // Get the secret key
            var key = System.Text.Encoding.ASCII.GetBytes(jwtSettings.IssuerSigningKey);
            DateTime expireTime = DateTime.UtcNow.AddDays(1);

            // Create a JWT token with the specified claims and settings
            var JWToken = new JwtSecurityToken(
                issuer: jwtSettings.ValidIssuer,
                audience: jwtSettings.ValidAudience,
                claims: GetClaims(model),
                notBefore: new DateTimeOffset(DateTime.Now).DateTime,
                expires: new DateTimeOffset(expireTime).DateTime,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256));

            // Create a UserToken object with the generated token and other information
            var UserToken = new UserToken
            {
                Token = new JwtSecurityTokenHandler().WriteToken(JWToken),
                Id = model.Id,
                UserName = model.UserName,
                UserTag = model.UserTag,
                Email = model.Email,
                Notifications = model.Notifications,
                ExpiredTime = DateTime.Now.AddDays(1),
                Validaty = expireTime.TimeOfDay
            };
            return UserToken;
        }
        catch (Exception)
        {
            throw;
        }
    }
}
