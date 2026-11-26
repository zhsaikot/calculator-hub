import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorSEO } from '../../common/CalculatorSEO';
import { useHistory } from '../../../context/HistoryContext';
import {
  calculateQuadrilateralLand,
  convertFromSqFeet,
  convertToSqFeet,
} from '../../../lib/calculators/bd/landCalculator';
import { MapPin, ArrowRightLeft } from 'lucide-react';

interface BdLandCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const BdLandCalculator: React.FC<BdLandCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();

  const [activeTab, setActiveTab] = useState<'boundary' | 'convert'>('boundary');

  // Boundary inputs (in feet)
  const [north, setNorth] = useState<number>(60);
  const [south, setSouth] = useState<number>(60);
  const [east, setEast] = useState<number>(40);
  const [west, setWest] = useState<number>(40);
  const [diagonal, setDiagonal] = useState<number>(0);

  // Unit converter inputs
  const [convValue, setConvValue] = useState<number>(1);
  const [convUnit, setConvUnit] = useState<'shotok' | 'katha' | 'bigha' | 'acre' | 'sqFeet'>('shotok');

  // Calculations
  const boundaryResult = calculateQuadrilateralLand({
    north,
    south,
    east,
    west,
    diagonal: diagonal > 0 ? diagonal : undefined,
  });

  const convertedSqFeet = convertToSqFeet(convValue, convUnit);
  const converterResult = convertFromSqFeet(convertedSqFeet);

  const handleSaveCalculation = () => {
    if (activeTab === 'boundary') {
      addHistory({
        calculatorId: 'bd-land',
        calculatorTitle: 'Land Measurement (জমি পরিমাপ)',
        summary: `Land (${north}x${south}x${east}x${west} ft)`,
        result: `${boundaryResult.units.shotok} শতক (${boundaryResult.units.katha} কাঠা / ${boundaryResult.sqFeet} sq ft)`,
      });
    } else {
      addHistory({
        calculatorId: 'bd-land',
        calculatorTitle: 'Land Measurement (জমি পরিমাপ)',
        summary: `Convert ${convValue} ${convUnit}`,
        result: `${converterResult.shotok} শতক = ${converterResult.katha} কাঠা = ${converterResult.sqFeet} sq ft`,
      });
    }
  };

  return (
    <CalculatorWrapper
      title="Land Measurement & Unit Converter"
      subtitle="বাংলাদেশি জমির পরিমাপ: শতক, কাঠা, বিঘা, একর, বর্গফুট ও চারকোণা জমির সঠিক মাপজোখ"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('boundary')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'boundary'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>৪ বাহু দিয়ে জমি পরিমাপ</span>
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'convert'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>শতক-কাঠা-বিঘা রূপান্তর</span>
          </button>
        </div>

        {/* Tab 1: Boundary Land Measurement */}
        {activeTab === 'boundary' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Enter Land Boundary Measurements in Feet (ফুটে ৪ দিকের পরিমাপ দিন)
                </h4>
                <button
                  onClick={handleSaveCalculation}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300"
                >
                  Save Result
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                    North Length (উত্তর বাহুর দৈর্ঘ্য - ফুট):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={north}
                    onChange={e => setNorth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                    South Length (দক্ষিণ বাহুর দৈর্ঘ্য - ফুট):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={south}
                    onChange={e => setSouth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                    East Width (পূর্ব বাহুর প্রস্থ - ফুট):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={east}
                    onChange={e => setEast(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                    West Width (পশ্চিম বাহুর প্রস্থ - ফুট):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={west}
                    onChange={e => setWest(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                  />
                </div>
              </div>

              {/* Diagonal Input */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <label className="block text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                  Optional Diagonal Length (কোণাকুণি কর্ণ - হেরন্স সূত্রে ১০০% নিখুঁত হিসাবের জন্য):
                </label>
                <input
                  type="number"
                  min="0"
                  value={diagonal || ''}
                  placeholder="ঐচ্ছিক (খালি রাখলে গড় পদ্ধতিতে হিসাব হবে)"
                  onChange={e => setDiagonal(parseFloat(e.target.value) || 0)}
                  className="w-full max-w-sm px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium text-slate-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  Shotok / Decimal (শতক)
                </span>
                <div className="mt-1 font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-zinc-100">
                  {boundaryResult.units.shotok}
                </div>
                <span className="text-[10px] text-slate-500">১ শতক = ৪৩৫.৬ বর্গফুট</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Katha (কাঠা)
                </span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {boundaryResult.units.katha}
                </div>
                <span className="text-[10px] text-slate-500">১ কাঠা = ৭২০ বর্গফুট</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Bigha (বিঘা)
                </span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {boundaryResult.units.bigha}
                </div>
                <span className="text-[10px] text-slate-500">১ বিঘা = ২০ কাঠা</span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Total Area (বর্গফুট)
                </span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {boundaryResult.sqFeet.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500">
                  {boundaryResult.units.sqMeters} বর্গমিটার
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Land Unit Converter */}
        {activeTab === 'convert' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Enter Amount & Select Unit (পরিমাণ ও একক নির্বাচন করুন)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  min="0"
                  value={convValue}
                  onChange={e => setConvValue(parseFloat(e.target.value) || 0)}
                  className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xl font-bold text-slate-900 dark:text-zinc-100 outline-none"
                />
                <select
                  value={convUnit}
                  onChange={e => setConvUnit(e.target.value as any)}
                  className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-zinc-100 outline-none"
                >
                  <option value="shotok">Shotok / Decimal (শতক / ডেসিমেল)</option>
                  <option value="katha">Katha (কাঠা)</option>
                  <option value="bigha">Bigha (বিঘা)</option>
                  <option value="acre">Acre (একর)</option>
                  <option value="sqFeet">Square Feet (বর্গফুট)</option>
                </select>
              </div>
            </div>

            {/* Conversion Result Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">শতক (Decimal):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {converterResult.shotok}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500">কাঠা (Katha):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {converterResult.katha}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500">বিঘা (Bigha):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {converterResult.bigha}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500">একর (Acre):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {converterResult.acre}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500">মোট বর্গফুট (Sq Feet):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {converterResult.sqFeet.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                <span className="text-xs font-bold text-slate-500">বর্গমিটার (Sq Meters):</span>
                <div className="mt-1 font-display font-extrabold text-2xl text-slate-900 dark:text-zinc-100">
                  {converterResult.sqMeters.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CalculatorSEO
        formulaTitle="বাংলাদেশে প্রচলিত জমির পরিমাপ ও রূপান্তর সূত্র"
        formulaDesc="সরকারি ভূমি জরিপ ও রেজিস্ট্রি বিভাগের মানদণ্ড অনুযায়ী জমির একক রূপান্তর ও আয়তন নির্ণয়ের নিয়মাবলী।"
        howItWorks={[
          '১ শতক (ডেসিমেল) = ৪৩৫.৬ বর্গফুট = ৪০.৪৬৯ বর্গমিটার।',
          '১ কাঠা = ১.৬৫ শতক = ৭২০ বর্গফুট।',
          '১ বিঘা = ২০ কাঠা = ৩৩ শতক = ১৪,৪০০ বর্গফুট।',
          '১ একর = ১০০ শতক = ৩ বিঘা ৮ ছটাক = ৪৩,৫৬০ বর্গফুট।',
          '১ ছটাক = ৪৫ বর্গফুট = ১/১৬ কাঠা।',
          'চারকোণা জমির মাপ: সাধারণ জরিপে গড় দৈর্ঘ্য ও গড় প্রস্থ গুণ করে বর্গফুট বের করে ৪৩৫.৬ দিয়ে ভাগ দিয়ে শতক বের করা হয়। কর্ণ জানা থাকলে হেরন্স সূত্রের সাহায্যে নিখুঁত আয়তন পাওয়া যায়।',
        ]}
      />
    </CalculatorWrapper>
  );
};
