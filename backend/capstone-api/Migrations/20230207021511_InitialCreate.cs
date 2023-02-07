using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace capstoneapi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Capstone");

            migrationBuilder.CreateTable(
                name: "FundraiserTypes",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FundraiserTypes", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    LastName = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    EmailAddress = table.Column<string>(type: "character varying(48)", maxLength: 48, nullable: false),
                    Password = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Fundraisers",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    TypeID = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    Views = table.Column<long>(type: "bigint", nullable: false),
                    Target = table.Column<double>(type: "double precision", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedByUserID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fundraisers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Fundraisers_FundraiserTypes_TypeID",
                        column: x => x.TypeID,
                        principalSchema: "Capstone",
                        principalTable: "FundraiserTypes",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Fundraisers_Users_CreatedByUserID",
                        column: x => x.CreatedByUserID,
                        principalSchema: "Capstone",
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GlobalAdmins",
                schema: "Capstone",
                columns: table => new
                {
                    UserID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GlobalAdmins", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_GlobalAdmins_Users_UserID",
                        column: x => x.UserID,
                        principalSchema: "Capstone",
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    UserID = table.Column<Guid>(type: "uuid", nullable: false),
                    FundraiserID = table.Column<Guid>(type: "uuid", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "Donations",
                schema: "Capstone",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uuid", nullable: false),
                    UserID = table.Column<Guid>(type: "uuid", nullable: false),
                    FundraiserID = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<double>(type: "double precision", nullable: false),
                    Message = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donations", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Donations_Fundraisers_FundraiserID",
                        column: x => x.FundraiserID,
                        principalSchema: "Capstone",
                        principalTable: "Fundraisers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Donations_Users_UserID",
                        column: x => x.UserID,
                        principalSchema: "Capstone",
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FundraiserAdmins",
                schema: "Capstone",
                columns: table => new
                {
                    UserID = table.Column<Guid>(type: "uuid", nullable: false),
                    FundraiserID = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FundraiserAdmins", x => new { x.UserID, x.FundraiserID });
                    table.ForeignKey(
                        name: "FK_FundraiserAdmins_Fundraisers_FundraiserID",
                        column: x => x.FundraiserID,
                        principalSchema: "Capstone",
                        principalTable: "Fundraisers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FundraiserAdmins_Users_UserID",
                        column: x => x.UserID,
                        principalSchema: "Capstone",
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "Capstone",
                table: "FundraiserTypes",
                columns: new[] { "ID", "Type" },
                values: new object[,]
                {
                    { new Guid("205da614-45da-4d86-8046-ab64eb9ffa1f"), 3 },
                    { new Guid("612d03cf-5b04-4ee4-8699-b3d88595c08c"), 4 },
                    { new Guid("64c75b27-e6c1-4214-822e-0ba901e59b03"), 0 },
                    { new Guid("64d3f6df-5597-4856-9627-e72aadd323e9"), 8 },
                    { new Guid("71f1a1c7-3954-498f-ac25-f710d72b9f6c"), 5 },
                    { new Guid("8a688175-7482-4d01-b5be-f701b6a34b20"), 1 },
                    { new Guid("90a7b31a-f52a-425e-910f-bee4dd2eb634"), 2 },
                    { new Guid("a07bf21e-17d5-48c6-abf9-3154d8e4387a"), 6 },
                    { new Guid("ee5eb6bd-135c-4a02-b0ac-b9a1097ffd0a"), 7 }
                });

            migrationBuilder.InsertData(
                schema: "Capstone",
                table: "Users",
                columns: new[] { "ID", "EmailAddress", "FirstName", "LastName", "Password" },
                values: new object[] { new Guid("93d9ad71-19eb-4a08-94aa-50f2123c1f52"), "anonymous@user.org", "Anonymous", "User", "SuperSecretPassw0rd!" });

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

            migrationBuilder.CreateIndex(
                name: "IX_Donations_FundraiserID",
                schema: "Capstone",
                table: "Donations",
                column: "FundraiserID");

            migrationBuilder.CreateIndex(
                name: "IX_Donations_UserID",
                schema: "Capstone",
                table: "Donations",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_FundraiserAdmins_FundraiserID",
                schema: "Capstone",
                table: "FundraiserAdmins",
                column: "FundraiserID");

            migrationBuilder.CreateIndex(
                name: "IX_Fundraisers_CreatedByUserID",
                schema: "Capstone",
                table: "Fundraisers",
                column: "CreatedByUserID");

            migrationBuilder.CreateIndex(
                name: "IX_Fundraisers_TypeID",
                schema: "Capstone",
                table: "Fundraisers",
                column: "TypeID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments",
                schema: "Capstone");

            migrationBuilder.DropTable(
                name: "Donations",
                schema: "Capstone");

            migrationBuilder.DropTable(
                name: "FundraiserAdmins",
                schema: "Capstone");

            migrationBuilder.DropTable(
                name: "GlobalAdmins",
                schema: "Capstone");

            migrationBuilder.DropTable(
                name: "Fundraisers",
                schema: "Capstone");

            migrationBuilder.DropTable(
                name: "FundraiserTypes",
                schema: "Capstone");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Capstone");
        }
    }
}
