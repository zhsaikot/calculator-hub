import React, { useState } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { calculatePercentage, PercentageTypes } from '../../lib/calculators/percentage';
import { useHistory } from '../../context/HistoryContext';

interface PercentageCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const PercentageCalculator: React.FC<PercentageCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();

  // 6 percentage calculations states
  const [p1, setP1] = useState<{ x: number | ''; y: number | '' }>({ x: 20, y: 500 });
  const [p2, setP2] = useState<{ x: number | ''; y: number | '' }>({ x: 45, y: 300 });
  const [p3, setP3] = useState<{ x: number | ''; y: number | '' }>({ x: 80, y: 100 });
  const [p4, setP4] = useState<{ x: number | ''; y: number | '' }>({ x: 500, y: 20 });
  const [p5, setP5] = useState<{ x: number | ''; y: number | '' }>({ x: 500, y: 15 });
  const [p6, setP6] = useState<{ x: number | ''; y: number | '' }>({ x: 25, y: 75 });

  const getAns = (type: number, x: number | '', y: number | ''): string => {
    if (x === '' || y === '') return '—';
    const res = calculatePercentage(type, Number(x), Number(y));
    if (typeof res === 'object') return res.error;
    return String(res);
  };

  const handleSave = (title: string, summary: string, res: string) => {
    addHistory({
      calculatorId: 'percentage',
      calculatorTitle: 'Percentage Calculator',
      summary: `${title}: ${summary}`,
      result: res,
    });
  };

  return (
    <CalculatorWrapper
      title="Percentage Calculator"
      subtitle="6 versatile percentage calculators for everyday math, finance, and discounts"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: What is X% of Y? */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="font-display font-bold text-sm mb-3 text-slate-900 dark:text-zinc-100">What is X% of Y?</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="X (%)"
              value={p1.x}
              onChange={e => setP1({ ...p1, x: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Y (Value)"
              value={p1.y}
              onChange={e => setP1({ ...p1, y: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Result:</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">
                {getAns(PercentageTypes.WHAT_IS_X_PCT_OF_Y, p1.x, p1.y)}
              </span>
              <button
                onClick={() => handleSave('What is X% of Y?', `${p1.x}% of ${p1.y}`, getAns(PercentageTypes.WHAT_IS_X_PCT_OF_Y, p1.x, p1.y))}
                className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="font-display font-bold text-sm mb-3 text-slate-900 dark:text-zinc-100">X is what % of Y?</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="X (Value)"
              value={p2.x}
              onChange={e => setP2({ ...p2, x: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Y (Total)"
              value={p2.y}
              onChange={e => setP2({ ...p2, y: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Percentage:</span>
            <span className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">
              {getAns(PercentageTypes.X_IS_WHAT_PCT_OF_Y, p2.x, p2.y)}%
            </span>
          </div>
        </div>

        {/* Card 3: % Change from X to Y */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="font-display font-bold text-sm mb-3 text-slate-900 dark:text-zinc-100">% Change (From X to Y)</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="From (X)"
              value={p3.x}
              onChange={e => setP3({ ...p3, x: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="To (Y)"
              value={p3.y}
              onChange={e => setP3({ ...p3, y: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Change:</span>
            <span className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">
              {getAns(PercentageTypes.PCT_CHANGE_X_TO_Y, p3.x, p3.y)}%
            </span>
          </div>
        </div>

        {/* Card 4: Increase X by Y% */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="font-display font-bold text-sm mb-3 text-slate-900 dark:text-zinc-100">Increase X by Y%</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="Original (X)"
              value={p4.x}
              onChange={e => setP4({ ...p4, x: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Increase (%)"
              value={p4.y}
              onChange={e => setP4({ ...p4, y: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Increased Value:</span>
            <span className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">
              {getAns(PercentageTypes.INCREASE_X_BY_Y_PCT, p4.x, p4.y)}
            </span>
          </div>
        </div>

        {/* Card 5: Decrease X by Y% */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="font-display font-bold text-sm mb-3 text-slate-900 dark:text-zinc-100">Decrease X by Y%</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="Original (X)"
              value={p5.x}
              onChange={e => setP5({ ...p5, x: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Decrease (%)"
              value={p5.y}
              onChange={e => setP5({ ...p5, y: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Decreased Value:</span>
            <span className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">
              {getAns(PercentageTypes.DECREASE_X_BY_Y_PCT, p5.x, p5.y)}
            </span>
          </div>
        </div>

        {/* Card 6: X% of what is Y? */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="font-display font-bold text-sm mb-3 text-slate-900 dark:text-zinc-100">X% of what number is Y?</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="Percentage (X)"
              value={p6.x}
              onChange={e => setP6({ ...p6, x: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Result (Y)"
              value={p6.y}
              onChange={e => setP6({ ...p6, y: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Whole Number:</span>
            <span className="font-display font-bold text-lg text-blue-600 dark:text-blue-400">
              {getAns(PercentageTypes.X_PCT_OF_WHAT_IS_Y, p6.x, p6.y)}
            </span>
          </div>
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="Percentage Formulas & Methods"
        formulaDesc="Percentages describe proportions per 100 parts. Common uses include calculating tips, markdowns, sales tax, and market change."
        howItWorks={[
          'What is X% of Y? Formula: (X ÷ 100) × Y',
          'Percentage Change: [(Y - X) ÷ |X|] × 100%',
          'Percentage Increase/Decrease: X × (1 ± Y ÷ 100)',
        ]}
        faqs={[
          {
            question: 'Can percentage change be negative?',
            answer: 'Yes! When the new value (Y) is smaller than the original value (X), the change percentage is negative, indicating a decrease.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
