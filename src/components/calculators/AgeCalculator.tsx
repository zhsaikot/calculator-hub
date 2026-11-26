import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { calculateAge, AgeResult } from '../../lib/calculators/age';
import { useHistory } from '../../context/HistoryContext';
import { Calendar, Gift, Clock, Sparkles } from 'lucide-react';

interface AgeCalculatorProps {
  onBack: () => void;
  onShare: () => void;
  initialDob?: string;
  initialTarget?: string;
}

export const AgeCalculator: React.FC<AgeCalculatorProps> = ({
  onBack,
  onShare,
  initialDob = '1998-05-15',
  initialTarget,
}) => {
  const { addHistory } = useHistory();
  const todayStr = new Date().toISOString().split('T')[0];

  const [dob, setDob] = useState(initialDob);
  const [target, setTarget] = useState(initialTarget || todayStr);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dob && target) {
      const res = calculateAge(dob, target);
      if ('error' in res) {
        setError(res.error);
        setResult(null);
      } else {
        setError(null);
        setResult(res);
      }
    }
  }, [dob, target]);

  const handleSaveToHistory = () => {
    if (result) {
      addHistory({
        calculatorId: 'age',
        calculatorTitle: 'Age Calculator',
        summary: `Born: ${dob} → On: ${target}`,
        result: `${result.years} Years, ${result.months} Months, ${result.days} Days`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="Age Calculator"
      subtitle="Calculate exact age in years, months, days, total hours, and birthday countdown"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 mb-2 uppercase tracking-wider">
            Calculate Age On
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {result && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-sky-900/20 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Your Exact Age</span>
            <button
              onClick={handleSaveToHistory}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
            >
              Save to History
            </button>
          </div>

          <div className="text-3xl md:text-4xl font-display font-extrabold text-white [data-theme='light']:text-slate-900 tracking-tight">
            {result.years} <span className="text-lg font-normal text-slate-400">years,</span> {result.months}{' '}
            <span className="text-lg font-normal text-slate-400">months,</span> {result.days}{' '}
            <span className="text-lg font-normal text-slate-400">days</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Days</div>
              <div className="text-base font-bold font-display text-indigo-400 mt-0.5">
                {result.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Hours</div>
              <div className="text-base font-bold font-display text-indigo-400 mt-0.5">
                {result.totalHours.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Minutes</div>
              <div className="text-base font-bold font-display text-indigo-400 mt-0.5">
                {result.totalMinutes.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Gift className="w-3 h-3 text-pink-400" /> Next Birthday
              </div>
              <div className="text-base font-bold font-display text-pink-400 mt-0.5">
                {result.daysToNextBirthday} days
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Your next birthday will fall on a <strong className="text-white [data-theme='light']:text-slate-900">{result.nextBirthdayDayOfWeek}</strong>.
          </div>
        </div>
      )}

      <CalculatorSEO
        formulaTitle="How Exact Age is Calculated"
        formulaDesc="Age calculation subtracts your birth year, month, and day from the specified target date while taking into account leap years (366 days in Feb 29) and varying month lengths (28, 30, or 31 days)."
        howItWorks={[
          'Select your Date of Birth.',
          'Select the Target Date (defaults to today).',
          'The engine evaluates the exact delta in full calendar years, months, and days, as well as elapsed hours and days until your next birthday.',
        ]}
        faqs={[
          {
            question: 'How are leap years handled?',
            answer: 'Leap years with 366 days (like 2024 or 2028) are automatically handled according to standard Gregorian calendar rules.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
