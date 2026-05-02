import type { PerKeyStat, TypingResult } from "./types";

const BEST_KEY = "ohmyzhs:typing:best:v1";
const KEYSTAT_KEY = "ohmyzhs:typing:keystats:v1";
const STREAK_KEY = "ohmyzhs:typing:streak:v1";

type BestScores = Record<string, TypingResult>;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeRead(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function bestKey(result: Pick<TypingResult, "mode" | "language" | "durationSeconds" | "lessonId">): string {
  return `${result.mode}:${result.language}:${result.durationSeconds}:${result.lessonId}`;
}

export function loadBestScores(): BestScores {
  const ls = safeRead();
  if (!ls) return {};
  return safeParse(ls.getItem(BEST_KEY), {});
}

export function saveBestIfBetter(result: TypingResult): { isNewBest: boolean; previous?: TypingResult } {
  const ls = safeRead();
  if (!ls) return { isNewBest: false };
  const all = loadBestScores();
  const key = bestKey(result);
  const prev = all[key];
  // Eligibility: 80% accuracy gate to avoid junk best scores.
  if (result.accuracy < 0.8) return { isNewBest: false, previous: prev };
  if (!prev || result.cpm > prev.cpm) {
    all[key] = result;
    try {
      ls.setItem(BEST_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
    return { isNewBest: true, previous: prev };
  }
  return { isNewBest: false, previous: prev };
}

export function loadKeyStats(): Record<string, PerKeyStat> {
  const ls = safeRead();
  if (!ls) return {};
  return safeParse(ls.getItem(KEYSTAT_KEY), {});
}

export function mergeKeyStats(stats: PerKeyStat[]): void {
  const ls = safeRead();
  if (!ls) return;
  const existing = loadKeyStats();
  for (const s of stats) {
    const cur = existing[s.key] ?? { key: s.key, attempts: 0, correct: 0 };
    existing[s.key] = {
      key: s.key,
      attempts: cur.attempts + s.attempts,
      correct: cur.correct + s.correct,
    };
  }
  try {
    ls.setItem(KEYSTAT_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function clearKeyStats(): void {
  const ls = safeRead();
  if (!ls) return;
  try {
    ls.removeItem(KEYSTAT_KEY);
  } catch {
    // ignore
  }
}

type StreakState = {
  lastDate: string;
  count: number;
  todaySeconds: number;
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadStreak(): StreakState {
  const ls = safeRead();
  if (!ls) return { lastDate: "", count: 0, todaySeconds: 0 };
  return safeParse(ls.getItem(STREAK_KEY), { lastDate: "", count: 0, todaySeconds: 0 });
}

export function recordPracticeSeconds(seconds: number): StreakState {
  const ls = safeRead();
  if (!ls) return { lastDate: "", count: 0, todaySeconds: 0 };
  const today = todayKey();
  const state = loadStreak();
  if (state.lastDate === today) {
    state.todaySeconds += seconds;
  } else {
    // If exactly yesterday, continue streak; else reset.
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    state.count = state.lastDate === yesterday ? state.count + 1 : 1;
    state.lastDate = today;
    state.todaySeconds = seconds;
  }
  try {
    ls.setItem(STREAK_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
  return state;
}
