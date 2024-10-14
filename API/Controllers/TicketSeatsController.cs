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

    }
}
