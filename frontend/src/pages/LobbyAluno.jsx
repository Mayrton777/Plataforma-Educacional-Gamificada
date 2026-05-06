import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Cat, Dog, Rabbit, Bird, Fish, Bug
} from 'lucide-react';

export default function LobbyAluno() {
  const { codigo } = useParams();
  const userName = localStorage.getItem("userName") || "User";
  
  // Estado para armazenar o avatar escolhido (null = padrão)
  const [avatarSelecionado, setAvatarSelecionado] = useState(null);

  // Lista de avatares com suas respectivas cores
  const avataresDisponiveis = [
    { id: 'cat', icone: Cat, cor: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
    { id: 'dog', icone: Dog, cor: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-600' },
    { id: 'rabbit', icone: Rabbit, cor: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500' },
    { id: 'bird', icone: Bird, cor: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' },
    { id: 'fish', icone: Fish, cor: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500' },
    { id: 'bug', icone: Bug, cor: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500' }
  ];

  // Identifica qual é o ícone atual para exibir em destaque
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
        {/* Borda superior decorativa */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-emerald-500 to-teal-500"></div>

        {/* Status de espera animado */}
        <div className="flex justify-center mb-6 mt-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-6 py-2.5 rounded-full"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>
              Aguardando
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
            </span>
          </motion.div>
        </div>

        {/* Avatar em Destaque */}
        <motion.div 
          key={avatarSelecionado} // Força a animação rodar quando o avatar muda
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
          <p className="text-muted-foreground font-medium mt-1 uppercase tracking-widest text-sm">
            Sala: {codigo}
          </p>
        </motion.div>

        {/* Seleção de Avatares */}
        <div className="border-t border-border pt-6 mt-6">
          <p className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">
            Escolha seu avatar
          </p>
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