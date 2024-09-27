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

        [HttpPost("{eventHallId}")]
        public async Task<ActionResult> CreateSeats(Guid eventHallId, [FromBody] List<Seat> seats)
        {
            var eventHall = await _context.EventHalls.FindAsync(eventHallId);
            if (eventHall == null)
            {
                return NotFound("Salon bulunamadı.");
            }

            foreach (var seat in seats)
            {
                seat.EventHallId = eventHallId;
                _context.Seats.Add(seat);
            }

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Ok();

            return BadRequest("Koltuk ekleme başarısız oldu.");
        }


        [HttpPut("{seatId}")]
        public async Task<ActionResult> UpdateSeat(Guid seatId, [FromBody] Seat updatedSeat)
        {
            var seat = await _context.Seats.FindAsync(seatId);

            if (seat == null) return NotFound("Koltuk bulunamadı.");

            seat.Label = updatedSeat.Label;
            seat.Row = updatedSeat.Row;
            seat.Column = updatedSeat.Column;
            seat.Status = updatedSeat.Status;

            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Ok();

            return BadRequest("Koltuk güncelleme başarısız oldu.");
        }

    
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

        [HttpPost("save")]
        public async Task<IActionResult> SaveSeats([FromBody] SaveSeatsDTO saveSeatsDTO)
        {

            var eventHall = await _context.EventHalls.FindAsync(saveSeatsDTO.EventHallId);
            if (eventHall == null)
            {
                return NotFound("Salon bulunamadı.");
            }

            var existingSeats = await _context.Seats
                .Where(s => s.EventHallId == saveSeatsDTO.EventHallId)
                .ToListAsync();

            if (existingSeats.Any())
            {
                _context.Seats.RemoveRange(existingSeats);
            }

            var newSeats = saveSeatsDTO.Seats.Select(seatDto => new Seat
            {
                Id = Guid.NewGuid(),  
                EventHallId = saveSeatsDTO.EventHallId,  
                Row = seatDto.Row,
                Column = seatDto.Column,
                Label = seatDto.Label,
                Status = seatDto.Status
            }).ToList(); 

            await _context.Seats.AddRangeAsync(newSeats);

            var success = await _context.SaveChangesAsync() > 0;

            if (success)
            {
                return Ok("Koltuk düzeni başarıyla kaydedildi.");
            }

            return BadRequest("Koltuk düzeni kaydedilemedi.");
        }


    }
}
