namespace Application.DTOs
{
    public class SeatDTO
    {
        public string Label { get; set; }
        public int Row { get; set; }
        public int Column { get; set; }
        public string Status { get; set; }
    }

    public class SaveSeatsDTO
    {
        public Guid EventHallId { get; set; }
        public List<SeatDTO> Seats { get; set; }
    }

}