using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {


        public class Command : IRequest<Result<ActivityDTO>>
        {
            public ActivityDTO Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
                    RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
                }
            }

        public class Handler : IRequestHandler<Command, Result<ActivityDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

        
            public async Task<Result<ActivityDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == request.Activity.CategoryId);
                var place = await _context.Places.FirstOrDefaultAsync(x => x.Id == request.Activity.PlaceId);
                var activity = new Activity
                {
                Name = request.Activity.Name,
                Description = request.Activity.Description,
                Date = request.Activity.Date,
                IsActive = request.Activity.IsActive,
                IsDeleted = false,
                IsCancelled = false,
                Category = category,
                Place= place,
                };
        
                var savedActivity = await _context.Activities.AddAsync(activity);
        
                var result = await _context.SaveChangesAsync() > 0;
        
                var rActivity = _mapper.Map<ActivityDTO>(savedActivity.Entity);

                if (!result) return Result<ActivityDTO>.Failure("Etkinlik oluşturulamadı.");

                return Result<ActivityDTO>.Success(rActivity);
            }
        }
    }
}