using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QuizGamificado.Application.DTOs;
using QuizGamificado.Application.Services;
using QuizGamificado.Domain.Entities;
using QuizGamificado.Domain.IRepositories;

namespace QuizGamificado.API.Controllers
{
    // A rota será: http://localhost:PORTA/api/quiz
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizRepository _quizRepository;
        private readonly GamificacaoService _gamificacaoService;

        // Injeção de Dependência das camadas de Domínio e Aplicação
        public QuizController(IQuizRepository quizRepository, GamificacaoService gamificacaoService)
        {
            _quizRepository = quizRepository;
            _gamificacaoService = gamificacaoService;
        }

        /// <summary>
        /// Rota para o Educador criar um novo Quiz com suas perguntas.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CriarQuiz([FromBody] CriarQuizDto dto)
        {
            // Instancia da entidade base Quiz
            var quiz = new Quiz(dto.Titulo);

            foreach (var perguntaDto in dto.Perguntas)
            {
                // Usamos o construtor blindado que criamos na entidade Pergunta
                var novaPergunta = new Pergunta(perguntaDto.Enunciado, perguntaDto.TempoLimiteSegundos, quiz.Id);
                quiz.Perguntas.Add(novaPergunta);
            }

            await _quizRepository.AddAsync(quiz);

            return CreatedAtAction(nameof(ObterQuiz), new { id = quiz.Id }, quiz);
        }

        /// <summary>
        /// Rota para o Front-end (React) carregar a tela do jogo.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> ObterQuiz(Guid id)
        {
            var quiz = await _quizRepository.GetByIdAsync(id);
            
            if (quiz == null) 
                return NotFound(new { Mensagem = "Quiz não encontrado." });

            return Ok(quiz);
        }

        /// <summary>
        /// Rota para buscar todos os Quizzes cadastrados.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> ObterTodos()
        {
            var quizzes = await _quizRepository.GetAllAsync();
            
            // Retorna um 200 OK com a lista de todos os jogos
            return Ok(quizzes);
        }

        /// <summary>
        /// Rota para simular o recebimento da resposta e cálculo da gamificação.
        /// </summary>
        [HttpPost("calcular-pontos")]
        public IActionResult CalcularPontos([FromQuery] int tempoLimite, [FromQuery] int tempoGasto)
        {
            var pontos = _gamificacaoService.CalcularPontuacao(tempoLimite, tempoGasto);
            
            return Ok(new 
            { 
                Mensagem = "Pontuação calculada com sucesso!",
                PontosGanhos = pontos 
            });
        }
    }
}