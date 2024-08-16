using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EventHalls
{
  public class List
  {
    public class Query : IRequest<Result<List<EventHall>>>
    {

    }

    public class Handler : IRequestHandler<Query, Result<List<EventHall>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<List<EventHall>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var halls = await _context.EventHalls.ProjectTo<EventHall>(_mapper.ConfigurationProvider).ToListAsync();
        return Result<List<EventHall>>.Success(halls);
      }
    }
  }
}