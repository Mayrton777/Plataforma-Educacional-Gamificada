import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Jogo from './pages/Jogo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/jogo/:id" element={<Jogo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;