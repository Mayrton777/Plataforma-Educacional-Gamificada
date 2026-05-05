using Microsoft.EntityFrameworkCore;
using QuizGamificado.Domain.Entities;

namespace QuizGamificado.Infrastructure.Data
{
    public class QuizDbContext : DbContext
    {
        public QuizDbContext(DbContextOptions<QuizDbContext> options) : base(options) { }

        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Pergunta> Perguntas { get; set; }

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
        }
    }
}
