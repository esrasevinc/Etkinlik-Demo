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
    // Koltuğun mevcut olup olmadığını ve dolu olup olmadığını kontrol et
    var seat = await _context.TicketSeats
        .Include(s => s.Activity) // Gerekirse aktivite bilgilerini de dahil et
        .FirstOrDefaultAsync(s => s.Id == createTicketDTO.TicketSeatId && s.Status != "Dolu");

    if (seat == null)
    {
        return BadRequest("Bu koltuk zaten dolu.");
    }

    // Müşteriyi ve etkinliği veritabanından yükle
    var customer = await _context.Customers.FindAsync(createTicketDTO.CustomerId);
    var activity = await _context.Activities.FindAsync(createTicketDTO.ActivityId);

    if (customer == null || activity == null)
    {
        return BadRequest("Müşteri veya etkinlik bulunamadı.");
    }

    // Yeni Ticket nesnesi oluşturma
    var ticket = new Ticket
    {
        CustomerId = createTicketDTO.CustomerId, // Müşteri kimliğini ata
        ActivityId = createTicketDTO.ActivityId, // Etkinlik kimliğini ata
        TicketSeatId = createTicketDTO.TicketSeatId, // Koltuk kimliğini ata
        Customer = customer, // Müşteriyi ata
        Activity = activity, // Etkinliği ata
        TicketSeat = seat // Seçilen koltuğu ata
    };

    // Koltuk durumunu güncelle
    seat.Status = "Dolu";

    // Ticket'ı ekleyin ve kaydedin
    _context.Tickets.Add(ticket);
    await _context.SaveChangesAsync();

    // Oluşturulan Ticket'ı DTO'ya dönüştürerek geri döndürün
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
             var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
                return NotFound();

            var ticketDTO = _mapper.Map<TicketDTO>(ticket);
            return Ok(ticketDTO);
        }

    }
}
