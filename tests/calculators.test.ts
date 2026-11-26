import { describe, it, expect } from 'vitest';
import { executeBasicOperation, formatFloat } from '../src/lib/calculators/basic';
import { calculateSciFunction } from '../src/lib/calculators/scientific';
import { calculateAge } from '../src/lib/calculators/age';
import { calculateBMI } from '../src/lib/calculators/bmi';
import { calculateIncomeTax } from '../src/lib/calculators/tax';
import { calculateProfitLoss } from '../src/lib/calculators/profitLoss';
import { calculateLoan, exportScheduleToCsv } from '../src/lib/calculators/loan';
import { calculatePercentage, PercentageTypes } from '../src/lib/calculators/percentage';
import { convertUnits } from '../src/lib/calculators/converter';
import { calculateCompoundInterest } from '../src/lib/calculators/compoundInterest';
import { calculateDiscount } from '../src/lib/calculators/discount';

describe('Basic Calculator Engine', () => {
  it('correctly calculates basic arithmetic', () => {
    expect(executeBasicOperation(12, 4, '+')).toBe(16);
    expect(executeBasicOperation(12, 4, '-')).toBe(8);
    expect(executeBasicOperation(12, 4, '*')).toBe(48);
    expect(executeBasicOperation(12, 4, '/')).toBe(3);
  });

  it('safely handles division by zero', () => {
    expect(isNaN(executeBasicOperation(10, 0, '/'))).toBe(true);
  });

  it('avoids float precision errors (0.1 + 0.2)', () => {
    expect(formatFloat(0.1 + 0.2)).toBe(0.3);
  });
});

describe('Scientific Calculator Engine', () => {
  it('calculates trigonometric values in degree mode', () => {
    expect(calculateSciFunction('sin', 90, 'deg').result).toBe(1);
    expect(calculateSciFunction('cos', 0, 'deg').result).toBe(1);
    expect(calculateSciFunction('tan', 45, 'deg').result).toBe(1);
  });

  it('calculates logarithm and square roots', () => {
    expect(calculateSciFunction('log', 100).result).toBe(2);
    expect(calculateSciFunction('sqrt', 64).result).toBe(8);
    expect(isNaN(calculateSciFunction('sqrt', -4).result)).toBe(true);
  });

  it('calculates factorials accurately', () => {
    expect(calculateSciFunction('fact', 5).result).toBe(120);
    expect(calculateSciFunction('fact', 0).result).toBe(1);
  });
});

describe('Age Calculator Engine', () => {
  it('calculates exact age and handles leap years', () => {
    const res = calculateAge('2000-01-01', '2025-01-01');
    expect('years' in res).toBe(true);
    if ('years' in res) {
      expect(res.years).toBe(25);
      expect(res.months).toBe(0);
      expect(res.days).toBe(0);
    }
  });

  it('returns error if birth date is after target date', () => {
    const res = calculateAge('2025-01-01', '2020-01-01');
    expect('error' in res).toBe(true);
  });
});

describe('BMI Calculator Engine', () => {
  it('calculates metric BMI and category correctly', () => {
    // 70 kg, 175 cm => BMI 22.9 (Normal)
    const res = calculateBMI(70, 175, 'metric');
    expect('bmi' in res).toBe(true);
    if ('bmi' in res) {
      expect(res.bmi).toBe(22.9);
      expect(res.category).toBe('Normal Weight');
    }
  });

  it('calculates imperial BMI correctly', () => {
    // 154 lbs, 69 inches
    const res = calculateBMI(154, 69, 'imperial');
    expect('bmi' in res).toBe(true);
    if ('bmi' in res) {
      expect(res.bmi).toBe(22.7);
    }
  });
});

describe('Tax Calculator Engine', () => {
  it('computes taxable income, tax amount, and net pay', () => {
    const res = calculateIncomeTax(60000, 20, 10000, '$');
    expect('taxAmount' in res).toBe(true);
    if ('taxAmount' in res) {
      expect(res.taxableIncome).toBe(50000);
      expect(res.taxAmount).toBe(10000);
      expect(res.netIncome).toBe(50000);
      expect(res.effectiveRate).toBe(16.67);
    }
  });
});

describe('Profit & Loss Calculator Engine', () => {
  it('accurately computes profit margin and markup', () => {
    // CP 80, SP 100, Qty 10, Overhead 50 => Cost = 850, Rev = 1000, Profit = 150
    const res = calculateProfitLoss(80, 100, 10, 50);
    expect('isProfit' in res).toBe(true);
    if ('isProfit' in res) {
      expect(res.isProfit).toBe(true);
      expect(res.profitLossAmount).toBe(150);
      expect(res.profitMarginPercentage).toBe(15);
    }
  });
});

describe('Loan / EMI Calculator Engine', () => {
  it('accurately calculates monthly EMI and amortization schedule', () => {
    // 100000 loan, 10% annual rate, 1 year (12 months)
    const res = calculateLoan(100000, 10, 1);
    expect('monthlyEmi' in res).toBe(true);
    if ('monthlyEmi' in res) {
      expect(res.monthlyEmi).toBe(8791.59);
      expect(res.schedule.length).toBe(12);
      expect(res.schedule[11].remainingBalance).toBe(0);
    }
  });

  it('exports schedule to CSV format', () => {
    const res = calculateLoan(50000, 8, 0.5); // 6 months
    if ('schedule' in res) {
      const csv = exportScheduleToCsv(res.schedule);
      expect(csv).toContain('Month,Monthly EMI');
      expect(csv.split('\n').length).toBe(7); // header + 6 rows
    }
  });
});

describe('Percentage Calculator Engine', () => {
  it('evaluates all 6 percentage variations', () => {
    expect(calculatePercentage(PercentageTypes.WHAT_IS_X_PCT_OF_Y, 20, 500)).toBe(100);
    expect(calculatePercentage(PercentageTypes.X_IS_WHAT_PCT_OF_Y, 25, 100)).toBe(25);
    expect(calculatePercentage(PercentageTypes.PCT_CHANGE_X_TO_Y, 80, 100)).toBe(25);
    expect(calculatePercentage(PercentageTypes.INCREASE_X_BY_Y_PCT, 100, 15)).toBe(115);
    expect(calculatePercentage(PercentageTypes.DECREASE_X_BY_Y_PCT, 100, 15)).toBe(85);
    expect(calculatePercentage(PercentageTypes.X_PCT_OF_WHAT_IS_Y, 25, 50)).toBe(200);
  });
});

describe('Unit Converter Engine', () => {
  it('converts lengths accurately', () => {
    // 1 Kilometer to Meters
    expect(convertUnits('length', 1, 0, 1)).toBe(1000);
    // 1 Mile to Meters
    expect(convertUnits('length', 4, 0, 1)).toBe(1609.344);
  });

  it('converts temperatures across Celsius, Fahrenheit, and Kelvin', () => {
    // 0 C = 32 F
    expect(convertUnits('temperature', 0, 1, 0)).toBe(32);
    // 100 C = 212 F
    expect(convertUnits('temperature', 0, 1, 100)).toBe(212);
    // 0 C = 273.15 K
    expect(convertUnits('temperature', 0, 2, 0)).toBe(273.15);
  });
});

describe('Compound Interest Engine', () => {
  it('computes future value with monthly deposits', () => {
    // Principal $1000, 10% rate, 2 years, $100 monthly deposit
    const res = calculateCompoundInterest(1000, 10, 2, 100, 'monthly');
    expect('finalBalance' in res).toBe(true);
    if ('finalBalance' in res) {
      expect(res.finalBalance).toBeGreaterThan(3400);
      expect(res.schedule.length).toBe(2);
    }
  });
});

describe('Discount Calculator Engine', () => {
  it('computes discount and sales tax', () => {
    // $100 original, 20% discount, 5% tax => $80 discounted + $4 tax = $84
    const res = calculateDiscount(100, 20, 5);
    expect('finalPrice' in res).toBe(true);
    if ('finalPrice' in res) {
      expect(res.discountedPrice).toBe(80);
      expect(res.finalPrice).toBe(84);
      expect(res.totalSaved).toBe(20);
    }
  });
});
