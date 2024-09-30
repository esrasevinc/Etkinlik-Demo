using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser, IdentityRole, string>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<EventHall> EventHalls { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<TicketSeat> TicketSeats { get; set; }  
        public DbSet<Ticket> Tickets { get; set; }        
        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>()
            .HasMany(x => x.Activities)
            .WithOne(x => x.Category)
            .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Place>()
            .HasMany(x => x.Activities)
            .WithOne(x => x.Place)
            .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<EventHall>()
            .HasMany(x => x.Activities)
            .WithOne(x => x.EventHall)
            .OnDelete(DeleteBehavior.SetNull);

            // modelBuilder.Entity<Place>()
            // .HasMany(x => x.EventHalls)
            // .WithOne(x => x.Place)
            // .OnDelete(DeleteBehavior.SetNull);

             modelBuilder.Entity<EventHall>()
            .HasMany(eh => eh.Seats)
            .WithOne(s => s.EventHall)
            .HasForeignKey(s => s.EventHallId);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.TicketSeat)
                .WithMany(ts => ts.Tickets)
                .HasForeignKey(t => t.TicketSeatId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Activity)
                .WithMany(a => a.Tickets)
                .HasForeignKey(t => t.ActivityId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Customer)
                .WithMany(c => c.Tickets)
                .HasForeignKey(t => t.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);
            }
    }
}