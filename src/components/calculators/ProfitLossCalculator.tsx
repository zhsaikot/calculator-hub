import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { calculateProfitLoss, ProfitLossResult } from '../../lib/calculators/profitLoss';
import { useHistory } from '../../context/HistoryContext';

interface ProfitLossCalculatorProps {
  onBack: () => void;
  onShare: () => void;
  initialCP?: number;
  initialSP?: number;
  initialQty?: number;
  initialOverhead?: number;
}

export const ProfitLossCalculator: React.FC<ProfitLossCalculatorProps> = ({
  onBack,
  onShare,
  initialCP = 800,
  initialSP = 1000,
  initialQty = 50,
  initialOverhead = 200,
}) => {
  const { addHistory } = useHistory();
  const [costPrice, setCostPrice] = useState<number | ''>(initialCP);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(initialSP);
  const [quantity, setQuantity] = useState<number | ''>(initialQty);
  const [overhead, setOverhead] = useState<number | ''>(initialOverhead);
  const [result, setResult] = useState<ProfitLossResult | null>(null);

  useEffect(() => {
    if (costPrice !== '' && sellingPrice !== '') {
      const res = calculateProfitLoss(
        Number(costPrice),
        Number(sellingPrice),
        Number(quantity || 1),
        Number(overhead || 0)
      );
      if (!('error' in res)) {
        setResult(res);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [costPrice, sellingPrice, quantity, overhead]);

  const handleSave = () => {
    if (result) {
      addHistory({
        calculatorId: 'profit-loss',
        calculatorTitle: 'Profit & Loss',
        summary: `CP: ${costPrice}, SP: ${sellingPrice}, Qty: ${quantity}`,
        result: `${result.isProfit ? 'Profit' : 'Loss'}: $${result.profitLossAmount.toLocaleString()} (${result.profitMarginPercentage}%)`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="Profit & Loss Calculator"
      subtitle="Analyze business sales, cost price, revenue, margins, and markup percentages"
      badge="Business"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Cost Price (per unit)
          </label>
          <input
            type="number"
            min="0.01"
            placeholder="e.g. 800"
            value={costPrice}
            onChange={e => setCostPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Selling Price (per unit)
          </label>
          <input
            type="number"
            min="0.01"
            placeholder="e.g. 1000"
            value={sellingPrice}
            onChange={e => setSellingPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Quantity Sold
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 50"
            value={quantity}
            onChange={e => setQuantity(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Overhead / Shipping
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 200"
            value={overhead}
            onChange={e => setOverhead(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-sky-900/20 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Net {result.isProfit ? 'Profit' : 'Loss'} Outcome
            </span>
            <button
              onClick={handleSave}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
            >
              Save Result
            </button>
          </div>

          <div
            className={`text-3xl md:text-4xl font-display font-extrabold ${
              result.isProfit ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {result.isProfit ? '+' : ''}${result.profitLossAmount.toLocaleString()}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Revenue</div>
              <div className="text-sm font-bold font-display text-white [data-theme='light']:text-slate-900 mt-0.5">
                ${result.revenue.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Cost (COGS)</div>
              <div className="text-sm font-bold font-display text-white [data-theme='light']:text-slate-900 mt-0.5">
                ${result.totalCost.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Profit Margin</div>
              <div className="text-sm font-bold font-display text-indigo-400 mt-0.5">
                {result.profitMarginPercentage}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Markup on Cost</div>
              <div className="text-sm font-bold font-display text-indigo-400 mt-0.5">
                {result.profitLossPercentage}%
              </div>
            </div>
          </div>
        </div>
      )}

      <CalculatorSEO
        formulaTitle="Profit Margin & Markup Formulas"
        formulaDesc="Profit margin represents the percentage of selling price that turns into profit, whereas Markup is the percentage added on top of your unit cost price."
        formulaMath="Profit = Revenue - Total Cost | Margin % = (Profit / Revenue) × 100 | Markup % = (Profit / Cost) × 100"
        howItWorks={[
          'Enter unit Cost Price (CP) and Selling Price (SP).',
          'Include inventory quantity and any operational overheads.',
          'Review total revenue, total costs, net profit, and gross profit margin.',
        ]}
        faqs={[
          {
            question: 'What is the difference between Margin and Markup?',
            answer: 'Margin is calculated based on Revenue, while Markup is calculated based on Cost. A 100% markup on a $50 cost results in a $100 selling price, which is a 50% profit margin.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
