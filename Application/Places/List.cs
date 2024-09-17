using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Places
{
    public class List
  {
    public class Query : IRequest<Result<List<PlaceDTO>>>
    {

    }

    public class Handler : IRequestHandler<Query, Result<List<PlaceDTO>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<List<PlaceDTO>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var places = await _context.Places.ProjectTo<PlaceDTO>(_mapper.ConfigurationProvider).ToListAsync();
        return Result<List<PlaceDTO>>.Success(places);
      }
    }
  }
}