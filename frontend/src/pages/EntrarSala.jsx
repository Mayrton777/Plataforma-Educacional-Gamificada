import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, LogIn } from "lucide-react";

export default function EntrarSala() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const handleEntrar = (e) => {
    e.preventDefault();
    
    const codigoFormatado = codigo.trim().toLowerCase();
    
    if (codigoFormatado.length >= 8) {
      navigate(`/lobby/${codigoFormatado}`); 
    } else {
      alert("Por favor, digite um código de sala válido (mínimo de 8 caracteres).");
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10 pb-12">
      {/* Botão Voltar */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="p-3 bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Card Principal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card text-card-foreground rounded-3xl shadow-2xl p-10 w-full border border-border"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-foreground">Entrar em Sala</h2>
          <p className="text-muted-foreground mt-2">
            Pronto para jogar, <strong className="text-primary">{userName}</strong>?
          </p>
        </div>

        <form onSubmit={handleEntrar} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Código da Sala</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: 1a3b-2c4d"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                maxLength={9} // 8 caracteres + 1 traço
                className="w-full h-16 px-6 text-2xl text-center font-black tracking-widest uppercase bg-muted border-2 border-border focus:border-emerald-500 outline-hidden rounded-2xl transition-all text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:tracking-normal"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={codigo.length < 8}
              className="w-full h-16 flex items-center justify-center gap-2 text-xl font-black bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-6 h-6" />
              Entrar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}