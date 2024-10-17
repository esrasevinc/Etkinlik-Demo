using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDTO>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<ActivityDTO>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(p => p.Place)
                    .Include(a => a.EventHall) 
                    .Include(eh => eh.TicketSeats) 
                    .FirstOrDefaultAsync(x => x.Id == request.Id && x.IsActive);

                if (activity == null) return Result<ActivityDTO>.Failure("Activity not found");

                var activityDTO = _mapper.Map<ActivityDTO>(activity);
                return Result<ActivityDTO>.Success(activityDTO);
            }
        }
    }
}