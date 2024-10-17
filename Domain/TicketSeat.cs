namespace Domain {
    public class TicketSeat
    {
    public Guid Id { get; set; } 
    public Guid SeatId { get; set; } 
    public string Label { get; set; } 
    public int Row { get; set; } 
    public int Column { get; set; } 
    public string Status { get; set; } // "Dolu", "Boş"
    public Guid ActivityId { get; set; }
    public Activity Activity { get; set; }
    public Guid? TicketId { get; set; }  
    public Ticket Ticket { get; set; } 
    }
}