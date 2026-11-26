import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { calculateDiscount, DiscountResult } from '../../lib/calculators/discount';
import { useHistory } from '../../context/HistoryContext';

interface DiscountCalculatorProps {
  onBack: () => void;
  onShare: () => void;
  initialPrice?: number;
  initialDiscount?: number;
  initialTax?: number;
}

export const DiscountCalculator: React.FC<DiscountCalculatorProps> = ({
  onBack,
  onShare,
  initialPrice = 120,
  initialDiscount = 25,
  initialTax = 7,
}) => {
  const { addHistory } = useHistory();
  const [price, setPrice] = useState<number | ''>(initialPrice);
  const [discount, setDiscount] = useState<number | ''>(initialDiscount);
  const [tax, setTax] = useState<number | ''>(initialTax);
  const [result, setResult] = useState<DiscountResult | null>(null);

  useEffect(() => {
    if (price !== '' && discount !== '') {
      const res = calculateDiscount(Number(price), Number(discount), Number(tax || 0));
      if (!('error' in res)) {
        setResult(res);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [price, discount, tax]);

  const handleSave = () => {
    if (result) {
      addHistory({
        calculatorId: 'discount',
        calculatorTitle: 'Discount Calculator',
        summary: `$${price} with ${discount}% off`,
        result: `Final Price: $${result.finalPrice} (Saved: $${result.totalSaved})`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="Discount & Sale Calculator"
      subtitle="Calculate shopping markdowns, sale savings, and final price including sales tax"
      badge="Shopping"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Original Price ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 120"
            value={price}
            onChange={e => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 25"
            value={discount}
            onChange={e => setDiscount(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Sales Tax (%)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 7"
            value={tax}
            onChange={e => setTax(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-sky-900/20 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Final Price to Pay</span>
            <button
              onClick={handleSave}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
            >
              Save Result
            </button>
          </div>

          <div className="text-3xl md:text-4xl font-display font-extrabold text-white [data-theme='light']:text-slate-900">
            ${result.finalPrice}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Money Saved</div>
              <div className="text-sm font-bold font-display text-emerald-400 mt-0.5">
                ${result.totalSaved}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Discounted Price</div>
              <div className="text-sm font-bold font-display text-white [data-theme='light']:text-slate-900 mt-0.5">
                ${result.discountedPrice}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Sales Tax</div>
              <div className="text-sm font-bold font-display text-amber-400 mt-0.5">
                ${result.taxAmount}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Effective Discount</div>
              <div className="text-sm font-bold font-display text-indigo-400 mt-0.5">
                {Math.round(((result.originalPrice - result.finalPrice) / result.originalPrice) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      <CalculatorSEO
        formulaTitle="Discount & Sales Tax Calculation"
        formulaDesc="Discounts reduce the retail sticker price before local sales taxes or shipping fees are assessed."
        formulaMath="Discount Amount = Original Price × (Discount % ÷ 100) | Final Price = (Original Price - Discount Amount) × (1 + Tax % ÷ 100)"
        howItWorks={[
          'Enter original retail tag price.',
          'Specify the promotional discount percentage.',
          'Optionally include sales tax percentage for exact register total.',
        ]}
        faqs={[
          {
            question: 'Is tax calculated before or after discount?',
            answer: 'In most jurisdictions, sales tax is applied to the discounted sale price rather than the original manufacturer price.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
