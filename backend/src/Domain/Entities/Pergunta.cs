using System;

namespace QuizGamificado.Domain.Entities
{
    public class Pergunta
    {
        public Guid Id { get; private set; }
        public string Enunciado { get; private set; }
        public int TempoLimiteSegundos { get; private set; }
        
        // Chave Estrangeira
        public Guid QuizId { get; private set; }
        public virtual Quiz Quiz { get; private set; } = null!;

        public Pergunta(string enunciado, int tempoLimiteSegundos, Guid quizId)
        {
            Id = Guid.NewGuid();
            Enunciado = enunciado;
            TempoLimiteSegundos = tempoLimiteSegundos;
            QuizId = quizId;
        }
    }
}
