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
<<<<<<< HEAD

=======
                
>>>>>>> 5addf47fee54a749e02a84477ceb2045667e26e8
            CreateMap<Seat, Seat>();
            CreateMap<Seat, SeatDTO>();


            CreateMap<Ticket, Ticket>();
            CreateMap<Ticket, TicketDTO>()
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.Customer.Id))
                .ForMember(dest => dest.ActivityId, opt => opt.MapFrom(src => src.Activity.Id))
                .ForMember(dest => dest.TicketSeatId, opt => opt.MapFrom(src => src.TicketSeat.Id));
            CreateMap<TicketDTO, Ticket>();

            CreateMap<TicketSeat, TicketSeat>();
            CreateMap<TicketSeat, TicketSeatDTO>()
                .ForMember(dest => dest.Label, opt => opt.MapFrom(src => src.Label))
                .ForMember(dest => dest.Row, opt => opt.MapFrom(src => src.Row))
                .ForMember(dest => dest.Column, opt => opt.MapFrom(src => src.Column))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.ActivityId, opt => opt.MapFrom(src => src.ActivityId));
            CreateMap<TicketSeatDTO, TicketSeat>();


            CreateMap<Customer, Customer>();
            CreateMap<Customer, CustomerDTO>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone))
                .ForMember(dest => dest.TCNumber, opt => opt.MapFrom(src => src.TCNumber))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate));
            CreateMap<CustomerDTO, Customer>();
        }
    }
}