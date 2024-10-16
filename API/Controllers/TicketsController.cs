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
        public async Task<ActionResult<TicketDTO>> CreateTicket(CreateTicketDTO createTicketDTO)
        {
       
            var seat = await _context.TicketSeats
                .Include(s => s.Activity) 
                .FirstOrDefaultAsync(s => s.Id == createTicketDTO.TicketSeatId && s.Status != "Dolu");

            if (seat == null)
            {
                return BadRequest("Bu koltuk zaten dolu.");
            }

            var customer = await _context.Customers.FindAsync(createTicketDTO.CustomerId);
            var activity = await _context.Activities.FindAsync(createTicketDTO.ActivityId);

            if (customer == null || activity == null)
            {
                return BadRequest("Müşteri veya etkinlik bulunamadı.");
            }

            var ticket = new Ticket
            {
                CustomerId = createTicketDTO.CustomerId, 
                ActivityId = createTicketDTO.ActivityId, 
                TicketSeatId = createTicketDTO.TicketSeatId, 
                Customer = customer, 
                Activity = activity,
                TicketSeat = seat 
            };

 
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
                    .ThenInclude(a => a.Place) 
                .Include(t => t.Activity.EventHall) 
                .Include(t => t.Activity.Category) 
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
                 .ThenInclude(a => a.Place) 
            .Include(t => t.Activity.EventHall)
            .Include(t => t.Activity.Category)
            .Include(t => t.TicketSeat) 
            .ToListAsync();

        var ticketDTOs = _mapper.Map<List<TicketDTO>>(tickets); 

        return Ok(ticketDTOs);
    }

    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicketById(Guid id)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Customer) 
            .Include(t => t.TicketSeat) 
            .Include(t => t.Activity) 
            .FirstOrDefaultAsync(t => t.Id == id); 

        if (ticket == null)
            return NotFound();

        var ticketDTO = _mapper.Map<TicketDTO>(ticket);
        return Ok(ticketDTO);
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<TicketDTO>> UpdateTicket(Guid id, UpdateTicketDTO updateTicketDTO)
    {

        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound("Bilet bulunamadı.");
        }

        var oldSeat = await _context.TicketSeats.FindAsync(ticket.TicketSeatId);
   
        var newSeat = await _context.TicketSeats.FindAsync(updateTicketDTO.TicketSeatId);
    
        if (newSeat == null || newSeat.Status == "Dolu")
        {
            return BadRequest("Yeni koltuk bulunamadı veya dolu.");
        }


        var customer = await _context.Customers.FindAsync(updateTicketDTO.CustomerId);
        var activity = await _context.Activities.FindAsync(updateTicketDTO.ActivityId);

        if (customer == null || activity == null)
        {
            return BadRequest("Müşteri veya etkinlik bulunamadı.");
        }

        if (oldSeat != null)
        {
            oldSeat.Status = "Boş";
        }

        ticket.TicketSeatId = updateTicketDTO.TicketSeatId;
        ticket.CustomerId = updateTicketDTO.CustomerId;
        ticket.ActivityId = updateTicketDTO.ActivityId;

  
        newSeat.Status = "Dolu";

        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<TicketDTO>(ticket));
    }



    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(Guid id)
    {
        var ticket = await _context.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound("Bilet bulunamadı.");
        }

   
        var seat = await _context.TicketSeats.FindAsync(ticket.TicketSeatId);
        if (seat != null)
        {
            seat.Status = "Boş"; 
        }

        _context.Tickets.Remove(ticket);
        await _context.SaveChangesAsync();

        return Ok();
    }


    }
}
