import React, { useState } from 'react';
import { CALCULATORS_REGISTRY } from '../../lib/calculators/registry';
import { CalculatorId } from '../../lib/calculators/types';
import { GlassCard } from '../common/GlassCard';
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
  ArrowRight,
  Search,
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

interface HomeHubProps {
  onSelectCalculator: (id: CalculatorId) => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({ onSelectCalculator }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'General' | 'Finance' | 'Health' | 'Utility'>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const filtered = CALCULATORS_REGISTRY.filter(calc => {
    const matchesCat = activeCategory === 'All' || calc.category === activeCategory;
    const matchesQuery =
      calc.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      calc.shortDesc.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-10">
      {/* Minimal Hero Section */}
      <section className="text-center py-6 sm:py-12 px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 [data-theme='light']:bg-slate-100 border border-zinc-700/60 [data-theme='light']:border-slate-200 text-xs font-medium text-zinc-300 [data-theme='light']:text-slate-700 mb-4">
          <span>11 Precision Online Calculators</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-zinc-100 [data-theme='light']:text-slate-900">
          Fast, Accurate Tools for Everyday Math & Finance
        </h1>

        <p className="mt-3.5 text-sm sm:text-base text-zinc-400 [data-theme='light']:text-slate-600 max-w-xl mx-auto leading-relaxed">
          From loan amortization schedules and tax breakdowns to body mass index and unit conversions. Ad-free, private, and instant.
        </p>

        {/* Clean Search Input */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or category (e.g. loan, tax, bmi)..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 [data-theme='light']:bg-white border border-zinc-800 [data-theme='light']:border-slate-200 text-sm text-zinc-100 [data-theme='light']:text-slate-900 outline-none focus:border-blue-600 transition-colors shadow-sm"
          />
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {(['All', 'General', 'Finance', 'Health', 'Utility'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-zinc-800 text-zinc-100 [data-theme="light"]:bg-slate-900 [data-theme="light"]:text-white font-semibold'
                : 'text-zinc-400 [data-theme="light"]:text-slate-600 hover:text-zinc-100 hover:bg-zinc-800/40 [data-theme="light"]:hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clean Calculator Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(calc => {
            const Icon = ICON_MAP[calc.icon] || Calculator;

            return (
              <GlassCard
                key={calc.id}
                hoverEffect
                className="p-5 cursor-pointer flex flex-col justify-between group"
              >
                <div onClick={() => onSelectCalculator(calc.id)}>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-zinc-800/80 [data-theme='light']:bg-slate-100 border border-zinc-700/50 [data-theme='light']:border-slate-200 flex items-center justify-center text-blue-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    {calc.badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 [data-theme='light']:bg-slate-100 [data-theme='light']:border-slate-200">
                        {calc.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-semibold text-base text-zinc-100 [data-theme='light']:text-slate-900 group-hover:text-blue-500 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 [data-theme='light']:text-slate-600 leading-relaxed line-clamp-2">
                    {calc.shortDesc}
                  </p>
                </div>

                <div
                  onClick={() => onSelectCalculator(calc.id)}
                  className="mt-4 pt-3 border-t border-zinc-800/80 [data-theme='light']:border-slate-100 flex items-center justify-between text-xs text-zinc-400 group-hover:text-blue-500 font-medium"
                >
                  <span>Use tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
};
