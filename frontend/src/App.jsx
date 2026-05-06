import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Identificacao } from './pages/Identificacao';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Jogo from './pages/Jogo';
import CriarQuiz from './pages/CriarQuiz';
import Login from './pages/Login';
import SalaEspera from './pages/SalaEspera';
import EntrarSala from './pages/EntrarSala';
import LobbyAluno from './pages/LobbyAluno';
import PainelHost from './pages/PainelHost';

const RotaProtegida = ({ children }) => {
  const usuarioLogado = localStorage.getItem("userName");
  if (!usuarioLogado) {
    return <Navigate to="/identificacao" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/identificacao" element={<Identificacao />} />

        <Route path="/*" element={
          <RotaProtegida>
            <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-500">
              <Navbar />
              <main className="p-6">
                <Routes>
                  <Route path="/" element={<Menu />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/entrar" element={<EntrarSala />} />
                  <Route path="/lobby/:codigo" element={<LobbyAluno />} />
                  <Route path="/criar" element={<CriarQuiz />} />
                  <Route path="/jogo/:id" element={<Jogo />} />
                  <Route path="/sala/:codigo" element={<SalaEspera />} />
                  <Route path="/painel-host/:codigo" element={<PainelHost />} />
                </Routes>
              </main>
            </div>
          </RotaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;