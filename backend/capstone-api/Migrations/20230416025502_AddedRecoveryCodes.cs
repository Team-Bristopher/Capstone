using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace capstoneapi.Migrations
{
    /// <inheritdoc />
    public partial class AddedRecoveryCodes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RecoveryCodes",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<int>(type: "integer", nullable: false),
                    RecoveryAuthenticationCode = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsComplete = table.Column<bool>(type: "boolean", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RequestedFor = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecoveryCodes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RecoveryCodes_Users_RequestedFor",
                        column: x => x.RequestedFor,
                        principalSchema: "Capstone",
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecoveryCodes_RequestedFor",
                schema: "Capstone",
                table: "RecoveryCodes",
                column: "RequestedFor");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecoveryCodes",
                schema: "Capstone");
        }
    }
}
