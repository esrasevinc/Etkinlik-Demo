namespace Domain
{
    public class Seat
    {
    public Guid Id { get; set; }
    public Guid EventHallId { get; set; }
    public EventHall EventHall{ get; set; }
    public string Label { get; set; } // Koltuk ismi (A1, B2)
    public int Row { get; set; }
    public int Column { get; set; }
    public string Status { get; set; } // "Boşluk", "Koltuk"
    }
}