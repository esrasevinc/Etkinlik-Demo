using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TicketSeats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketSeats_Activities_ActivityId1",
                table: "TicketSeats");

            migrationBuilder.DropIndex(
                name: "IX_TicketSeats_ActivityId1",
                table: "TicketSeats");

            migrationBuilder.DropColumn(
                name: "ActivityId1",
                table: "TicketSeats");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ActivityId1",
                table: "TicketSeats",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketSeats_ActivityId1",
                table: "TicketSeats",
                column: "ActivityId1");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketSeats_Activities_ActivityId1",
                table: "TicketSeats",
                column: "ActivityId1",
                principalTable: "Activities",
                principalColumn: "Id");
        }
    }
}
