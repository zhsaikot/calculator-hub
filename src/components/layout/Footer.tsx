import React from 'react';
import { CALCULATORS_REGISTRY } from '../../lib/calculators/registry';
import { CalculatorId } from '../../lib/calculators/types';
import { Calculator, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onSelectCalculator: (id: CalculatorId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCalculator }) => {
  return (
    <footer className="mt-20 border-t border-white/10 [data-theme='light']:border-slate-200 bg-slate-950/40 [data-theme='light']:bg-slate-50 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-display text-xl font-bold">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white">
                <Calculator className="w-4 h-4" />
              </div>
              <span>CalcHub</span>
            </div>
            <p className="text-sm text-slate-400 [data-theme='light']:text-slate-600 max-w-sm leading-relaxed">
              CalcHub provides precision, ad-free online calculation tools for financial planning, scientific computation, health tracking, and everyday math. Fast, modern, and open-source.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> High Precision Math
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Quick Calculators */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 [data-theme='light']:text-slate-800 mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 [data-theme='light']:text-slate-600">
              {CALCULATORS_REGISTRY.slice(0, 5).map(calc => (
                <li key={calc.id}>
                  <button
                    onClick={() => onSelectCalculator(calc.id)}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {calc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools & About */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-300 [data-theme='light']:text-slate-800 mb-3">
              Finance & Utilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 [data-theme='light']:text-slate-600">
              {CALCULATORS_REGISTRY.slice(5).map(calc => (
                <li key={calc.id}>
                  <button
                    onClick={() => onSelectCalculator(calc.id)}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {calc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 [data-theme='light']:border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CalcHub. Built for precision & high performance.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/zhsaikot/calculator-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              GitHub Repository
            </a>
            <a
              href="https://github.com/zhsaikot/calculator-hub/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              MIT License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
