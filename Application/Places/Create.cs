using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Places
{
  public class Create
  {
    public class Command : IRequest<Result<Place>>
    {
      public Place Place { get; set; }
    }
  }

  public class CommandValidator : AbstractValidator<Place>
  {
    public CommandValidator()
    {
      RuleFor(x => x.Title).NotEmpty();
    }
  }

  public class Handler : IRequestHandler<Create.Command, Result<Place>>
  {
    private readonly DataContext _context;
    public Handler(DataContext context)
    {
      _context = context;
    }

    public async Task<Result<Place>> Handle(Create.Command request, CancellationToken cancellationToken)
    {
      var savedPlace = await _context.Places.AddAsync(request.Place);
      var result = await _context.SaveChangesAsync() > 0;

      if (!result) return Result<Place>.Failure("Gösteri merkezi oluşturulamadı.");

      return Result<Place>.Success(savedPlace.Entity);
    }
  }
}