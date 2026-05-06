namespace QuizGamificado.Domain.Entities
{
    public class Alternativa
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        // texto da alternativa
        public string Texto { get; set; } = string.Empty;
        
        // Indica se esta é a resposta certa da pergunta
        public bool IsCorreta { get; set; }

        // Chave Estrangeira para vincular à Pergunta
        public Guid PerguntaId { get; set; }

        public Pergunta? Pergunta { get; set; }
    }
}