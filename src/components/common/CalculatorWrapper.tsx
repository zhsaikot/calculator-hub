import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
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
    <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-up">
      {/* Top action header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900/50 text-xs font-semibold text-blue-600 dark:text-blue-400 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Title & Badge */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-zinc-100 tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>

      {/* Calculator Body Container */}
      <GlassCard className="p-4 sm:p-6 md:p-8">
        {children}
      </GlassCard>
    </div>
  );
};
