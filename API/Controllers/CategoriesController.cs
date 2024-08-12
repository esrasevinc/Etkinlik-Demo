using Application.Categories;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoriesController : BaseApiController
    {
        [HttpGet] //api/categories
        public async Task<IActionResult> GetCategories() {
             return HandleResult(await Mediator.Send(new List.Query {}));
        }

        [HttpGet("{id}")] //api/categories/id
        public async Task<IActionResult> GetSingleCategory(Guid id) {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCategory(Category category) {
            return HandleResult(await Mediator.Send(new Create.Command { Category = category }));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> EditCategory(Guid id, Category category) {
            category.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Category = category }));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCategory(Guid id) {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}