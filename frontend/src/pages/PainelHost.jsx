import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Timer, Crown, Users, XCircle, AlertTriangle } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import { api } from '../services/api';

export default function PainelHost() {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const [statusJogo, setStatusJogo] = useState('em_andamento');
  const [jogadores, setJogadores] = useState([]);
  const [conexao, setConexao] = useState(null);
  const [tempoRestanteSala, setTempoRestanteSala] = useState(0);
  const [mostrarModalEncerrar, setMostrarModalEncerrar] = useState(false);

  useEffect(() => {
    // 1. Calcula o tempo total do Quiz
    const quizId = localStorage.getItem(`quiz_${codigo}`);
    api.get(`/quiz/${quizId}`).then(res => {
      const total = res.data.perguntas.reduce((acc, p) => acc + p.tempoLimiteSegundos, 0);
      setTempoRestanteSala(total);
    });

    const novaConexao = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5092/quizhub")
      .withAutomaticReconnect()
      .build();

    novaConexao.on("RankingAtualizado", (rankingData) => {
      setJogadores(rankingData);
    });

    novaConexao.start()
      .then(() => novaConexao.invoke("ReingressarNoJogo", codigo))
      .catch(err => console.error(err));

    setConexao(novaConexao);
    return () => novaConexao.stop();
  }, [codigo]);

  useEffect(() => {
    if (tempoRestanteSala <= 0 && statusJogo === 'em_andamento') {
      finalizarTudo();
      return;
    }

    const timer = setInterval(() => {
      const novoTempo = tempoRestanteSala - 1;
      setTempoRestanteSala(novoTempo);
      
      // Envia o tempo para todos os alunos na sala
      if (conexao && conexao.state === signalR.HubConnectionState.Connected) {
        conexao.invoke("SincronizarTempo", codigo, novoTempo);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestanteSala, statusJogo, conexao]);

  const finalizarTudo = async () => {
    setStatusJogo('finalizado');
    if (conexao) {
      await conexao.invoke("FinalizarPartidaGeral", codigo);
    }
  };

  // Função que encerra a sala
  const confirmarEncerramento = async () => {
    if (conexao) await conexao.invoke("EncerrarSala", codigo);
    navigate('/');
  };

  const podio = { primeiro: jogadores[0], segundo: jogadores[1], terceiro: jogadores[2] };
  const getAvatarBg = (avatar) => ({ cat: 'bg-orange-500', dog: 'bg-amber-600', rabbit: 'bg-pink-500', bird: 'bg-blue-500', fish: 'bg-cyan-500', bug: 'bg-emerald-500' }[avatar] || 'bg-slate-500');

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-6 p-4 max-w-7xl mx-auto w-full">
      <div className="flex-1 flex flex-col bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl border border-border overflow-hidden relative">
        <div className="p-6 flex justify-between items-center border-b border-border bg-background/50">
          <div>
            <h2 className="text-2xl font-black uppercase">Sala: <span className="text-primary">{codigo}</span></h2>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Timer className={`w-6 h-6 ${tempoRestanteSala < 10 ? 'text-red-500 animate-bounce' : 'text-primary'}`} />
                {tempoRestanteSala > 0 ? `${tempoRestanteSala}s restantes` : "Tempo Esgotado!"}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMostrarModalEncerrar(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive font-bold rounded-xl hover:bg-destructive hover:text-white transition-all"
          >
            <XCircle /> Encerrar
          </button>
        </div>

        {/* Pódio */}
        <div className="flex-1 flex items-end justify-center p-8 pb-12 gap-4 relative">
            <AnimatePresence>
                {statusJogo === 'finalizado' ? (
                    <PodioVisual jogadores={jogadores} getAvatarBg={getAvatarBg} />
                ) : (
                    <div className="text-center animate-pulse">
                        <Trophy className="w-20 h-20 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-muted-foreground">Partida em andamento...</h3>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Ranking lateral */}
      <RankingLateral jogadores={jogadores} getAvatarBg={getAvatarBg} />

      <AnimatePresence>
        {mostrarModalEncerrar && (
          <motion.div
            key="modal-confirmacao"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card text-card-foreground rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full border border-border text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-destructive/10 p-4 rounded-full">
                  <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Encerrar Sala?</h3>
              <p className="text-muted-foreground mb-8">
                Tem certeza que deseja encerrar esta sala? Todos os jogadores conectados serão expulsos imediatamente.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarModalEncerrar(false)}
                  className="flex-1 h-12 font-bold bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmarEncerramento}
                  className="flex-1 h-12 font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl transition-colors"
                >
                  Sim, Encerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componentes menores
function PodioVisual({ jogadores, getAvatarBg }) {
    const p1 = jogadores[0], p2 = jogadores[1], p3 = jogadores[2];
    return (
        <div className="flex items-end gap-4">
            {p2 && <div className="flex flex-col items-center"><div className={`w-16 h-16 rounded-full border-4 border-slate-300 ${getAvatarBg(p2.avatar)}`}></div><span className="font-bold">{p2.nome}</span><div className="w-24 h-32 bg-slate-400 rounded-t-xl flex justify-center pt-2 text-3xl font-black text-white/40">2</div></div>}
            {p1 && <div className="flex flex-col items-center"><Crown className="text-amber-400 animate-bounce" /><div className={`w-20 h-20 rounded-full border-4 border-amber-400 ${getAvatarBg(p1.avatar)}`}></div><span className="font-bold text-lg">{p1.nome}</span><div className="w-32 h-48 bg-amber-500 rounded-t-xl flex justify-center pt-2 text-5xl font-black text-white/40">1</div></div>}
            {p3 && <div className="flex flex-col items-center"><div className={`w-14 h-14 rounded-full border-4 border-orange-700 ${getAvatarBg(p3.avatar)}`}></div><span className="font-bold">{p3.nome}</span><div className="w-24 h-24 bg-orange-800 rounded-t-xl flex justify-center pt-2 text-2xl font-black text-white/40">3</div></div>}
        </div>
    );
}

function RankingLateral({ jogadores, getAvatarBg }) {
    return (
        <div className="w-full md:w-80 bg-card/90 rounded-3xl border border-border p-6 overflow-y-auto">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Users /> Ranking</h3>
            {jogadores.map((j, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background rounded-xl mb-2 border border-border">
                    <div className="flex items-center gap-3">
                        <span className="font-black text-muted-foreground">{i+1}º</span>
                        <div className={`w-8 h-8 rounded-full ${getAvatarBg(j.avatar)}`}></div>
                        <span className="font-bold text-sm">{j.nome}</span>
                    </div>
                    <span className="font-black text-primary">{j.pontuacao}</span>
                </div>
            ))}
        </div>
    );
}