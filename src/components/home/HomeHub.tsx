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
  ArrowUpRight,
  Sparkles,
  Zap,
  ShieldCheck,
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
    <div className="space-y-12 animate-fade-up">
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>11 Precision Calculators · 100% Free & Ad-Free</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight max-w-3xl mx-auto leading-tight text-white [data-theme='light']:text-slate-900">
          Smart Calculations for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-pink-400">
            Every Aspect of Life
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 [data-theme='light']:text-slate-600 max-w-xl mx-auto leading-relaxed">
          From complex financial loan schedules to daily arithmetic and health metrics. Fast, beautiful, and completely private in your browser.
        </p>

        {/* Quick Search in Hero */}
        <div className="mt-8 max-w-md mx-auto relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search any calculator (loan, bmi, tax)..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.06] [data-theme='light']:bg-white border border-white/10 [data-theme='light']:border-slate-300 text-sm outline-none focus:border-indigo-500 transition-all shadow-lg"
          />
        </div>

        {/* Stats */}
        <div className="mt-12 flex items-center justify-center gap-8 sm:gap-16 flex-wrap">
          <div className="text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
              11
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Calculators</div>
          </div>
          <div className="text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
              0ms
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Server Latency</div>
          </div>
          <div className="text-center">
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
              100%
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Private & Offline</div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {(['All', 'General', 'Finance', 'Health', 'Utility'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/5 [data-theme="light"]:bg-slate-200/70 text-slate-400 [data-theme="light"]:text-slate-700 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Calculator Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(calc => {
            const Icon = ICON_MAP[calc.icon] || Calculator;

            return (
              <GlassCard
                key={calc.id}
                hoverEffect
                className="p-6 cursor-pointer group relative flex flex-col justify-between"
              >
                <div onClick={() => onSelectCalculator(calc.id)}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 [data-theme='light']:bg-indigo-50 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    {calc.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                        {calc.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white [data-theme='light']:text-slate-900 group-hover:text-indigo-400 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 [data-theme='light']:text-slate-600 leading-relaxed">
                    {calc.shortDesc}
                  </p>
                </div>

                <div
                  onClick={() => onSelectCalculator(calc.id)}
                  className="mt-6 pt-4 border-t border-white/5 [data-theme='light']:border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-400 font-semibold"
                >
                  <span>Open Calculator</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Marketing Trust Badges */}
      <section className="py-8">
        <GlassCard className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm">Ultra-Fast Computation</h4>
                <p className="text-xs text-slate-400 [data-theme='light']:text-slate-600 mt-1">
                  100% client-side execution with instantaneous responses and zero network lag.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm">Zero Data Collection</h4>
                <p className="text-xs text-slate-400 [data-theme='light']:text-slate-600 mt-1">
                  Your numbers, loans, and health metrics never leave your device.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm">PWA Offline Mode</h4>
                <p className="text-xs text-slate-400 [data-theme='light']:text-slate-600 mt-1">
                  Add to home screen and calculate anywhere, even without an active internet connection.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
