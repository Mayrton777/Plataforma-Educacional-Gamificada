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
        
        // ESSA LINHA É CRUCIAL: Diz que a pergunta vem com uma lista de alternativas
        public List<CriarAlternativaDto> Alternativas { get; set; } = new();
    }

    public class CriarAlternativaDto
    {
        public string Texto { get; set; } = string.Empty;
        public bool IsCorreta { get; set; }
    }
}