using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizGamificado.Infrastructure.Data;
using QuizGamificado.Domain.Entities;
using System.Net;
using System.Net.Mail;

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

        public class LoginDto 
        { 
            public string Email { get; set; } = string.Empty; 
            public string Senha { get; set; } = string.Empty; 
        }
        
        public class CadastroDto 
        { 
            public string Nome { get; set; } = string.Empty; 
            public string Email { get; set; } = string.Empty; 
            public string Senha { get; set; } = string.Empty; 
        }
        
        public class ConfirmarDto 
        { 
            public string Email { get; set; } = string.Empty; 
            public string Codigo { get; set; } = string.Empty; 
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Senha == dto.Senha);

            if (usuario == null)
            {
                return Unauthorized(new { mensagem = "E-mail ou senha incorretos." });
            }

            if (!usuario.EmailConfirmado)
            {
                return Unauthorized(new { mensagem = "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada." });
            }

            return Ok(new { 
                mensagem = "Login realizado com sucesso!", 
                nome = usuario.Nome 
            });
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] CadastroDto dto)
        {
            var usuarioExistente = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (usuarioExistente != null && usuarioExistente.EmailConfirmado)
            {
                return BadRequest(new { mensagem = "Este e-mail já está em uso e confirmado." });
            }

            // Gera código alfanumérico de 6 dígitos
            string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            string codigo = new string(Enumerable.Repeat(chars, 6).Select(s => s[new Random().Next(s.Length)]).ToArray());

            if (usuarioExistente != null && !usuarioExistente.EmailConfirmado)
            {
                // Atualiza os dados e gera um novo código para o registro pendente
                usuarioExistente.Nome = dto.Nome;
                usuarioExistente.Senha = dto.Senha;
                usuarioExistente.CodigoVerificacao = codigo;
                usuarioExistente.ValidadeCodigo = DateTime.Now.AddMinutes(15);
                _context.Usuarios.Update(usuarioExistente);
            }
            else
            {
                // Cria um novo registro se o e-mail for inédito
                var novoUsuario = new Usuario
                {
                    Id = Guid.NewGuid(),
                    Nome = dto.Nome,
                    Email = dto.Email,
                    Senha = dto.Senha,
                    CodigoVerificacao = codigo,
                    ValidadeCodigo = DateTime.Now.AddMinutes(15),
                    EmailConfirmado = false
                };
                await _context.Usuarios.AddAsync(novoUsuario);
            }

            await _context.SaveChangesAsync();
            EnviarEmail(dto.Email, codigo);

            return Ok(new { mensagem = "Código de verificação enviado para o seu e-mail." });
        }

        [HttpPost("confirmar")]
        public async Task<IActionResult> Confirmar([FromBody] ConfirmarDto dto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (usuario == null) return BadRequest(new { mensagem = "Usuário não encontrado." });
            if (usuario.EmailConfirmado) return BadRequest(new { mensagem = "E-mail já está confirmado." });
            if (usuario.CodigoVerificacao != dto.Codigo.ToUpper()) return BadRequest(new { mensagem = "Código inválido." });
            if (usuario.ValidadeCodigo < DateTime.Now) return BadRequest(new { mensagem = "Código expirado." });

            usuario.EmailConfirmado = true;
            usuario.CodigoVerificacao = null; 
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Conta confirmada com sucesso!" });
        }

        private void EnviarEmail(string emailDestino, string codigo)
        {
            try
            {
                var remetente = Environment.GetEnvironmentVariable("GMAIL_USER");
                var senhaApp = Environment.GetEnvironmentVariable("GMAIL_APP_PASSWORD");

                if (string.IsNullOrEmpty(remetente) || string.IsNullOrEmpty(senhaApp))
                {
                    Console.WriteLine("Erro: Credenciais de e-mail não encontradas no arquivo .env");
                    return;
                }

                var smtp = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(remetente, senhaApp),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(remetente),
                    Subject = "Código de Confirmação - Quiz Gamificado",
                    Body = $"Olá! Seu código de verificação é: <b>{codigo}</b>. Ele expira em 15 minutos.",
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(emailDestino);
                smtp.Send(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao enviar email: " + ex.Message);
            }
        }
    }
}