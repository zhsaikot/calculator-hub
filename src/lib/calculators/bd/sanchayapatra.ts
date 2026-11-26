export type SanchayapatraSchemeId =
  | 'paribar' // পরিবার সঞ্চয়পত্র (মাসিক মুনাফা)
  | 'three_month' // ৩ মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র (ত্রৈমাসিক)
  | 'pensioner' // পেনশনার সঞ্চয়পত্র (ত্রৈমাসিক)
  | 'five_year_bd'; // ৫ বছর মেয়াদী বাংলাদেশ সঞ্চয়পত্র

export interface SanchayapatraScheme {
  id: SanchayapatraSchemeId;
  name: string;
  banglaName: string;
  termYears: number;
  payoutInterval: 'monthly' | 'quarterly' | 'at_maturity';
  payoutName: string;
  maxLimit: number;
  rates: {
    tier1: number; // up to 15 Lakh
    tier2: number; // 15 Lakh to 30 Lakh
    tier3: number; // above 30 Lakh
  };
}

export const SANCHAYAPATRA_SCHEMES: Record<SanchayapatraSchemeId, SanchayapatraScheme> = {
  paribar: {
    id: 'paribar',
    name: 'Paribar Sanchayapatra',
    banglaName: 'পরিবার সঞ্চয়পত্র (৫ বছর মেয়াদী)',
    termYears: 5,
    payoutInterval: 'monthly',
    payoutName: 'মাসিক কিস্তি',
    maxLimit: 4500000, // 45 Lakh
    rates: { tier1: 11.52, tier2: 10.3, tier3: 9.3 },
  },
  three_month: {
    id: 'three_month',
    name: '3-Month Profit Bearing',
    banglaName: '৩ মাস অন্তর মুনাফাভিত্তিক সঞ্চয়পত্র (৩ বছর)',
    termYears: 3,
    payoutInterval: 'quarterly',
    payoutName: '৩ মাস পর পর কিস্তি',
    maxLimit: 3000000, // 30 Lakh individual
    rates: { tier1: 11.04, tier2: 10.0, tier3: 9.0 },
  },
  pensioner: {
    id: 'pensioner',
    name: 'Pensioner Sanchayapatra',
    banglaName: 'পেনশনার সঞ্চয়পত্র (৫ বছর মেয়াদী)',
    termYears: 5,
    payoutInterval: 'quarterly',
    payoutName: '৩ মাস পর পর কিস্তি',
    maxLimit: 5000000, // 50 Lakh
    rates: { tier1: 11.76, tier2: 10.75, tier3: 9.75 },
  },
  five_year_bd: {
    id: 'five_year_bd',
    name: '5-Year Bangladesh Sanchayapatra',
    banglaName: '৫ বছর মেয়াদী বাংলাদেশ সঞ্চয়পত্র',
    termYears: 5,
    payoutInterval: 'at_maturity',
    payoutName: 'মেয়াদান্তে এককালীন',
    maxLimit: 3000000,
    rates: { tier1: 11.28, tier2: 10.2, tier3: 9.2 },
  },
};

export interface SanchayapatraResult {
  scheme: SanchayapatraScheme;
  principalAmount: number;
  tdsRatePct: number;
  grossAnnualProfit: number;
  annualTdsDeduction: number;
  netAnnualProfit: number;
  periodsPerYear: number;
  grossPeriodicProfit: number;
  periodicTdsDeduction: number;
  netPeriodicProfit: number;
  totalTermGrossProfit: number;
  totalTermTds: number;
  totalTermNetProfit: number;
  totalMaturityPayout: number;
}

/**
 * Calculates Sanchayapatra profit and source tax deduction (TDS)
 */
export const calculateSanchayapatraProfit = (
  schemeId: SanchayapatraSchemeId,
  principalAmount: number,
  hasTin = true
): SanchayapatraResult => {
  const scheme = SANCHAYAPATRA_SCHEMES[schemeId] || SANCHAYAPATRA_SCHEMES.paribar;
  const amount = Math.max(0, principalAmount);

  // Slabs calculation for blended annual profit
  let remaining = amount;
  let grossAnnualProfit = 0;

  // Tier 1: up to 15,00,000
  if (remaining > 0) {
    const tier1Amt = Math.min(remaining, 1500000);
    grossAnnualProfit += tier1Amt * (scheme.rates.tier1 / 100);
    remaining -= tier1Amt;
  }

  // Tier 2: 15,00,001 to 30,00,000 (next 15 Lakh)
  if (remaining > 0) {
    const tier2Amt = Math.min(remaining, 1500000);
    grossAnnualProfit += tier2Amt * (scheme.rates.tier2 / 100);
    remaining -= tier2Amt;
  }

  // Tier 3: above 30,00,000
  if (remaining > 0) {
    grossAnnualProfit += remaining * (scheme.rates.tier3 / 100);
    remaining = 0;
  }

  // Source tax (TDS):
  // 5% if total cumulative investment is <= 5,00,000 BDT
  // 10% if total cumulative investment is > 5,00,000 BDT
  const tdsRatePct = amount <= 500000 ? 5 : hasTin ? 10 : 10;

  const annualTdsDeduction = Math.round(grossAnnualProfit * (tdsRatePct / 100));
  const netAnnualProfit = grossAnnualProfit - annualTdsDeduction;

  const periodsPerYear =
    scheme.payoutInterval === 'monthly' ? 12 : scheme.payoutInterval === 'quarterly' ? 4 : 1;

  const grossPeriodicProfit = Math.round((grossAnnualProfit / periodsPerYear) * 100) / 100;
  const periodicTdsDeduction = Math.round((annualTdsDeduction / periodsPerYear) * 100) / 100;
  const netPeriodicProfit = Math.round((netAnnualProfit / periodsPerYear) * 100) / 100;

  const totalTermGrossProfit = Math.round(grossAnnualProfit * scheme.termYears);
  const totalTermTds = Math.round(annualTdsDeduction * scheme.termYears);
  const totalTermNetProfit = Math.round(netAnnualProfit * scheme.termYears);
  const totalMaturityPayout = amount + (scheme.payoutInterval === 'at_maturity' ? totalTermNetProfit : 0);

  return {
    scheme,
    principalAmount: amount,
    tdsRatePct,
    grossAnnualProfit: Math.round(grossAnnualProfit),
    annualTdsDeduction,
    netAnnualProfit,
    periodsPerYear,
    grossPeriodicProfit,
    periodicTdsDeduction,
    netPeriodicProfit,
    totalTermGrossProfit,
    totalTermTds,
    totalTermNetProfit,
    totalMaturityPayout,
  };
};
