using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace capstoneapi.Migrations
{
    /// <inheritdoc />
    public partial class AddedViewTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Views",
                schema: "Capstone",
                table: "Fundraisers");

            migrationBuilder.CreateTable(
                name: "FundraiserViews",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    ViewedByID = table.Column<Guid>(type: "uuid", nullable: false),
                    FundraiserID = table.Column<Guid>(type: "uuid", nullable: false),
                    ViewedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FundraiserViews", x => x.ID);
                    table.ForeignKey(
                        name: "FK_FundraiserViews_Fundraisers_FundraiserID",
                        column: x => x.FundraiserID,
                        principalSchema: "Capstone",
                        principalTable: "Fundraisers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FundraiserViews_Users_ViewedByID",
                        column: x => x.ViewedByID,
                        principalSchema: "Capstone",
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FundraiserViews_FundraiserID",
                schema: "Capstone",
                table: "FundraiserViews",
                column: "FundraiserID");

            migrationBuilder.CreateIndex(
                name: "IX_FundraiserViews_ViewedByID",
                schema: "Capstone",
                table: "FundraiserViews",
                column: "ViewedByID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FundraiserViews",
                schema: "Capstone");

            migrationBuilder.AddColumn<long>(
                name: "Views",
                schema: "Capstone",
                table: "Fundraisers",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }
    }
}
