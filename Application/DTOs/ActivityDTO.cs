using System.Text.Json.Serialization;

namespace Application.DTOs
{
    public class ActivityDTO
    {
        public Guid Id { get; set; }    
        public string Name { get; set; } 
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Duration { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsCancelled { get; set; }
        public bool IsPaid { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? PlaceId { get; set; }
        public Guid? EventHallId { get; set; }
        public CategoryDTO Category { get; set; }
        public PlaceDTO Place { get; set; }
        public EventHallDTO EventHall { get; set; }
        public IEnumerable<TicketSeatDTO> TicketSeats { get; set; } 

        [JsonIgnore]
        public IEnumerable<TicketDTO> Tickets { get; set; } 
    }
}