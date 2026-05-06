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
  
  const [statusResposta, setStatusResposta] = useState(null);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState(null);

  useEffect(() => {
    api.get(`/quiz/${id}`).then(response => {
      setQuiz(response.data);
      if (response.data.perguntas && response.data.perguntas.length > 0) {
        setTempoRestante(response.data.perguntas[0].tempoLimiteSegundos);
      }
    }).catch(err => console.error("Erro ao carregar quiz:", err));
  }, [id]);

  const enviarResposta = async (tempoGasto, acertou) => {
    const perguntaAtual = quiz.perguntas[indicePergunta];

    try {
      let pontosGanhos = 0;
      
      if (acertou) {
        const response = await api.post(`/quiz/calcular-pontos?tempoLimite=${perguntaAtual.tempoLimiteSegundos}&tempoGasto=${tempoGasto}`);
        pontosGanhos = response.data.pontosGanhos;
      }
      
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

  const handleResponder = (alternativa, index) => {
    if (statusResposta) return;

    const acertou = alternativa.isCorreta;
    const tempoGasto = quiz.perguntas[indicePergunta].tempoLimiteSegundos - tempoRestante;

    setStatusResposta(acertou ? 'correta' : 'errada');
    setAlternativaSelecionada(index);

    setTimeout(() => {
      enviarResposta(tempoGasto, acertou);
      setStatusResposta(null);
      setAlternativaSelecionada(null);
    }, 1500);
  };

  // 4. Lógica do Cronômetro - CORRIGIDA
  useEffect(() => {
    if (jogoFinalizado || !quiz || statusResposta) return;

    if (tempoRestante <= 0) {
      // O setTimeout aqui impede o "cascading renders" do React
      const esgotadoTimer = setTimeout(() => {
        setStatusResposta('errada'); 
        
        setTimeout(() => {
          enviarResposta(quiz.perguntas[indicePergunta].tempoLimiteSegundos, false);
          setStatusResposta(null);
        }, 1500);
      }, 0);
      
      return () => clearTimeout(esgotadoTimer);
    }

    const timer = setInterval(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempoRestante, jogoFinalizado, quiz, statusResposta, indicePergunta]);

  if (!quiz) return <div style={{ padding: '2rem' }}>Carregando jogo...</div>;

  // Proteção contra Quizzes antigos sem perguntas
  if (!quiz.perguntas || quiz.perguntas.length === 0) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui', textAlign: 'center' }}>
        <h2>⚠️ Oops! Este quiz está vazio ou é de uma versão antiga.</h2>
        <button 
          onClick={() => navigate('/')}
          style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Voltar ao Menu
        </button>
      </div>
    );
  }

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
  const letras = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Pergunta {indicePergunta + 1} de {quiz.perguntas.length}</h3>
        <h2 style={{ color: tempoRestante <= 5 ? 'red' : 'black' }}>
          ⏱️ {tempoRestante}s
        </h2>
      </div>

      <div style={{ border: '2px solid #ccc', padding: '2rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'center' }}>
        <h2>{perguntaAtual.enunciado}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {perguntaAtual.alternativas?.map((alt, index) => {
            let bgColor = '#f8f9fa';
            let fontColor = '#333';
            let borderColor = '#ccc';

            if (statusResposta) {
              if (alt.isCorreta) {
                bgColor = '#28a745'; 
                fontColor = 'white';
                borderColor = '#28a745';
              } else if (alternativaSelecionada === index && !alt.isCorreta) {
                bgColor = '#dc3545'; 
                fontColor = 'white';
                borderColor = '#dc3545';
              }
            }

            return (
              <button 
                key={index}
                onClick={() => handleResponder(alt, index)}
                disabled={!!statusResposta}
                style={{ 
                  padding: '1rem', 
                  fontSize: '1.1rem', 
                  textAlign: 'left',
                  background: bgColor, 
                  color: fontColor, 
                  border: `2px solid ${borderColor}`, 
                  borderRadius: '8px', 
                  cursor: statusResposta ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <strong style={{ marginRight: '10px' }}>{letras[index]})</strong> {alt.texto}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <p>Pontuação atual: <strong>{pontuacaoTotal}</strong></p>
      </div>
    </div>
  );
}

export default Jogo;