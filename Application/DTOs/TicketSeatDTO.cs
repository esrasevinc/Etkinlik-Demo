namespace Application.DTOs {
    public class TicketSeatDTO {
         public Guid Id { get; set; } 
        public string Label { get; set; } 
        public int Row { get; set; } 
        public int Column { get; set; } 
        public string Status { get; set; } 
        public Guid? ActivityId { get; set; }
        public ActivityDTO Activity { get; set; }
    }
}