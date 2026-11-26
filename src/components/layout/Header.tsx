import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calculator, Sun, Moon, Search, History } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenHistory: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenHistory,
  onNavigateHome,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 [data-theme='light']:bg-white/80 border-b border-white/10 [data-theme='light']:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <span>
            Calc<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Hub</span>
          </span>
        </button>

        {/* Quick Search Input */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-200 text-slate-400 hover:text-white [data-theme='light']:hover:text-slate-900 transition-all w-64 text-xs"
        >
          <Search className="w-4 h-4 text-indigo-400" />
          <span className="flex-1 text-left">Search calculators...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 [data-theme='light']:bg-slate-200 font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-white [data-theme='light']:hover:text-slate-900 hover:bg-white/5 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-white [data-theme='light']:hover:text-slate-900 hover:bg-white/5 transition-colors relative"
            title="History"
          >
            <History className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white [data-theme='light']:hover:text-slate-900 hover:bg-white/5 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>

          <a
            href="https://github.com/zhsaikot/calculator-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white [data-theme='light']:hover:text-slate-900 hover:bg-white/5 transition-colors"
            title="View on GitHub"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
