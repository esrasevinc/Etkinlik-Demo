using Application.Core;
using Application.DTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.EventHalls
{
    public class GetByActivityId
{
    public class Query : IRequest<Result<EventHallDTO>>
    {
        public Guid ActivityId { get; set; }
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
            var hall = await _context.EventHalls
                .Include(e => e.Activities) 
                .FirstOrDefaultAsync(e => e.Activities.Any(a => a.Id == request.ActivityId), cancellationToken);

            if (hall == null)
            {
                return Result<EventHallDTO>.Failure("Event Hall not found for the provided Activity ID.");
            }

            var hallDto = _mapper.Map<EventHallDTO>(hall);

            return Result<EventHallDTO>.Success(hallDto);
        }
    }
}


}

