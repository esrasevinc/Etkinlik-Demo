using Application.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [Authorize]
        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivities() {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [Authorize]
        [HttpGet("{id}")] //api/activities/id
        public async Task<IActionResult> GetSingleActivity(Guid id) {
            return HandleResult(await Mediator.Send(new Details.Query{ Id = id }));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateActivity(ActivityDTO activity) {
            return HandleResult(await Mediator.Send(new Create.Command{ Activity = activity }));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> EditActivity(Guid id, ActivityDTO activity) {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{ Activity = activity }));

        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteActivity(Guid id) {
            return HandleResult(await Mediator.Send(new Delete.Command{ Id = id}));
           
        }
    }
}