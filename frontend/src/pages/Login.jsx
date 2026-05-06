import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulação temporária: se digitou algo, entra!
    if (email && senha) {
      navigate("/criar");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card text-card-foreground rounded-3xl shadow-2xl p-10 max-w-md w-full border border-border"
      >
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 dark:from-blue-500 dark:to-purple-600 mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-foreground">Bem-vindo</h2>
          <p className="text-muted-foreground mt-2">Faça login para criar seu quiz</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-6 h-6 text-muted-foreground" />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 pl-14 pr-4 text-lg bg-muted border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 w-6 h-6 text-muted-foreground" />
              <input
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full h-14 pl-14 pr-4 text-lg bg-muted border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-14 flex items-center justify-center gap-2 text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 text-white rounded-xl shadow-lg transition-all active:scale-95"
            >
              Entrar
            </button>
          </div>
        </form>

        {/* Separador e Cadastro */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">Ainda não tem uma conta?</p>
          <button
            onClick={() => alert("A tela de cadastro será criada em breve!")}
            className="w-full h-14 flex items-center justify-center gap-2 text-lg font-bold bg-transparent border-2 border-border hover:bg-muted text-foreground rounded-xl transition-all active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            Cadastrar-se
          </button>
        </div>
      </motion.div>
    </div>
  );
}