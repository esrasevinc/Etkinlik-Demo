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
    public class TicketController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public TicketController(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<TicketDTO>> CreateTicket(TicketDTO ticketDTO)
        {
            var seat = await _context.TicketSeats
                .FirstOrDefaultAsync(s => s.Id == ticketDTO.TicketSeatId && s.Status != "Dolu");

            if (seat == null)
            {
                return BadRequest("Bu koltuk zaten dolu.");
            }

        
            var ticket = _mapper.Map<Ticket>(ticketDTO);

            seat.Status = "Dolu";

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<TicketDTO>(ticket));
        }
    }
}