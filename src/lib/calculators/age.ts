export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  daysToNextBirthday: number;
  nextBirthdayDayOfWeek: string;
}

export function calculateAge(dobStr: string, targetStr: string): AgeResult | { error: string } {
  if (!dobStr || !targetStr) {
    return { error: 'Please enter both dates.' };
  }

  const [y1, m1, d1] = dobStr.split('-').map(Number);
  const [y2, m2, d2] = targetStr.split('-').map(Number);

  const dob = new Date(y1, m1 - 1, d1);
  const target = new Date(y2, m2 - 1, d2);

  if (isNaN(dob.getTime()) || isNaN(target.getTime())) {
    return { error: 'Invalid date values provided.' };
  }

  if (dob >= target) {
    return { error: 'Date of birth must be before target date.' };
  }

  let years = y2 - y1;
  let months = m2 - m1;
  let days = d2 - d1;

  if (days < 0) {
    months--;
    // Days in previous month relative to target
    const prevMonthDays = new Date(y2, m2 - 1, 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = target.getTime() - dob.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  // Next birthday calculation
  let nextBdayYear = y2;
  let nextBday = new Date(nextBdayYear, m1 - 1, d1);
  if (nextBday < target) {
    nextBdayYear++;
    nextBday = new Date(nextBdayYear, m1 - 1, d1);
  }

  const daysToNextBirthday = Math.round((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nextBirthdayDayOfWeek = daysOfWeek[nextBday.getDay()];

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    totalMinutes,
    daysToNextBirthday,
    nextBirthdayDayOfWeek,
  };
}
