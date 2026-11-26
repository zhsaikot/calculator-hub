export interface AmortizationRow {
  month: number;
  emi: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
}

export interface LoanResult {
  monthlyEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  interestRatioPercentage: number;
  schedule: AmortizationRow[];
}

export function calculateLoan(
  principal: number,
  annualInterestRate: number,
  termYears: number
): LoanResult | { error: string } {
  if (principal <= 0 || termYears <= 0) {
    return { error: 'Loan principal and term must be greater than zero.' };
  }
  if (annualInterestRate < 0) {
    return { error: 'Interest rate cannot be negative.' };
  }

  const n = Math.round(termYears * 12);
  const monthlyRate = annualInterestRate / 100 / 12;

  let emi: number;
  if (monthlyRate === 0) {
    emi = principal / n;
  } else {
    const factor = Math.pow(1 + monthlyRate, n);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  const interestRatioPercentage = principal > 0 ? (totalInterest / principal) * 100 : 0;

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= n; month++) {
    const interestPayment = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPayment = emi - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month,
      emi: Math.round(emi * 100) / 100,
      principalPayment: Math.round(principalPayment * 100) / 100,
      interestPayment: Math.round(interestPayment * 100) / 100,
      remainingBalance: Math.round(balance * 100) / 100,
    });
  }

  return {
    monthlyEmi: Math.round(emi * 100) / 100,
    totalPrincipal: Math.round(principal * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    interestRatioPercentage: Math.round(interestRatioPercentage * 10) / 10,
    schedule,
  };
}

export function exportScheduleToCsv(schedule: AmortizationRow[]): string {
  const headers = 'Month,Monthly EMI,Principal Paid,Interest Paid,Remaining Balance\n';
  const rows = schedule
    .map(r => `${r.month},${r.emi},${r.principalPayment},${r.interestPayment},${r.remainingBalance}`)
    .join('\n');
  return headers + rows;
}
