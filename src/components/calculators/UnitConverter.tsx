import React, { useState, useEffect } from 'react';
import { CalculatorWrapper } from '../common/CalculatorWrapper';
import { CalculatorSEO } from '../common/CalculatorSEO';
import { CONVERTER_DATA, convertUnits, UnitCategory } from '../../lib/calculators/converter';
import { useHistory } from '../../context/HistoryContext';
import { ArrowLeftRight } from 'lucide-react';

interface UnitConverterProps {
  onBack: () => void;
  onShare: () => void;
  initialCategory?: UnitCategory;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({
  onBack,
  onShare,
  initialCategory = 'length',
}) => {
  const { addHistory } = useHistory();
  const [category, setCategory] = useState<UnitCategory>(initialCategory);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [fromVal, setFromVal] = useState<number | ''>(1);
  const [result, setResult] = useState<number | null>(null);

  const catData = CONVERTER_DATA[category];

  useEffect(() => {
    if (fromVal !== '') {
      const res = convertUnits(category, fromIdx, toIdx, Number(fromVal));
      setResult(isNaN(res) ? null : res);
    } else {
      setResult(null);
    }
  }, [category, fromIdx, toIdx, fromVal]);

  const handleCategorySwitch = (cat: UnitCategory) => {
    setCategory(cat);
    setFromIdx(0);
    setToIdx(1);
    setFromVal(1);
  };

  const handleSwap = () => {
    const temp = fromIdx;
    setFromIdx(toIdx);
    setToIdx(temp);
  };

  const handleSave = () => {
    if (result !== null && fromVal !== '') {
      const fromUnit = catData.units[fromIdx];
      const toUnit = catData.units[toIdx];
      addHistory({
        calculatorId: 'converter',
        calculatorTitle: 'Unit Converter',
        summary: `${fromVal} ${fromUnit} → ${toUnit}`,
        result: `${result} ${toUnit}`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="All-in-One Unit Converter"
      subtitle="Convert measurements across Length, Weight, Temperature, Area, and Speed"
      onBack={onBack}
      onShare={onShare}
    >
      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(Object.keys(CONVERTER_DATA) as UnitCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => handleCategorySwitch(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              category === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/5 [data-theme="light"]:bg-slate-200 text-slate-400'
            }`}
          >
            {CONVERTER_DATA[cat].name}
          </button>
        ))}
      </div>

      {/* Converter Inputs & Swap */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center mb-6">
        <div className="sm:col-span-3 space-y-2">
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 uppercase tracking-wider">
            From Unit
          </label>
          <select
            value={fromIdx}
            onChange={e => setFromIdx(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500 mb-2"
          >
            {catData.units.map((u, i) => (
              <option key={i} value={i} className="bg-slate-900 text-white">
                {u}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Enter value"
            value={fromVal}
            onChange={e => setFromVal(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500"
          />
        </div>

        <div className="sm:col-span-1 flex justify-center pt-6">
          <button
            onClick={handleSwap}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/10 text-indigo-400 flex items-center justify-center transition-all shadow-md group"
            title="Swap units"
          >
            <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        <div className="sm:col-span-3 space-y-2">
          <label className="block text-xs font-bold text-slate-400 [data-theme='light']:text-slate-600 uppercase tracking-wider">
            To Unit
          </label>
          <select
            value={toIdx}
            onChange={e => setToIdx(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] [data-theme='light']:bg-slate-100 border border-white/10 [data-theme='light']:border-slate-300 text-sm font-semibold outline-none focus:border-indigo-500 mb-2"
          >
            {catData.units.map((u, i) => (
              <option key={i} value={i} className="bg-slate-900 text-white">
                {u}
              </option>
            ))}
          </select>
          <input
            type="number"
            readOnly
            value={result !== null ? result : ''}
            placeholder="Result"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] [data-theme='light']:bg-slate-200/50 border border-white/5 text-sm font-semibold font-mono text-indigo-400 outline-none"
          />
        </div>
      </div>

      {result !== null && fromVal !== '' && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-sky-900/20 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Conversion Output</span>
            <button
              onClick={handleSave}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
            >
              Save Result
            </button>
          </div>

          <div className="text-2xl md:text-3xl font-display font-extrabold text-white [data-theme='light']:text-slate-900">
            {fromVal} {catData.units[fromIdx]} = <span className="text-indigo-400">{result}</span> {catData.units[toIdx]}
          </div>
        </div>
      )}

      <CalculatorSEO
        formulaTitle="Unit Conversion Matrix"
        formulaDesc="All physical unit measurements are mapped to standardized SI base units (meters, kilograms, and Kelvin) to provide consistent conversion ratios."
        howItWorks={[
          'Select the unit category: Length, Weight, Temperature, Area, or Speed.',
          'Choose the source unit and enter a magnitude.',
          'Choose your target unit to see the real-time calculated value.',
        ]}
        faqs={[
          {
            question: 'How is temperature converted?',
            answer: 'Temperature conversions use non-linear formulas: °F = (°C × 9/5) + 32, and K = °C + 273.15.',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
