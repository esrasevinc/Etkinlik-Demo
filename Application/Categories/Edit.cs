using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Categories
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
          public Category Category { get; set; }
        }
        
        public class CommandValidator : AbstractValidator<Category>
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
        var category = await _context.Categories.FindAsync(request.Category.Id);

        if (category == null) return null;

        _mapper.Map(request.Category, category);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Kategori güncellenemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}