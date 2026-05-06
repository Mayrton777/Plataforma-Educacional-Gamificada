using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGamificado.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVerificacaoEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CodigoVerificacao",
                table: "TB_USUARIO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmado",
                table: "TB_USUARIO",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ValidadeCodigo",
                table: "TB_USUARIO",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "TB_USUARIO",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CodigoVerificacao", "EmailConfirmado", "Nome", "ValidadeCodigo" },
                values: new object[] { null, false, "Avaliador", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodigoVerificacao",
                table: "TB_USUARIO");

            migrationBuilder.DropColumn(
                name: "EmailConfirmado",
                table: "TB_USUARIO");

            migrationBuilder.DropColumn(
                name: "ValidadeCodigo",
                table: "TB_USUARIO");

            migrationBuilder.UpdateData(
                table: "TB_USUARIO",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "Nome",
                value: "Professor Avaliador");
        }
    }
}
