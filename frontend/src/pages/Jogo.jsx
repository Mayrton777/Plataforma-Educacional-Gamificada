import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, Crown, Users } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import Temporizador from '../components/Temporizador';

export default function Jogo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { codigoSala, avatar } = location.state || {};
  const userName = localStorage.getItem("userName") || "Jogador";

  const [quiz, setQuiz] = useState(null);
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [tempoTotalGasto, setTempoTotalGasto] = useState(0);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [statusResposta, setStatusResposta] = useState(null);
  const [alternativaSelecionada, setAlternativaSelecionada] = useState(null);
  const [conexao, setConexao] = useState(null);
  const [rankingReal, setRankingReal] = useState([]);

  // useRef guarda o tempo sem re-renderizar a página Jogo
  const tempoRestanteRef = useRef(0);

  useEffect(() => {
    if (!codigoSala) return;

    const novaConexao = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5092/quizhub")
      .withAutomaticReconnect()
      .build();

    novaConexao.on("PartidaFinalizadaForcada", () => setJogoFinalizado(true));
    novaConexao.on("SalaEncerrada", () => {
      alert("O organizador encerrou a partida.");
      navigate('/');
    });
    novaConexao.on("RankingAtualizado", (rankingData) => setRankingReal(rankingData));

    novaConexao.start()
      .then(() => novaConexao.invoke("ReingressarNoJogo", codigoSala))
      .catch(err => console.error("Erro no SignalR:", err));

    setConexao(novaConexao);
    return () => novaConexao.stop();
  }, [codigoSala, navigate]);

  useEffect(() => {
    api.get(`/quiz/${id}`).then(response => {
      const quizData = response.data;
      if (quizData.perguntas && quizData.perguntas.length > 0) {
        quizData.perguntas.forEach(p => {
          if (p.alternativas) p.alternativas.sort(() => Math.random() - 0.5);
        });
        setQuiz(quizData);
        // Inicializa a ref com o tempo da primeira pergunta
        tempoRestanteRef.current = quizData.perguntas[0].tempoLimiteSegundos;
      }
    }).catch(err => console.error("Erro ao carregar quiz:", err));
  }, [id]);

  const enviarResposta = async (tempoGasto, acertou) => {
    const perguntaAtual = quiz.perguntas[indicePergunta];
    const isUltimaPergunta = indicePergunta + 1 >= quiz.perguntas.length;

    try {
      let pontosGanhos = 0;
      if (acertou) {
        const response = await api.post(`/quiz/calcular-pontos?tempoLimite=${perguntaAtual.tempoLimiteSegundos}&tempoGasto=${tempoGasto}`);
        pontosGanhos = response.data.pontosGanhos;
      }
      
      const novaPontuacao = pontuacaoTotal + pontosGanhos;
      const novoTempoTotal = tempoTotalGasto + tempoGasto;
      
      setPontuacaoTotal(novaPontuacao);
      setTempoTotalGasto(novoTempoTotal);

      if (conexao && conexao.state === signalR.HubConnectionState.Connected) {
        await conexao.invoke("AtualizarPontuacao", codigoSala, userName, avatar || "cat", novaPontuacao, novoTempoTotal, isUltimaPergunta);
      }

      if (!isUltimaPergunta) {
        setIndicePergunta(prev => prev + 1);
        // Atualiza a ref para o tempo da próxima pergunta
        tempoRestanteRef.current = quiz.perguntas[indicePergunta + 1].tempoLimiteSegundos;
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
    const tempoGasto = quiz.perguntas[indicePergunta].tempoLimiteSegundos - tempoRestanteRef.current;

    setStatusResposta(acertou ? 'correta' : 'errada');
    setAlternativaSelecionada(index);

    setTimeout(() => {
      enviarResposta(tempoGasto, acertou);
      setStatusResposta(null);
      setAlternativaSelecionada(null);
    }, 1500);
  };

  const handleTempoEsgotado = () => {
    if (statusResposta) return;
    setStatusResposta('errada'); 
    setTimeout(() => {
      enviarResposta(quiz.perguntas[indicePergunta].tempoLimiteSegundos, false);
      setStatusResposta(null);
    }, 1500);
  };

  if (!quiz) return <div className="p-10 text-center text-white text-2xl font-bold animate-pulse">Carregando jogo...</div>;

  if (jogoFinalizado) {
    const getAvatarBg = (avatarName) => ({ cat: 'bg-orange-500', dog: 'bg-amber-600', rabbit: 'bg-pink-500', bird: 'bg-blue-500', fish: 'bg-cyan-500', bug: 'bg-emerald-500' }[avatarName] || 'bg-slate-500');

    return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-6 p-4 max-w-7xl mx-auto w-full">
        {/* Bloco de Jogo Finalizado - Mantido exatamente como o seu original */}
        <div className="flex-1 flex flex-col bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl border border-border overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-500 to-pink-500"></div>
          
          <div className="p-6 flex justify-between items-center border-b border-border bg-background/50">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wider">
                Sala: <span className="text-primary">{codigoSala}</span>
              </h2>
              <p className="text-emerald-500 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4"/> Você concluiu o quiz!
              </p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold">Sua Pontuação</p>
                <p className="text-2xl font-black text-primary">{pontuacaoTotal} pts</p>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-center p-8 pb-12 gap-4 relative">
             <Trophy className="absolute top-1/4 opacity-5 w-64 h-64 text-foreground pointer-events-none" />
             
             <AnimatePresence>
                {rankingReal.length > 0 && (
                    <div className="flex items-end gap-4 md:gap-8 z-10">
                        {rankingReal[1] && (
                          <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring' }} className="flex flex-col items-center">
                            <div className={`w-16 h-16 rounded-full border-4 border-slate-300 shadow-xl ${getAvatarBg(rankingReal[1].avatar)}`}></div>
                            <span className="font-bold mt-2 text-foreground">{rankingReal[1].nome}</span>
                            <div className="w-24 md:w-32 h-32 bg-slate-400 dark:bg-slate-700 rounded-t-xl flex justify-center pt-2 text-4xl font-black text-white/30">2</div>
                          </motion.div>
                        )}
                        {rankingReal[0] && (
                          <motion.div initial={{ y: 300, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="flex flex-col items-center">
                            <Crown className="text-amber-400 animate-bounce w-10 h-10 -mb-2" />
                            <div className={`w-20 h-20 rounded-full border-4 border-amber-400 shadow-2xl ${getAvatarBg(rankingReal[0].avatar)}`}></div>
                            <span className="font-black text-lg mt-2 text-foreground">{rankingReal[0].nome}</span>
                            <div className="w-28 md:w-40 h-48 bg-amber-500 rounded-t-xl flex justify-center pt-2 text-6xl font-black text-white/30">1</div>
                          </motion.div>
                        )}
                        {rankingReal[2] && (
                          <motion.div initial={{ y: 150, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: 'spring' }} className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-full border-4 border-orange-700 shadow-xl ${getAvatarBg(rankingReal[2].avatar)}`}></div>
                            <span className="font-bold mt-2 text-foreground">{rankingReal[2].nome}</span>
                            <div className="w-24 h-24 bg-orange-800 rounded-t-xl flex justify-center pt-2 text-3xl font-black text-white/30">3</div>
                          </motion.div>
                        )}
                    </div>
                )}
             </AnimatePresence>
          </div>
        </div>

        <div className="w-full md:w-80 bg-card/90 backdrop-blur-md rounded-3xl border border-border flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border bg-background/50 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-black uppercase tracking-tighter">Ranking Global</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {rankingReal.map((j, i) => (
                    <motion.div 
                        key={i} layout
                        className={`flex items-center justify-between p-3 rounded-xl border ${j.nome === userName ? 'bg-primary/10 border-primary/50' : 'bg-background border-border'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-black text-muted-foreground text-xs">{i+1}º</span>
                            <div className={`w-8 h-8 rounded-full ${getAvatarBg(j.avatar)}`}></div>
                            <span className={`text-sm font-bold ${j.nome === userName ? 'text-primary' : 'text-foreground'}`}>
                                {j.nome} {j.nome === userName && '(Você)'}
                            </span>
                        </div>
                        <span className="font-black text-foreground">{j.pontuacao}</span>
                    </motion.div>
                ))}
            </div>
            <div className="p-4 bg-muted/50 text-center text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Aguardando organizador encerrar sala
            </div>
        </div>
      </div>
    );
  }

  const perguntaAtual = quiz.perguntas[indicePergunta];
  const letras = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-12 px-4">
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-primary font-bold uppercase tracking-wider text-sm">Pergunta {indicePergunta + 1} de {quiz.perguntas.length}</p>
          <p className="text-white font-bold">Pontos: {pontuacaoTotal}</p>
        </div>
        
        <Temporizador 
          tempoLimite={perguntaAtual.tempoLimiteSegundos} 
          ativo={!jogoFinalizado && !!quiz && !statusResposta}
          onTempoEsgotado={handleTempoEsgotado}
          onTick={(tempo) => tempoRestanteRef.current = tempo}
        />

      </div>

      <motion.div key={indicePergunta} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-card text-card-foreground rounded-3xl shadow-xl p-8 border border-border">
        <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">{perguntaAtual.enunciado}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perguntaAtual.alternativas?.map((alt, index) => {
            let stateClass = "bg-background border-border hover:border-primary hover:bg-muted text-foreground";
            let Icon = null;

            if (statusResposta) {
              if (alt.isCorreta) {
                stateClass = "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/30";
                Icon = CheckCircle2;
              } else if (alternativaSelecionada === index) {
                stateClass = "bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/30";
                Icon = XCircle;
              } else {
                stateClass = "bg-background/50 border-border/50 text-muted-foreground opacity-50";
              }
            }

            return (
              <button 
                key={index}
                onClick={() => handleResponder(alt, index)}
                disabled={!!statusResposta}
                className={`relative flex items-center p-6 text-lg font-bold border-2 rounded-2xl transition-all duration-300 text-left disabled:cursor-not-allowed active:scale-95 ${stateClass}`}
              >
                <span className="w-10 h-10 flex items-center justify-center bg-black/10 rounded-full mr-4 text-xl">
                  {letras[index]}
                </span>
                <span className="flex-1">{alt.texto}</span>
                {Icon && <Icon className="w-8 h-8 absolute right-6 opacity-80" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}