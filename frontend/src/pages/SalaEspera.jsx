import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, XCircle, Copy, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import * as signalR from '@microsoft/signalr';

export default function SalaEspera() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState(false);
  const [mostrarModalCancelamento, setMostrarModalCancelamento] = useState(false);
  
  // Guardaremos a conexão aqui para podermos usá-la nos botões
  const [conexao, setConexao] = useState(null);
  const [jogadoresConectados, setJogadoresConectados] = useState(0);

  useEffect(() => {
    // Cria a conexão com o back-end
    const novaConexao = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5092/quizhub") 
      .withAutomaticReconnect()
      .build();

    // Configura o que fazer quando um aluno se conectar
    novaConexao.on("NovoJogadorConectado", (nome, avatar) => {
      console.log(`${nome} entrou com o avatar ${avatar}!`);
      setJogadoresConectados(prev => prev + 1);
    });

    // Inicia a conexão
    novaConexao.start()
      .then(() => {
        console.log("Organizador conectado ao SignalR!");
       
        const quizIdVerdadeiro = localStorage.getItem(`quiz_${codigo}`);
        
        novaConexao.invoke("AbrirSala", codigo, quizIdVerdadeiro);
      })

    setConexao(novaConexao);

    // Quando a tela for fechada, desconecta
    return () => {
      novaConexao.stop();
    };
  }, [codigo]);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); 
  };

  const iniciarSala = async () => {
    try {
      if (conexao && conexao.state === signalR.HubConnectionState.Connected) {
        await conexao.invoke("IniciarPartida", codigo); // Tranca a sala no C#!
      } else {
        console.warn("SignalR não está conectado. O backend C# está rodando?");
        alert("Atenção: Servidor offline. Simulando a ida para o painel...");
      }
      
      navigate(`/painel-host/${codigo}`);
      
    } catch (erro) {
      console.error("Erro ao tentar iniciar a sala no servidor:", erro);
      alert("Houve um erro de comunicação com o servidor C#.");
    }
  };

  const tentarCancelarSala = () => {
    setMostrarModalCancelamento(true);
  };

  const confirmarCancelamento = async () => {
    if (conexao && conexao.state === signalR.HubConnectionState.Connected) {
      await conexao.invoke("EncerrarSala", codigo);
    }
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-card text-card-foreground rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-border text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 rounded-full p-4 mt-2 relative">
            <Users className="w-12 h-12 text-primary" />
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg text-sm">
              {jogadoresConectados}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-1">Sala Aberta!</h2>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">Código para os jogadores entrarem:</p>

        <div className="flex flex-col items-center justify-center gap-3 mb-8 w-full">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 sm:gap-4 bg-muted px-4 sm:px-6 md:px-8 py-4 rounded-2xl border-2 border-border w-full md:w-fit"
          >
            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 dark:from-blue-400 dark:to-purple-400 tracking-wider sm:tracking-widest uppercase whitespace-nowrap">
              {codigo}
            </span>
            <button onClick={copiarCodigo} className="shrink-0 p-2 sm:p-2.5 bg-background border border-border rounded-xl hover:bg-card transition-colors">
              {copiado ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" /> : <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground hover:text-primary" />}
            </button>
          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-primary font-medium bg-primary/10 px-4 py-2 rounded-full text-xs sm:text-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></div>
            <span className="whitespace-nowrap">Aguardando jogadores...</span>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          <button onClick={tentarCancelarSala} className="flex-1 flex items-center justify-center gap-2 h-12 text-sm sm:text-base font-bold bg-background border-2 border-destructive/50 hover:border-destructive hover:bg-destructive/10 text-destructive rounded-xl transition-all">
            <XCircle className="w-5 h-5 shrink-0" /> Cancelar
          </button>
          <button onClick={iniciarSala} className="flex-1 flex items-center justify-center gap-2 h-12 text-sm sm:text-lg font-black bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg transition-all active:scale-95">
            <Play className="w-5 h-5 fill-current shrink-0" /> Iniciar Partida
          </button>
        </div>
      </motion.div>
      <AnimatePresence>
        {mostrarModalCancelamento && (
          <motion.div
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
              
              <h3 className="text-2xl font-bold mb-2">Cancelar Sala?</h3>
              <p className="text-muted-foreground mb-8">
                Tem certeza que deseja encerrar esta sala? Todos os jogadores conectados serão desconectados.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarModalCancelamento(false)}
                  className="flex-1 h-12 font-bold bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={confirmarCancelamento}
                  className="flex-1 h-12 font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl transition-colors"
                >
                  Sim, Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}