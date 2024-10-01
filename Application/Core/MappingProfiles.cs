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


            CreateMap<Ticket, Ticket>();
            CreateMap<Ticket, TicketDTO>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.Customer.Id))
                .ForMember(dest => dest.ActivityId, opt => opt.MapFrom(src => src.Activity.Id))
                .ForMember(dest => dest.TicketSeatId, opt => opt.MapFrom(src => src.TicketSeat.Id));
            CreateMap<TicketDTO, Ticket>();

            CreateMap<TicketSeat, TicketSeat>();
            CreateMap<TicketSeat, TicketSeatDTO>();
            CreateMap<TicketSeatDTO, TicketSeat>();


            CreateMap<Customer, Customer>();
            CreateMap<Customer, CustomerDTO>();
            CreateMap<CustomerDTO, Customer>();
        }
    }
}