using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TestMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_TicketSeats_TicketSeatId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_TicketSeatId",
                table: "Tickets");

            migrationBuilder.AddColumn<Guid>(
                name: "TicketId",
                table: "TicketSeats",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketSeats_TicketId",
                table: "TicketSeats",
                column: "TicketId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TicketSeats_Tickets_TicketId",
                table: "TicketSeats",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketSeats_Tickets_TicketId",
                table: "TicketSeats");

            migrationBuilder.DropIndex(
                name: "IX_TicketSeats_TicketId",
                table: "TicketSeats");

            migrationBuilder.DropColumn(
                name: "TicketId",
                table: "TicketSeats");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketSeatId",
                table: "Tickets",
                column: "TicketSeatId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_TicketSeats_TicketSeatId",
                table: "Tickets",
                column: "TicketSeatId",
                principalTable: "TicketSeats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
