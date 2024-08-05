namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }    
        public string Name { get; set; } 
        public int CategoryId { get; set; }
        public string Category { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsCancelled { get; set; }
    }
}