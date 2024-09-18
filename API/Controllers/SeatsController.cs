using Microsoft.AspNetCore.Mvc;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.DTOs;

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

        // Belirli bir salonun koltuklarını getir
        [HttpGet("{eventHallId}")]
        public async Task<ActionResult<List<Seat>>> GetSeats(Guid eventHallId)
        {
            var seats = await _context.Seats
                .Where(seat => seat.EventHallId == eventHallId)
                .ToListAsync();

            if (seats == null || seats.Count == 0)
            {
                return NotFound("Koltuk bulunamadı.");
            }

            return Ok(seats);
        }

        // Bir salona koltuk ekle
        [HttpPost("{eventHallId}")]
        public async Task<ActionResult> CreateSeats(Guid eventHallId, [FromBody] List<Seat> seats)
        {
            // Salonu kontrol et
            var eventHall = await _context.EventHalls.FindAsync(eventHallId);
            if (eventHall == null)
            {
                return NotFound("Salon bulunamadı.");
            }

            // Koltukları salona ekle
            foreach (var seat in seats)
            {
                seat.EventHallId = eventHallId;
                _context.Seats.Add(seat);
            }

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Ok();

            return BadRequest("Koltuk ekleme başarısız oldu.");
        }

        // Bir koltuğu güncelle
        [HttpPut("{seatId}")]
        public async Task<ActionResult> UpdateSeat(Guid seatId, [FromBody] Seat updatedSeat)
        {
            var seat = await _context.Seats.FindAsync(seatId);

            if (seat == null) return NotFound("Koltuk bulunamadı.");

            // Koltuğun özelliklerini güncelle
            seat.Label = updatedSeat.Label;
            seat.Row = updatedSeat.Row;
            seat.Column = updatedSeat.Column;
            seat.Status = updatedSeat.Status;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Ok();

            return BadRequest("Koltuk güncelleme başarısız oldu.");
        }

        // Bir koltuğu sil
        [HttpDelete("{seatId}")]
        public async Task<ActionResult> DeleteSeat(Guid seatId)
        {
            var seat = await _context.Seats.FindAsync(seatId);

            if (seat == null) return NotFound("Koltuk bulunamadı.");

            _context.Seats.Remove(seat);

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Ok();

            return BadRequest("Koltuk silme başarısız oldu.");
        }


// Endpoint in SeatsController
[HttpPost("save")]
public async Task<IActionResult> SaveSeats([FromBody] SaveSeatsDTO saveSeatsDTO)
{
    var existingSeats = await _context.Seats
        .Where(s => s.EventHallId == saveSeatsDTO.EventHallId)
        .ToListAsync();

    _context.Seats.RemoveRange(existingSeats);

    var newSeats = saveSeatsDTO.Seats.Select(seatDto => new Seat
    {
        Id = Guid.NewGuid(),
        EventHallId = saveSeatsDTO.EventHallId,
        Row = seatDto.Row,
        Column = seatDto.Column,
        Label = seatDto.Label,
        Status = seatDto.Status
    });

    await _context.Seats.AddRangeAsync(newSeats);
    await _context.SaveChangesAsync();

    return Ok("Koltuk düzeni kaydedildi.");
}

    }
}
