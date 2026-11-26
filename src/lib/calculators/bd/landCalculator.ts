export interface LandUnitsResult {
  sqFeet: number;
  sqMeters: number;
  shotok: number; // Decimal / শতাংশ / শতক
  katha: number; // কাঠা
  bigha: number; // বিঘা
  acre: number; // একর
  chotak: number; // ছটাক
}

export const SQ_FEET_PER = {
  SHOTOK: 435.6,
  KATHA: 720.0,
  BIGHA: 14400.0, // 20 katha
  ACRE: 43560.0, // 100 shotok
  CHOTAK: 45.0, // 1/16 katha
  SQ_METER: 10.7639,
};

export const convertFromSqFeet = (sqFeet: number): LandUnitsResult => {
  const safeSqFt = Math.max(0, sqFeet);
  return {
    sqFeet: Math.round(safeSqFt * 100) / 100,
    sqMeters: Math.round((safeSqFt / SQ_FEET_PER.SQ_METER) * 100) / 100,
    shotok: Math.round((safeSqFt / SQ_FEET_PER.SHOTOK) * 1000) / 1000,
    katha: Math.round((safeSqFt / SQ_FEET_PER.KATHA) * 1000) / 1000,
    bigha: Math.round((safeSqFt / SQ_FEET_PER.BIGHA) * 10000) / 10000,
    acre: Math.round((safeSqFt / SQ_FEET_PER.ACRE) * 10000) / 10000,
    chotak: Math.round((safeSqFt / SQ_FEET_PER.CHOTAK) * 100) / 100,
  };
};

export const convertToSqFeet = (
  value: number,
  unit: 'sqFeet' | 'shotok' | 'katha' | 'bigha' | 'acre' | 'chotak' | 'sqMeters'
): number => {
  const safeVal = Math.max(0, value);
  switch (unit) {
    case 'shotok':
      return safeVal * SQ_FEET_PER.SHOTOK;
    case 'katha':
      return safeVal * SQ_FEET_PER.KATHA;
    case 'bigha':
      return safeVal * SQ_FEET_PER.BIGHA;
    case 'acre':
      return safeVal * SQ_FEET_PER.ACRE;
    case 'chotak':
      return safeVal * SQ_FEET_PER.CHOTAK;
    case 'sqMeters':
      return safeVal * SQ_FEET_PER.SQ_METER;
    case 'sqFeet':
    default:
      return safeVal;
  }
};

export interface QuadrilateralLandInput {
  north: number; // Length 1 in feet
  south: number; // Length 2 in feet
  east: number; // Width 1 in feet
  west: number; // Width 2 in feet
  diagonal?: number; // Optional diagonal in feet for exact Heron's triangular calculation
}

/**
 * Calculates quadrilateral land area:
 * - If diagonal is provided: uses exact Heron's formula for two triangles (North, East, Diagonal) and (South, West, Diagonal).
 * - If diagonal is omitted: uses the standard surveyor average method: avgLength * avgWidth.
 */
export const calculateQuadrilateralLand = (
  input: QuadrilateralLandInput
): {
  sqFeet: number;
  units: LandUnitsResult;
  method: 'exact_heron' | 'average';
  avgLength: number;
  avgWidth: number;
} => {
  const { north, south, east, west, diagonal } = input;
  const avgLength = (north + south) / 2;
  const avgWidth = (east + west) / 2;

  let totalSqFeet = 0;
  let method: 'exact_heron' | 'average' = 'average';

  if (diagonal && diagonal > 0) {
    // Triangle 1: north, east, diagonal
    const s1 = (north + east + diagonal) / 2;
    const area1Sq = s1 * (s1 - north) * (s1 - east) * (s1 - diagonal);

    // Triangle 2: south, west, diagonal
    const s2 = (south + west + diagonal) / 2;
    const area2Sq = s2 * (s2 - south) * (s2 - west) * (s2 - diagonal);

    if (area1Sq > 0 && area2Sq > 0) {
      totalSqFeet = Math.sqrt(area1Sq) + Math.sqrt(area2Sq);
      method = 'exact_heron';
    } else {
      totalSqFeet = avgLength * avgWidth;
    }
  } else {
    totalSqFeet = avgLength * avgWidth;
  }

  return {
    sqFeet: Math.round(totalSqFeet * 100) / 100,
    units: convertFromSqFeet(totalSqFeet),
    method,
    avgLength: Math.round(avgLength * 100) / 100,
    avgWidth: Math.round(avgWidth * 100) / 100,
  };
};
