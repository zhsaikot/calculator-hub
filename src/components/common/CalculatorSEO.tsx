import React from 'react';
import { GlassCard } from './GlassCard';
import { HelpCircle, BookOpen } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface CalculatorSEOProps {
  formulaTitle: string;
  formulaDesc: string;
  formulaMath?: string;
  howItWorks: string[];
  faqs: FaqItem[];
}

export const CalculatorSEO: React.FC<CalculatorSEOProps> = ({
  formulaTitle,
  formulaDesc,
  formulaMath,
  howItWorks,
  faqs,
}) => {
  return (
    <div className="mt-8 space-y-6">
      {/* Formula & Explanation */}
      <GlassCard className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="font-display font-semibold text-lg text-zinc-100 [data-theme='light']:text-slate-900">{formulaTitle}</h2>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 [data-theme='light']:text-slate-600 mb-4">
          {formulaDesc}
        </p>

        {formulaMath && (
          <div className="p-3 my-3 rounded-lg bg-zinc-800/60 [data-theme='light']:bg-slate-100 border border-zinc-800 [data-theme='light']:border-slate-200 font-mono text-xs sm:text-sm text-zinc-200 [data-theme='light']:text-slate-800 overflow-x-auto text-center font-medium">
            {formulaMath}
          </div>
        )}

        <div className="mt-4">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-zinc-500 [data-theme='light']:text-slate-500 mb-2.5">
            How It Works
          </h3>
          <ul className="space-y-1.5">
            {howItWorks.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300 [data-theme='light']:text-slate-700">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-zinc-800 [data-theme='light']:bg-slate-200 text-zinc-300 [data-theme='light']:text-slate-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <GlassCard className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="font-display font-semibold text-lg text-zinc-100 [data-theme='light']:text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-zinc-800 [data-theme='light']:divide-slate-200">
            {faqs.map((faq, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0">
                <h3 className="font-medium text-xs sm:text-sm mb-1 text-zinc-200 [data-theme='light']:text-slate-900">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 [data-theme='light']:text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
