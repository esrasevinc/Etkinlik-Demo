namespace API.DTOs
{
    public class UserDTO
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public IList<string> Roles { get; set; }
    }
}