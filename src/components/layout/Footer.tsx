import React from 'react';
import { CALCULATORS_REGISTRY } from '../../lib/calculators/registry';
import { CalculatorId } from '../../lib/calculators/types';
import { Calculator, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onSelectCalculator: (id: CalculatorId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCalculator }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Calculator className="w-3.5 h-3.5" />
              </div>
              <span>CalcHub</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              CalcHub provides fast, reliable, ad-free online calculation tools for financial planning, scientific math, and health metrics. 100% private in your browser.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 pt-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-blue-500" /> Precision Math
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Quick Calculators */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-300 mb-2.5">
              Popular Tools
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              {CALCULATORS_REGISTRY.slice(0, 5).map(calc => (
                <li key={calc.id}>
                  <button
                    onClick={() => onSelectCalculator(calc.id)}
                    className="hover:text-blue-500 transition-colors"
                  >
                    {calc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools & About */}
          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-300 mb-2.5">
              Finance & Utilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              {CALCULATORS_REGISTRY.slice(5).map(calc => (
                <li key={calc.id}>
                  <button
                    onClick={() => onSelectCalculator(calc.id)}
                    className="hover:text-blue-500 transition-colors"
                  >
                    {calc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
          <p>© {new Date().getFullYear()} CalcHub. All rights reserved.</p>
          <p className="text-[11px] text-zinc-600">Fast, minimal & client-side.</p>
        </div>
      </div>
    </footer>
  );
};
