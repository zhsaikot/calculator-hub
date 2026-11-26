export type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'speed';

export interface UnitCategoryData {
  name: string;
  units: string[];
  toBase: number[] | null; // null for temperature
}

export const CONVERTER_DATA: Record<UnitCategory, UnitCategoryData> = {
  length: {
    name: 'Length',
    units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Mile', 'Yard', 'Foot', 'Inch', 'Nautical Mile'],
    toBase: [1, 1000, 0.01, 0.001, 1609.344, 0.9144, 0.3048, 0.0254, 1852],
  },
  weight: {
    name: 'Weight',
    units: ['Kilogram', 'Gram', 'Milligram', 'Metric Tonne', 'Pound', 'Ounce', 'Stone', 'Carat'],
    toBase: [1, 0.001, 0.000001, 1000, 0.45359237, 0.028349523, 6.35029318, 0.0002],
  },
  temperature: {
    name: 'Temperature',
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    toBase: null,
  },
  area: {
    name: 'Area',
    units: ['Square Meter', 'Square Kilometer', 'Square Mile', 'Square Yard', 'Square Foot', 'Square Inch', 'Hectare', 'Acre'],
    toBase: [1, 1e6, 2589988.11, 0.83612736, 0.09290304, 0.00064516, 10000, 4046.85642],
  },
  speed: {
    name: 'Speed',
    units: ['Meter/sec', 'Kilometer/hour', 'Mile/hour', 'Foot/sec', 'Knot'],
    toBase: [1, 0.277777778, 0.44704, 0.3048, 0.514444444],
  },
};

export function convertUnits(
  category: UnitCategory,
  fromIdx: number,
  toIdx: number,
  val: number
): number {
  if (isNaN(val)) return NaN;
  if (fromIdx === toIdx) return val;

  const data = CONVERTER_DATA[category];

  if (category === 'temperature') {
    // 0: Celsius, 1: Fahrenheit, 2: Kelvin
    let celsius: number;
    if (fromIdx === 0) celsius = val;
    else if (fromIdx === 1) celsius = ((val - 32) * 5) / 9;
    else celsius = val - 273.15;

    if (toIdx === 0) return Math.round(celsius * 10000) / 10000;
    if (toIdx === 1) return Math.round((celsius * (9 / 5) + 32) * 10000) / 10000;
    return Math.round((celsius + 273.15) * 10000) / 10000;
  }

  if (!data.toBase) return val;
  const baseVal = val * data.toBase[fromIdx];
  const converted = baseVal / data.toBase[toIdx];
  return Math.round(converted * 100000000) / 100000000;
}
