export const PercentageTypes = {
  WHAT_IS_X_PCT_OF_Y: 1,      // What is X% of Y?
  X_IS_WHAT_PCT_OF_Y: 2,      // X is what % of Y?
  PCT_CHANGE_X_TO_Y: 3,       // % Change from X to Y
  INCREASE_X_BY_Y_PCT: 4,     // Increase X by Y%
  DECREASE_X_BY_Y_PCT: 5,     // Decrease X by Y%
  X_PCT_OF_WHAT_IS_Y: 6,      // X% of what number is Y?
} as const;

export function calculatePercentage(type: number, x: number, y: number): number | { error: string } {
  if (isNaN(x) || isNaN(y)) {
    return { error: 'Please enter valid numbers.' };
  }

  switch (type) {
    case PercentageTypes.WHAT_IS_X_PCT_OF_Y:
      return Math.round((x / 100) * y * 10000) / 10000;

    case PercentageTypes.X_IS_WHAT_PCT_OF_Y:
      if (y === 0) return { error: 'Denominator cannot be zero.' };
      return Math.round(((x / y) * 100) * 10000) / 10000;

    case PercentageTypes.PCT_CHANGE_X_TO_Y:
      if (x === 0) return { error: 'Original value cannot be zero.' };
      return Math.round((((y - x) / Math.abs(x)) * 100) * 10000) / 10000;

    case PercentageTypes.INCREASE_X_BY_Y_PCT:
      return Math.round((x * (1 + y / 100)) * 10000) / 10000;

    case PercentageTypes.DECREASE_X_BY_Y_PCT:
      return Math.round((x * (1 - y / 100)) * 10000) / 10000;

    case PercentageTypes.X_PCT_OF_WHAT_IS_Y:
      if (x === 0) return { error: 'Percentage cannot be zero.' };
      return Math.round((y / (x / 100)) * 10000) / 10000;

    default:
      return { error: 'Invalid percentage calculation type.' };
  }
}
