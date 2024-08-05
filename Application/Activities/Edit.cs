using Application.Core;
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
            public Activity Activity { get; set; }
        }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        
      }
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
        var activity = await _context.Activities.FindAsync(request.Activity.Id);

        if (activity == null) return null;

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Etkinlik detayları güncellenemedi!");

        return Result<Unit>.Success(Unit.Value);
      }
    }
    }
}