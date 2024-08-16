using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
       
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    //[RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Şifre karmaşık olmalı.")]
    public string Password { get; set; }

  
    public string DisplayName { get; set; }


    public string Username { get; set; }

    public string Role { get; set; }
  
  }   
}