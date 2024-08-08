using Application.Categories;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoriesController : BaseApiController
    {
        [HttpGet] //api/categories
        public async Task<ActionResult<List<CategoryDTO>>> GetCategories() {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //api/categories/id
        public async Task<ActionResult<CategoryDTO>> GetSingleCategory(Guid id) {
            return await Mediator.Send(new Details.Query{ Id = id });
        }

        [HttpPost]
        public async Task<ActionResult> CreateCategory(Category category) {
            await Mediator.Send(new Create.Command{ Category = category});
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditCategory(Guid id, Category category) {
            category.Id = id;
            await Mediator.Send(new Edit.Command{ Category = category });
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(Guid id) {
            await Mediator.Send(new Delete.Command{ Id = id});
            return Ok();
        }
    }
}