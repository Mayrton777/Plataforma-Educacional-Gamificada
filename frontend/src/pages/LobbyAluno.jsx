import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Cat, Dog, Rabbit, Bird, Fish, Bug } from 'lucide-react';
import * as signalR from '@microsoft/signalr';

export default function LobbyAluno() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Jogador";
  const [avatarSelecionado, setAvatarSelecionado] = useState('cat'); // Padrão
  const [conexao, setConexao] = useState(null);

  const avataresDisponiveis = [
    { id: 'cat', icone: Cat, cor: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
    { id: 'dog', icone: Dog, cor: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-600' },
    { id: 'rabbit', icone: Rabbit, cor: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500' },
    { id: 'bird', icone: Bird, cor: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' },
    { id: 'fish', icone: Fish, cor: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500' },
    { id: 'bug', icone: Bug, cor: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500' }
  ];

  useEffect(() => {
    const novaConexao = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5092/quizhub") // Atenção à porta!
      .withAutomaticReconnect()
      .build();

    // Se o back-end recusar a conexão (sala não existe ou trancada)
    novaConexao.on("ErroConexao", (mensagem) => {
      alert(mensagem);
      navigate('/'); // Manda de volta pro início
    });

    // Se o organizador começar o jogo
    novaConexao.on("PartidaIniciada", (quizIdDoBanco) => {
      navigate(`/jogo/${quizIdDoBanco}`, { 
        state: { codigoSala: codigo, avatar: avatarSelecionado } 
      });
    });

    // Se o organizador cancelar a sala
    novaConexao.on("SalaEncerrada", () => {
      alert("O organizador cancelou a sala.");
      navigate('/');
    });

    novaConexao.start()
      .then(() => {
        // Tenta entrar na sala no C# assim que conecta
        novaConexao.invoke("EntrarNaSala", codigo, userName, avatarSelecionado);
      })
      .catch(err => console.error("Erro no SignalR: ", err));

    setConexao(novaConexao);

    return () => novaConexao.stop();
  }, [codigo, navigate, userName]);

  // Resto do código de UI que a gente já tinha feito!
  const AvatarAtual = avatarSelecionado 
    ? avataresDisponiveis.find(a => a.id === avatarSelecionado).icone 
    : User;

  const corAtual = avatarSelecionado 
    ? avataresDisponiveis.find(a => a.id === avatarSelecionado).cor 
    : 'text-muted-foreground';

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-card text-card-foreground rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-border text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-500 to-teal-500"></div>

        <div className="flex justify-center mb-6 mt-4">
          <motion.div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-6 py-2.5 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Aguardando organizador...</span>
          </motion.div>
        </div>

        <motion.div 
          key={avatarSelecionado}
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          type="spring"
          className="flex flex-col items-center justify-center mb-8"
        >
          <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-xl mb-4 transition-colors duration-300 ${
            avatarSelecionado 
              ? avataresDisponiveis.find(a => a.id === avatarSelecionado).bg + ' ' + avataresDisponiveis.find(a => a.id === avatarSelecionado).border
              : 'bg-muted border-border'
          }`}>
            <AvatarAtual className={`w-16 h-16 ${corAtual}`} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-foreground">{userName}</h2>
          <p className="text-muted-foreground font-medium mt-1 uppercase tracking-widest text-sm">Sala: {codigo}</p>
        </motion.div>

        <div className="border-t border-border pt-6 mt-6">
          <p className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">Escolha seu avatar</p>
          <div className="grid grid-cols-3 gap-4">
            {avataresDisponiveis.map((avatar) => (
              <motion.button
                key={avatar.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAvatarSelecionado(avatar.id)}
                className={`flex justify-center items-center p-4 rounded-2xl border-2 transition-all ${
                  avatarSelecionado === avatar.id 
                    ? `${avatar.border} ${avatar.bg} shadow-md` 
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                <avatar.icone className={`w-8 h-8 ${avatarSelecionado === avatar.id ? avatar.cor : 'text-muted-foreground'}`} />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}