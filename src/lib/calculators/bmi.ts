export type BmiUnit = 'metric' | 'imperial';

export interface BmiResult {
  bmi: number;
  category: string;
  categoryColor: string;
  healthyWeightRange: string;
  needlePercent: number; // 0 - 100 for gauge visualization
  healthTip: string;
}

export function calculateBMI(
  weight: number,
  height: number,
  unit: BmiUnit = 'metric'
): BmiResult | { error: string } {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return { error: 'Please enter positive values for weight and height.' };
  }

  let bmi: number;
  let healthyMinWeight: number;
  let healthyMaxWeight: number;

  if (unit === 'metric') {
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
    healthyMinWeight = 18.5 * (heightInMeters * heightInMeters);
    healthyMaxWeight = 24.9 * (heightInMeters * heightInMeters);
  } else {
    bmi = (703 * weight) / (height * height);
    healthyMinWeight = (18.5 * (height * height)) / 703;
    healthyMaxWeight = (24.9 * (height * height)) / 703;
  }

  bmi = Math.round(bmi * 10) / 10;
  healthyMinWeight = Math.round(healthyMinWeight * 10) / 10;
  healthyMaxWeight = Math.round(healthyMaxWeight * 10) / 10;

  const unitSuffix = unit === 'metric' ? 'kg' : 'lbs';
  const healthyWeightRange = `${healthyMinWeight} – ${healthyMaxWeight} ${unitSuffix}`;

  let category = 'Normal Weight';
  let categoryColor = '#34d399'; // green
  let healthTip = 'You are within a healthy body mass range. Maintain a balanced diet and regular activity.';

  if (bmi < 16) {
    category = 'Severe Thinness';
    categoryColor = '#3b82f6';
    healthTip = 'Significantly below healthy range. Consulting a healthcare provider or nutritionist is recommended.';
  } else if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = '#60a5fa';
    healthTip = 'Slightly below healthy weight. Consider nutrient-rich calorie-dense whole foods.';
  } else if (bmi < 25) {
    category = 'Normal Weight';
    categoryColor = '#34d399';
    healthTip = 'Great job! Your BMI is in the optimal health range.';
  } else if (bmi < 30) {
    category = 'Overweight';
    categoryColor = '#fbbf24';
    healthTip = 'Higher than optimal weight. Regular cardiovascular exercise and portion control can help.';
  } else if (bmi < 35) {
    category = 'Obesity Class I';
    categoryColor = '#f87171';
    healthTip = 'Elevated health risks. A structured fitness and dietary plan is recommended.';
  } else {
    category = 'Obesity Class II+';
    categoryColor = '#dc2626';
    healthTip = 'High risk of cardiovascular and metabolic issues. Professional medical guidance is advised.';
  }

  // Gauge needle percent: 12 (0%) to 40 (100%)
  const needlePercent = Math.min(100, Math.max(0, ((bmi - 12) / 28) * 100));

  return {
    bmi,
    category,
    categoryColor,
    healthyWeightRange,
    needlePercent,
    healthTip,
  };
}
