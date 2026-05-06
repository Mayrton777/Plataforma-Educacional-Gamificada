using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizGamificado.Infrastructure.Data;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public AuthController(QuizDbContext context)
        {
            _context = context;
        }

        // Uma classe rápida para receber os dados do React
        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Senha { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Busca no banco se existe um usuário com esse email E senha
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Senha == dto.Senha);

            if (usuario == null)
            {
                return Unauthorized(new { mensagem = "E-mail ou senha incorretos." });
            }

            // Retorna o sucesso e o nome do professor para usarmos no Front-end
            return Ok(new { 
                mensagem = "Login realizado com sucesso!", 
                nome = usuario.Nome 
            });
        }
    }
}