namespace Application.DTOs {
    public class TicketDTO {
        public Guid Id { get; set; }
        public CustomerDTO Customer { get; set; }
        public Guid? CustomerId { get; set; }
        public ActivityDTO Activity { get; set; }
        public Guid? ActivityId { get; set; }
        public Guid? TicketSeatId { get; set; }
        public TicketSeatDTO TicketSeat { get; set; }
    }

    public class CreateTicketDTO
    {
        public Guid CustomerId { get; set; } 
        public Guid ActivityId { get; set; } 
        public Guid TicketSeatId { get; set; } 
    }


}