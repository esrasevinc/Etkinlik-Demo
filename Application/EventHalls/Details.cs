using Application.Activities;
using Application.Core;
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
    public class Query : IRequest<Result<EventHall>>
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<EventHall>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<EventHall>> Handle(Query request, CancellationToken cancellationToken)
      {
        var hall = await _context.EventHalls.ProjectTo<EventHall>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.Id == request.Id);

        return Result<EventHall>.Success(hall);
      }
    }
  }
}