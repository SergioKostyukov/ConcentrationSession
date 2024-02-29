using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using PowerOfControl.Models;

namespace PowerOfControl.JwtHelpers;

public static class JwtHelpers
{
    // Helper method to generate claims for a user
    private static IEnumerable<Claim> GetClaims(this UserDto userAccounts)
    {
        IEnumerable<Claim> claims = new Claim[]
        {
            new("user_name", userAccounts.user_name),
            new("email", userAccounts.email),
            new("id", userAccounts.id.ToString()),
            new("tag_name", userAccounts.tag_name),
            new("notifications", userAccounts.notifications.ToString()),
            new("expiration", DateTime.UtcNow.AddDays(1).ToString("MMM ddd dd yyyy HH:mm:ss tt"))
        };
        return claims;
    }

    // Generate a JWT token for a given user model and JWT settings
    public static string GenTokenkey(UserDto model, JwtSettings jwtSettings)
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

            return new JwtSecurityTokenHandler().WriteToken(JWToken);
        }
        catch (Exception)
        {
            throw;
        }
    }
}
