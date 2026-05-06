using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGamificado.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarAlternativasFluentApi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Alternativa",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Texto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCorreta = table.Column<bool>(type: "bit", nullable: false),
                    PerguntaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alternativa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alternativa_TB_PERGUNTA_PerguntaId",
                        column: x => x.PerguntaId,
                        principalTable: "TB_PERGUNTA",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alternativa_PerguntaId",
                table: "Alternativa",
                column: "PerguntaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Alternativa");
        }
    }
}
