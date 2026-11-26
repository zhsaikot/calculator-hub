import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorSEO } from '../../common/CalculatorSEO';
import { useHistory } from '../../../context/HistoryContext';
import {
  compareMfsCharges,
  MFS_PROVIDERS,
} from '../../../lib/calculators/bd/mfsComparator';
import { Smartphone, Check, ArrowRightLeft, Sparkles } from 'lucide-react';

interface MfsComparatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const MfsComparator: React.FC<MfsComparatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();

  const [amount, setAmount] = useState<number>(5000);
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [selectedChannels, setSelectedChannels] = useState<Record<string, string>>({
    bkash: 'bkash-app',
    nagad: 'nagad-app',
    rocket: 'rocket-app',
    upay: 'upay-app',
  });

  const handleChannelChange = (providerId: string, channelId: string) => {
    setSelectedChannels(prev => ({ ...prev, [providerId]: channelId }));
  };

  const result = compareMfsCharges(amount, mode, selectedChannels);

  const handleSaveCalculation = () => {
    addHistory({
      calculatorId: 'bd-mfs',
      calculatorTitle: 'MFS Charges Comparator',
      summary: `${mode === 'forward' ? 'Cash Out' : 'Reverse Send'} ৳${amount.toLocaleString()}`,
      result: `Best: ${result.cheapestProvider} (Saved up to ৳${result.maxSavings.toFixed(2)})`,
    });
  };

  return (
    <CalculatorWrapper
      title="MFS Cash-Out & Send Money Comparator"
      subtitle="বিকাশ, নগদ, রকেট ও উপায় ক্যাশ-আউট চার্জের তুলনা এবং সঠিক টাকা পাঠানোর হিসাব"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="space-y-6">
        {/* Mode & Amount Bar */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1">
              <button
                onClick={() => setMode('forward')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'forward'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <span>ক্যাশ-আউট খরচ কত?</span>
              </button>
              <button
                onClick={() => setMode('reverse')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'reverse'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>কত পাঠালে পুরো টাকা পাবে?</span>
              </button>
            </div>

            <button
              onClick={handleSaveCalculation}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 self-start sm:self-auto"
            >
              Save Comparison
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              {mode === 'forward'
                ? 'Cash-out Amount (উত্তোলনের পরিমাণ)'
                : 'Desired In-Hand Amount (প্রাপকের হাতে পাওয়ার লক্ষ্যমাত্রা)'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                ৳
              </span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="5000"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xl font-display font-extrabold text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-500"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 mt-2.5 flex-wrap">
              {[1000, 2000, 5000, 10000, 25000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    amount === amt
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
                      : 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                  }`}
                >
                  ৳{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Providers Side-by-Side Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {result.items.map(item => {
            const providerMeta = MFS_PROVIDERS.find(p => p.id === item.providerId)!;

            return (
              <div
                key={item.providerId}
                className={`p-5 rounded-2xl bg-white dark:bg-zinc-900 border transition-all relative flex flex-col justify-between shadow-xs ${
                  item.isBestValue
                    ? 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-zinc-800'
                }`}
              >
                {item.isBestValue && (
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Best Value (সাশ্রয়ী)
                  </span>
                )}

                <div>
                  {/* Provider Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                        style={{ backgroundColor: providerMeta.color }}
                      >
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-zinc-100">
                          {providerMeta.name.split(' ')[0]}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          ৳{item.ratePerThousand}/হাজার
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Dropdown */}
                  <select
                    value={selectedChannels[item.providerId] || providerMeta.defaultChannelId}
                    onChange={e => handleChannelChange(item.providerId, e.target.value)}
                    className="w-full mb-4 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 outline-none"
                  >
                    {providerMeta.channels.map(ch => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.ratePct}%)
                      </option>
                    ))}
                  </select>

                  {/* Calculation Details */}
                  <div className="space-y-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Cash-out Charge (খরচ)
                      </span>
                      <div className="font-display font-extrabold text-2xl text-rose-600 dark:text-rose-400">
                        ৳{item.cashOutFee.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {item.ratePct}% হারে কর্তন
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                        {mode === 'forward' ? 'Recipient Gets (হাতে পাবে)' : 'Total to Send (পাঠাতে হবে)'}
                      </span>
                      <div className="font-display font-extrabold text-xl text-slate-900 dark:text-zinc-100">
                        ৳{(mode === 'forward' ? item.recipientGets : item.amountToSend).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-[10px] text-slate-500">
                  {item.isBestValue ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> সবচেয়ে কম চার্জ কাটবে
                    </span>
                  ) : (
                    <span>
                      বেশি খরচ হবে: +৳
                      {Math.max(0, item.cashOutFee - result.items.find(i => i.isBestValue)!.cashOutFee).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="বিকাশ, নগদ, রকেট ও উপায় ক্যাশ-আউট চার্জের হিসাব ও নীতিমালা"
        formulaDesc="বাংলাদেশে প্রচলিত প্রধান ৪টি এমএফএস ওয়ালেটের অফিশিয়াল ক্যাশ-আউট রেট ও খরচ সাশ্রয়ের তুলনামূলক নির্দেশিকা।"
        formulaMath="Forward Fee = Amount × (Rate ÷ 100) | Reverse Amount = Desired In Hand ÷ (1 - Rate ÷ 100)"
        howItWorks={[
          'বিকাশ (bKash): ১টি প্রিয় এজেন্ট নাম্বারে প্রতি মাসে ২৫,০০০ টাকা পর্যন্ত ১.৪৯% (৳১৪.৯০/হাজার) চার্জ প্রযোজ্য। রেগুলার অ্যাপ ও ইউএসএসডি ক্যাশ-আউট চার্জ ১.৮৫% (৳১৮.৫০/হাজার)।',
          'নগদ (Nagad): নগদ অ্যাপে ক্যাশ-আউট চার্জ ভ্যাট সহ ১.২৫% (৳১২.৫০/হাজার) এবং ইউএসএসডি (*167#) কোডের মাধ্যমে ১.৪৯৪% (৳১৪.৯৪/হাজার)।',
          'রকেট (Rocket): ডাচ-বাংলা ব্যাংকের যেকোনো এটিএম বুথ থেকে ক্যাশ-আউট করলে মাত্র ০.৯০% (৳৯.০০/হাজার) চার্জ প্রযোজ্য। সাধারণ এজেন্ট থেকে ১.৬৭% (৳১৬.৭০/হাজার)।',
          'উপায় (Upay): উপায় অ্যাপে ১.৪০% (৳১৪.০০/হাজার) এবং ইউএসএসডিতে ১.৮০% (৳১৮.০০/হাজার) চার্জ প্রযোজ্য।',
        ]}
      />
    </CalculatorWrapper>
  );
};
