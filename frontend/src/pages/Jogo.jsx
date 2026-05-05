import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Jogo() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  // 1. Carrega os dados do Quiz quando a tela abre
  useEffect(() => {
    api.get(`/quiz/${id}`).then(response => {
      setQuiz(response.data);
      if (response.data.perguntas.length > 0) {
        setTempoRestante(response.data.perguntas[0].tempoLimiteSegundos);
      }
    }).catch(err => console.error("Erro ao carregar quiz:", err));
  }, [id]);

  // 2. Função que chama sua API de Gamificação (Movida para cima!)
  const enviarResposta = async (tempoGasto) => {
    const perguntaAtual = quiz.perguntas[indicePergunta];

    try {
      const response = await api.post(`/quiz/calcular-pontos?tempoLimite=${perguntaAtual.tempoLimiteSegundos}&tempoGasto=${tempoGasto}`);
      const pontosGanhos = response.data.pontosGanhos;
      
      setPontuacaoTotal(prev => prev + pontosGanhos);

      if (indicePergunta + 1 < quiz.perguntas.length) {
        setIndicePergunta(prev => prev + 1);
        setTempoRestante(quiz.perguntas[indicePergunta + 1].tempoLimiteSegundos);
      } else {
        setJogoFinalizado(true);
      }
    } catch (error) {
      console.error("Erro ao calcular pontos:", error);
    }
  };

  // 3. Lógica do Cronômetro (Agora ele conhece a função enviarResposta)
  useEffect(() => {
    if (jogoFinalizado || !quiz) return;

    if (tempoRestante <= 0) {
      enviarResposta(quiz.perguntas[indicePergunta].tempoLimiteSegundos);
      return;
    }

    const timer = setInterval(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempoRestante, jogoFinalizado, quiz]);

  if (!quiz) return <div style={{ padding: '2rem' }}>Carregando jogo...</div>;

  if (jogoFinalizado) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h1>🏆 Fim de Jogo!</h1>
        <h2>Pontuação Final: {pontuacaoTotal} pontos</h2>
        <button 
          onClick={() => navigate('/')}
          style={{ padding: '1rem 2rem', fontSize: '1.2rem', marginTop: '2rem', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Voltar ao Menu
        </button>
      </div>
    );
  }

  const perguntaAtual = quiz.perguntas[indicePergunta];

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Pergunta {indicePergunta + 1} de {quiz.perguntas.length}</h3>
        <h2 style={{ color: tempoRestante <= 5 ? 'red' : 'black' }}>
          ⏱️ {tempoRestante}s
        </h2>
      </div>

      <div style={{ border: '2px solid #ccc', padding: '2rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'center' }}>
        <h1>{perguntaAtual.enunciado}</h1>
        
        <button 
          onClick={() => {
            const tempoGasto = perguntaAtual.tempoLimiteSegundos - tempoRestante;
            enviarResposta(tempoGasto);
          }}
          style={{ padding: '1rem 2rem', fontSize: '1.2rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '2rem' }}
        >
          Simular Resposta Correta
        </button>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <p>Pontuação atual: <strong>{pontuacaoTotal}</strong></p>
      </div>
    </div>
  );
}

export default Jogo;