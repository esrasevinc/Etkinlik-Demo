namespace Domain
{
    public class Seat
    {
    public Guid Id { get; set; }
    public int EventHallId { get; set; }
    public string Label { get; set; } // Koltuk ismi (ör: A1, B2)
    public int Row { get; set; }
    public int Column { get; set; }
    public string Status { get; set; } // "Available", "Booked"
 
    }
}