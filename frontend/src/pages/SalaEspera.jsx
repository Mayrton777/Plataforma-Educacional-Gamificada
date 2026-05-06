import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, XCircle, Copy, CheckCircle2, Users } from 'lucide-react';
import * as signalR from '@microsoft/signalr'; // Importando o SignalR

export default function SalaEspera() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState(false);
  
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

  const cancelarSala = async () => {
    if (window.confirm("Tem certeza que deseja cancelar esta sala?")) {
      if (conexao && conexao.state === signalR.HubConnectionState.Connected) {
        await conexao.invoke("EncerrarSala", codigo);
      }
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-card text-card-foreground rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-border text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-3 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 rounded-full p-6 mt-4 relative">
            <Users className="w-16 h-16 text-primary" />
            {/* Contador de alunos que vai subir em tempo real! */}
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              {jogadoresConectados}
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">Sala Aberta!</h2>
        <p className="text-muted-foreground mb-8 text-lg">Código para os jogadores entrarem:</p>

        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-6 bg-muted px-8 py-6 rounded-2xl border-2 border-border"
          >
            <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 dark:from-blue-400 dark:to-purple-400 tracking-widest uppercase">
              {codigo}
            </span>
            <button onClick={copiarCodigo} className="p-3 bg-background border border-border rounded-xl hover:bg-card transition-colors">
              {copiado ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Copy className="w-8 h-8 text-muted-foreground hover:text-primary" />}
            </button>
          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-primary font-medium bg-primary/10 px-5 py-2.5 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <span>Aguardando jogadores...</span>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={cancelarSala} className="flex-1 flex items-center justify-center gap-2 h-14 text-lg font-bold bg-background border-2 border-destructive/50 hover:border-destructive hover:bg-destructive/10 text-destructive rounded-xl transition-all">
            <XCircle className="w-6 h-6" /> Cancelar Sala
          </button>
          <button onClick={iniciarSala} className="flex-1 flex items-center justify-center gap-2 h-14 text-xl font-black bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg transition-all active:scale-95">
            <Play className="w-6 h-6 fill-current" /> Iniciar Partida
          </button>
        </div>
      </motion.div>
    </div>
  );
}