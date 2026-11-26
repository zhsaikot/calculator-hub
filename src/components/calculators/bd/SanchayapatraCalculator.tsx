import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorSEO } from '../../common/CalculatorSEO';
import { useHistory } from '../../../context/HistoryContext';
import {
  calculateSanchayapatraProfit,
  SANCHAYAPATRA_SCHEMES,
  SanchayapatraSchemeId,
} from '../../../lib/calculators/bd/sanchayapatra';
import { HelpCircle } from 'lucide-react';

interface SanchayapatraCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const SanchayapatraCalculator: React.FC<SanchayapatraCalculatorProps> = ({
  onBack,
  onShare,
}) => {
  const { addHistory } = useHistory();

  const [schemeId, setSchemeId] = useState<SanchayapatraSchemeId>('paribar');
  const [amount, setAmount] = useState<number>(1000000); // 10 Lakh
  const [hasTin, setHasTin] = useState<boolean>(true);

  const result = calculateSanchayapatraProfit(schemeId, amount, hasTin);

  const handleSaveCalculation = () => {
    addHistory({
      calculatorId: 'bd-sanchayapatra',
      calculatorTitle: 'Sanchayapatra Profit (সঞ্চয়পত্র)',
      summary: `${result.scheme.banglaName} ৳${amount.toLocaleString()}`,
      result: `${result.scheme.payoutName}: ৳${result.netPeriodicProfit.toLocaleString()} (Net Annual: ৳${result.netAnnualProfit.toLocaleString()})`,
    });
  };

  return (
    <CalculatorWrapper
      title="Sanchayapatra Profit Calculator (জাতীয় সঞ্চয়পত্র)"
      subtitle="পরিবার, ৩-মাস অন্তর, পেনশনার ও বাংলাদেশ সঞ্চয়পত্রের নিট মুনাফা ও ১০%/৫% উৎস কর (TDS) হিসাব"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scheme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Savings Certificate Scheme (সঞ্চয়পত্র স্কিম)
              </label>
              <select
                value={schemeId}
                onChange={e => setSchemeId(e.target.value as SanchayapatraSchemeId)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none"
              >
                {Object.values(SANCHAYAPATRA_SCHEMES).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.banglaName}
                  </option>
                ))}
              </select>
            </div>

            {/* Investment Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Investment Amount (বিনিয়োগের পরিমাণ - টাকা)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  max={result.scheme.maxLimit}
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>

              {/* Amount Chips */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {[200000, 500000, 1000000, 1500000, 3000000].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                      amount === val
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
                    }`}
                  >
                    ৳{val / 100000} লাখ
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasTin}
                onChange={e => setHasTin(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              <span className="text-xs text-slate-700 dark:text-zinc-300">
                TIN Certificate Holder (ই-টিন সার্টিফিকেট আছে)
              </span>
            </label>

            <button
              onClick={handleSaveCalculation}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
            >
              Save Result
            </button>
          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              {result.scheme.payoutName} (Net In-Hand)
            </span>
            <div className="mt-2 font-display font-extrabold text-3xl text-slate-900 dark:text-zinc-100">
              ৳{result.netPeriodicProfit.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-600 dark:text-zinc-400">
              {result.tdsRatePct}% সোর্স ট্যাক্স বাদ দিয়ে ব্যাংকে জমা
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Net Annual Profit (বাৎসরিক নিট আয়)
            </span>
            <div className="mt-2 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
              ৳{result.netAnnualProfit.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">
              গ্রস বার্ষিক মুনাফা: ৳{result.grossAnnualProfit.toLocaleString()}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total {result.scheme.termYears}-Year Return
            </span>
            <div className="mt-2 font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
              ৳{result.totalTermNetProfit.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">
              মোট কর্তনকৃত কর: -৳{result.totalTermTds.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Scheme Tier Rates Card */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/60 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200 mb-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>স্ল্যাব অনুযায়ী মুনাফার হার (বর্তমান জাতীয় সঞ্চয় অধিদপ্তর নীতিমালা):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600 dark:text-zinc-400">
            <div>• প্রথম ১৫ লাখ টাকা পর্যন্ত: <strong className="text-slate-900 dark:text-zinc-100">{result.scheme.rates.tier1}%</strong></div>
            <div>• ১৫ লাখ থেকে ৩০ লাখ টাকা: <strong className="text-slate-900 dark:text-zinc-100">{result.scheme.rates.tier2}%</strong></div>
            <div>• ৩০ লাখ টাকার ঊর্ধ্বে: <strong className="text-slate-900 dark:text-zinc-100">{result.scheme.rates.tier3}%</strong></div>
          </div>
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="জাতীয় সঞ্চয়পত্র মুনাফার হার ও উৎস কর (TDS) বিধিমালা"
        formulaDesc="বাংলাদেশ ব্যাংক ও জাতীয় সঞ্চয় অধিদপ্তরের সর্বশেষ সার্কুলার অনুযায়ী বিভিন্ন স্কিমের মুনাফা ও ট্যাক্স কর্তনের নিয়মাবলী।"
        howItWorks={[
          'পরিবার সঞ্চয়পত্র: শুধুমাত্র ১৮ বছর বা তদূর্ধ্ব নারী, শারীরিক প্রতিবন্ধী বা ৬৫+ বয়স্ক পুরুষ ক্রয় করতে পারেন। সর্বোচ্চ সীমা একক নামে ৪৫ লাখ টাকা। প্রতি মাসে নিট মুনাফা ব্যাংক একাউন্টে জমা হয়।',
          '৩ মাস অন্তর মুনাফাভিত্তিক: যে কোনো বাংলাদেশি নাগরিক ক্রয় করতে পারেন। প্রতি তিন মাস পর পর মুনাফা প্রদেয়।',
          'পেনশনার সঞ্চয়পত্র: অবসরপ্রাপ্ত সরকারি, আধা-সরকারি ও স্বায়ত্তশাসিত প্রতিষ্ঠানের কর্মচারীদের জন্য নির্ধারিত। সর্বোচ্চ সীমা ৫০ লাখ টাকা।',
          'উৎস কর (TDS): মোট সঞ্চয়পত্র বিনিয়োগ ৫ লাখ টাকা পর্যন্ত হলে ৫% হারে এবং ৫ লাখ টাকার বেশি হলে ১০% হারে মুনাফা থেকে স্বয়ংক্রিয়ভাবে কর কর্তন করা হয়।',
        ]}
      />
    </CalculatorWrapper>
  );
};
