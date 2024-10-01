using Application.Core;
using Application.DTOs;
using AutoMapper;
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
        var activity = await _context.Activities.FindAsync(request.Activity.Id);

        if (activity == null) return null;
        
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

        if (request.Activity.EventHallId.HasValue)
        {
          var eventHall = await _context.EventHalls.FindAsync(request.Activity.EventHallId);
          activity.EventHall = eventHall;
        }

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Etkinlik güncellenemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}