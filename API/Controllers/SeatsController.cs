using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatsController : ControllerBase
    {
        private readonly DataContext _context;

        public SeatsController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveSeats([FromBody] List<SeatDTO> seats)
        {
        if (seats == null || !seats.Any())
        {
            return BadRequest("Koltuk bilgileri geçersiz.");
        }

        foreach (var seat in seats)
        {
            var existingSeat = await _context.Seats
                .FirstOrDefaultAsync(s => s.Row == seat.Row && s.Column == seat.Column);

            if (existingSeat != null)
            {
                existingSeat.Label = seat.Label;
                _context.Seats.Update(existingSeat);
            }
            else
            {
                var newSeat = new Seat
                {
                    Row = seat.Row,
                    Column = seat.Column,
                    Label = seat.Label
                };
                _context.Seats.Add(newSeat);
            }
        }

        await _context.SaveChangesAsync();
        return Ok("Koltuklar başarıyla kaydedildi.");
    }
}

public class SeatDTO
{
    public int Row { get; set; }
    public int Column { get; set; }
    public string Label { get; set; }
}

}