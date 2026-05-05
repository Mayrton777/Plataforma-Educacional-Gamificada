using System;
using System.Collections.Generic;

namespace QuizGamificado.Domain.Entities
{
    public class Quiz
    {
        public Guid Id { get; private set; }
        public string Titulo { get; private set; }
        public DateTime DataCriacao { get; private set; }
        
        // Propriedade de navegação (Relacionamento 1:N)
        public virtual ICollection<Pergunta> Perguntas { get; private set; }

        public Quiz(string titulo)
        {
            Id = Guid.NewGuid();
            Titulo = titulo;
            DataCriacao = DateTime.UtcNow;
            Perguntas = new List<Pergunta>();
        }
    }
}
