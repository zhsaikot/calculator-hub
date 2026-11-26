import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { calculateIncomeTax, TaxResult } from '../../lib/calculators/tax';
import { useHistory } from '../../context/HistoryContext';

interface TaxCalculatorProps {
  onBack: () => void;
  onShare: () => void;
  initialIncome?: number;
  initialRate?: number;
  initialDeductions?: number;
  initialCurrency?: string;
}

export const TaxCalculator: React.FC<TaxCalculatorProps> = ({
  onBack,
  onShare,
  initialIncome = 60000,
  initialRate = 20,
  initialDeductions = 5000,
  initialCurrency = '$',
}) => {
  const { addHistory } = useHistory();
  const [income, setIncome] = useState<number | ''>(initialIncome);
  const [rate, setRate] = useState<number | ''>(initialRate);
  const [deductions, setDeductions] = useState<number | ''>(initialDeductions);
  const [currency, setCurrency] = useState(initialCurrency);
  const [result, setResult] = useState<TaxResult | null>(null);

  useEffect(() => {
    if (income !== '' && rate !== '') {
      const res = calculateIncomeTax(
        Number(income),
        Number(rate),
        Number(deductions || 0),
        currency
      );
      if (!('error' in res)) {
        setResult(res);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [income, rate, deductions, currency]);

  const handleSave = () => {
    if (result) {
      addHistory({
        calculatorId: 'tax',
        calculatorTitle: 'Tax Calculator',
        summary: `Gross: ${currency}${result.grossIncome.toLocaleString()} @ ${rate}%`,
        result: `Net: ${currency}${result.netIncome.toLocaleString()} (Tax: ${currency}${result.taxAmount.toLocaleString()})`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="Income Tax Calculator"
      subtitle="Calculate net income, tax payable, deductions, and effective tax rates"
      badge="Finance"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Gross Income
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 60000"
            value={income}
            onChange={e => setIncome(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Tax Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 20"
            value={rate}
            onChange={e => setRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Deductions
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 5000"
            value={deductions}
            onChange={e => setDeductions(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Currency
          </label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          >
            <option value="$">$ USD</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
            <option value="৳">৳ BDT</option>
            <option value="₹">₹ INR</option>
            <option value="¥">¥ JPY</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-sky-900/20 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Net Take-Home Pay</span>
            <button
              onClick={handleSave}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
            >
              Save to History
            </button>
          </div>

          <div className="text-3xl md:text-4xl font-display font-extrabold text-white [data-theme='light']:text-slate-900">
            {currency}{result.netIncome.toLocaleString()}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Taxable Income</div>
              <div className="text-sm font-bold font-display text-white [data-theme='light']:text-slate-900 mt-0.5">
                {currency}{result.taxableIncome.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Tax Amount</div>
              <div className="text-sm font-bold font-display text-rose-400 mt-0.5">
                {currency}{result.taxAmount.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Effective Rate</div>
              <div className="text-sm font-bold font-display text-amber-400 mt-0.5">
                {result.effectiveRate}%
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Deductions Saved</div>
              <div className="text-sm font-bold font-display text-emerald-400 mt-0.5">
                {currency}{result.deductions.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <CalculatorSEO
        formulaTitle="Income Tax Calculation Formula"
        formulaDesc="Income tax is calculated on your adjusted gross income after deducting allowable expenses, retirement contributions, or tax credits."
        formulaMath="Taxable Income = Gross Income - Allowable Deductions | Net Income = Gross Income - (Taxable Income × Tax Rate)"
        howItWorks={[
          'Enter your total annual or monthly gross earnings.',
          'Specify your estimated marginal tax rate.',
          'Subtract tax-exempt allowances or deductions to view your final take-home salary and effective tax rate.',
        ]}
        faqs={[
          {
            question: 'What is the difference between Marginal and Effective tax rate?',
            answer: 'Your marginal tax rate is the percentage applied to your highest tax bracket. Your effective tax rate is the actual percentage of your total income paid in taxes (Total Tax ÷ Gross Income).',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
