
using Domain;
using FluentValidation;

namespace Application.Activities
{
    public class ActivityValidator : AbstractValidator<ActivityDTO>
    {
        public ActivityValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            //RuleFor(x => x.PlaceId).NotEmpty();
            //RuleFor(x => x.CategoryId).NotEmpty();
        }
    }
}