import React, { useState } from 'react';
import { CalculatorWrapper } from '../../common/CalculatorWrapper';
import { CalculatorSEO } from '../../common/CalculatorSEO';
import { useHistory } from '../../../context/HistoryContext';
import {
  calculateBdgpa,
  GRADE_SCALE,
  BD_GPA_PRESETS,
  SubjectGrade,
} from '../../../lib/calculators/bd/gpaCalculator';
import { Award, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BdGpaCalculatorProps {
  onBack: () => void;
  onShare: () => void;
}

export const BdGpaCalculator: React.FC<BdGpaCalculatorProps> = ({ onBack, onShare }) => {
  const { addHistory } = useHistory();

  const [selectedPresetId, setSelectedPresetId] = useState('ssc-science');

  const [mainSubjects, setMainSubjects] = useState<SubjectGrade[]>(() => {
    const preset = BD_GPA_PRESETS[0];
    return preset.mainSubjects.map((name, i) => ({
      id: `sub-${i}`,
      name,
      point: 5.0,
      grade: 'A+',
    }));
  });

  const [fourthSubject, setFourthSubject] = useState<SubjectGrade>(() => {
    const preset = BD_GPA_PRESETS[0];
    return {
      id: 'sub-4th',
      name: preset.fourthSubject,
      point: 5.0,
      grade: 'A+',
      isOptional: true,
    };
  });

  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = BD_GPA_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setMainSubjects(
      preset.mainSubjects.map((name, i) => ({
        id: `sub-${i}-${Date.now()}`,
        name,
        point: 5.0,
        grade: 'A+',
      }))
    );
    setFourthSubject({
      id: `sub-4th-${Date.now()}`,
      name: preset.fourthSubject,
      point: 5.0,
      grade: 'A+',
      isOptional: true,
    });
  };

  const handleUpdateMainGrade = (index: number, point: number) => {
    const found = GRADE_SCALE.find(g => g.point === point);
    setMainSubjects(prev =>
      prev.map((sub, i) =>
        i === index ? { ...sub, point, grade: found?.grade || 'A+' } : sub
      )
    );
  };

  const handleUpdateFourthGrade = (point: number) => {
    const found = GRADE_SCALE.find(g => g.point === point);
    setFourthSubject(prev => ({ ...prev, point, grade: found?.grade || 'A+' }));
  };

  const handleAddSubject = () => {
    setMainSubjects(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: `Additional Subject ${prev.length + 1}`,
        point: 5.0,
        grade: 'A+',
      },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    if (mainSubjects.length <= 1) return;
    setMainSubjects(prev => prev.filter((_, i) => i !== index));
  };

  const result = calculateBdgpa(mainSubjects, fourthSubject);

  const handleSaveCalculation = () => {
    addHistory({
      calculatorId: 'bd-gpa',
      calculatorTitle: 'SSC / HSC GPA Calculator',
      summary: `${mainSubjects.length} subjects + 4th subject (${fourthSubject.name})`,
      result: `GPA: ${result.finalGpa.toFixed(2)} (${result.letterGrade})${
        result.isGoldenAPlus ? ' [Golden A+]' : ''
      }`,
    });
  };

  return (
    <CalculatorWrapper
      title="SSC / HSC GPA Calculator"
      subtitle="এসএসসি ও এইচএসসি ফলাফল হিসাব: ৪র্থ বিষয়ের বোনাস পয়েন্ট এবং গোল্ডেন A+ ভ্যালিডেশন"
      onBack={onBack}
      onShare={onShare}
    >
      <div className="space-y-6">
        {/* Presets Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
            Select Exam & Group (পরীক্ষা ও বিভাগ নির্বাচন করুন)
          </label>
          <div className="flex gap-2 flex-wrap">
            {BD_GPA_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedPresetId === preset.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Banner */}
        <div
          className={`p-6 rounded-2xl border transition-all shadow-sm ${
            !result.isPassed
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
              : result.isGoldenAPlus
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60'
              : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {result.isPassed ? (
                  result.isGoldenAPlus ? (
                    <Award className="w-6 h-6 text-amber-500 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  {result.isPassed ? 'Estimated Result' : 'Status: Failed'}
                </span>
                {result.isGoldenAPlus && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500 text-white shadow-xs">
                    ★ Golden A+
                  </span>
                )}
              </div>

              <div className="mt-1 font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-zinc-100">
                GPA {result.finalGpa.toFixed(2)}{' '}
                <span className="text-lg font-bold text-slate-500 dark:text-zinc-400">
                  ({result.letterGrade})
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">{result.summary}</p>
            </div>

            <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto">
              <button
                onClick={handleSaveCalculation}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 shadow-xs"
              >
                Save Result
              </button>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-zinc-400">Main Subjects:</span>
              <div className="font-bold text-slate-900 dark:text-zinc-100">
                {result.totalMainSubjects} Subjects
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-zinc-400">Total Main Points:</span>
              <div className="font-bold text-slate-900 dark:text-zinc-100">
                {result.totalMainPoints.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-zinc-400">4th Subject Bonus:</span>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                +{result.fourthSubjectBonus.toFixed(2)} pts
              </div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-zinc-400">Calculated Sum:</span>
              <div className="font-bold text-slate-900 dark:text-zinc-100">
                {result.totalCalculatedPoints.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-zinc-100">
              Compulsory & Main Subjects (আবশ্যিক ও প্রধান বিষয়সমূহ)
            </h3>
            <button
              onClick={handleAddSubject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subject
            </button>
          </div>

          <div className="space-y-2">
            {mainSubjects.map((sub, idx) => (
              <div
                key={sub.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-5 text-xs font-mono text-slate-400">{idx + 1}.</span>
                  <input
                    type="text"
                    value={sub.name}
                    onChange={e => {
                      const val = e.target.value;
                      setMainSubjects(prev =>
                        prev.map((s, i) => (i === idx ? { ...s, name: val } : s))
                      );
                    }}
                    className="flex-1 bg-transparent text-xs font-semibold text-slate-800 dark:text-zinc-200 outline-none truncate"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={sub.point}
                    onChange={e => handleUpdateMainGrade(idx, parseFloat(e.target.value))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none ${
                      sub.point >= 5.0
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
                        : sub.point === 0
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-900/50'
                        : 'bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border-slate-200 dark:border-zinc-700'
                    }`}
                  >
                    {GRADE_SCALE.map(g => (
                      <option key={g.grade} value={g.point} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                        {g.grade} ({g.point.toFixed(2)})
                      </option>
                    ))}
                  </select>

                  {mainSubjects.length > 1 && (
                    <button
                      onClick={() => handleRemoveSubject(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
                      title="Remove subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4th Subject Section */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                4th Subject (৪র্থ / ঐচ্ছিক বিষয়)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                ২.০০ এর উপরের যে কোনো পয়েন্ট বোনাস হিসেবে মূল পয়েন্টে যোগ হবে (সর্বোচ্চ জিপিএ ৫.০০)।
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <input
              type="text"
              value={fourthSubject.name}
              onChange={e => setFourthSubject({ ...fourthSubject, name: e.target.value })}
              className="flex-1 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 outline-none"
            />
            <select
              value={fourthSubject.point}
              onChange={e => handleUpdateFourthGrade(parseFloat(e.target.value))}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-amber-300 dark:border-amber-800 bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 outline-none"
            >
              {GRADE_SCALE.map(g => (
                <option key={g.grade} value={g.point} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
                  {g.grade} ({g.point.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <CalculatorSEO
        formulaTitle="বাংলাদেশ শিক্ষা বোর্ডের এসএসসি ও এইচএসসি জিপিএ নির্ণয়ের নিয়ম"
        formulaDesc="জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) এবং সকল শিক্ষা বোর্ডের গ্রেডিং নীতিমালা অনুযায়ী জিপিএ গণনা করা হয়।"
        formulaMath="Final GPA = min(5.00, [মোট আবশ্যিক পয়েন্ট + max(0, ৪র্থ বিষয়ের পয়েন্ট - ২.০০)] ÷ মোট আবশ্যিক বিষয়)"
        howItWorks={[
          'গ্রেড পয়েন্ট স্কেল: ৮০-১০০ (A+ = ৫.০০), ৭০-৭৯ (A = ৪.০০), ৬০-৬৯ (A- = ৩.৫০), ৫০-৫৯ (B = ৩.০০), ৪০-৪৯ (C = ২.০০), ৩৩-৩৯ (D = ১.০০), ০-৩২ (F = ০.০০)।',
          '৪র্থ বিষয়ের সুবিধা: ৪র্থ বিষয়ে প্রাপ্ত পয়েন্ট থেকে ২.০০ বাদ দিয়ে বাকি পয়েন্ট বোনাস হিসেবে মূল পয়েন্টে যোগ হয়। যেমন: ৪র্থ বিষয়ে ৫.০০ পেলে বোনাস ৩.০০, ৩.৫০ পেলে বোনাস ১.৫০।',
          'ফেল নিয়ম: কোনো আবশ্যিক বিষয়ে F (০.০০) পেলে সামগ্রিক ফলাফল অকৃতকার্য (GPA 0.00) হবে। ৪র্থ বিষয়ে F পেলে ফেল হয় না, তবে কোনো বোনাস পয়েন্ট যোগ হবে না।',
          'গোল্ডেন A+: ৪র্থ বিষয় সহ সকল বিষয়ে আলাদাভাবে ৫.০০ (A+) পেলে পরীক্ষার্থীকে গোল্ডেন A+ হিসেবে গণ্য করা হয়।',
        ]}
        faqs={[
          {
            question: '৪র্থ বিষয়ে ২.০০ পেলে কি কোনো পয়েন্ট যোগ হবে?',
            answer: 'না। নিয়মানুযায়ী ২.০০ এর উপরের পয়েন্ট যোগ হয়। তাই ২.০০ বা তার নিচে পয়েন্ট পেলে কোনো অতিরিক্ত পয়েন্ট যোগ হবে না।',
          },
          {
            question: '৪র্থ বিষয়ের বোনাস পয়েন্ট যোগ করে কি জিপিএ ৫.০০ এর বেশি হতে পারে?',
            answer: 'না। জাতীয় গ্রেডিং স্কেলে সর্বোচ্চ জিপিএ ৫.০০ নির্ধারিত। মোট পয়েন্ট যত বেশিই হোক না কেন, ফলাফল ৫.০০ এ ক্যাপ করা হবে।',
          },
        ]}
      />
    </CalculatorWrapper>
  );
};
