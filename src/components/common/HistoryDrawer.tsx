import React from 'react';
import { useHistory } from '../../context/HistoryContext';
import { Clock, Trash2, X, ArrowUpRight } from 'lucide-react';
import { CalculatorId } from '../../lib/calculators/types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (id: CalculatorId) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
}) => {
  const { history, clearHistory, removeHistoryItem } = useHistory();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-up">
      <div className="w-full max-w-sm h-full flex flex-col bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <Clock className="w-5 h-5 text-indigo-400" />
            Calculation History
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No recent calculations recorded yet. Perform calculations to see your history here!
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                className="group relative p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-1">
                  <span>{item.calculatorTitle}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-zinc-400 mb-1.5 font-mono line-clamp-1">
                  {item.summary}
                </div>
                <div className="text-sm font-bold font-display text-slate-900 dark:text-zinc-100">
                  {item.result}
                </div>

                <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <button
                    onClick={() => {
                      onSelectCalculator(item.calculatorId);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:underline"
                  >
                    Open tool <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeHistoryItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <span className="text-xs text-slate-500">{history.length} saved items</span>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
