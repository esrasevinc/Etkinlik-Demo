using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.EventHalls
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
          public EventHall EventHall { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<EventHall>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
            }
        }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
    private readonly DataContext _context;
    private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
      _mapper = mapper;
      _context = context;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var hall = await _context.EventHalls.FindAsync(request.EventHall.Id);

        if (hall == null) return null;

        _mapper.Map(request.EventHall, hall);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Salon güncellenemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}