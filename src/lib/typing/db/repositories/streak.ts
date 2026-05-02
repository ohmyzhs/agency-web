import type { TypingDB } from '../client';

export type StreakDayRow = {
  date: string;
  practice_seconds: number;
};

export function todayISODate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function recordToday(db: TypingDB, seconds: number): Promise<void> {
  await db.recordStreak(todayISODate(), seconds);
}

export async function getStreakCount(db: TypingDB): Promise<number> {
  const today = todayISODate();
  const past = new Date();
  past.setDate(past.getDate() - 365);
  const fromDate = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, '0')}-${String(past.getDate()).padStart(2, '0')}`;

  const days = (await db.getStreakDays(fromDate, today)) as StreakDayRow[];
  if (!days.length) return 0;

  let streak = 0;
  const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date));
  const todayStr = today;
  const startDay = sorted[0].date === todayStr ? sorted[0].date : null;
  if (!startDay) return 0;

  let prev = new Date(startDay);
  for (const d of sorted) {
    const curr = new Date(d.date);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff <= 1) { streak += 1; prev = curr; }
    else break;
  }
  return streak;
}
