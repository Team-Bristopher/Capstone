using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace capstoneapi.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserProfilePictureProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureURL",
                schema: "Capstone",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                schema: "Capstone",
                table: "Users",
                keyColumn: "ID",
                keyValue: new Guid("93d9ad71-19eb-4a08-94aa-50f2123c1f52"),
                column: "ProfilePictureURL",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureURL",
                schema: "Capstone",
                table: "Users");
        }
    }
}
