using Application.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<ActivityDTO, Activity>();
            CreateMap<Activity, ActivityDTO>()
                .ForMember(x => x.Category, o => o.MapFrom(s => s.Category ?? null))
                .ForMember(x => x.CategoryId, o => o.MapFrom(s => s.Category != null ? s.Category.Id : (Guid?)null))
                .ForMember(x => x.Place, o => o.MapFrom(s => s.Place ?? null))
                .ForMember(x => x.PlaceId, o => o.MapFrom(s => s.Place != null ? s.Place.Id : (Guid?)null))
                .ForMember(x => x.EventHall, o => o.MapFrom(s => s.EventHall ?? null))
                .ForMember(x => x.EventHallId, o => o.MapFrom(s => s.EventHall != null ? s.EventHall.Id : (Guid?)null));

            CreateMap<Category, Category>();
            CreateMap<Category, CategoryDTO>();

            CreateMap<Place, Place>();
            CreateMap<Place, PlaceDTO>();

            CreateMap<EventHall, EventHall>();
            CreateMap<EventHallDTO, EventHall>();
            CreateMap<EventHall, EventHallDTO>()
                .ForMember(dest => dest.Seats, opt => opt.MapFrom(src => src.Seats))
                .ForMember(x => x.Place, o => o.MapFrom(s => s.Place ?? null))
                .ForMember(x => x.PlaceId, o => o.MapFrom(s => s.Place.Id));
                
            CreateMap<Seat, Seat>();
            CreateMap<Seat, SeatDTO>();
        }
    }
}