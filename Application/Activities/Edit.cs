using Application.Activities;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
  public class Edit
  {
    public class Command : IRequest<Result<Unit>>
    {
      public ActivityDTO Activity { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
      }
    }

    public class Handler(DataContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
      private readonly IMapper _mapper = mapper;
      private readonly DataContext _context = context;

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        /* Search item in database */
        var activity = await _context.Activities.FindAsync(request.Activity.Id);

        /* Return null and handle it if not found */
        if (activity == null) return null;

        /* Update fields based on given object */
        
        _mapper.Map(request.Activity, activity);
        

        if (request.Activity.CategoryId.HasValue)
        {
          var category = await _context.Categories.FindAsync(request.Activity.CategoryId);
          activity.Category = category;
        }

        if (request.Activity.PlaceId.HasValue)
        {
          var place = await _context.Places.FindAsync(request.Activity.PlaceId);
          activity.Place = place;
        }

        /* Save updated item to database */
        var result = await _context.SaveChangesAsync() > 0;

        /* Handle if can't save to database */
        if (!result) return Result<Unit>.Failure("Makale güncellenemedi.");

        /* Done! */
        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}