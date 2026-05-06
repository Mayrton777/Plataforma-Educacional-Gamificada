using Microsoft.EntityFrameworkCore;
using QuizGamificado.Domain.Entities;
using QuizGamificado.Domain.IRepositories;
using QuizGamificado.Infrastructure.Data;

namespace QuizGamificado.Infrastructure.Repositories
{
    public class QuizRepository : IQuizRepository
    {
        private readonly QuizDbContext _context;

        public QuizRepository(QuizDbContext context)
        {
            _context = context;
        }

        public async Task<Quiz?> GetByIdAsync(Guid id)
        {
            // A tela do Jogo precisa de tudo: do Quiz, das Perguntas e das Alternativas!
            return await _context.Quizzes
                .Include(q => q.Perguntas)
                    .ThenInclude(p => p.Alternativas) // Inclui os "filhos" das perguntas
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<IEnumerable<Quiz>> GetAllAsync()
        {
            // O Menu precisa saber quantas perguntas existem, então incluímos as Perguntas
            return await _context.Quizzes
                .Include(q => q.Perguntas) 
                .ToListAsync();
        }

        public async Task AddAsync(Quiz quiz)
        {
            await _context.Quizzes.AddAsync(quiz);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Quiz quiz)
        {
            _context.Quizzes.Update(quiz);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var quiz = await GetByIdAsync(id);
            if (quiz != null)
            {
                _context.Quizzes.Remove(quiz);
                await _context.SaveChangesAsync();
            }
        }
    }
}