using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EventHalls
{
    public class Details
  {
    public class Query : IRequest<Result<EventHallDTO>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<EventHallDTO>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<EventHallDTO>> Handle(Query request, CancellationToken cancellationToken)
      {
        var hall = await _context.EventHalls.ProjectTo<EventHallDTO>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.Id == request.Id);

        return Result<EventHallDTO>.Success(hall);
      }
    }
  }
}