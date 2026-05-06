using Microsoft.EntityFrameworkCore;
using QuizGamificado.Domain.Entities;

namespace QuizGamificado.Infrastructure.Data
{
    public class QuizDbContext : DbContext
    {
        public QuizDbContext(DbContextOptions<QuizDbContext> options) : base(options) { }

        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Pergunta> Perguntas { get; set; }
        public DbSet<Alternativa> Alternativas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapeamento da Tabela Quiz
            modelBuilder.Entity<Quiz>(entity =>
            {
                entity.ToTable("TB_QUIZ");
                entity.HasKey(q => q.Id);
                entity.Property(q => q.Titulo).IsRequired().HasMaxLength(100);
            });

            // Mapeamento da Tabela Pergunta e Relacionamento
            modelBuilder.Entity<Pergunta>(entity =>
            {
                entity.ToTable("TB_PERGUNTA");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Enunciado).IsRequired().HasMaxLength(500);
                
                // Configuração do relacionamento 1:N com Exclusão em Cascata
                entity.HasOne(p => p.Quiz)
                      .WithMany(q => q.Perguntas)
                      .HasForeignKey(p => p.QuizId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Mapeamento da Tabela Alternativa e Relacionamento
            modelBuilder.Entity<Alternativa>(entity =>
            {
                entity.ToTable("TB_ALTERNATIVA");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Texto).IsRequired().HasMaxLength(300);
                entity.Property(a => a.IsCorreta).IsRequired();

                // Configuração do relacionamento 1:N com Exclusão em Cascata
                entity.HasOne(a => a.Pergunta)
                      .WithMany(p => p.Alternativas)
                      .HasForeignKey(a => a.PerguntaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
