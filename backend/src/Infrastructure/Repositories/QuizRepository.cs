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
        return await _context.Quizzes
            .Include(q => q.Perguntas)
                .ThenInclude(p => p.Alternativas.OrderBy(a => a.Id))
            .AsSplitQuery()
            .FirstOrDefaultAsync(q => q.Id == id);
    }

        public async Task<IEnumerable<Quiz>> GetAllAsync()
        {
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