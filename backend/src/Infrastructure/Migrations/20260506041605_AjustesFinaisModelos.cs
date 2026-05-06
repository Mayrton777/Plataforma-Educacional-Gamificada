using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizGamificado.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AjustesFinaisModelos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alternativa_TB_PERGUNTA_PerguntaId",
                table: "Alternativa");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Alternativa",
                table: "Alternativa");

            migrationBuilder.RenameTable(
                name: "Alternativa",
                newName: "TB_ALTERNATIVA");

            migrationBuilder.RenameIndex(
                name: "IX_Alternativa_PerguntaId",
                table: "TB_ALTERNATIVA",
                newName: "IX_TB_ALTERNATIVA_PerguntaId");

            migrationBuilder.AlterColumn<string>(
                name: "Texto",
                table: "TB_ALTERNATIVA",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TB_ALTERNATIVA",
                table: "TB_ALTERNATIVA",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TB_ALTERNATIVA_TB_PERGUNTA_PerguntaId",
                table: "TB_ALTERNATIVA",
                column: "PerguntaId",
                principalTable: "TB_PERGUNTA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TB_ALTERNATIVA_TB_PERGUNTA_PerguntaId",
                table: "TB_ALTERNATIVA");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TB_ALTERNATIVA",
                table: "TB_ALTERNATIVA");

            migrationBuilder.RenameTable(
                name: "TB_ALTERNATIVA",
                newName: "Alternativa");

            migrationBuilder.RenameIndex(
                name: "IX_TB_ALTERNATIVA_PerguntaId",
                table: "Alternativa",
                newName: "IX_Alternativa_PerguntaId");

            migrationBuilder.AlterColumn<string>(
                name: "Texto",
                table: "Alternativa",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Alternativa",
                table: "Alternativa",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Alternativa_TB_PERGUNTA_PerguntaId",
                table: "Alternativa",
                column: "PerguntaId",
                principalTable: "TB_PERGUNTA",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
