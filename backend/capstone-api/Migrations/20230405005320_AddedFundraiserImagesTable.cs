using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace capstoneapi.Migrations
{
    /// <inheritdoc />
    public partial class AddedFundraiserImagesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FundraiserImages",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    FundraiserImageURL = table.Column<string>(type: "text", nullable: false),
                    FundraiserID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FundraiserImages", x => x.ID);
                    table.ForeignKey(
                        name: "FK_FundraiserImages_Fundraisers_FundraiserID",
                        column: x => x.FundraiserID,
                        principalSchema: "Capstone",
                        principalTable: "Fundraisers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FundraiserImages_FundraiserID",
                schema: "Capstone",
                table: "FundraiserImages",
                column: "FundraiserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FundraiserImages",
                schema: "Capstone");
        }
    }
}
