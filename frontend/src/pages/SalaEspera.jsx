import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, XCircle, Copy, CheckCircle2, Users } from 'lucide-react';

export default function SalaEspera() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); 
  };

  const iniciarSala = () => {
    alert("A partida vai começar!");
  };

  const cancelarSala = () => {
    if (window.confirm("Tem certeza que deseja cancelar esta sala?")) {
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
          <div className="bg-primary/10 rounded-full p-6 mt-4">
            <Users className="w-16 h-16 text-primary" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">
          Sala Criada com Sucesso!
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Código para acessar a sala:
        </p>

        {/* Display do Código */}
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-6 bg-muted px-8 py-6 rounded-2xl border-2 border-border"
          >
            <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 dark:from-blue-400 dark:to-purple-400 tracking-widest uppercase">
              {codigo}
            </span>
            <button 
              onClick={copiarCodigo}
              className="p-3 bg-background border border-border rounded-xl hover:bg-card transition-colors shadow-sm"
              title="Copiar código"
            >
              {copiado ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <Copy className="w-8 h-8 text-muted-foreground hover:text-primary" />
              )}
            </button>
          </motion.div>
          
          {/* Animação de "Aguardando jogadores..." */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-primary font-medium bg-primary/10 px-5 py-2.5 rounded-full"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <span>
              Aguardando jogadores
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
            </span>
          </motion.div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={cancelarSala}
            className="flex-1 flex items-center justify-center gap-2 h-14 text-lg font-bold bg-background border-2 border-destructive/50 hover:border-destructive hover:bg-destructive/10 text-destructive rounded-xl transition-all"
          >
            <XCircle className="w-6 h-6" />
            Cancelar Sala
          </button>

          <button
            onClick={iniciarSala}
            className="flex-1 flex items-center justify-center gap-2 h-14 text-xl font-black bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg transition-all active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            Iniciar Partida
          </button>
        </div>
      </motion.div>
    </div>
  );
}