export interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  deductions: number;
  taxAmount: number;
  netIncome: number;
  effectiveRate: number;
  currency: string;
}

export function calculateIncomeTax(
  grossIncome: number,
  taxRatePercent: number,
  deductions: number = 0,
  currency: string = '$'
): TaxResult | { error: string } {
  if (grossIncome < 0 || taxRatePercent < 0 || deductions < 0) {
    return { error: 'Values cannot be negative.' };
  }
  if (taxRatePercent > 100) {
    return { error: 'Tax rate cannot exceed 100%.' };
  }

  const taxableIncome = Math.max(0, grossIncome - deductions);
  const taxAmount = (taxableIncome * taxRatePercent) / 100;
  const netIncome = grossIncome - taxAmount;
  const effectiveRate = grossIncome > 0 ? (taxAmount / grossIncome) * 100 : 0;

  return {
    grossIncome: Math.round(grossIncome * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    deductions: Math.round(deductions * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    currency,
  };
}
