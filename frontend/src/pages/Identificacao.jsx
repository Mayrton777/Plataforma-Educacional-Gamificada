import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

export function Identificacao() {
  const [nome, setNome] = useState("");
  const navigate = useNavigate();

  const handleContinuar = () => {
    if (nome.trim()) {
      // Salva o nome no localStorage para persistência simples
      localStorage.setItem("userName", nome);
      // Redireciona para a Dashboard/Menu principal
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4 transition-colors duration-500">
      
      {/* Botão de Tema posicionado no topo da tela de identificação */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card text-card-foreground rounded-3xl shadow-2xl p-10 max-w-md w-full border border-border"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="bg-linear-to-br from-purple-500 to-pink-500 dark:from-blue-500 dark:to-purple-600 rounded-full p-6 mb-4 shadow-lg">
            <Bot className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 dark:from-blue-400 dark:to-purple-400">
            Dev Education
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Aprender nunca foi tão divertido!
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Digite seu nome ou apelido"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleContinuar()}
              className="w-full h-14 px-4 text-lg bg-muted border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <button
            onClick={handleContinuar}
            disabled={!nome.trim()}
            className="w-full h-14 text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Continuar
          </button>
        </motion.div>

        {/* Decorative Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`w-2.5 h-2.5 rounded-full ${
                i % 2 === 0 ? "bg-primary/40" : "bg-secondary-foreground/20"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}