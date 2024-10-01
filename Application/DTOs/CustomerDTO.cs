namespace Application.DTOs {
    public class CustomerDTO {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string TCNumber { get; set; }
        public string Address { get; set; }
        public DateTime BirthDate { get; set; }

    }
}