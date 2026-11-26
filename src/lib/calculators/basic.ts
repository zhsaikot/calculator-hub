/**
 * Precision arithmetic helper to prevent IEEE 754 float precision errors (e.g. 0.1 + 0.2 = 0.30000000000000004)
 */
export function formatFloat(val: number, maxDecimals: number = 10): number {
  if (!isFinite(val) || isNaN(val)) return NaN;
  const factor = Math.pow(10, maxDecimals);
  return Math.round(val * factor) / factor;
}

export type BasicOperator = '+' | '-' | '*' | '/';

export interface BasicCalcState {
  current: string;
  prev: string;
  op: BasicOperator | null;
  newNum: boolean;
  expr: string;
}

export function createInitialBasicState(): BasicCalcState {
  return {
    current: '0',
    prev: '',
    op: null,
    newNum: true,
    expr: '',
  };
}

export function executeBasicOperation(a: number, b: number, op: BasicOperator): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
  }
}
