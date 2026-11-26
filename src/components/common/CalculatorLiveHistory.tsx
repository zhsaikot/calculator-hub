import React, { useState } from 'react';
import { useHistory } from '../../context/HistoryContext';
import { CalculatorId } from '../../lib/calculators/types';
import {
  Clock,
  Trash2,
  Share2,
  Download,
  Edit2,
  Check,
  X,
  CornerDownLeft,
  CheckCheck,
} from 'lucide-react';

interface CalculatorLiveHistoryProps {
  calculatorId: CalculatorId;
  calculatorTitle?: string;
  onSelectResult?: (value: string) => void;
  className?: string;
}

export const CalculatorLiveHistory: React.FC<CalculatorLiveHistoryProps> = ({
  calculatorId,
  calculatorTitle = 'Basic Calculator',
  onSelectResult,
  className = '',
}) => {
  const { history, removeHistoryItem, updateHistoryItem, clearHistory } = useHistory();

  // Filter history for this specific calculator
  const calcHistory = history.filter(item => item.calculatorId === calculatorId);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSummary, setEditSummary] = useState('');
  const [editResult, setEditResult] = useState('');
  const [editNote, setEditNote] = useState('');

  // Toast / copy feedback
  const [copied, setCopied] = useState(false);

  const startEdit = (item: { id: string; summary: string; result: string; note?: string }) => {
    setEditingId(item.id);
    setEditSummary(item.summary);
    setEditResult(item.result);
    setEditNote(item.note || '');
  };

  const saveEdit = (id: string) => {
    updateHistoryItem(id, {
      summary: editSummary.trim(),
      result: editResult.trim(),
      note: editNote.trim() || undefined,
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Format history as plain text
  const generatePlainText = () => {
    const timestamp = new Date().toLocaleString();
    let text = `==================================================\n`;
    text += `CalcHub Calculation History (${calculatorTitle})\n`;
    text += `Exported on: ${timestamp}\n`;
    text += `URL: https://zhsaikot.github.io/calculator-hub/\n`;
    text += `==================================================\n\n`;

    if (calcHistory.length === 0) {
      text += `No calculations recorded.\n`;
    } else {
      calcHistory.forEach((item, index) => {
        const time = new Date(item.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const noteStr = item.note ? ` [Note: ${item.note}]` : '';
        text += `[${index + 1}] ${item.summary} ${item.result}${noteStr}\n`;
        text += `    Time: ${time}\n\n`;
      });
      text += `--------------------------------------------------\n`;
      text += `Total calculations: ${calcHistory.length}\n`;
      text += `==================================================\n`;
    }
    return text;
  };

  // Download as .txt file
  const handleDownloadTxt = () => {
    const text = generatePlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `calchub-${calculatorId}-history-${dateStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share or copy history
  const handleShare = async () => {
    const text = generatePlainText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CalcHub ${calculatorTitle} History`,
          text: text,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Unable to copy to clipboard.');
    }
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header with Title and Actions */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-zinc-100">
                Live History
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                {calcHistory.length} {calcHistory.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Action buttons: Share & Download */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              disabled={calcHistory.length === 0}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                calcHistory.length === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-zinc-800 text-slate-400'
                  : copied
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-750 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
              }`}
              title={copied ? 'Copied!' : 'Share / Copy History'}
              aria-label="Share history"
            >
              {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              disabled={calcHistory.length === 0}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                calcHistory.length === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-zinc-800 text-slate-400'
                  : 'bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-750 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
              }`}
              title="Download as .txt"
              aria-label="Download history"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">.TXT</span>
            </button>
          </div>
        </div>

        {/* Calculations List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {calcHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-zinc-500 text-xs flex flex-col items-center justify-center">
              <Clock className="w-8 h-8 mb-2 opacity-30 stroke-1" />
              <p className="font-medium">No calculations yet</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Perform calculations with the keypad to see your live tape here.
              </p>
            </div>
          ) : (
            calcHistory.map(item => {
              const isEditing = editingId === item.id;
              const formattedTime = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              if (isEditing) {
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2"
                  >
                    <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Edit Calculation Item
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Expression / Summary:</label>
                      <input
                        type="text"
                        value={editSummary}
                        onChange={e => setEditSummary(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Result:</label>
                      <input
                        type="text"
                        value={editResult}
                        onChange={e => setEditResult(e.target.value)}
                        className="w-full px-2 py-1 text-xs font-bold rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Note / Label (Optional):</label>
                      <input
                        type="text"
                        placeholder="e.g. Rent, Groceries, Total"
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={cancelEdit}
                        className="p-1 rounded text-slate-500 hover:bg-slate-200 dark:hover:bg-zinc-800 text-[11px] flex items-center gap-1 px-2"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-1 rounded bg-blue-600 text-white text-[11px] font-semibold flex items-center gap-1 px-2.5 shadow-xs"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="group relative p-3 rounded-xl bg-slate-50 dark:bg-zinc-850/70 border border-slate-200/80 dark:border-zinc-800 hover:border-blue-500/40 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-0.5">
                        <span className="font-mono">{formattedTime}</span>
                        {item.note && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-medium border border-amber-200 dark:border-amber-900/50 truncate max-w-[120px]">
                            {item.note}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono text-slate-600 dark:text-zinc-400 truncate">
                        {item.summary}
                      </div>

                      <div className="text-base font-bold font-display text-slate-900 dark:text-zinc-100 tracking-tight">
                        {item.result}
                      </div>
                    </div>

                    {/* Quick Action Icons */}
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {onSelectResult && (
                        <button
                          onClick={() => onSelectResult(item.result)}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                          title="Load into calculator"
                          aria-label="Reuse result"
                        >
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/60 dark:hover:bg-zinc-700 transition-colors"
                        title="Edit calculation"
                        aria-label="Edit item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => removeHistoryItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete from history"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer / Clear All */}
      {calcHistory.length > 0 && (
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Click <CornerDownLeft className="w-3 h-3 inline mx-0.5" /> to reuse result
          </span>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-500 transition-colors py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        </div>
      )}
    </div>
  );
};
