import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Users, Bot } from "lucide-react";

export default function Menu() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Desenvolvedor";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white/20 dark:bg-black/20 rounded-full p-4 shadow-lg backdrop-blur-sm border border-white/30">
              <Bot className="w-12 h-12 text-white" />
            </div>
            {/* Título agora é branco para contrastar com o fundo vibrante */}
            <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">
              Dev Education
            </h1>
          </div>
          <p className="text-3xl font-bold text-white drop-shadow-md">Olá, {userName}! 👋</p>
          <p className="text-xl text-white/90 mt-2 font-medium">O que você deseja fazer hoje?</p>
        </motion.div>

        {/* CTAs (Cards de Ação) */}
        <div className="grid md:grid-cols-2 gap-8">
          
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="bg-linear-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-900 hover:from-blue-600 hover:to-indigo-700 rounded-3xl p-10 shadow-xl group relative overflow-hidden text-left border border-white/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30 shadow-inner">
                <Plus className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Criar Quiz</h2>
              <p className="text-lg text-white/90 font-medium">
                Crie um novo jogo de perguntas e respostas
              </p>
            </div>
          </motion.button>

          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/entrar")}
            className="bg-linear-to-br from-emerald-500 to-teal-600 dark:from-emerald-700 dark:to-teal-900 hover:from-emerald-600 hover:to-teal-700 rounded-3xl p-10 shadow-xl group relative overflow-hidden text-left border border-white/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30 shadow-inner">
                <Users className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Entrar em Sala</h2>
              <p className="text-lg text-white/90 font-medium">
                Participe de um quiz
              </p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}