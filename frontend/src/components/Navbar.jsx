import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white/10 dark:bg-black/20 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm transition-colors duration-300">
      <Link 
        to="/" 
        className="flex items-center gap-3 text-2xl font-black text-white hover:opacity-80 transition-opacity drop-shadow-md"
      >
        <Bot className="w-8 h-8 text-white" />
        Dev Education
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </nav>
  );
}