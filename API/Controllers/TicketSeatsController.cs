using Application.DTOs;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketSeatsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public TicketSeatsController(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<TicketSeatDTO>> CreateTicketSeat(TicketSeatDTO ticketSeatDTO)
        {
            var seat = await _context.Seats
                .FirstOrDefaultAsync(s => s.Id == ticketSeatDTO.SeatId);

            if (seat == null)
            {
                return NotFound("Seçilen koltuk bulunamadı.");
            }

            var ticketSeat = new TicketSeat
            {
                Id = ticketSeatDTO.SeatId,
                Row = seat.Row,
                Column = seat.Column,
                Status = "Boş",
                ActivityId = ticketSeatDTO.ActivityId
            };

            _context.TicketSeats.Add(ticketSeat);
            await _context.SaveChangesAsync();

            return Ok(new TicketSeatDTO
            {
                Id = ticketSeat.Id,
                SeatId = ticketSeat.SeatId,
                Row = ticketSeat.Row,
                Column = ticketSeat.Column,
                Status = ticketSeat.Status
            });
        }


        [HttpGet("activity/{activityId}")]
        public async Task<ActionResult<IEnumerable<TicketSeatDTO>>> GetTicketSeatsByActivityId(Guid activityId)
        {
            var ticketSeats = await _context.TicketSeats
                .Where(ts => ts.ActivityId == activityId)
                .ToListAsync();

            if (ticketSeats == null || !ticketSeats.Any())
            {
                return NotFound("Bu aktivite için koltuk bulunamadı.");
            }

            var ticketSeatDTOs = _mapper.Map<IEnumerable<TicketSeatDTO>>(ticketSeats);
            return Ok(ticketSeatDTOs);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TicketSeatDTO>> UpdateTicketSeat(Guid id, UpdateTicketSeatDTO updateTicketSeatDTO)
        {
            var ticketSeat = await _context.TicketSeats.FindAsync(id);

            if (ticketSeat == null)
            {
                return NotFound("Koltuk bulunamadı.");
            }

            ticketSeat.Status = updateTicketSeatDTO.Status; 

            var success = await _context.SaveChangesAsync() > 0;

            if (success)
            {
                var updatedTicketSeatDTO = _mapper.Map<TicketSeatDTO>(ticketSeat);
                return Ok(updatedTicketSeatDTO);
            }

            return BadRequest("Koltuk durumu güncellenemedi.");
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketSeatDTO>> GetTicketSeatById(Guid id)
        {
        var ticketSeat = await _context.TicketSeats
            .FirstOrDefaultAsync(ts => ts.Id == id);

        if (ticketSeat == null)
        {
            return NotFound("Koltuk bulunamadı.");
        }

        var ticketSeatDTO = _mapper.Map<TicketSeatDTO>(ticketSeat);
        return Ok(ticketSeatDTO);
        }   

    }
}
