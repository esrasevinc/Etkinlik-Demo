using Application.Core;
using Application.DTOs;
using AutoMapper;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.EventHalls
{
    public class Edit
  {
    public class Command : IRequest<Result<Unit>>
    {
      public EventHallDTO EventHall { get; set; }
    }

    public class CommandValidator : AbstractValidator<EventHallDTO>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.PlaceId).NotEmpty();
        RuleFor(x => x.Rows).NotEmpty();
        RuleFor(x => x.Columns).NotEmpty();
      }
    }

    public class Handler(DataContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
      private readonly IMapper _mapper = mapper;
      private readonly DataContext _context = context;

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        /* Search item in database */
        var eventHall = await _context.EventHalls.FindAsync(request.EventHall.Id);

        /* Return null and handle it if not found */
        if (eventHall == null) return null;

        /* Update fields based on given object */
        
        _mapper.Map(request.EventHall, eventHall);

        if (request.EventHall.PlaceId.HasValue)
        {
          var place = await _context.Places.FindAsync(request.EventHall.PlaceId);
          eventHall.Place = place;
        }

        /* Save updated item to database */
        var result = await _context.SaveChangesAsync() > 0;

        /* Handle if can't save to database */
        if (!result) return Result<Unit>.Failure("Salon güncellenemedi.");

        /* Done! */
        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}