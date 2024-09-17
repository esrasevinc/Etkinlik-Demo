using Application.DTOs;
using Application.EventHalls;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class EventHalls : BaseApiController
    {
        [HttpGet] 
        [Authorize]
        public async Task<IActionResult> GetEventHalls() {
             return HandleResult(await Mediator.Send(new List.Query {}));
        }


        [HttpGet("{id}")] 
        [Authorize]
        public async Task<IActionResult> GetSingleEventHall(Guid id) {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateEventHall(EventHallDTO eventHall) {
            return HandleResult(await Mediator.Send(new Create.Command { EventHall = eventHall }));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> EditEventHall(Guid id, EventHallDTO eventHall) {
            eventHall.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { EventHall = eventHall }));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteEventHall(Guid id) {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}