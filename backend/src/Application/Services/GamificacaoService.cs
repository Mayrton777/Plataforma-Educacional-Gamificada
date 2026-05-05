using System;

namespace QuizGamificado.Application.Services
{
    public class GamificacaoService
    {
        /// <summary>
        /// Calcula a pontuação baseada na velocidade da resposta do aluno.
        /// Retorna um valor entre 5 (acertou no último segundo) e 10 (acertou instantaneamente).
        /// </summary>
        public int CalcularPontuacao(int tempoLimiteSegundos, int tempoGastoSegundos)
        {
            // Se o aluno demorou mais que o tempo limite, não ganha pontos
            if (tempoGastoSegundos >= tempoLimiteSegundos) return 0;

            // Se respondeu muito rápido (0 segundos), considera 1 segundo para evitar divisão por zero
            if (tempoGastoSegundos <= 0) tempoGastoSegundos = 1;

            int pontosBase = 5;
            
            double proporcaoTempoRestante = 1.0 - ((double)tempoGastoSegundos / tempoLimiteSegundos);
            int bonusVelocidade = (int)(Math.Round(5 * proporcaoTempoRestante));

            return pontosBase + bonusVelocidade;
        }
    }
}