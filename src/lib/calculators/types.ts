export type CalculatorId =
  | 'basic'
  | 'scientific'
  | 'age'
  | 'percentage'
  | 'loan-emi'
  | 'compound-interest'
  | 'converter'
  | 'bmi'
  | 'discount'
  | 'profit-loss'
  | 'tax'
  // Bangladeshi Special Tools
  | 'bd-gpa'
  | 'bd-payscale'
  | 'bd-mfs'
  | 'bd-land'
  | 'bd-tax'
  | 'bd-sanchayapatra'
  | 'bd-gold';

export type CalculatorCategory = 'Basic' | 'International' | 'Bangladesh';

export interface CalculatorMeta {
  id: CalculatorId;
  title: string;
  shortDesc: string;
  category: CalculatorCategory;
  icon: string; // Lucide icon name
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
  note?: string;
}
