import React, { createContext, useContext, useEffect, useState } from 'react';
import { CalculationHistoryItem } from '../lib/calculators/types';

interface HistoryContextType {
  history: CalculationHistoryItem[];
  addHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calchub_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('calchub_history', JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save calculation history:', e);
    }
  }, [history]);

  const addHistory = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: CalculationHistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev.filter(h => h.summary !== newItem.summary).slice(0, 49)]);
  };

  const clearHistory = () => setHistory([]);

  const removeHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory, clearHistory, removeHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};
