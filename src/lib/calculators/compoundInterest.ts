export type CompoundingFrequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';

export interface CompoundInterestRow {
  year: number;
  startingBalance: number;
  interestEarned: number;
  deposits: number;
  endingBalance: number;
}

export interface CompoundInterestResult {
  initialPrincipal: number;
  totalDeposits: number;
  totalInterest: number;
  finalBalance: number;
  schedule: CompoundInterestRow[];
}

export function calculateCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  monthlyDeposit: number = 0,
  frequency: CompoundingFrequency = 'monthly'
): CompoundInterestResult | { error: string } {
  if (principal < 0 || annualRatePct < 0 || years <= 0 || monthlyDeposit < 0) {
    return { error: 'Please enter valid non-negative values.' };
  }

  const timesPerYearMap: Record<CompoundingFrequency, number> = {
    annually: 1,
    'semi-annually': 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  };

  const n = timesPerYearMap[frequency] || 12;
  const r = annualRatePct / 100;

  let currentBalance = principal;
  let totalDeposited = principal;
  const schedule: CompoundInterestRow[] = [];

  for (let y = 1; y <= years; y++) {
    const startBal = currentBalance;
    let annualInterest = 0;
    const yearDeposits = monthlyDeposit * 12;

    // Simulate 12 months in the year
    for (let m = 1; m <= 12; m++) {
      currentBalance += monthlyDeposit;
      // Compounding per month or frequency approximation
      const monthRate = Math.pow(1 + r / n, n / 12) - 1;
      const interestThisMonth = currentBalance * monthRate;
      annualInterest += interestThisMonth;
      currentBalance += interestThisMonth;
    }

    totalDeposited += yearDeposits;

    schedule.push({
      year: y,
      startingBalance: Math.round(startBal * 100) / 100,
      interestEarned: Math.round(annualInterest * 100) / 100,
      deposits: Math.round(yearDeposits * 100) / 100,
      endingBalance: Math.round(currentBalance * 100) / 100,
    });
  }

  const totalInterest = currentBalance - totalDeposited;

  return {
    initialPrincipal: Math.round(principal * 100) / 100,
    totalDeposits: Math.round(totalDeposited * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    finalBalance: Math.round(currentBalance * 100) / 100,
    schedule,
  };
}
