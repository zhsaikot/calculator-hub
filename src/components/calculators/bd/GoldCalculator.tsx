import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorSEO } from '../../common/CalculatorSEO';
import { useHistory } from '../../../context/HistoryContext';
import {
  calculateGoldPrice,
} from '../../../lib/calculators/bd/goldCalculator';

interface GoldCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const GoldCalculator: React.FC<GoldCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();

  const [inputMode, setInputMode] = useState<'vori' | 'grams'>('vori');

  // Vori-Ana-Roti inputs
  const [vori, setVori] = useState<number>(1);
  const [ana, setAna] = useState<number>(0);
  const [roti, setRoti] = useState<number>(0);

  // Grams input
  const [grams, setGrams] = useState<number>(11.664);

  // Price parameters
  const [pricePerVori, setPricePerVori] = useState<number>(125000); // Current typical 22K BAJUS rate
  const [makingCharge, setMakingCharge] = useState<number>(3500); // Tk 3,500 per vori
  const [vatPct, setVatPct] = useState<number>(5); // 5% govt VAT

  const result = calculateGoldPrice(
    inputMode === 'vori' ? { vori, ana, roti } : { grams },
    pricePerVori,
    makingCharge,
    vatPct
  );

  const handleSaveCalculation = () => {
    addHistory({
      calculatorId: 'bd-gold',
      calculatorTitle: 'Gold & Silver Price (স্বর্ণের দাম)',
      summary: `${result.vori} ভরি ${result.ana} আনা ${result.roti} রতি (${result.totalGrams}g) @ ৳${pricePerVori.toLocaleString()}/ভরি`,
      result: `Total: ৳${result.totalPrice.toLocaleString()} (Gold: ৳${result.goldPrice.toLocaleString()} + Making: ৳${result.makingCharge.toLocaleString()} + VAT: ৳${result.vatAmount.toLocaleString()})`,
    });
  };

  return (
    <CalculatorWrapper
      title="Gold & Silver Price Calculator (স্বর্ণের দাম)"
      subtitle="বাজুস (BAJUS) রেট, ভরি-আনা-রতি ও গ্রাম রূপান্তর, মজুরি এবং ৫% সরকারি ভ্যাট সহ সঠিক স্বর্ণের মূল্য"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1">
              <button
                onClick={() => setInputMode('vori')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  inputMode === 'vori'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                ভরি - আনা - রতি
              </button>
              <button
                onClick={() => setInputMode('grams')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  inputMode === 'grams'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                গ্রামে পরিমাপ (Grams)
              </button>
            </div>

            <button
              onClick={handleSaveCalculation}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200"
            >
              Save Gold Price
            </button>
          </div>

          {/* Weight Inputs */}
          {inputMode === 'vori' ? (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Vori (ভরি / তোলা)
                </label>
                <input
                  type="number"
                  min="0"
                  value={vori}
                  onChange={e => setVori(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Ana (আনা - ১/১৬)
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={ana}
                  onChange={e => setAna(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Roti (রতি - ১/৯৬)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={roti}
                  onChange={e => setRoti(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Weight in Grams (গ্রামে ওজন)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={grams}
                  onChange={e => setGrams(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-base font-bold text-slate-900 dark:text-zinc-100 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  g
                </span>
              </div>
            </div>
          )}

          {/* Pricing Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Gold Rate per Vori (প্রতি ভরি রেট - টাকা)
              </label>
              <input
                type="number"
                min="0"
                value={pricePerVori}
                onChange={e => setPricePerVori(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Making Charge/Vori (মজুরি - প্রতি ভরি)
              </label>
              <input
                type="number"
                min="0"
                value={makingCharge}
                onChange={e => setMakingCharge(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-zinc-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                Government VAT (ভ্যাট %)
              </label>
              <input
                type="number"
                min="0"
                value={vatPct}
                onChange={e => setVatPct(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-zinc-100 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Banner */}
        <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 shadow-xs">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            Total Jewelry Buying Price (সর্বমোট ক্রয়মূল্য - ভ্যাট ও মজুরি সহ)
          </span>
          <div className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-zinc-100">
            ৳{result.totalPrice.toLocaleString()}
          </div>
          <span className="text-xs text-slate-600 dark:text-zinc-400">
            মোট ওজন: {result.totalVori} ভরি ({result.vori} ভরি {result.ana} আনা {result.roti} রতি) = {result.totalGrams} গ্রাম
          </span>

          <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-900/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Gold Value (স্বর্ণের মূল্য):</span>
              <div className="font-bold text-slate-900 dark:text-zinc-100">৳{result.goldPrice.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-slate-500">Making Charge (মজুরি):</span>
              <div className="font-bold text-slate-900 dark:text-zinc-100">৳{result.makingCharge.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-slate-500">Govt VAT ({vatPct}%):</span>
              <div className="font-bold text-rose-600 dark:text-rose-400">৳{result.vatAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="বাংলাদেশে প্রচলিত স্বর্ণের পরিমাপ ও বাজুস (BAJUS) নির্দেশিকা"
        formulaDesc="বাংলাদেশ জুয়েলার্স অ্যাসোসিয়েশন (BAJUS) নির্ধারিত মানদণ্ড অনুযায়ী ভরি, আনা, রতি ও গ্রাম রূপান্তর এবং ক্রয়মূল্য গণনার নিয়ম।"
        howItWorks={[
          '১ ভরি (তোলা) = ১৬ আনা = ৯৬ রতি = ১১.৬৬৪ গ্রাম।',
          '১ আনা = ৬ রতি = ০.৭২৯ গ্রাম।',
          '১ রতি = ০.১২১৫ গ্রাম।',
          'ক্যারেট বিশুদ্ধতা: ২২ ক্যারেট (৯১.৬% খাঁটি স্বর্ণ), ২১ ক্যারেট (৮৭.৫%), ১৮ ক্যারেট (৭৫.০%) এবং সনাতন পদ্ধতি।',
          'ফাইনাল বিল: মোট বিল = (স্বর্ণের মূল্য + মেকিং চার্জ) + ৫% সরকারি ভ্যাট।',
        ]}
      />
    </CalculatorWrapper>
  );
};
