using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet] //api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities() {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //api/activities/id
        public async Task<ActionResult<ActivityDTO>> GetSingleActivity(Guid id) {
            return await Mediator.Send(new Details.Query{ Id = id });
        }

        [HttpPost]
        public async Task<ActionResult> CreateActivity(ActivityDTO activity) {
            await Mediator.Send(new Create.Command{ Activity = activity});
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditActivity(Guid id, ActivityDTO activity) {
            activity.Id = id;
            await Mediator.Send(new Edit.Command{ Activity = activity });
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActivity(Guid id) {
            await Mediator.Send(new Delete.Command{ Id = id});
            return Ok();
        }
    }
}