import React from 'react';
import { CALCULATORS_REGISTRY } from '../../lib/calculators/registry';
import { CalculatorId } from '../../lib/calculators/types';
import {
  Calculator,
  Atom,
  Cake,
  Activity,
  Receipt,
  TrendingUp,
  Landmark,
  Coins,
  Tag,
  Percent,
  ArrowLeftRight,
  Home,
  X,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Calculator,
  Atom,
  Cake,
  Activity,
  Receipt,
  TrendingUp,
  Landmark,
  Coins,
  Tag,
  Percent,
  ArrowLeftRight,
};

interface SidebarProps {
  currentId: CalculatorId | 'home';
  onSelect: (id: CalculatorId | 'home') => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentId,
  onSelect,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const categories = ['General', 'Finance', 'Health', 'Utility'] as const;

  const content = (
    <div className="space-y-6">
      {/* Mobile drawer header */}
      {isMobileOpen && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-display font-bold text-sm text-slate-900 dark:text-zinc-100">
            <Calculator className="w-4 h-4 text-blue-600" />
            Navigation
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <button
          onClick={() => {
            onSelect('home');
            if (isMobileOpen && onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            currentId === 'home'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home Hub</span>
        </button>
      </div>

      {categories.map(cat => {
        const items = CALCULATORS_REGISTRY.filter(c => c.category === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="space-y-1">
            <div className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-zinc-500">
              {cat}
            </div>
            {items.map(item => {
              const Icon = ICON_MAP[item.icon] || Calculator;
              const isActive = currentId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    if (isMobileOpen && onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-semibold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 dark:text-zinc-500'}`} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-56 flex-shrink-0 hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 border-r border-slate-200 dark:border-zinc-800">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 p-4 overflow-y-auto shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
