namespace Domain 
{
    public class EventHall 
    {
        public Guid Id { get; set;}
        public string Title { get; set;}
        public Place Place { get; set; }
        public int Rows { get; set; }
        public int Columns { get; set; }
        public List<Seat> Seats { get; set; }
    }    
}