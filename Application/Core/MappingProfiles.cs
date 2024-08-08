using Application.Activities;
using Application.Categories;
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
            .ForMember(x => x.CategoryId, o => o.MapFrom(s => s.Category.Id))
            .ForMember(x => x.Id, o => o.MapFrom(s => s.Id));
            CreateMap<Category, Category>();
            CreateMap<Category, CategoryDTO>();
        }
    }
}