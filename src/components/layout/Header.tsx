import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calculator, Sun, Moon, Search, History, Menu } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenHistory: () => void;
  onNavigateHome: () => void;
  onToggleMobileMenu: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenHistory,
  onNavigateHome,
  onToggleMobileMenu,
  isSidebarCollapsed = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/90 backdrop-blur border-b border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="w-full h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Brand Logo (Aligned pixel-perfectly with Sidebar) */}
        <div
          className={`flex items-center h-full ${
            isSidebarCollapsed ? 'lg:w-16' : 'lg:w-80'
          } lg:border-r border-slate-200 dark:border-zinc-800/80 transition-[width] duration-200 px-3 sm:px-4 lg:px-4 flex-shrink-0`}
        >
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 -ml-1 mr-1 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo Button */}
          <button
            onClick={onNavigateHome}
            className={`flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100 focus:outline-none transition-colors ${
              isSidebarCollapsed
                ? 'lg:mx-auto'
                : 'px-3 py-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-zinc-850/60'
            }`}
            title="CalcHub Home"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <span className={`${isSidebarCollapsed ? 'lg:hidden' : ''} truncate`}>
              CalcHub
            </span>
          </button>
        </div>

        {/* Center & Right Navigation Container */}
        <div className="flex-1 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-full">
          {/* Center: Search Bar (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 transition-all w-64 text-xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
            <span className="flex-1 text-left">Search calculators...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-zinc-800 font-mono text-slate-500 dark:text-zinc-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="History"
            >
              <History className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span className="hidden md:inline">History</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
