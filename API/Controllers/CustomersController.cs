using Application.DTOs;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public CustomersController(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }


        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerDTO customerDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var customer = _mapper.Map<Customer>(customerDTO);

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var createdCustomer = _mapper.Map<CustomerDTO>(customer);

            return CreatedAtAction(nameof(GetCustomerById), new { id = customer.Id }, createdCustomer);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
             var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
                return NotFound();

            var customerDTO = _mapper.Map<CustomerDTO>(customer);
            return Ok(customerDTO);
        }
    }
}
