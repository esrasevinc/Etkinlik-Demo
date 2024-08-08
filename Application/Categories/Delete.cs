using Application.Core;
using MediatR;
using Persistence;

namespace Application.Categories
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
        var category = await _context.Categories.FindAsync(request.Id);

        if (category == null) return null;

        _context.Categories.Remove(category);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Kategori silinemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}