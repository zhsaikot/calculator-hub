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
    <div className="mt-12 space-y-8">
      {/* Formula & Explanation */}
      <GlassCard className="p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-xl">{formulaTitle}</h2>
        </div>

        <p className="text-sm md:text-base leading-relaxed text-slate-300 [data-theme='light']:text-slate-600 mb-5">
          {formulaDesc}
        </p>

        {formulaMath && (
          <div className="p-4 my-4 rounded-xl bg-white/[0.03] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-200 font-mono text-sm md:text-base text-indigo-300 [data-theme='light']:text-indigo-700 overflow-x-auto text-center font-bold tracking-wide">
            {formulaMath}
          </div>
        )}

        <div className="mt-5">
          <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-slate-400 [data-theme='light']:text-slate-600 mb-3">
            Key Steps & How It Works:
          </h3>
          <ul className="space-y-2">
            {howItWorks.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 [data-theme='light']:text-slate-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center mt-0.5">
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
        <GlassCard className="p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-xl">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-white/10 [data-theme='light']:divide-slate-200">
            {faqs.map((faq, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <h3 className="font-semibold text-base mb-2 text-white [data-theme='light']:text-slate-900">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400 [data-theme='light']:text-slate-600">
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
