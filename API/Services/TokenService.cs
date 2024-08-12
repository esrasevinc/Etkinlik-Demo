using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
  public class TokenService
  {
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config)
    {
      _config = config;

    }
    public string CreateToken(AppUser user)
    {
      var claims = new List<Claim>
          {
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email)
          };

      var envKey = Environment.GetEnvironmentVariable("TOKEN");

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("xmyHrRn4SBv38aVw5UdzcQgEuJACKhYM2kD7sZqL9fPtTNGeWbLfPrjAUYX5eFSgHy6mWvE7w3BpQ24qu8RzbVTGhdn9katJZcNszxcGkgwNdRHCEaQsSXBD8bFUmZWA74yYhT9tjpLrquJ36f5vMeH8FB3rvZNcUXn6WuV4phjC7KJYQeTPzfMtDyaS5AkgdRbqL9sGHvGTcf7Cq3et6Wjp4ZBgFmbEUdQ928hXzNRaSnALVxsKrJu5DYxmyHrRn4SBv38aVw5UdzcQgEuJACKhYM2kD7sZqL9fPtTNGeWbLfPrjAUYX5eFSgHy6mWvE7w3BpQ24qu8RzbVTGhdn9katJZcNszxcGkgwNdRHCEaQsSXBD8bFUmZWA74yYhT9tjpLrquJ36f5vMeH8FB3rvZNcUXn6WuV4phjC7KJYQeTPzfMtDyaS5AkgdRbqL9sGHvGTcf7Cq3et6Wjp4ZBgFmbEUdQ928hXzNRaSnALVxsKrJu5DYxmyHrRn4SBv38aVw5UdzcQgEuJACKhYM2kD7sZqL9fPtTNGeWbLfPrjAUYX5eFSgHy6mWvE7w3BpQ24qu8RzbVTGhdn9katJZcNszxcGkgwNdRHCEaQsSXBD8bFUmZWA74yYhT9tjpLrquJ36f5vMeH8FB3rvZNcUXn6WuV4phjC7KJYQeTPzfMtDyaS5AkgdRbqL9sGHvGTcf7Cq3et6Wjp4ZBgFmbEUdQ928hXzNRaSnALVxsKrJu5DY"));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(7),
        SigningCredentials = creds
      };

      var tokenHandler = new JwtSecurityTokenHandler();

      var token = tokenHandler.CreateToken(tokenDescriptor);

      return tokenHandler.WriteToken(token);
    }
  }
}