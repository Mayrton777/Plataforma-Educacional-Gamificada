namespace QuizGamificado.Domain.Entities
{
    public class Pergunta
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Enunciado { get; set; } = string.Empty;
        public int TempoLimiteSegundos { get; set; }
        
        // Chave Estrangeira
        public Guid QuizId { get; set; }

        // Propriedade de Navegação
        public Quiz? Quiz { get; set; } 

        public List<Alternativa> Alternativas { get; set; } = new();
    }
}