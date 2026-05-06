import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function CriarQuiz() {
  const navigate = useNavigate();
  
  const [titulo, setTitulo] = useState('');

  // Função auxiliar para criar as 4 alternativas padrão (A primeira começa como correta)
  const gerarAlternativasPadrao = () => [
    { texto: '', isCorreta: true },
    { texto: '', isCorreta: false },
    { texto: '', isCorreta: false },
    { texto: '', isCorreta: false }
  ];

  // A pergunta agora já nasce com as 4 alternativas embutidas
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

  // Funções novas para manipular as alternativas
  const atualizarTextoAlternativa = (perguntaIndex, altIndex, texto) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas[altIndex].texto = texto;
    setPerguntas(novasPerguntas);
  };

  const definirAlternativaCorreta = (perguntaIndex, altIndexSelecionada) => {
    const novasPerguntas = [...perguntas];
    // Varre as alternativas daquela pergunta e marca apenas a selecionada como true
    novasPerguntas[perguntaIndex].alternativas.forEach((alt, i) => {
      alt.isCorreta = (i === altIndexSelecionada);
    });
    setPerguntas(novasPerguntas);
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
        alert('Quiz criado com sucesso!');
        navigate('/');
    } catch (error) {
        console.error("Erro ao salvar:", error);
    }
  };

  const letras = ['A', 'B', 'C', 'D']; // Para a interface visual

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>✍️ Criar Novo Quiz</h1>
        <button onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Voltar
        </button>
      </div>

      <form onSubmit={salvarQuiz} style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Título do Quiz:</label>
          <input 
            type="text" 
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Ex: Quiz de Matemática Básica"
          />
        </div>

        <hr style={{ margin: '2rem 0' }} />
        <h2>Perguntas</h2>

        {perguntas.map((pergunta, pIndex) => (
          <div key={pIndex} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', background: '#f9f9f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Pergunta {pIndex + 1}</h3>
              {perguntas.length > 1 && (
                <button type="button" onClick={() => removerPergunta(pIndex)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  🗑️ Remover Pergunta
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 3 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 'bold' }}>Enunciado:</label>
                <input 
                  type="text" 
                  required
                  value={pergunta.enunciado}
                  onChange={(e) => atualizarPergunta(pIndex, 'enunciado', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  placeholder="Ex: Quanto é 2 + 2?"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem', fontWeight: 'bold' }}>Tempo (seg):</label>
                <input 
                  type="number" 
                  required
                  min="5"
                  value={pergunta.tempoLimiteSegundos}
                  onChange={(e) => atualizarPergunta(pIndex, 'tempoLimiteSegundos', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <h4 style={{ marginBottom: '0.5rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>Alternativas (Selecione a correta):</h4>
            
            {pergunta.alternativas.map((alternativa, aIndex) => (
              <div key={aIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <input 
                  type="radio" 
                  name={`correta-${pIndex}`} // Garante que só uma pode ser selecionada por pergunta
                  checked={alternativa.isCorreta}
                  onChange={() => definirAlternativaCorreta(pIndex, aIndex)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <strong style={{ fontSize: '1.2rem', minWidth: '25px' }}>{letras[aIndex]})</strong>
                <input 
                  type="text" 
                  required
                  value={alternativa.texto}
                  onChange={(e) => atualizarTextoAlternativa(pIndex, aIndex, e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', 
                           borderColor: alternativa.isCorreta ? '#28a745' : '#ccc', 
                           background: alternativa.isCorreta ? '#e8f5e9' : 'white' }}
                  placeholder={`Digite a alternativa ${letras[aIndex]}`}
                />
              </div>
            ))}
          </div>
        ))}

        <button 
          type="button" 
          onClick={adicionarPergunta}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '2rem' }}
        >
          ➕ Adicionar Outra Pergunta
        </button>

        <div style={{ textAlign: 'right' }}>
          <button 
            type="submit"
            style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            💾 Salvar Quiz Completo
          </button>
        </div>
      </form>
    </div>
  );
}

export default CriarQuiz;