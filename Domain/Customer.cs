namespace Domain {
    public class Customer {
        public Guid Id { get; set; }
        public string Name  { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string TCNumber { get; set; }
        public string Address { get; set; }
        public DateTime BirthDate { get; set; }
        public ICollection<Ticket> Tickets { get; set; } 
    }
}