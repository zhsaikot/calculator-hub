export type CalculatorId =
  | 'basic'
  | 'scientific'
  | 'age'
  | 'bmi'
  | 'tax'
  | 'profit-loss'
  | 'loan-emi'
  | 'percentage'
  | 'converter'
  | 'compound-interest'
  | 'discount';

export interface CalculatorMeta {
  id: CalculatorId;
  title: string;
  shortDesc: string;
  category: 'General' | 'Finance' | 'Health' | 'Utility';
  icon: string; // Lucide icon name or emoji
  badge?: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export interface CalculationHistoryItem {
  id: string;
  calculatorId: CalculatorId;
  calculatorTitle: string;
  summary: string;
  result: string;
  timestamp: number;
}
