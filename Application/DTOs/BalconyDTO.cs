namespace Application.DTOs 
{
    public class BalconyDTO 
    {
        public int Rows { get; set; }
        public int Columns { get; set; }
        public int StartRow { get; set; }  
        public int StartColumn { get; set; }
        public List<SeatDTO> Seats { get; set; }
    }
}