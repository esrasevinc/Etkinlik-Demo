using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Categories
{
  public class Create
  {
    public class Command : IRequest<Result<Category>>
    {
      public Category Category { get; set; }
    }
  }

  public class CommandValidator : AbstractValidator<Category>
  {
    public CommandValidator()
    {
      RuleFor(x => x.Title).NotEmpty();
    }
  }

  public class Handler : IRequestHandler<Create.Command, Result<Category>>
  {
    private readonly DataContext _context;
    public Handler(DataContext context)
    {
      _context = context;
    }

    public async Task<Result<Category>> Handle(Create.Command request, CancellationToken cancellationToken)
    {
      var savedCategory = await _context.Categories.AddAsync(request.Category);
      var result = await _context.SaveChangesAsync() > 0;

      if (!result) return Result<Category>.Failure("Kategori oluşturulamadı.");

      return Result<Category>.Success(savedCategory.Entity);
    }
  }
}