import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { calculateLoan, exportScheduleToCsv, LoanResult } from '../../lib/calculators/loan';
import { useHistory } from '../../context/HistoryContext';
import { Download, Table } from 'lucide-react';

interface LoanCalculatorProps {
  onBack: () => void;
  onShare: () => void;
  initialAmount?: number;
  initialRate?: number;
  initialTerm?: number;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  onBack,
  onShare,
  initialAmount = 500000,
  initialRate = 8.5,
  initialTerm = 5,
}) => {
  const { addHistory } = useHistory();
  const [amount, setAmount] = useState<number | ''>(initialAmount);
  const [rate, setRate] = useState<number | ''>(initialRate);
  const [term, setTerm] = useState<number | ''>(initialTerm);
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    if (amount !== '' && rate !== '' && term !== '') {
      const res = calculateLoan(Number(amount), Number(rate), Number(term));
      if (!('error' in res)) {
        setResult(res);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [amount, rate, term]);

  const handleDownloadCsv = () => {
    if (!result) return;
    const csvContent = exportScheduleToCsv(result.schedule);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Loan_Amortization_Schedule_${amount}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = () => {
    if (result) {
      addHistory({
        calculatorId: 'loan-emi',
        calculatorTitle: 'Loan / EMI Calculator',
        summary: `$${amount} @ ${rate}% for ${term} yrs`,
        result: `EMI: $${result.monthlyEmi.toLocaleString()}/mo (Total: $${result.totalPayment.toLocaleString()})`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="Loan / EMI Calculator"
      subtitle="Monthly installment calculations with complete amortization schedule & CSV export"
      badge="Popular"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Loan Principal Amount
          </label>
          <input
            type="number"
            min="100"
            placeholder="e.g. 500000"
            value={amount}
            onChange={e => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g. 8.5"
            value={rate}
            onChange={e => setRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Loan Term (Years)
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            placeholder="e.g. 5"
            value={term}
            onChange={e => setTerm(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Monthly EMI Payment</span>
              <button
                onClick={handleSave}
                className="text-[11px] font-medium px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                Save Result
              </button>
            </div>

            <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-zinc-100">
              ${result.monthlyEmi.toLocaleString()} <span className="text-xs sm:text-sm font-normal text-zinc-400">/ month</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5">
              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Total Payment</div>
                <div className="text-xs sm:text-sm font-semibold font-display text-slate-900 dark:text-zinc-100 mt-0.5">
                  ${result.totalPayment.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Total Interest</div>
                <div className="text-xs sm:text-sm font-semibold font-display text-rose-400 mt-0.5">
                  ${result.totalInterest.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Principal Borrowed</div>
                <div className="text-xs sm:text-sm font-semibold font-display text-slate-900 dark:text-zinc-100 mt-0.5">
                  ${result.totalPrincipal.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-medium">Interest to Loan %</div>
                <div className="text-xs sm:text-sm font-semibold font-display text-amber-400 mt-0.5">
                  {result.interestRatioPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Schedule Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-850 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-semibold transition-all"
            >
              <Table className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {showSchedule ? 'Hide Schedule' : 'View Monthly Amortization Table'}
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-4 h-4" /> Download CSV
            </button>
          </div>

          {/* Amortization Table */}
          {showSchedule && (
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-zinc-850 sticky top-0 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3">EMI</th>
                      <th className="p-3">Principal</th>
                      <th className="p-3">Interest</th>
                      <th className="p-3">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                    {result.schedule.map(row => (
                      <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-zinc-850/50">
                        <td className="p-3 font-semibold text-slate-400">{row.month}</td>
                        <td className="p-3 font-medium text-slate-900 dark:text-zinc-100">${row.emi.toLocaleString()}</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">${row.principalPayment.toLocaleString()}</td>
                        <td className="p-3 text-rose-600 dark:text-rose-400 font-medium">${row.interestPayment.toLocaleString()}</td>
                        <td className="p-3 font-mono text-slate-500 dark:text-zinc-400">${row.remainingBalance.toLocaleString()}</td>
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
        formulaTitle="Standard Equated Monthly Installment (EMI) Formula"
        formulaDesc="Monthly loan installments are calculated using the reducing balance compound interest formula standard across global banking institutions."
        formulaMath="EMI = [P × r × (1 + r)ⁿ] / [(1 + r)ⁿ - 1]"
        howItWorks={[
          'P = Principal loan amount borrowed.',
          'r = Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100).',
          'n = Number of monthly payment periods (Loan Term in Years × 12).',
        ]}
        faqs={[
          {
            question: 'Can I export the amortization schedule?',
            answer: 'Yes! Click "Download CSV" to download the complete monthly payment breakdown for Excel, Google Sheets, or financial records.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
