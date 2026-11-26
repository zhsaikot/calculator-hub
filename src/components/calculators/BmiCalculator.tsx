import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { calculateBMI, BmiUnit, BmiResult } from '../../lib/calculators/bmi';
import { useHistory } from '../../context/HistoryContext';

interface BmiCalculatorProps {
  onBack: () => void;
  onShare: () => void;
  initialWeight?: number;
  initialHeight?: number;
  initialUnit?: BmiUnit;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({
  onBack,
  onShare,
  initialWeight = 70,
  initialHeight = 175,
  initialUnit = 'metric',
}) => {
  const { addHistory } = useHistory();
  const [unit, setUnit] = useState<BmiUnit>(initialUnit);
  const [weight, setWeight] = useState<number | ''>(initialWeight);
  const [height, setHeight] = useState<number | ''>(initialHeight);
  const [result, setResult] = useState<BmiResult | null>(null);

  useEffect(() => {
    if (weight && height) {
      const res = calculateBMI(Number(weight), Number(height), unit);
      if (!('error' in res)) {
        setResult(res);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [weight, height, unit]);

  const handleUnitSwitch = (newUnit: BmiUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'imperial') {
      // metric to imperial: kg -> lbs (* 2.20462), cm -> inches (/ 2.54)
      if (weight) setWeight(Math.round(Number(weight) * 2.20462));
      if (height) setHeight(Math.round(Number(height) / 2.54));
    } else {
      // imperial to metric: lbs -> kg (/ 2.20462), inches -> cm (* 2.54)
      if (weight) setWeight(Math.round(Number(weight) / 2.20462));
      if (height) setHeight(Math.round(Number(height) * 2.54));
    }
    setUnit(newUnit);
  };

  const handleSave = () => {
    if (result) {
      addHistory({
        calculatorId: 'bmi',
        calculatorTitle: 'BMI Calculator',
        summary: `${weight}${unit === 'metric' ? 'kg' : 'lbs'}, ${height}${unit === 'metric' ? 'cm' : 'in'}`,
        result: `BMI ${result.bmi} (${result.category})`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="BMI Calculator"
      subtitle="Body Mass Index & World Health Organization (WHO) category status"
      badge="Health"
      onBack={onBack}
      onShare={onShare}
    >
      {/* Unit Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleUnitSwitch('metric')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            unit === 'metric'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
          }`}
        >
          Metric (kg / cm)
        </button>
        <button
          onClick={() => handleUnitSwitch('imperial')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            unit === 'imperial'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
          }`}
        >
          Imperial (lbs / inches)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            min="1"
            placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
            value={weight}
            onChange={e => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-2 uppercase tracking-wider">
            Height ({unit === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            min="1"
            placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
            value={height}
            onChange={e => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-850 border border-slate-300 dark:border-zinc-800 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {result && (
        <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Your Calculated BMI</span>
            <button
              onClick={handleSave}
              className="text-[11px] font-medium px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Save Result
            </button>
          </div>

          <div className="flex items-baseline gap-3">
            <span
              className="text-3xl sm:text-4xl font-display font-bold tracking-tight"
              style={{ color: result.categoryColor }}
            >
              {result.bmi}
            </span>
            <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-zinc-100">
              {result.category}
            </span>
          </div>

          {/* Minimal BMI Bar */}
          <div className="mt-5 mb-2">
            <div className="h-2 rounded-full bg-slate-200 dark:bg-zinc-800 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${result.needlePercent}%`, backgroundColor: result.categoryColor }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1.5 font-medium">
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5–24.9)</span>
              <span>Overweight (25–29.9)</span>
              <span>Obese (&ge;30)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-zinc-800">
            <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Healthy Weight Target</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
                {result.healthyWeightRange}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Health Tip</div>
              <div className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                {result.healthTip}
              </div>
            </div>
          </div>
        </div>
      )}

      <CalculatorSEO
        formulaTitle="Body Mass Index Formula"
        formulaDesc="BMI is a standard screening measurement used by doctors and health organizations worldwide to evaluate adult body mass relative to height."
        formulaMath="Metric: BMI = weight (kg) / [height (m)]²  |  Imperial: BMI = 703 × weight (lbs) / [height (inches)]²"
        howItWorks={[
          'Enter your body weight in kilograms or pounds.',
          'Enter your standing height in centimeters or inches.',
          'The calculator squares height and divides weight to position you on the WHO BMI scale.',
        ]}
        faqs={[
          {
            question: 'Is BMI accurate for athletes and bodybuilders?',
            answer: 'BMI measures total body mass and does not distinguish between muscle mass and fat tissue. Very muscular individuals may score in the overweight category despite having low body fat.',
          },
          {
            question: 'What is the ideal BMI range for adults?',
            answer: 'According to the World Health Organization (WHO), a BMI between 18.5 and 24.9 is considered the normal, healthy range for adults.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
