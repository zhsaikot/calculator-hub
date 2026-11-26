export const GRAMS_PER_VORI = 11.664;
export const ANA_PER_VORI = 16;
export const ROTI_PER_ANA = 6;
export const ROTI_PER_VORI = 96;

export interface WeightInput {
  vori?: number;
  ana?: number;
  roti?: number;
  grams?: number;
}

export interface GoldBreakdown {
  totalVori: number;
  totalGrams: number;
  vori: number;
  ana: number;
  roti: number;
  goldPrice: number;
  makingCharge: number;
  subtotal: number;
  vatAmount: number;
  totalPrice: number;
}

/**
 * Converts Vori, Ana, Roti into decimal Vori
 */
export const toTotalVori = (input: WeightInput): number => {
  if (input.grams !== undefined && input.grams > 0) {
    return input.grams / GRAMS_PER_VORI;
  }
  const vori = input.vori || 0;
  const ana = input.ana || 0;
  const roti = input.roti || 0;

  return vori + ana / ANA_PER_VORI + roti / ROTI_PER_VORI;
};

export const fromTotalVori = (
  totalVori: number
): { vori: number; ana: number; roti: number; grams: number } => {
  const safeVori = Math.max(0, totalVori);
  const vori = Math.floor(safeVori);

  const remainingAfterVori = (safeVori - vori) * ANA_PER_VORI;
  const ana = Math.floor(remainingAfterVori);

  const remainingAfterAna = (remainingAfterVori - ana) * ROTI_PER_ANA;
  const roti = Math.round(remainingAfterAna * 10) / 10;

  const grams = Math.round(safeVori * GRAMS_PER_VORI * 1000) / 1000;

  return { vori, ana, roti, grams };
};

/**
 * Calculates total gold price based on BAJUS rate, making charge, and 5% VAT.
 */
export const calculateGoldPrice = (
  weight: WeightInput,
  pricePerVori: number,
  makingChargePerVori = 3500,
  vatRatePct = 5
): GoldBreakdown => {
  const totalVori = toTotalVori(weight);
  const { vori, ana, roti, grams: totalGrams } = fromTotalVori(totalVori);

  const goldPrice = Math.round(totalVori * pricePerVori);
  const makingCharge = Math.round(totalVori * makingChargePerVori);
  const subtotal = goldPrice + makingCharge;
  const vatAmount = Math.round((subtotal * vatRatePct) / 100);
  const totalPrice = subtotal + vatAmount;

  return {
    totalVori: Math.round(totalVori * 1000) / 1000,
    totalGrams,
    vori,
    ana,
    roti,
    goldPrice,
    makingCharge,
    subtotal,
    vatAmount,
    totalPrice,
  };
};
