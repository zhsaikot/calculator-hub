import { describe, it, expect } from 'vitest';
import { calculateBdgpa } from '../src/lib/calculators/bd/gpaCalculator';
import { calculateBdPayScale } from '../src/lib/calculators/bd/payScaleCalculator';
import { compareMfsCharges } from '../src/lib/calculators/bd/mfsComparator';
import {
  convertFromSqFeet,
  convertToSqFeet,
  calculateQuadrilateralLand,
  SQ_FEET_PER,
} from '../src/lib/calculators/bd/landCalculator';
import {
  calculateBdIncomeTax,
} from '../src/lib/calculators/bd/incomeTaxBd';
import { calculateSanchayapatraProfit } from '../src/lib/calculators/bd/sanchayapatra';
import {
  toTotalVori,
  fromTotalVori,
  calculateGoldPrice,
  GRAMS_PER_VORI,
} from '../src/lib/calculators/bd/goldCalculator';

describe('Bangladesh Calculators Engine Tests', () => {
  // 1. GPA Calculator
  describe('SSC / HSC GPA Calculator', () => {
    it('calculates GPA with 4th subject bonus points correctly', () => {
      // 6 main subjects: 5, 4, 4, 4, 4, 3 = 24 points
      // 4th subject: 4.5 -> bonus = 4.5 - 2 = 2.5
      // Total = 24 + 2.5 = 26.5
      // GPA = 26.5 / 6 = 4.416... -> 4.42 (Grade A)
      const main = [
        { name: 'Bangla', point: 5.0 },
        { name: 'English', point: 4.0 },
        { name: 'Math', point: 4.0 },
        { name: 'Physics', point: 4.0 },
        { name: 'Chemistry', point: 4.0 },
        { name: 'Biology', point: 3.0 },
      ];
      const fourth = { name: 'Higher Math', point: 4.5 };
      const res = calculateBdgpa(main, fourth);

      expect(res.isPassed).toBe(true);
      expect(res.fourthSubjectBonus).toBe(2.5);
      expect(res.finalGpa).toBe(4.42);
      expect(res.letterGrade).toBe('A');
      expect(res.isGoldenAPlus).toBe(false);
    });

    it('identifies Golden A+ when all subjects including 4th get 5.00', () => {
      const main = [
        { name: 'Bangla', point: 5.0 },
        { name: 'English', point: 5.0 },
        { name: 'Math', point: 5.0 },
      ];
      const fourth = { name: 'Higher Math', point: 5.0 };
      const res = calculateBdgpa(main, fourth);

      expect(res.isPassed).toBe(true);
      expect(res.finalGpa).toBe(5.0);
      expect(res.isGoldenAPlus).toBe(true);
    });

    it('returns Fail (GPA 0.00) if any compulsory subject gets F', () => {
      const main = [
        { name: 'Bangla', point: 5.0 },
        { name: 'English', point: 0.0 }, // FAILED!
        { name: 'Math', point: 5.0 },
      ];
      const fourth = { name: 'Higher Math', point: 5.0 };
      const res = calculateBdgpa(main, fourth);

      expect(res.isPassed).toBe(false);
      expect(res.finalGpa).toBe(0.0);
      expect(res.letterGrade).toBe('F');
    });
  });

  // 2. Govt Pay Scale
  describe('Govt Pay Scale & Pension Calculator', () => {
    it('calculates gross and net salary for Grade 9 Officer in Dhaka', () => {
      const res = calculateBdPayScale({
        grade: 9,
        basicSalary: 22000,
        location: 'dhaka',
        childrenCount: 2,
        gpfRate: 10,
        serviceYears: 25,
      });

      // Grade 9 Dhaka: House rent 55% of 22000 = 12100 (min 9600)
      expect(res.houseRent).toBe(12100);
      expect(res.medicalAllowance).toBe(1500);
      expect(res.conveyanceAllowance).toBe(0); // Grade 9 has no conveyance
      expect(res.educationAllowance).toBe(1000); // 2 children = 1000
      expect(res.grossSalary).toBe(22000 + 12100 + 1500 + 1000);
      expect(res.gpfDeduction).toBe(2200); // 10% of 22000
      expect(res.pensionInfo?.fullPensionRate).toBe(90);
      expect(res.pensionInfo?.lumpSumGratuity).toBeGreaterThan(0);
    });
  });

  // 3. MFS Comparator
  describe('MFS Comparator (bKash, Nagad, Rocket, Upay)', () => {
    it('calculates forward cash out fees and identifies best value', () => {
      const res = compareMfsCharges(10000, 'forward');
      expect(res.items.length).toBe(4);
      expect(res.cheapestProvider).toBeDefined();

      // Find Nagad App item (1.25%)
      const nagad = res.items.find(i => i.providerId === 'nagad');
      expect(nagad?.cashOutFee).toBe(125); // 1.25% of 10000
      expect(nagad?.recipientGets).toBe(10000 - 125);

      // Find bKash App item (1.85%)
      const bkash = res.items.find(i => i.providerId === 'bkash');
      expect(bkash?.cashOutFee).toBe(185); // 1.85% of 10000
    });

    it('calculates reverse cash out correctly for desired amount in hand', () => {
      const res = compareMfsCharges(5000, 'reverse');
      const bkash = res.items.find(i => i.providerId === 'bkash');
      expect(bkash).toBeDefined();
      // Reverse: amountToSend = 5000 / (1 - 0.0185) = ~5094.24
      expect(bkash!.amountToSend).toBeGreaterThan(5000);
      expect(bkash!.recipientGets).toBe(5000);
    });
  });

  // 4. Land Measurement
  describe('Land Measurement & Area Converter', () => {
    it('accurately converts between Shotok, Katha, Bigha, and Sq Feet', () => {
      expect(SQ_FEET_PER.SHOTOK).toBe(435.6);
      expect(SQ_FEET_PER.KATHA).toBe(720.0);
      expect(SQ_FEET_PER.BIGHA).toBe(14400.0);

      // 1 Katha should equal 720 sq ft
      const sqFt = convertToSqFeet(1, 'katha');
      expect(sqFt).toBe(720);

      const converted = convertFromSqFeet(720);
      expect(converted.katha).toBe(1);
      expect(converted.shotok).toBeCloseTo(1.653, 2);
    });

    it('calculates quadrilateral land area by average method', () => {
      // 50ft x 40ft rectangular land = 2000 sq ft
      const res = calculateQuadrilateralLand({
        north: 50,
        south: 50,
        east: 40,
        west: 40,
      });

      expect(res.sqFeet).toBe(2000);
      expect(res.units.shotok).toBeCloseTo(2000 / 435.6, 2);
    });
  });

  // 5. BD Income Tax
  describe('BD Income Tax (NBR)', () => {
    it('returns zero tax for income within tax-free limit', () => {
      const res = calculateBdIncomeTax({
        annualIncome: 300000,
        category: 'general',
        location: 'dhaka_chattogram',
      });

      expect(res.taxableIncome).toBe(0);
      expect(res.netTaxPayable).toBe(0);
    });

    it('applies progressive slabs and minimum tax correctly', () => {
      const res = calculateBdIncomeTax({
        annualIncome: 600000, // 350,000 tax-free + 100,000 @ 5% (5,000) + 150,000 @ 10% (15,000) = 20,000
        category: 'general',
        location: 'dhaka_chattogram',
      });

      expect(res.taxFreeLimit).toBe(350000);
      expect(res.taxableIncome).toBe(250000);
      expect(res.grossTax).toBe(5000 + 15000); // 20,000
      expect(res.netTaxPayable).toBe(20000);
    });
  });

  // 6. Sanchayapatra Profit
  describe('Sanchayapatra Profit Calculator', () => {
    it('calculates Paribar Sanchayapatra monthly net payout with TDS', () => {
      // 10 Lakh Paribar: 11.52% annual = 1,15,200. TDS 10% = 11,520. Net annual = 1,03,680.
      // Net monthly = 1,03,680 / 12 = 8,640
      const res = calculateSanchayapatraProfit('paribar', 1000000, true);

      expect(res.grossAnnualProfit).toBe(115200);
      expect(res.tdsRatePct).toBe(10);
      expect(res.netPeriodicProfit).toBe(8640);
    });
  });

  // 7. Gold Calculator
  describe('Gold Price & Unit Converter', () => {
    it('converts between Vori, Ana, Roti, and Grams accurately', () => {
      expect(GRAMS_PER_VORI).toBe(11.664);

      // 1 Vori 8 Ana = 1.5 Vori
      const totalVori = toTotalVori({ vori: 1, ana: 8, roti: 0 });
      expect(totalVori).toBe(1.5);

      const parsed = fromTotalVori(1.5);
      expect(parsed.vori).toBe(1);
      expect(parsed.ana).toBe(8);
      expect(parsed.grams).toBe(1.5 * 11.664);
    });

    it('calculates gold jewelry price with making charge and 5% VAT', () => {
      // 1 Vori @ 1,20,000 + 3,500 making = 1,23,500. VAT 5% = 6,175. Total = 1,29,675
      const res = calculateGoldPrice({ vori: 1 }, 120000, 3500, 5);
      expect(res.goldPrice).toBe(120000);
      expect(res.makingCharge).toBe(3500);
      expect(res.subtotal).toBe(123500);
      expect(res.vatAmount).toBe(6175);
      expect(res.totalPrice).toBe(129675);
    });
  });
});
