using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace capstoneapi.Migrations
{
    /// <inheritdoc />
    public partial class RemovedCommentsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments",
                schema: "Capstone");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Comments",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    FundraiserID = table.Column<Guid>(type: "uuid", nullable: false),
                    UserID = table.Column<Guid>(type: "uuid", nullable: false),
                    CommentText = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Comments_Fundraisers_FundraiserID",
                        column: x => x.FundraiserID,
                        principalSchema: "Capstone",
                        principalTable: "Fundraisers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Users_UserID",
                        column: x => x.UserID,
                        principalSchema: "Capstone",
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_FundraiserID",
                schema: "Capstone",
                table: "Comments",
                column: "FundraiserID");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserID",
                schema: "Capstone",
                table: "Comments",
                column: "UserID");
        }
    }
}
