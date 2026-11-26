import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import {
  calculateCompoundInterest,
  CompoundInterestResult,
  CompoundingFrequency,
} from '../../lib/calculators/compoundInterest';
import { useHistory } from '../../context/HistoryContext';
import { Table } from 'lucide-react';

interface CompoundInterestCalculatorProps {
  onBack: () => void;
  onShare: () => void;
  initialPrincipal?: number;
  initialRate?: number;
  initialYears?: number;
  initialDeposit?: number;
  initialFrequency?: CompoundingFrequency;
}

export const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({
  onBack,
  onShare,
  initialPrincipal = 5000,
  initialRate = 8,
  initialYears = 10,
  initialDeposit = 200,
  initialFrequency = 'monthly',
}) => {
  const { addHistory } = useHistory();
  const [principal, setPrincipal] = useState<number | ''>(initialPrincipal);
  const [rate, setRate] = useState<number | ''>(initialRate);
  const [years, setYears] = useState<number | ''>(initialYears);
  const [deposit, setDeposit] = useState<number | ''>(initialDeposit);
  const [frequency, setFrequency] = useState<CompoundingFrequency>(initialFrequency);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (principal !== '' && rate !== '' && years !== '') {
      const res = calculateCompoundInterest(
        Number(principal),
        Number(rate),
        Number(years),
        Number(deposit || 0),
        frequency
      );
      if (!('error' in res)) {
        setResult(res);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [principal, rate, years, deposit, frequency]);

  const handleSave = () => {
    if (result) {
      addHistory({
        calculatorId: 'compound-interest',
        calculatorTitle: 'Compound Interest',
        summary: `$${principal} @ ${rate}%, +$${deposit}/mo for ${years} yrs`,
        result: `Final Balance: $${result.finalBalance.toLocaleString()} (Interest: $${result.totalInterest.toLocaleString()})`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="Compound Interest Calculator"
      subtitle="Project long-term investment growth, recurring deposits, and compound earnings"
      badge="Growth"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Initial Principal ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 5000"
            value={principal}
            onChange={e => setPrincipal(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Estimated Annual Return (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g. 8"
            value={rate}
            onChange={e => setRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Time Horizon (Years)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            placeholder="e.g. 10"
            value={years}
            onChange={e => setYears(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Monthly Contribution ($)
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 200"
            value={deposit}
            onChange={e => setDeposit(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Compounding Frequency
          </label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as CompoundingFrequency)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          >
            <option value="annually">Annually (1x / year)</option>
            <option value="semi-annually">Semi-Annually (2x / year)</option>
            <option value="quarterly">Quarterly (4x / year)</option>
            <option value="monthly">Monthly (12x / year)</option>
            <option value="daily">Daily (365x / year)</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Future Balance</span>
              <button
                onClick={handleSave}
                className="text-[11px] font-medium px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                Save Result
              </button>
            </div>

            <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-zinc-100">
              ${result.finalBalance.toLocaleString()}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-5">
              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Total Deposits</div>
                <div className="text-xs sm:text-sm font-semibold font-display text-slate-900 dark:text-zinc-100 mt-0.5">
                  ${result.totalDeposits.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Total Interest Earned</div>
                <div className="text-xs sm:text-sm font-semibold font-display text-emerald-400 mt-0.5">
                  +${result.totalInterest.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Interest Share</div>
                <div className="text-xs sm:text-sm font-semibold font-display text-blue-500 mt-0.5">
                  {Math.round((result.totalInterest / result.finalBalance) * 100)}% of total
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold transition-all"
          >
            <Table className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {showTable ? 'Hide Yearly Breakdown' : 'View Year-by-Year Growth Table'}
          </button>

          {showTable && (
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-zinc-800/80 sticky top-0 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase">
                    <tr>
                      <th className="p-3">Year</th>
                      <th className="p-3">Starting</th>
                      <th className="p-3">Deposits</th>
                      <th className="p-3">Interest</th>
                      <th className="p-3">Ending Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                    {result.schedule.map(row => (
                      <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-zinc-850/50">
                        <td className="p-3 font-semibold text-slate-500 dark:text-zinc-400">{row.year}</td>
                        <td className="p-3 text-slate-700 dark:text-zinc-300">${row.startingBalance.toLocaleString()}</td>
                        <td className="p-3 text-slate-700 dark:text-zinc-300">${row.deposits.toLocaleString()}</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">+${row.interestEarned.toLocaleString()}</td>
                        <td className="p-3 font-bold font-mono text-slate-900 dark:text-zinc-100">${row.endingBalance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <CalculatorSEO
        formulaTitle="The Power of Compound Interest"
        formulaDesc="Compound interest earns return not only on the initial principal deposited, but also on all accumulated interest from prior compounding periods."
        formulaMath="A = P × (1 + r/n)^(n×t)"
        howItWorks={[
          'P = Initial starting balance.',
          'r = Annual interest rate in decimal form.',
          'n = Number of times interest compounds per year.',
          't = Total number of years the money is invested.',
        ]}
        faqs={[
          {
            question: 'Why does compound frequency matter?',
            answer: 'More frequent compounding (e.g. daily or monthly vs annually) allows earned interest to start earning its own interest sooner, yielding a higher final return.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
