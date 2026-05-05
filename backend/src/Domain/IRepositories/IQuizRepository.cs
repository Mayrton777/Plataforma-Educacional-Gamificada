using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using QuizGamificado.Domain.Entities;

namespace QuizGamificado.Domain.IRepositories
{
    public interface IQuizRepository
    {
        Task<Quiz> GetByIdAsync(Guid id);
        Task<IEnumerable<Quiz>> GetAllAsync();
        Task AddAsync(Quiz quiz);
        Task UpdateAsync(Quiz quiz);
        Task DeleteAsync(Guid id);
    }
}