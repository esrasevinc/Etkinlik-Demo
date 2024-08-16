using Application.Core;
using MediatR;
using Persistence;

namespace Application.EventHalls
{
    public class Delete
  {
    public class Command : IRequest<Result<Unit>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var hall = await _context.EventHalls.FindAsync(request.Id);

        if (hall == null) return null;

        _context.EventHalls.Remove(hall);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Salon silinemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}