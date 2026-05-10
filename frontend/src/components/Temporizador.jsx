import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

export default function Temporizador({ tempoLimite, ativo, onTempoEsgotado, onTick }) {
  // Estado volátil: Isolado aqui dentro!
  const [tempoRestante, setTempoRestante] = useState(tempoLimite);

  // Se a pergunta mudar (novo tempo limite), reseta o cronômetro
  useEffect(() => {
    setTempoRestante(tempoLimite);
  }, [tempoLimite]);

  useEffect(() => {
    // Se o jogo acabou ou o aluno já respondeu, pausa o relógio
    if (!ativo) return;

    if (tempoRestante <= 0) {
      onTempoEsgotado();
      return;
    }

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        const novoTempo = prev - 1;
        if (onTick) onTick(novoTempo); // Avisa o pai silenciosamente (via ref)
        return novoTempo;
      });
    }, 1000);

    // Cleanup: previne memory leaks
    return () => clearInterval(intervalo);
  }, [tempoRestante, ativo, onTempoEsgotado, onTick]);

  const isAcabando = tempoRestante <= 5;

  return (
    <div className={`flex items-center gap-2 text-3xl font-black bg-card px-6 py-3 rounded-2xl shadow-lg border-2 transition-colors duration-300 ${isAcabando ? 'text-red-500 border-red-500 animate-pulse' : 'text-foreground border-border'}`}>
      <Timer className="w-8 h-8" />
      {tempoRestante}s
    </div>
  );
}