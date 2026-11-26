import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorSEO } from '../../common/CalculatorSEO';
import { useHistory } from '../../../context/HistoryContext';
import {
  calculateBdPayScale,
  BD_PAY_GRADES,
  WorkLocation,
} from '../../../lib/calculators/bd/payScaleCalculator';
import { Building2, Shield, Wallet } from 'lucide-react';

interface BdPayScaleCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const BdPayScaleCalculator: React.FC<BdPayScaleCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();

  const [grade, setGrade] = useState(9); // Default BCS Cadre Grade 9
  const [basicSalary, setBasicSalary] = useState(22000);
  const [location, setLocation] = useState<WorkLocation>('dhaka');
  const [childrenCount, setChildrenCount] = useState(0);
  const [gpfRate, setGpfRate] = useState(10); // 10%
  const [includePension, setIncludePension] = useState(false);
  const [serviceYears, setServiceYears] = useState(25);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);

  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade);
    const found = BD_PAY_GRADES.find(g => g.grade === newGrade);
    if (found) {
      setBasicSalary(found.basicMin);
    }
  };

  const result = calculateBdPayScale({
    grade,
    basicSalary,
    location,
    childrenCount,
    gpfRate,
    serviceYears: includePension ? serviceYears : undefined,
    isSeniorCitizen,
  });

  const handleSaveCalculation = () => {
    addHistory({
      calculatorId: 'bd-payscale',
      calculatorTitle: 'Govt Pay Scale & Pension',
      summary: `Grade ${grade} (${location}) Basic: ৳${basicSalary.toLocaleString()}`,
      result: `Net Monthly: ৳${result.netSalary.toLocaleString()} (Gross: ৳${result.grossSalary.toLocaleString()})`,
    });
  };

  return (
    <CalculatorWrapper
      title="Govt Pay Scale & Pension Calculator"
      subtitle="বাংলাদেশ সরকারি কর্মচারী পে-স্কেল বেতন, বাড়ি ভাড়া, চিকিৎসা ভাতা, জিপিএফ ও পেনশন হিসাব"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="space-y-6">
        {/* Input Controls */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Grade Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Pay Scale Grade (বেতন গ্রেড)
              </label>
              <select
                value={grade}
                onChange={e => handleGradeChange(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-500"
              >
                {BD_PAY_GRADES.map(g => (
                  <option key={g.grade} value={g.grade}>
                    Grade {g.grade} - ৳{g.basicMin.toLocaleString()} ({g.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Salary Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Current Basic Salary (বর্তমান মূল বেতন)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ৳
                </span>
                <input
                  type="number"
                  min="0"
                  value={basicSalary}
                  onChange={e => setBasicSalary(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Work Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Posting Location (কর্মস্থল)
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value as WorkLocation)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none"
              >
                <option value="dhaka">Dhaka City Corp (ঢাকা সিটি)</option>
                <option value="other_city">Chattogram / Other City Corp (অন্যান্য সিটি)</option>
                <option value="district">District Town (জেলা সদর)</option>
                <option value="upazila">Upazila / Other Areas (উপজেলা ও অন্যান্য)</option>
              </select>
            </div>

            {/* Children Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Children (সন্তান সংখ্যা)
              </label>
              <select
                value={childrenCount}
                onChange={e => setChildrenCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none"
              >
                <option value={0}>0 (No Allowance)</option>
                <option value={1}>1 Child (৳500)</option>
                <option value={2}>2 or more Children (৳1,000)</option>
              </select>
            </div>

            {/* GPF Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                GPF Deduction (জিপিএফ কর্তন %)
              </label>
              <select
                value={gpfRate}
                onChange={e => setGpfRate(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-zinc-100 outline-none"
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={10}>10% (স্ট্যান্ডার্ড)</option>
                <option value={15}>15%</option>
                <option value={20}>20%</option>
                <option value={25}>25% (সর্বোচ্চ)</option>
              </select>
            </div>
          </div>

          {/* Pension Toggle */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includePension}
                onChange={e => setIncludePension(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Calculate Pension & Gratuity (অবসরকালীন পেনশন ও আনুতোষিক হিসাব অন্তর্ভুক্ত করুন)
              </span>
            </label>

            {includePension && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Service:</span>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={serviceYears}
                    onChange={e => setServiceYears(parseInt(e.target.value) || 25)}
                    className="w-16 px-2 py-1 text-xs font-bold rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-center"
                  />
                  <span className="text-xs text-slate-500">Years</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeniorCitizen}
                    onChange={e => setIsSeniorCitizen(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-600 dark:text-zinc-400">
                    Age 65+ (জ্যেষ্ঠ নাগরিক - ৳২,৫০০ চিকিৎসা ভাতা)
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Salary Result Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              <Wallet className="w-4 h-4" /> Net Monthly Salary
            </div>
            <div className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-zinc-100">
              ৳{result.netSalary.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-600 dark:text-zinc-400">হাতে পাওয়ার নিট বেতন</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-emerald-500" /> Gross Monthly Pay
            </div>
            <div className="mt-2 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
              ৳{result.grossSalary.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">মূল বেতন + সকল ভাতাসমূহ</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-rose-500" /> Total Deductions
            </div>
            <div className="mt-2 font-display font-extrabold text-2xl text-rose-600 dark:text-rose-400">
              -৳{result.totalDeductions.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">জিপিএফ, কল্যাণ তহবিল ও বীমা</span>
          </div>
        </div>

        {/* Detailed Breakdown Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allowances Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-zinc-100 mb-3">
              Monthly Allowances (প্রদেয় ভাতাসমূহ)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Basic Pay (মূল বেতন):</span>
                <span className="font-semibold text-slate-900 dark:text-zinc-100">৳{result.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">
                  House Rent ({result.houseRentRatePct}%):
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">+৳{result.houseRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Medical Allowance (চিকিৎসা ভাতা):</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">+৳{result.medicalAllowance.toLocaleString()}</span>
              </div>
              {result.conveyanceAllowance > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-600 dark:text-zinc-400">Conveyance (যাতায়াত ভাতা):</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+৳{result.conveyanceAllowance.toLocaleString()}</span>
                </div>
              )}
              {result.tiffinAllowance > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-600 dark:text-zinc-400">Tiffin Allowance (টিফিন ভাতা):</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+৳{result.tiffinAllowance.toLocaleString()}</span>
                </div>
              )}
              {result.educationAllowance > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-600 dark:text-zinc-400">Education Allowance (শিক্ষা সহায়ক ভাতা):</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">+৳{result.educationAllowance.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-bold text-slate-900 dark:text-zinc-100">
                <span>Total Gross:</span>
                <span>৳{result.grossSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-zinc-100 mb-3">
              Monthly Deductions (মাসিক কর্তনসমূহ)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">GPF Contribution ({gpfRate}%):</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">-৳{result.gpfDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Benevolent Fund (কল্যাণ তহবিল):</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">-৳{result.benevolentFund.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-slate-600 dark:text-zinc-400">Group Insurance (যৌথ বীমা):</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">-৳{result.groupInsurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-rose-600 dark:text-rose-400">
                <span>Total Deductions:</span>
                <span>-৳{result.totalDeductions.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleSaveCalculation}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-colors"
            >
              Save Calculation
            </button>
          </div>
        </div>

        {/* Pension & Gratuity Section */}
        {result.pensionInfo && (
          <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-sm text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  Estimated Pension & Gratuity (অবসরকালীন আনুতোষিক ও পেনশন)
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  {serviceYears} বছরের চাকরির ভিত্তিতে আনুতোষিক (এককালীন) ও মাসিক নিট পেনশনের প্রাক্কলন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/40">
                <span className="text-xs text-slate-500">Lump Sum Gratuity (এককালীন আনুতোষিক):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
                  ৳{result.pensionInfo.lumpSumGratuity.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500">৫০% সমর্পণ বাবদ এককালীন প্রাপ্তি</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/40">
                <span className="text-xs text-slate-500">Monthly Pension (মাসিক ইন-হ্যান্ড পেনশন):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  ৳{result.pensionInfo.totalMonthlyInHandPension.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500">মাসিক পেনশন + ৳১,৫০০ চিকিৎসা ভাতা</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <CalculatorSEO
        formulaTitle="বাংলাদেশ সরকারি কর্মচারী পে-স্কেল ও পেনশন নীতিমালার নিয়মাবলী"
        formulaDesc="জাতীয় বেতন স্কেল অনুযায়ী মূল বেতন, এলাকাভিত্তিক বাড়ি ভাড়া, চিকিৎসা ভাতা ও জিপিএফ কর্তন সাপেক্ষে নিট বেতন এবং অবসরে আনুতোষিক ও পেনশন হিসাব করা হয়।"
        howItWorks={[
          'বাড়ি ভাড়া ভাতা: ঢাকা সিটি কর্পোরেশনে মূল বেতনের ৫০% থেকে ৬৫% (ন্যূনতম ৳৫,৬০০ - ৳১৯,৫০০); অন্যান্য সিটি কর্পোরেশনে ৪০% থেকে ৫৫%; এবং জেলা সদরে ৩৫% থেকে ৫০%।',
          'চিকিৎসা ভাতা: সকল কর্মচারীর জন্য মাসিক নির্ধারিত ৳১,৫০০ (৬৫ বছরের বেশি বয়স্ক অবসরপ্রাপ্তদের ক্ষেত্রে ৳২,৫০০)।',
          'জিপিএফ কর্তন: মূল বেতনের সর্বনিম্ন ৫% থেকে সর্বোচ্চ ২৫% পর্যন্ত ভবিষ্যৎ তহবিলে জমা রাখা যায়।',
          'পেনশন হার: ২৫ বছর বা তদূর্ধ্ব চাকরিকাল থাকলে সর্বশেষ মূল বেতনের ৯০% গ্রস পেনশন নির্ধারিত হয়, যার ৫০% বাধ্যতামূলকভাবে আনুতোষিক (গ্র্যাচুইটি) হিসেবে এককালীন উত্তোলন করা যায়।',
        ]}
      />
    </CalculatorWrapper>
  );
};
