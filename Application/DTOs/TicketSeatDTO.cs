namespace Application.DTOs {
    public class TicketSeatDTO {
        public Guid Id { get; set; } 
        public Guid SeatId { get; set; } 
        public string Label { get; set; } 
        public int Row { get; set; } 
        public int Column { get; set; } 
        public string Status { get; set; } // "Boş", "Dolu"
        public Guid ActivityId { get; set; }
        public Guid? TicketId { get; set; }
    
    
    }

    public class UpdateTicketSeatDTO
    {
    public Guid Id { get; set; }
    public string Status { get; set; }
    }

}