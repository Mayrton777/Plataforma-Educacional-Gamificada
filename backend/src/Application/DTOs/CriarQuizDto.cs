using System.Collections.Generic;

namespace QuizGamificado.Application.DTOs
{
    public class CriarQuizDto
    {
        public string Titulo { get; set; } = string.Empty;
        public List<CriarPerguntaDto> Perguntas { get; set; } = new();
    }

    public class CriarPerguntaDto
    {
        public string Enunciado { get; set; } = string.Empty;
        public int TempoLimiteSegundos { get; set; }
    }
}