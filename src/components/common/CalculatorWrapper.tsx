import React from 'react';
import { ArrowLeft, Share2, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface CalculatorWrapperProps {
  title: string;
  subtitle: string;
  badge?: string;
  onBack: () => void;
  onShare: () => void;
  children: React.ReactNode;
}

export const CalculatorWrapper: React.FC<CalculatorWrapperProps> = ({
  title,
  subtitle,
  badge,
  onBack,
  onShare,
  children,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Top action header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 [data-theme='light']:bg-slate-100 hover:bg-white/10 [data-theme='light']:hover:bg-slate-200 border border-white/10 [data-theme='light']:border-slate-200 text-xs font-semibold text-slate-300 [data-theme='light']:text-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold text-indigo-400 transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Title & Badge */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white [data-theme='light']:text-slate-900 tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 text-indigo-300">
              <Sparkles className="w-2.5 h-2.5" /> {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-400 [data-theme='light']:text-slate-600">
          {subtitle}
        </p>
      </div>

      {/* Calculator Body Container */}
      <GlassCard className="p-6 md:p-8">
        {children}
      </GlassCard>
    </div>
  );
};
