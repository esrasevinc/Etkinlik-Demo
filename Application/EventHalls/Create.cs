using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.EventHalls
{
  public class Create
  {
    public class Command : IRequest<Result<EventHall>>
    {
      public EventHall EventHall { get; set; }
    }
  }

  public class CommandValidator : AbstractValidator<EventHall>
  {
    public CommandValidator()
    {
      RuleFor(x => x.Title).NotEmpty();
    }
  }

  public class Handler : IRequestHandler<Create.Command, Result<EventHall>>
  {
    private readonly DataContext _context;
    public Handler(DataContext context)
    {
      _context = context;
    }

    public async Task<Result<EventHall>> Handle(Create.Command request, CancellationToken cancellationToken)
    {
      var savedHall = await _context.EventHalls.AddAsync(request.EventHall);
      var result = await _context.SaveChangesAsync() > 0;

      if (!result) return Result<EventHall>.Failure("Salon oluşturulamadı.");

      return Result<EventHall>.Success(savedHall.Entity);
    }
  }
}