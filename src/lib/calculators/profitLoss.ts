export interface ProfitLossResult {
  revenue: number;
  totalCost: number;
  profitLossAmount: number;
  isProfit: boolean;
  profitLossPercentage: number;
  profitMarginPercentage: number;
}

export function calculateProfitLoss(
  costPrice: number,
  sellingPrice: number,
  quantity: number = 1,
  overheadCosts: number = 0
): ProfitLossResult | { error: string } {
  if (costPrice <= 0 || sellingPrice <= 0) {
    return { error: 'Cost price and selling price must be greater than zero.' };
  }
  if (quantity <= 0) {
    return { error: 'Quantity must be at least 1.' };
  }
  if (overheadCosts < 0) {
    return { error: 'Overhead costs cannot be negative.' };
  }

  const revenue = sellingPrice * quantity;
  const totalCost = costPrice * quantity + overheadCosts;
  const profitLossAmount = revenue - totalCost;
  const isProfit = profitLossAmount >= 0;

  const profitLossPercentage = totalCost > 0 ? (profitLossAmount / totalCost) * 100 : 0;
  const profitMarginPercentage = revenue > 0 ? (profitLossAmount / revenue) * 100 : 0;

  return {
    revenue: Math.round(revenue * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    profitLossAmount: Math.round(profitLossAmount * 100) / 100,
    isProfit,
    profitLossPercentage: Math.round(profitLossPercentage * 100) / 100,
    profitMarginPercentage: Math.round(profitMarginPercentage * 100) / 100,
  };
}
