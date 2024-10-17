using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
   
    public class Create
{
    public class Command : IRequest<Result<ActivityDTO>>
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

    public class Handler : IRequestHandler<Command, Result<ActivityDTO>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<Result<ActivityDTO>> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == request.Activity.CategoryId);
            var place = await _context.Places.FirstOrDefaultAsync(x => x.Id == request.Activity.PlaceId);
            var eventHall = await _context.EventHalls.FirstOrDefaultAsync(x => x.Id == request.Activity.EventHallId);
            var activity = new Activity
            {
                Name = request.Activity.Name,
                Description = request.Activity.Description,
                Date = request.Activity.Date,
                Duration = request.Activity.Duration,
                IsActive = request.Activity.IsActive,
                IsPaid = request.Activity.IsPaid,
                IsDeleted = false,
                IsCancelled = false,
                Category = category,
                Place = place,
                EventHall = eventHall
            };

            var savedActivity = await _context.Activities.AddAsync(activity);
            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return Result<ActivityDTO>.Failure("Etkinlik oluşturulamadı.");

            var seats = await _context.Seats
                .Where(s => s.EventHallId == eventHall.Id && s.Status == "Koltuk")
                .ToListAsync(cancellationToken);

            var ticketSeats = seats
                .Select(seat => new TicketSeat
                {
                    Label = seat.Label,
                    Row = seat.Row,
                    Column = seat.Column,
                    Status = "Boş",
                    ActivityId = savedActivity.Entity.Id 
                }).ToList();

            await _context.TicketSeats.AddRangeAsync(ticketSeats);
            var ticketSeatResult = await _context.SaveChangesAsync() > 0;

            if (!ticketSeatResult) return Result<ActivityDTO>.Failure("TicketSeat oluşturulamadı.");

            var rActivity = _mapper.Map<ActivityDTO>(savedActivity.Entity);
            return Result<ActivityDTO>.Success(rActivity);
        }
    }
}

}