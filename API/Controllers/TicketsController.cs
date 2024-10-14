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
    public class TicketsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public TicketsController(IMapper mapper, DataContext context)
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


        [HttpGet("all")]
        public async Task<ActionResult<List<TicketDTO>>> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.Customer) 
                .Include(t => t.Activity) 
                .Include(t => t.TicketSeat) 
                .ToListAsync();

            var ticketDTOs = _mapper.Map<List<TicketDTO>>(tickets); 

            return Ok(ticketDTOs);
        }


        [HttpGet]
        public async Task<ActionResult<List<TicketDTO>>> GetTicketsByActivityId([FromQuery] Guid activityId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.ActivityId == activityId)
                .Include(t => t.Customer) 
                .Include(t => t.Activity) 
                .Include(t => t.TicketSeat) 
                .ToListAsync();

            var ticketDTOs = _mapper.Map<List<TicketDTO>>(tickets); 

            return Ok(ticketDTOs);
        }
    }
}
