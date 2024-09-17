using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.DTOs;

namespace Application.Categories
{
    public class Details
  {
    public class Query : IRequest<Result<CategoryDTO>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<CategoryDTO>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<CategoryDTO>> Handle(Query request, CancellationToken cancellationToken)
      {
        var category = await _context.Categories.ProjectTo<CategoryDTO>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.Id == request.Id);

        return Result<CategoryDTO>.Success(category);
      }
    }
  }
}