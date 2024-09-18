using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class EventHallActivityAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EventHallId",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_EventHallId",
                table: "Activities",
                column: "EventHallId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_EventHalls_EventHallId",
                table: "Activities",
                column: "EventHallId",
                principalTable: "EventHalls",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_EventHalls_EventHallId",
                table: "Activities");

            migrationBuilder.DropIndex(
                name: "IX_Activities_EventHallId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "EventHallId",
                table: "Activities");
        }
    }
}
