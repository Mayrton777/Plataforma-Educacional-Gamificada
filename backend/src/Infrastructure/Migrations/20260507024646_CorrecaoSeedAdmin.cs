using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGamificado.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CorrecaoSeedAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "TB_USUARIO",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "EmailConfirmado",
                value: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "TB_USUARIO",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "EmailConfirmado",
                value: false);
        }
    }
}
