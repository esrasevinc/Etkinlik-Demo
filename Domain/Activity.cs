namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }    
        public string Name { get; set; } 
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsCancelled { get; set; }
        public Category Category { get; set; }
        public Place Place { get; set; }
        public EventHall EventHall { get; set; }
        public ICollection<Ticket> Tickets { get; set; } 
    }
}