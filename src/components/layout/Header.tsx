import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calculator, Sun, Moon, Search, History, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenHistory: () => void;
  onNavigateHome: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenHistory,
  onNavigateHome,
  onToggleMobileMenu,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 [data-theme='light']:bg-white/95 backdrop-blur border-b border-zinc-800 [data-theme='light']:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-100 [data-theme='light']:hover:text-slate-900 hover:bg-zinc-800 [data-theme='light']:hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-zinc-100 [data-theme='light']:text-slate-900 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Calculator className="w-4 h-4" />
            </div>
            <span>CalcHub</span>
          </button>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-zinc-900 [data-theme='light']:bg-slate-100 border border-zinc-800 [data-theme='light']:border-slate-200 text-zinc-400 [data-theme='light']:text-slate-500 hover:text-zinc-200 [data-theme='light']:hover:text-slate-900 transition-all w-64 text-xs"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span className="flex-1 text-left">Search calculators...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-800 [data-theme='light']:bg-slate-200 font-mono text-zinc-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 [data-theme='light']:hover:text-slate-900 hover:bg-zinc-800 [data-theme='light']:hover:bg-slate-100 transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 [data-theme='light']:text-slate-700 hover:bg-zinc-800 [data-theme='light']:hover:bg-slate-100 transition-colors"
            title="History"
          >
            <History className="w-4 h-4 text-zinc-400" />
            <span className="hidden md:inline">History</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 [data-theme='light']:hover:text-slate-900 hover:bg-zinc-800 [data-theme='light']:hover:bg-slate-100 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
