import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Menu() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate(); // Hook para navegar entre telas

  useEffect(() => {
    api.get('/quiz')
      .then(response => setQuizzes(response.data))
      .catch(error => console.error("Erro ao buscar quizzes:", error));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🎮 Plataforma Educacional Gamificada</h1>
      <p>Selecione um Quiz para jogar ou crie um novo.</p>
      <hr style={{ margin: '2rem 0' }} />

      <h2>Quizzes Disponíveis</h2>
      {quizzes.length === 0 ? (
        <p>Carregando ou nenhum quiz encontrado...</p>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {quizzes.map(quiz => (
            <div key={quiz.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', minWidth: '200px' }}>
              <h3>{quiz.titulo}</h3>
              <p>{quiz.perguntas?.length || 0} perguntas</p>
              {/* O botão agora redireciona passando o ID do quiz na URL */}
              <button 
                onClick={() => navigate(`/jogo/${quiz.id}`)}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', marginTop: '1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Jogar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;