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
  PanelLeftClose,
  PanelLeftOpen,
  LucideIcon,
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentId,
  onSelect,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const categories = ['General', 'Finance', 'Health', 'Utility'] as const;

  // Expanded content for Desktop (expanded) and Mobile Drawer
  const renderExpandedContent = () => (
    <div className="space-y-5">
      <div>
        <button
          onClick={() => {
            onSelect('home');
            if (isMobileOpen && onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            currentId === 'home'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-850 hover:text-slate-900 dark:hover:text-zinc-100'
          }`}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          <span>Home Hub</span>
        </button>
      </div>

      {categories.map(cat => {
        const items = CALCULATORS_REGISTRY.filter(c => c.category === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500">
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/80 dark:border-blue-900/60 shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500'
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700'
                      }`}
                    >
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

  // Compact icon-only content for Desktop (collapsed)
  const renderCollapsedContent = () => (
    <div className="space-y-3">
      <button
        onClick={() => onSelect('home')}
        className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all ${
          currentId === 'home'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-850'
        }`}
        title="Home Hub"
        aria-label="Home Hub"
      >
        <Home className="w-4 h-4" />
      </button>

      {categories.map((cat, idx) => {
        const items = CALCULATORS_REGISTRY.filter(c => c.category === cat);
        if (items.length === 0) return null;

        return (
          <div key={cat} className="space-y-1">
            {idx > 0 && <div className="w-6 h-px bg-slate-200 dark:bg-zinc-800 mx-auto my-2" />}
            {items.map(item => {
              const Icon = ICON_MAP[item.icon] || Calculator;
              const isActive = currentId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-850'
                  }`}
                  title={`${item.title} (${cat})`}
                  aria-label={item.title}
                >
                  <Icon className="w-4 h-4" />
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
      {/* Desktop Sidebar (Flush to Left, Collapsible & Sticky) */}
      <aside
        className={`flex-shrink-0 hidden lg:flex flex-col sticky top-14 sm:top-16 self-start h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] border-r border-slate-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/90 backdrop-blur transition-[width] duration-200 ease-in-out z-20 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Navigation List Area */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
          {isCollapsed ? renderCollapsedContent() : renderExpandedContent()}
        </div>

        {/* Bottom Collapsible Toggle Button Section */}
        {onToggleCollapse && (
          <div className="p-2 border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-900/40">
            {isCollapsed ? (
              <button
                onClick={onToggleCollapse}
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/70 dark:hover:bg-zinc-800/70 transition-all group"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-slate-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
            ) : (
              <button
                onClick={onToggleCollapse}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/70 dark:hover:bg-zinc-800/70 transition-all group"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <div className="flex items-center gap-2.5">
                  <PanelLeftClose className="w-4 h-4 text-slate-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  <span className="font-semibold text-xs text-slate-700 dark:text-zinc-300">Collapse sidebar</span>
                </div>
                {/* Toggle switch visual */}
                <div className="w-8 h-4.5 bg-blue-600 rounded-full p-0.5 flex items-center justify-end transition-colors shadow-inner">
                  <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
                </div>
              </button>
            )}
          </div>
        )}
      </aside>

      {/* Mobile Drawer (Responsive slide-over) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col shadow-2xl z-10 animate-fade-up">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5 font-display font-bold text-sm text-slate-900 dark:text-zinc-100">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <Calculator className="w-3.5 h-3.5" />
                </div>
                <span>Navigation</span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-5">
              {renderExpandedContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
