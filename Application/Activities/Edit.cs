using Application.Core;
using Application.DTOs;
using AutoMapper;
using FluentValidation;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Domain;

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

        bool eventHallChanged = activity.EventHall.Id != request.Activity.EventHallId;
        
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
          var eventHall = await _context.EventHalls
                        .Include(eh => eh.Seats) 
                        .FirstOrDefaultAsync(eh => eh.Id == request.Activity.EventHallId, cancellationToken);

          if (eventHallChanged)
          {
              var oldTicketSeats = await _context.TicketSeats
              .Where(ts => ts.ActivityId == activity.Id)
              .ToListAsync(cancellationToken);

              _context.TicketSeats.RemoveRange(oldTicketSeats);

              foreach (var seat in eventHall.Seats.Where(s => s.Status == "Koltuk")) 
              {
                  var ticketSeat = new TicketSeat
                  {
                    Label = seat.Label,
                    Row = seat.Row,
                    Column = seat.Column,
                    Status = "Boş",  
                    ActivityId = activity.Id,
                  };
              _context.TicketSeats.Add(ticketSeat);
              }
          }
        }

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Etkinlik güncellenemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}