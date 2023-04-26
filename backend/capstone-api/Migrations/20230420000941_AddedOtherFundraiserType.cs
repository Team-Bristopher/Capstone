using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace capstoneapi.Migrations
{
    /// <inheritdoc />
    public partial class AddedOtherFundraiserType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                schema: "Capstone",
                table: "FundraiserTypes",
                columns: new[] { "ID", "Type" },
                values: new object[] { new Guid("a577a3a2-2048-4010-9f21-23410e5e0065"), 9 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "Capstone",
                table: "FundraiserTypes",
                keyColumn: "ID",
                keyValue: new Guid("a577a3a2-2048-4010-9f21-23410e5e0065"));
        }
    }
}
