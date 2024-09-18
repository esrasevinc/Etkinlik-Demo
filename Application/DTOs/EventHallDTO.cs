namespace Application.DTOs {

    public class EventHallDTO
    {
        public Guid Id { get; set;}
        public string Title { get; set;}
        public PlaceDTO Place { get; set; }
        public Guid? PlaceId { get; set; }
        public int Rows { get; set; }
        public int Columns { get; set; }
        public IEnumerable<SeatDTO> Seats { get; set; } 

    }
}
