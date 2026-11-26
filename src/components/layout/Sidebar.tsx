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
}

export const Sidebar: React.FC<SidebarProps> = ({ currentId, onSelect }) => {
  const categories = ['General', 'Finance', 'Health', 'Utility'] as const;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 border-r border-white/10 [data-theme='light']:border-slate-200">
      <div className="space-y-6">
        <div>
          <button
            onClick={() => onSelect('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              currentId === 'home'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white [data-theme="light"]:hover:text-slate-900 hover:bg-white/5'
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
            <div key={cat} className="space-y-1.5">
              <div className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-500">
                {cat}
              </div>
              {items.map(item => {
                const Icon = ICON_MAP[item.icon] || Calculator;
                const isActive = currentId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white [data-theme="light"]:hover:text-slate-900 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span className="truncate">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
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
    </aside>
  );
};
