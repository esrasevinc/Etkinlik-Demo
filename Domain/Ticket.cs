namespace Domain {
    public class Ticket
    {
    public Guid Id { get; set; } 
    public Guid CustomerId { get; set; } 
    public Customer Customer { get; set; } 
    public Guid ActivityId { get; set; } 
    public Activity Activity { get; set; } 
    public Guid TicketSeatId { get; set; } 
    public TicketSeat TicketSeat { get; set; } 
    }
}