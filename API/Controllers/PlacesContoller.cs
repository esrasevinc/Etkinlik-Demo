using Application.Places;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PlacesController : BaseApiController
    {
        [HttpGet] //api/places
        [Authorize]
        public async Task<IActionResult> GetPlaces() {
             return HandleResult(await Mediator.Send(new List.Query {}));
        }


        [HttpGet("{id}")] //api/places/id
        [Authorize]
        public async Task<IActionResult> GetSinglePlace(Guid id) {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePlace(Place place) {
            return HandleResult(await Mediator.Send(new Create.Command { Place = place }));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> EditPlace(Guid id, Place place) {
            place.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Place = place }));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePlace(Guid id) {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}