import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Rocket, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Clock 
} from 'lucide-react';

function CriarQuiz() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');

  const gerarAlternativasPadrao = () => [
    { texto: '', isCorreta: true },
    { texto: '', isCorreta: false },
    { texto: '', isCorreta: false },
    { texto: '', isCorreta: false }
  ];

  const [perguntas, setPerguntas] = useState([
    { enunciado: '', tempoLimiteSegundos: 30, alternativas: gerarAlternativasPadrao() }
  ]);

  const adicionarPergunta = () => {
    setPerguntas([...perguntas, { enunciado: '', tempoLimiteSegundos: 30, alternativas: gerarAlternativasPadrao() }]);
  };

  const atualizarPergunta = (index, campo, valor) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index][campo] = campo === 'tempoLimiteSegundos' ? Number(valor) : valor;
    setPerguntas(novasPerguntas);
  };

  const removerPergunta = (index) => {
    setPerguntas(perguntas.filter((_, i) => i !== index));
  };

  const atualizarTextoAlternativa = (perguntaIndex, altIndex, texto) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas[altIndex].texto = texto;
    setPerguntas(novasPerguntas);
  };

  const definirAlternativaCorreta = (perguntaIndex, altIndexSelecionada) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas.forEach((alt, i) => {
      alt.isCorreta = (i === altIndexSelecionada);
    });
    setPerguntas(novasPerguntas);
  };

  const gerarCodigoSala = () => {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    // Formata no estilo 1a3b-2c4d
    return `${codigo.slice(0, 4)}-${codigo.slice(4, 8)}`;
  };

  const salvarQuiz = async (e) => {
    e.preventDefault();
    
    const novoQuiz = {
      titulo: titulo,
      perguntas: perguntas.map(p => ({
        enunciado: p.enunciado,
        tempoLimiteSegundos: p.tempoLimiteSegundos,
        alternativas: p.alternativas.map(a => ({
          texto: a.texto,
          isCorreta: a.isCorreta
        }))
      }))
    };

    try {
      await api.post('/quiz', novoQuiz);
      
      // Gera o código e manda para a nova tela
      const codigoDaSala = gerarCodigoSala();
      navigate(`/sala/${codigoDaSala}`);
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Houve um erro ao criar a sala. Verifique o console.");
    }
  };

  const letras = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-3 bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black text-white drop-shadow-md">
            Criar Quiz
          </h1>
        </div>
      </div>

      <form onSubmit={salvarQuiz} className="space-y-8">
        
        {/* Card do Título */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border"
        >
          <label className="block text-lg font-bold mb-3 text-foreground">Título do Quiz</label>
          <input 
            type="text" 
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full h-14 px-4 text-xl bg-muted border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all text-foreground placeholder:text-muted-foreground"
            placeholder="Ex: Matemática Básica - Nível 1"
          />
        </motion.div>

        {/* Lista de Perguntas */}
        <div className="space-y-8">
          <AnimatePresence>
            {perguntas.map((pergunta, pIndex) => (
              <motion.div 
                key={pIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3 }}
                className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl border border-border relative overflow-hidden"
              >
                {/* Faixa decorativa no topo do card */}
                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-500 to-pink-500 opacity-80"></div>

                <div className="flex justify-between items-center mb-6 mt-2">
                  <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-base">
                      {pIndex + 1}
                    </span>
                    Pergunta
                  </h3>
                  
                  {perguntas.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removerPergunta(pIndex)}
                      className="flex items-center gap-2 text-destructive hover:bg-destructive/10 px-4 py-2 rounded-lg font-bold transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      Remover
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="md:col-span-3">
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-muted-foreground">
                      <HelpCircle className="w-4 h-4" /> Enunciado
                    </label>
                    <input 
                      type="text" 
                      required
                      value={pergunta.enunciado}
                      onChange={(e) => atualizarPergunta(pIndex, 'enunciado', e.target.value)}
                      className="w-full h-12 px-4 text-lg bg-background border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all text-foreground placeholder:text-muted-foreground"
                      placeholder="Ex: Quanto é 2 + 2?"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="flex items-center gap-2 text-sm font-bold mb-2 text-muted-foreground">
                      <Clock className="w-4 h-4" /> Tempo (seg)
                    </label>
                    <input 
                      type="number" 
                      required
                      min="5"
                      value={pergunta.tempoLimiteSegundos}
                      onChange={(e) => atualizarPergunta(pIndex, 'tempoLimiteSegundos', e.target.value)}
                      className="w-full h-12 px-4 text-lg bg-background border-2 border-border focus:border-primary outline-hidden rounded-xl transition-all text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">
                    Alternativas (Selecione a correta)
                  </h4>
                  <div className="space-y-3">
                    {pergunta.alternativas.map((alternativa, aIndex) => (
                      <div 
                        key={aIndex} 
                        className={`flex items-center gap-4 p-2 pl-4 rounded-2xl border-2 transition-all ${
                          alternativa.isCorreta 
                            ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20' 
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        {/* Botão customizado de Radio */}
                        <button
                          type="button"
                          onClick={() => definirAlternativaCorreta(pIndex, aIndex)}
                          className="focus:outline-hidden"
                        >
                          {alternativa.isCorreta ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                          ) : (
                            <Circle className="w-7 h-7 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                        
                        <strong className="text-lg font-black text-foreground min-w-[24px]">
                          {letras[aIndex]}
                        </strong>
                        
                        <input 
                          type="text" 
                          required
                          value={alternativa.texto}
                          onChange={(e) => atualizarTextoAlternativa(pIndex, aIndex, e.target.value)}
                          className="flex-1 h-12 px-4 text-lg bg-transparent outline-hidden text-foreground placeholder:text-muted-foreground/60"
                          placeholder={`Digite a alternativa ${letras[aIndex]}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Botões de Ação Final */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
          <button 
            type="button" 
            onClick={adicionarPergunta}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-2xl transition-all"
          >
            <Plus className="w-6 h-6" />
            Adicionar Nova Pergunta
          </button>

          <button 
            type="submit"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg font-black rounded-2xl shadow-xl transition-all active:scale-95"
          >
            <Rocket className="w-6 h-6" />
            Criar Sala
          </button>
        </div>

      </form>
    </div>
  );
}

export default CriarQuiz;