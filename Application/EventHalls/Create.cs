using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EventHalls
{
    public class Create
    {
        public class Command : IRequest<Result<EventHallDTO>>
        {
            public EventHallDTO EventHall { get; set; }
        }

        public class CommandValidator : AbstractValidator<EventHall>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<EventHallDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<EventHallDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                var place = await _context.Places.FirstOrDefaultAsync(x => x.Id == request.EventHall.PlaceId);

                var eventHall = new EventHall
                {
                    Title = request.EventHall.Title,
                    Rows = request.EventHall.Rows,
                    Columns = request.EventHall.Columns,
                    Place = place,
                };

                var savedEventHall = await _context.EventHalls.AddAsync(eventHall);
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<EventHallDTO>.Failure("Salon oluşturulamadı.");

                var seats = new List<Seat>();

                for (int row = 0; row < eventHall.Rows; row++)
                {
                    for (int col = 0; col < eventHall.Columns; col++)
                    {
                        seats.Add(new Seat
                        {
                            EventHallId = eventHall.Id, 
                            Row = row,
                            Column = col,
                            Label = "",
                            Status = "Boşluk" 
                        });
                    }
                }

                await _context.Seats.AddRangeAsync(seats);
                var seatResult = await _context.SaveChangesAsync() > 0;

                if (!seatResult) return Result<EventHallDTO>.Failure("Koltuklar eklenirken bir hata oluştu.");

                var rEventHall = _mapper.Map<EventHallDTO>(savedEventHall.Entity);

                return Result<EventHallDTO>.Success(rEventHall);
    
            }
        }
    }
}
