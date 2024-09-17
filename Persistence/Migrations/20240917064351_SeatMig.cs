using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeatMig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seats_EventHalls_EventHallId1",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Seats_EventHallId1",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "EventHallId1",
                table: "Seats");

            migrationBuilder.AlterColumn<Guid>(
                name: "EventHallId",
                table: "Seats",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.CreateIndex(
                name: "IX_Seats_EventHallId",
                table: "Seats",
                column: "EventHallId");

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_EventHalls_EventHallId",
                table: "Seats",
                column: "EventHallId",
                principalTable: "EventHalls",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seats_EventHalls_EventHallId",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Seats_EventHallId",
                table: "Seats");

            migrationBuilder.AlterColumn<int>(
                name: "EventHallId",
                table: "Seats",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddColumn<Guid>(
                name: "EventHallId1",
                table: "Seats",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seats_EventHallId1",
                table: "Seats",
                column: "EventHallId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_EventHalls_EventHallId1",
                table: "Seats",
                column: "EventHallId1",
                principalTable: "EventHalls",
                principalColumn: "Id");
        }
    }
}
