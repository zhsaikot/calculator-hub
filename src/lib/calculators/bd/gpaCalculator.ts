export interface SubjectGrade {
  id: string;
  name: string;
  point: number; // 0.0 to 5.0
  grade?: string;
  isOptional?: boolean; // 4th subject
}

export interface GpaResult {
  finalGpa: number;
  letterGrade: string;
  isPassed: boolean;
  isGoldenAPlus: boolean;
  totalMainPoints: number;
  fourthSubjectBonus: number;
  totalCalculatedPoints: number;
  totalMainSubjects: number;
  summary: string;
}

export const GRADE_SCALE: { grade: string; point: number; marksRange: string }[] = [
  { grade: 'A+', point: 5.0, marksRange: '80 - 100' },
  { grade: 'A', point: 4.0, marksRange: '70 - 79' },
  { grade: 'A-', point: 3.5, marksRange: '60 - 69' },
  { grade: 'B', point: 3.0, marksRange: '50 - 59' },
  { grade: 'C', point: 2.0, marksRange: '40 - 49' },
  { grade: 'D', point: 1.0, marksRange: '33 - 39' },
  { grade: 'F', point: 0.0, marksRange: '0 - 32' },
];

export const getLetterGrade = (gpa: number, isPassed: boolean): string => {
  if (!isPassed || gpa < 1.0) return 'F';
  if (gpa >= 5.0) return 'A+';
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.5) return 'A-';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.0) return 'C';
  return 'D';
};

/**
 * Bangladesh National Curriculum GPA Formula:
 * - 4th Subject Bonus = max(0, 4th_point - 2.00)
 * - If any mandatory subject has 0.00 (F), total GPA = 0.00 (Fail)
 * - Final GPA = min(5.00, (sum of main points + bonus) / total_main_subjects)
 */
export const calculateBdgpa = (
  mainSubjects: { name: string; point: number }[],
  fourthSubject?: { name: string; point: number }
): GpaResult => {
  if (mainSubjects.length === 0) {
    return {
      finalGpa: 0,
      letterGrade: 'F',
      isPassed: false,
      isGoldenAPlus: false,
      totalMainPoints: 0,
      fourthSubjectBonus: 0,
      totalCalculatedPoints: 0,
      totalMainSubjects: 0,
      summary: 'No subjects provided',
    };
  }

  // Check if any mandatory subject is failed (F = 0)
  const hasFailedCompulsory = mainSubjects.some(s => s.point <= 0);

  const totalMainPoints = mainSubjects.reduce((acc, s) => acc + s.point, 0);

  // 4th subject bonus points: points above 2.00 (e.g. 5.00 -> 3.00, 3.50 -> 1.50, 2.00 -> 0.00)
  const fourthSubjectBonus = fourthSubject ? Math.max(0, fourthSubject.point - 2.0) : 0;

  if (hasFailedCompulsory) {
    return {
      finalGpa: 0.0,
      letterGrade: 'F',
      isPassed: false,
      isGoldenAPlus: false,
      totalMainPoints,
      fourthSubjectBonus,
      totalCalculatedPoints: totalMainPoints + fourthSubjectBonus,
      totalMainSubjects: mainSubjects.length,
      summary: 'Failed (One or more compulsory subjects received F grade)',
    };
  }

  const rawGpa = (totalMainPoints + fourthSubjectBonus) / mainSubjects.length;
  // Cap at 5.00 and round to 2 decimal places
  const finalGpa = Math.min(5.0, Math.round(rawGpa * 100) / 100);

  // Golden A+: Every single main subject scored 5.00 (A+)
  const allMainAreAPlus = mainSubjects.every(s => s.point >= 5.0);
  const fourthIsAPlus = fourthSubject ? fourthSubject.point >= 5.0 : true;
  const isGoldenAPlus = allMainAreAPlus && fourthIsAPlus;

  const letterGrade = getLetterGrade(finalGpa, true);

  return {
    finalGpa,
    letterGrade,
    isPassed: true,
    isGoldenAPlus,
    totalMainPoints,
    fourthSubjectBonus,
    totalCalculatedPoints: Math.round((totalMainPoints + fourthSubjectBonus) * 100) / 100,
    totalMainSubjects: mainSubjects.length,
    summary: isGoldenAPlus
      ? 'Golden A+ (GPA 5.00 in all subjects)'
      : `GPA: ${finalGpa.toFixed(2)} (${letterGrade})`,
  };
};

export interface GroupPreset {
  id: string;
  name: string;
  level: 'SSC' | 'HSC';
  mainSubjects: string[];
  fourthSubject: string;
}

export const BD_GPA_PRESETS: GroupPreset[] = [
  {
    id: 'ssc-science',
    name: 'SSC - Science (বিজ্ঞান)',
    level: 'SSC',
    mainSubjects: [
      'Bangla (বাংলা)',
      'English (ইংরেজি)',
      'Mathematics (সাধারণ গণিত)',
      'Physics (পদার্থবিজ্ঞান)',
      'Chemistry (রসায়ন)',
      'Biology (জীববিজ্ঞান)',
      'Bangladesh & Global Studies (বিজিএস)',
      'Religion & Moral Edu (ধর্ম)',
      'ICT (তথ্য ও যোগাযোগ প্রযুক্তি)',
    ],
    fourthSubject: 'Higher Mathematics (উচ্চতর গণিত)',
  },
  {
    id: 'ssc-commerce',
    name: 'SSC - Business Studies (ব্যবসায় শিক্ষা)',
    level: 'SSC',
    mainSubjects: [
      'Bangla (বাংলা)',
      'English (ইংরেজি)',
      'Mathematics (সাধারণ গণিত)',
      'Accounting (হিসাববিজ্ঞান)',
      'Finance & Banking (ফিন্যান্স ও ব্যাংকিং)',
      'Business Entrepreneurship (ব্যবসায় উদ্যোগ)',
      'General Science (সাধারণ বিজ্ঞান)',
      'Religion (ধর্ম)',
      'ICT (আইসিটি)',
    ],
    fourthSubject: 'Agriculture Studies (কৃষি শিক্ষা)',
  },
  {
    id: 'ssc-humanities',
    name: 'SSC - Humanities (মানবিক)',
    level: 'SSC',
    mainSubjects: [
      'Bangla (বাংলা)',
      'English (ইংরেজি)',
      'Mathematics (সাধারণ গণিত)',
      'History of BD & World (ইতিহাস)',
      'Geography & Environment (ভূগোল)',
      'Civics & Citizenship (পৌরনীতি)',
      'General Science (সাধারণ বিজ্ঞান)',
      'Religion (ধর্ম)',
      'ICT (আইসিটি)',
    ],
    fourthSubject: 'Economics (অর্থনীতি)',
  },
  {
    id: 'hsc-science',
    name: 'HSC - Science (বিজ্ঞান)',
    level: 'HSC',
    mainSubjects: [
      'Bangla (বাংলা)',
      'English (ইংরেজি)',
      'ICT (তথ্য ও যোগাযোগ প্রযুক্তি)',
      'Physics (পদার্থবিজ্ঞান)',
      'Chemistry (রসায়ন)',
      'Higher Mathematics (উচ্চতর গণিত)',
    ],
    fourthSubject: 'Biology (জীববিজ্ঞান)',
  },
  {
    id: 'hsc-commerce',
    name: 'HSC - Business Studies (ব্যবসায় শিক্ষা)',
    level: 'HSC',
    mainSubjects: [
      'Bangla (বাংলা)',
      'English (ইংরেজি)',
      'ICT (তথ্য ও যোগাযোগ প্রযুক্তি)',
      'Accounting (হিসাববিজ্ঞান)',
      'Business Org & Mgmt (ব্যবসায় সংগঠন ও ব্যবস্থাপনা)',
      'Finance, Banking & Insurance (ফিন্যান্স ও ব্যাংকিং)',
    ],
    fourthSubject: 'Economics (অর্থনীতি)',
  },
];
