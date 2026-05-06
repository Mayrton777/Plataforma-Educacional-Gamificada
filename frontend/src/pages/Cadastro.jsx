import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, User, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";

export default function Cadastro() {
  const navigate = useNavigate();
  
  // Controle de etapa: 1 = Dados Iniciais | 2 = Validação de Código
  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [codigo, setCodigo] = useState("");

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await api.post('/auth/registrar', { nome, email, senha });
      setEtapa(2); // Avança para a tela de código
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await api.post('/auth/confirmar', { email, codigo: codigo.toUpperCase() });
      
      alert("Conta confirmada com sucesso! Faça login para continuar.");
      navigate("/login");
      
    } catch (error) {
      setErro(error.response?.data?.mensagem || "Código inválido ou expirado.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4 relative">
      <button onClick={() => navigate('/login')} className="absolute top-4 left-4 p-3 bg-card border border-border rounded-full hover:bg-muted transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <motion.div className="bg-card text-card-foreground rounded-3xl shadow-2xl p-10 max-w-md w-full border border-border overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* ETAPA 1: DADOS DO USUÁRIO */}
          {etapa === 1 && (
            <motion.div key="etapa1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black">Criar Conta</h2>
                <p className="text-muted-foreground mt-2">Cadastre-se para criar salas</p>
              </div>

              <form onSubmit={handleCadastrar} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-4 w-6 h-6 text-muted-foreground" />
                  <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full h-14 pl-14 pr-4 bg-muted border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-6 h-6 text-muted-foreground" />
                  <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-14 pl-14 pr-4 bg-muted border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-6 h-6 text-muted-foreground" />
                  <input type="password" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={5} className="w-full h-14 pl-14 pr-4 bg-muted border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all" />
                </div>

                {erro && <p className="text-destructive font-bold text-center">{erro}</p>}

                <button type="submit" disabled={carregando} className="w-full h-14 flex items-center justify-center text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 mt-6">
                  {carregando ? "Cadastrando..." : "Continuar"}
                </button>
              </form>
            </motion.div>
          )}

          {/* ETAPA 2: VERIFICAÇÃO DE CÓDIGO */}
          {etapa === 2 && (
            <motion.div key="etapa2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg">
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black">Verifique seu E-mail</h2>
                <p className="text-muted-foreground mt-2 px-4">
                  Enviamos um código de 6 dígitos para <strong className="text-foreground">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerificarCodigo} className="space-y-6">
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="EX: A1B2C3"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                    className="w-48 h-16 text-center text-2xl font-black tracking-widest uppercase bg-muted border-2 border-border focus:border-emerald-500 outline-hidden rounded-xl transition-all"
                  />
                </div>

                {erro && <p className="text-destructive font-bold text-center">{erro}</p>}

                <button type="submit" disabled={carregando || codigo.length !== 6} className="w-full h-14 flex items-center justify-center gap-2 text-xl font-bold bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70">
                  <CheckCircle2 className="w-6 h-6" />
                  {carregando ? "Validando..." : "Confirmar Código"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}