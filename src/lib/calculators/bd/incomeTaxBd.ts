export type TaxpayerCategory =
  | 'general' // Male <65: 350,000
  | 'female_senior' // Female or Male 65+: 400,000
  | 'disabled_third_gender' // 475,000
  | 'freedom_fighter'; // 500,000

export type TaxLocation =
  | 'dhaka_chattogram' // Min tax: 5,000
  | 'other_city' // Min tax: 4,000
  | 'outside_city'; // Min tax: 3,000

export interface BdTaxInput {
  annualIncome: number;
  category: TaxpayerCategory;
  location: TaxLocation;
  hasDisabledChild?: boolean; // +50,000
  eligibleInvestment?: number; // Sanchayapatra, DPS (max 1.2L), Life Insurance, Stocks
}

export interface TaxSlabBreakdown {
  slabName: string;
  taxableAmount: number;
  ratePct: number;
  taxAmount: number;
}

export interface BdTaxResult {
  annualIncome: number;
  taxFreeLimit: number;
  taxableIncome: number;
  grossTax: number;
  slabs: TaxSlabBreakdown[];
  investmentRebate: number;
  taxAfterRebate: number;
  minimumTax: number;
  netTaxPayable: number;
  effectiveTaxRate: number;
  monthlyTds: number;
}

export const getTaxFreeThreshold = (
  category: TaxpayerCategory,
  hasDisabledChild = false
): number => {
  let base = 350000;
  if (category === 'female_senior') base = 400000;
  else if (category === 'disabled_third_gender') base = 475000;
  else if (category === 'freedom_fighter') base = 500000;

  if (hasDisabledChild) base += 50000;
  return base;
};

export const getMinimumTaxByLocation = (location: TaxLocation): number => {
  if (location === 'dhaka_chattogram') return 5000;
  if (location === 'other_city') return 4000;
  return 3000;
};

/**
 * Calculates Bangladesh Individual Income Tax according to NBR FY 2024-25 / 2025-26 Finance Acts.
 */
export const calculateBdIncomeTax = (input: BdTaxInput): BdTaxResult => {
  const { annualIncome, category, location, hasDisabledChild = false, eligibleInvestment = 0 } = input;

  const taxFreeLimit = getTaxFreeThreshold(category, hasDisabledChild);
  const minimumTax = getMinimumTaxByLocation(location);

  const taxableIncome = Math.max(0, annualIncome - taxFreeLimit);

  const slabs: TaxSlabBreakdown[] = [];
  let remaining = taxableIncome;
  let grossTax = 0;

  // 1. First slab (Tax-free)
  slabs.push({
    slabName: `First ৳${taxFreeLimit.toLocaleString()} (Tax Free)`,
    taxableAmount: Math.min(annualIncome, taxFreeLimit),
    ratePct: 0,
    taxAmount: 0,
  });

  // 2. Next 100,000 @ 5%
  if (remaining > 0) {
    const amt = Math.min(remaining, 100000);
    const tax = Math.round(amt * 0.05);
    slabs.push({ slabName: 'Next ৳1,00,000', taxableAmount: amt, ratePct: 5, taxAmount: tax });
    grossTax += tax;
    remaining -= amt;
  }

  // 3. Next 400,000 @ 10%
  if (remaining > 0) {
    const amt = Math.min(remaining, 400000);
    const tax = Math.round(amt * 0.1);
    slabs.push({ slabName: 'Next ৳4,00,000', taxableAmount: amt, ratePct: 10, taxAmount: tax });
    grossTax += tax;
    remaining -= amt;
  }

  // 4. Next 500,000 @ 15%
  if (remaining > 0) {
    const amt = Math.min(remaining, 500000);
    const tax = Math.round(amt * 0.15);
    slabs.push({ slabName: 'Next ৳5,00,000', taxableAmount: amt, ratePct: 15, taxAmount: tax });
    grossTax += tax;
    remaining -= amt;
  }

  // 5. Next 500,000 @ 20%
  if (remaining > 0) {
    const amt = Math.min(remaining, 500000);
    const tax = Math.round(amt * 0.2);
    slabs.push({ slabName: 'Next ৳5,00,000', taxableAmount: amt, ratePct: 20, taxAmount: tax });
    grossTax += tax;
    remaining -= amt;
  }

  // 6. Remaining Balance @ 25%
  if (remaining > 0) {
    const amt = remaining;
    const tax = Math.round(amt * 0.25);
    slabs.push({ slabName: 'Remaining Balance', taxableAmount: amt, ratePct: 25, taxAmount: tax });
    grossTax += tax;
    remaining = 0;
  }

  // Investment Rebate calculation (15% on allowable investment or 3% of taxable income or ৳10L)
  let investmentRebate = 0;
  if (eligibleInvestment > 0 && taxableIncome > 0) {
    const maxAllowedInvestment = Math.min(eligibleInvestment, taxableIncome * 0.2, 10000000);
    const fifteenPct = maxAllowedInvestment * 0.15;
    const threePctTaxable = taxableIncome * 0.03;
    investmentRebate = Math.round(Math.min(fifteenPct, threePctTaxable, 1000000));
  }

  const taxAfterRebate = Math.max(0, grossTax - investmentRebate);

  // If taxable income > 0, tax cannot be less than minimum tax
  let netTaxPayable = 0;
  if (taxableIncome > 0) {
    netTaxPayable = Math.max(minimumTax, taxAfterRebate);
  }

  const effectiveTaxRate =
    annualIncome > 0 ? Math.round((netTaxPayable / annualIncome) * 10000) / 100 : 0;
  const monthlyTds = Math.round(netTaxPayable / 12);

  return {
    annualIncome,
    taxFreeLimit,
    taxableIncome,
    grossTax,
    slabs,
    investmentRebate,
    taxAfterRebate,
    minimumTax,
    netTaxPayable,
    effectiveTaxRate,
    monthlyTds,
  };
};
