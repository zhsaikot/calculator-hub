import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorSEO } from '../../common/CalculatorSEO';
import { useHistory } from '../../../context/HistoryContext';
import {
  calculateBdIncomeTax,
  TaxpayerCategory,
  TaxLocation,
} from '../../../lib/calculators/bd/incomeTaxBd';

interface BdTaxCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const BdTaxCalculator: React.FC<BdTaxCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();

  const [annualIncome, setAnnualIncome] = useState<number>(800000); // 8 Lakh
  const [category, setCategory] = useState<TaxpayerCategory>('general');
  const [location, setLocation] = useState<TaxLocation>('dhaka_chattogram');
  const [hasDisabledChild, setHasDisabledChild] = useState<boolean>(false);
  const [eligibleInvestment, setEligibleInvestment] = useState<number>(100000); // 1 Lakh

  const result = calculateBdIncomeTax({
    annualIncome,
    category,
    location,
    hasDisabledChild,
    eligibleInvestment,
  });

  const handleSaveCalculation = () => {
    addHistory({
      calculatorId: 'bd-tax',
      calculatorTitle: 'BD Income Tax (NBR)',
      summary: `Annual Income ৳${annualIncome.toLocaleString()} (${category})`,
      result: `Net Tax: ৳${result.netTaxPayable.toLocaleString()} (TDS: ৳${result.monthlyTds.toLocaleString()}/mo)`,
    });
  };

  return (
    <CalculatorWrapper
      title="Bangladesh Income Tax Calculator (NBR)"
      subtitle="জাতীয় রাজস্ব বোর্ড (NBR) ২০২৪-২৫ / ২০২৫-২৬ অর্থবছর: আয়কর স্ল্যাব, করমুক্ত সীমা, রেয়াত ও ন্যূনতম কর হিসাব"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Annual Income */}
            <div className="flex flex-col">
              <label className="min-h-[2.5rem] flex flex-col justify-end mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  Annual Total Income
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">
                  বার্ষিক মোট করযোগ্য আয়
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  value={annualIncome}
                  onChange={e => setAnnualIncome(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 pl-8 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-850 transition-colors"
                />
              </div>

              {/* Quick Preset Chips */}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {[500000, 800000, 1200000, 1600000, 2500000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAnnualIncome(val)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                      annualIncome === val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-750'
                    }`}
                  >
                    ৳{val / 100000}L
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Taxpayer Category */}
            <div className="flex flex-col">
              <label className="min-h-[2.5rem] flex flex-col justify-end mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  Taxpayer Category
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">
                  করদাতার শ্রেণি ও করমুক্ত সীমা
                </span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaxpayerCategory)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-850 transition-colors"
              >
                <option value="general">General / Male (পুরুষ করদাতা — করমুক্ত ৳৩.৫ লাখ)</option>
                <option value="female_senior">Female or Senior 65+ (মহিলা / ৬৫+ জ্যেষ্ঠ নাগরিক — ৳৪ লাখ)</option>
                <option value="disabled_third_gender">Third Gender or Disabled (প্রতিবন্ধী / তৃতীয় লিঙ্গ — ৳৪.৭৫ লাখ)</option>
                <option value="freedom_fighter">Gazetted Freedom Fighter (গেজেটভুক্ত মুক্তিযোদ্ধা — ৳৫ লাখ)</option>
              </select>
            </div>

            {/* 3. Location */}
            <div className="flex flex-col">
              <label className="min-h-[2.5rem] flex flex-col justify-end mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  Work / Living Location
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">
                  করদাতার এলাকা ও ন্যূনতম কর
                </span>
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value as TaxLocation)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-850 transition-colors"
              >
                <option value="dhaka_chattogram">Dhaka & Chattogram City Corp (ন্যূনতম কর ৳৫,০০০)</option>
                <option value="other_city">Other City Corporation (অন্যান্য সিটি কর্পোরেশন — ৳৪,০০০)</option>
                <option value="outside_city">Non-City Areas / Pourashava (পৌরসভা ও অন্যান্য — ৳৩,০০০)</option>
              </select>
            </div>

            {/* 4. Investment for Rebate */}
            <div className="flex flex-col">
              <label className="min-h-[2.5rem] flex flex-col justify-end mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider">
                  Investment for Rebate
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-normal">
                  অনুমোদিত খাতে মোট বিনিয়োগ (সঞ্চয়পত্র, ডিপিএস, বীমা)
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  value={eligibleInvestment}
                  placeholder="যেমন: ১,০০,০০০"
                  onChange={e => setEligibleInvestment(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 pl-8 pr-4 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-zinc-850 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Bottom Options & Save Action */}
          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasDisabledChild}
                onChange={e => setHasDisabledChild(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs text-slate-700 dark:text-zinc-300">
                Parent of a Disabled Child <span className="text-slate-400 dark:text-zinc-500">(প্রতিবন্ধী সন্তানের পিতা/মাতা — অতিরিক্ত ৳৫০,০০০ করমুক্ত)</span>
              </span>
            </label>

            <button
              onClick={handleSaveCalculation}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors self-start sm:self-auto"
            >
              Save Tax Calculation
            </button>
          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Net Tax Payable (নিট প্রদেয় কর)
            </span>
            <div className="mt-2 font-display font-extrabold text-3xl text-slate-900 dark:text-zinc-100">
              ৳{result.netTaxPayable.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-600 dark:text-zinc-400">
              ইফেক্টিভ ট্যাক্স রেট: {result.effectiveTaxRate}%
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Monthly TDS (মাসিক সম্ভাব্য কর্তন)
            </span>
            <div className="mt-2 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
              ৳{result.monthlyTds.toLocaleString()}/মাস
            </div>
            <span className="text-[11px] text-slate-500">বেতন থেকে মাসিক সম্ভাব্য কর</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Investment Rebate (কর রেয়াত)
            </span>
            <div className="mt-2 font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
              ৳{result.investmentRebate.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">বিনিয়োগের বিপরীতে কর সাশ্রয়</span>
          </div>
        </div>

        {/* Slabs Breakdown Table */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-zinc-100 mb-3">
            NBR Progressive Tax Slabs Breakdown (স্ল্যাবভিত্তিক আয়কর গণনা)
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
            {result.slabs.map((slab, i) => (
              <div key={i} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">{slab.slabName}</span>
                  <span className="ml-2 text-slate-400">({slab.ratePct}%)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 mr-4">৳{slab.taxableAmount.toLocaleString()}</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">
                    ৳{slab.taxAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex justify-between font-bold text-xs">
            <span>Gross Tax Before Rebate:</span>
            <span>৳{result.grossTax.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="বাংলাদেশ জাতীয় রাজস্ব বোর্ড (NBR) আয়কর স্ল্যাব ও রেয়াত নীতিমালা"
        formulaDesc="অর্থ আইন ২০২৪ অনুযায়ী ব্যক্তিশ্রেণির করদাতাদের জন্য নির্ধারিত আয়করের প্রগ্রেসিভ হার ও রেয়াত গণনার নির্দেশিকা।"
        howItWorks={[
          'করমুক্ত আয়ের সীমা: সাধারণ পুরুষ করদাতা ৳৩,৫০,০০০; নারী ও ৬৫+ বয়সের জ্যেষ্ঠ নাগরিক ৳৪,০০,০০০; তৃতীয় লিঙ্গ ও প্রতিবন্ধী ৳৪,৭৫,০০০; যুদ্ধাহত গেজেটভুক্ত মুক্তিযোদ্ধা ৳৫,০০,০০০।',
          'প্রগ্রেসিভ করের হার: করমুক্ত সীমার পরবর্তী ১ লাখ টাকায় ৫%, পরবর্তী ৪ লাখ টাকায় ১০%, পরবর্তী ৫ লাখ টাকায় ১৫%, পরবর্তী ৫ লাখ টাকায় ২০%, এবং অবশিষ্ট আয়ের ওপর ২৫%।',
          'বিনিয়োগ কর রেয়াত: অনুমোদিত খাতে (সঞ্চয়পত্র, জীবন বীমা, ডিপিএস বার্ষিক সর্বোচ্চ ১.২ লাখ টাকা ইত্যাদি) বিনিয়োগের ১৫% অথবা করযোগ্য আয়ের ৩% (যা কম) কর রেয়াত পাওয়া যায়।',
          'ন্যূনতম কর: করযোগ্য আয় থাকলে ঢাকা ও চট্টগ্রাম সিটি কর্পোরেশনে ন্যূনতম কর ৳৫,০০০, অন্যান্য সিটিতে ৳৪,০০০ এবং পৌরসভা/অন্যান্য এলাকায় ৳৩,০০০ প্রযোজ্য।',
        ]}
      />
    </CalculatorWrapper>
  );
};
