using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Categories
{
    public class Details
  {
    public class Query : IRequest<CategoryDTO>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, CategoryDTO>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<CategoryDTO> Handle(Query request, CancellationToken cancellationToken)
      {
        return await _context.Categories.ProjectTo<CategoryDTO>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.Id == request.Id);
        
      }
    }
  }
}