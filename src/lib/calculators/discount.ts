export interface DiscountResult {
  originalPrice: number;
  discountAmount: number;
  discountedPrice: number;
  taxAmount: number;
  finalPrice: number;
  totalSaved: number;
}

export function calculateDiscount(
  originalPrice: number,
  discountPercentage: number,
  taxPercentage: number = 0
): DiscountResult | { error: string } {
  if (originalPrice < 0 || discountPercentage < 0 || taxPercentage < 0) {
    return { error: 'Values cannot be negative.' };
  }
  if (discountPercentage > 100) {
    return { error: 'Discount cannot exceed 100%.' };
  }

  const discountAmount = (originalPrice * discountPercentage) / 100;
  const discountedPrice = originalPrice - discountAmount;
  const taxAmount = (discountedPrice * taxPercentage) / 100;
  const finalPrice = discountedPrice + taxAmount;
  const totalSaved = discountAmount;

  return {
    originalPrice: Math.round(originalPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    totalSaved: Math.round(totalSaved * 100) / 100,
  };
}
