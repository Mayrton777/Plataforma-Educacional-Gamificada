using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGamificado.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarUsuarioPadrao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TB_USUARIO",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Senha = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TB_USUARIO", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "TB_USUARIO",
                columns: new[] { "Id", "Email", "Nome", "Senha" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "admin@tcc.com", "Professor Avaliador", "admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TB_USUARIO");
        }
    }
}
