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
    public class ListByPlaceId
    {
        public class Query : IRequest<Result<List<EventHallDTO>>>
        {
            public Guid PlaceId { get; set; }  
        }

        public class Handler : IRequestHandler<Query, Result<List<EventHallDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<EventHallDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Belirli bir placeId'ye göre etkinlik salonlarını filtrele
                var halls = await _context.EventHalls
                    .Include(eh => eh.Place) // Place'ı yükle
                    .Where(eh => eh.Place.Id == request.PlaceId)
                    .ProjectTo<EventHallDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<EventHallDTO>>.Success(halls);
            }
        }
    }
}
