export interface PayScaleGrade {
  grade: number;
  basicMin: number;
  basicMax: number;
  increments: number; // typical annual increment percentage or amount
  description: string;
}

export const BD_PAY_GRADES: PayScaleGrade[] = [
  { grade: 1, basicMin: 78000, basicMax: 78000, increments: 0, description: 'Senior Secretary / Secretary (ফিক্সড)' },
  { grade: 2, basicMin: 66000, basicMax: 76490, increments: 5, description: 'Additional Secretary' },
  { grade: 3, basicMin: 56500, basicMax: 74400, increments: 5, description: 'Joint Secretary' },
  { grade: 4, basicMin: 50000, basicMax: 71200, increments: 5, description: 'Deputy Secretary' },
  { grade: 5, basicMin: 43000, basicMax: 69850, increments: 5, description: 'Senior Assistant Secretary' },
  { grade: 6, basicMin: 35500, basicMax: 67010, increments: 5, description: 'Assistant Secretary' },
  { grade: 7, basicMin: 29000, basicMax: 63410, increments: 5, description: 'Senior Officer' },
  { grade: 8, basicMin: 23000, basicMax: 60380, increments: 5, description: 'First Class Entry Level' },
  { grade: 9, basicMin: 22000, basicMax: 53060, increments: 5, description: 'BCS Cadre Entry / Officer' },
  { grade: 10, basicMin: 16000, basicMax: 38640, increments: 5, description: 'Second Class Officer / Sub-Assistant Engineer' },
  { grade: 11, basicMin: 12500, basicMax: 30230, increments: 5, description: 'Administrative Officer / Senior Staff' },
  { grade: 12, basicMin: 11300, basicMax: 27300, increments: 5, description: 'Officer Assistant' },
  { grade: 13, basicMin: 11000, basicMax: 26590, increments: 5, description: 'Upper Division Assistant (ইউডিএ)' },
  { grade: 14, basicMin: 10200, basicMax: 24680, increments: 5, description: 'Assistant' },
  { grade: 15, basicMin: 9700, basicMax: 23490, increments: 5, description: 'Computer Typist' },
  { grade: 16, basicMin: 9300, basicMax: 22490, increments: 5, description: 'Lower Division Assistant (এলডিএ)' },
  { grade: 17, basicMin: 9000, basicMax: 21800, increments: 5, description: 'Driver / Office Assistant' },
  { grade: 18, basicMin: 8800, basicMax: 21310, increments: 5, description: 'Junior Staff' },
  { grade: 19, basicMin: 8500, basicMax: 20570, increments: 5, description: 'Messenger' },
  { grade: 20, basicMin: 8250, basicMax: 20010, increments: 5, description: 'Office Sohayok (MLSS)' },
];

export type WorkLocation = 'dhaka' | 'other_city' | 'district' | 'upazila';

export interface PayScaleInput {
  grade: number;
  basicSalary: number;
  location: WorkLocation;
  childrenCount: number; // 0, 1, 2+
  gpfRate: number; // percentage, e.g. 10%
  serviceYears?: number; // for pension calculation, e.g. 25
  isSeniorCitizen?: boolean; // 65+ years for higher medical allowance
}

export interface PayScaleResult {
  grade: number;
  basicSalary: number;
  // Allowances
  houseRent: number;
  houseRentRatePct: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  tiffinAllowance: number;
  educationAllowance: number;
  grossSalary: number;
  // Deductions
  gpfDeduction: number;
  benevolentFund: number;
  groupInsurance: number;
  totalDeductions: number;
  // Net
  netSalary: number;
  // Pension Breakdown
  pensionInfo?: {
    fullPensionRate: number; // 90%
    grossMonthlyPension: number;
    surrenderedFiftyPct: number;
    monthlyPensionPayable: number;
    lumpSumGratuity: number;
    pensionMedicalAllowance: number;
    totalMonthlyInHandPension: number;
  };
}

/**
 * Calculates Bangladesh Government Pay Scale salary and pension
 */
export const calculateBdPayScale = (input: PayScaleInput): PayScaleResult => {
  const { grade, basicSalary, location, childrenCount, gpfRate, serviceYears, isSeniorCitizen } = input;

  // 1. House Rent calculation based on Location and Basic Pay
  let houseRentRatePct = 50;
  let minHouseRent = 4500;

  if (location === 'dhaka') {
    if (basicSalary <= 9700) {
      houseRentRatePct = 65;
      minHouseRent = 5600;
    } else if (basicSalary <= 16000) {
      houseRentRatePct = 60;
      minHouseRent = 6500;
    } else if (basicSalary <= 35500) {
      houseRentRatePct = 55;
      minHouseRent = 9600;
    } else {
      houseRentRatePct = 50;
      minHouseRent = 19500;
    }
  } else if (location === 'other_city') {
    if (basicSalary <= 9700) {
      houseRentRatePct = 55;
      minHouseRent = 4800;
    } else if (basicSalary <= 16000) {
      houseRentRatePct = 50;
      minHouseRent = 5400;
    } else if (basicSalary <= 35500) {
      houseRentRatePct = 45;
      minHouseRent = 8000;
    } else {
      houseRentRatePct = 40;
      minHouseRent = 16000;
    }
  } else {
    // District / Upazila
    if (basicSalary <= 9700) {
      houseRentRatePct = 50;
      minHouseRent = 4500;
    } else if (basicSalary <= 16000) {
      houseRentRatePct = 45;
      minHouseRent = 4800;
    } else if (basicSalary <= 35500) {
      houseRentRatePct = 40;
      minHouseRent = 7200;
    } else {
      houseRentRatePct = 35;
      minHouseRent = 14200;
    }
  }

  const calculatedHouseRent = Math.round((basicSalary * houseRentRatePct) / 100);
  const houseRent = Math.max(calculatedHouseRent, minHouseRent);

  // 2. Medical Allowance
  const medicalAllowance = isSeniorCitizen ? 2500 : 1500;

  // 3. Conveyance & Tiffin (Grade 10 to 20 employees without official vehicles)
  const conveyanceAllowance = grade >= 10 ? 300 : 0;
  const tiffinAllowance = grade >= 10 ? 200 : 0;

  // 4. Education Allowance (Tk 500 per child, max 2 children)
  const educationAllowance = Math.min(2, Math.max(0, childrenCount)) * 500;

  // Gross Salary
  const grossSalary =
    basicSalary +
    houseRent +
    medicalAllowance +
    conveyanceAllowance +
    tiffinAllowance +
    educationAllowance;

  // 5. Deductions
  const gpfDeduction = Math.round((basicSalary * Math.max(0, gpfRate)) / 100);
  const benevolentFund = Math.min(150, Math.round((basicSalary * 1) / 100)); // 1% capped at Tk 150
  const groupInsurance = 50; // standard Tk 50
  const totalDeductions = gpfDeduction + benevolentFund + groupInsurance;

  // Net Salary
  const netSalary = grossSalary - totalDeductions;

  // 6. Pension and Gratuity (if serviceYears is provided, standard full 25+ years gives 90%)
  let pensionInfo: PayScaleResult['pensionInfo'] = undefined;
  if (serviceYears && serviceYears >= 5) {
    const ratePct = serviceYears >= 25 ? 90 : Math.min(90, Math.round((serviceYears / 25) * 90));
    const grossMonthlyPension = Math.round((basicSalary * (ratePct / 100)));
    // 50% must be surrendered for lump sum gratuity, 50% drawn monthly
    const surrenderedFiftyPct = Math.round(grossMonthlyPension * 0.5);
    const monthlyPensionPayable = grossMonthlyPension - surrenderedFiftyPct;
    // Gratuity rate: standard Tk 230 per Taka surrendered for 25+ years
    const gratuityMultiplier = serviceYears >= 25 ? 230 : 200;
    const lumpSumGratuity = surrenderedFiftyPct * gratuityMultiplier;
    const pensionMedicalAllowance = isSeniorCitizen ? 2500 : 1500;
    const totalMonthlyInHandPension = monthlyPensionPayable + pensionMedicalAllowance;

    pensionInfo = {
      fullPensionRate: ratePct,
      grossMonthlyPension,
      surrenderedFiftyPct,
      monthlyPensionPayable,
      lumpSumGratuity,
      pensionMedicalAllowance,
      totalMonthlyInHandPension,
    };
  }

  return {
    grade,
    basicSalary,
    houseRent,
    houseRentRatePct,
    medicalAllowance,
    conveyanceAllowance,
    tiffinAllowance,
    educationAllowance,
    grossSalary,
    gpfDeduction,
    benevolentFund,
    groupInsurance,
    totalDeductions,
    netSalary,
    pensionInfo,
  };
};
