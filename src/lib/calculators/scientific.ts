import { formatFloat } from './basic';

export type SciAngleMode = 'deg' | 'rad';

export function calculateSciFunction(
  fn: string,
  val: number,
  mode: SciAngleMode = 'deg'
): { result: number; expr: string } {
  const angleToRad = (x: number) => (mode === 'deg' ? (x * Math.PI) / 180 : x);

  switch (fn) {
    case 'sin':
      return { result: formatFloat(Math.sin(angleToRad(val))), expr: `sin(${val})` };
    case 'cos':
      return { result: formatFloat(Math.cos(angleToRad(val))), expr: `cos(${val})` };
    case 'tan': {
      // In deg mode, 90 + 180k has no tangent
      if (mode === 'deg' && Math.abs(val % 180) === 90) {
        return { result: NaN, expr: `tan(${val})` };
      }
      return { result: formatFloat(Math.tan(angleToRad(val))), expr: `tan(${val})` };
    }
    case 'log': // base 10
      return { result: val <= 0 ? NaN : formatFloat(Math.log10(val)), expr: `log(${val})` };
    case 'ln': // natural log
      return { result: val <= 0 ? NaN : formatFloat(Math.log(val)), expr: `ln(${val})` };
    case 'sqrt':
      return { result: val < 0 ? NaN : formatFloat(Math.sqrt(val)), expr: `√(${val})` };
    case 'sq':
      return { result: formatFloat(val * val), expr: `${val}²` };
    case 'cube':
      return { result: formatFloat(val * val * val), expr: `${val}³` };
    case 'inv':
      return { result: val === 0 ? NaN : formatFloat(1 / val), expr: `1/${val}` };
    case 'fact': {
      if (val < 0 || !Number.isInteger(val) || val > 170) return { result: NaN, expr: `${val}!` };
      let r = 1;
      for (let i = 2; i <= val; i++) r *= i;
      return { result: r, expr: `${val}!` };
    }
    default:
      return { result: val, expr: String(val) };
  }
}
