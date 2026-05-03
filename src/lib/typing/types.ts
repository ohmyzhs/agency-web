export type TypingMode =
  | "keyboard-zone"
  | "word"
  | "sentence"
  | "longform"
  | "speed-test";

// 도전단계 (분당 목표 타수)
export type StageLevel = 100 | 200 | 400 | 600 | 800 | 1000 | 1100 | 1200;

// 장문 카테고리 8종
export type LongformCategory =
  | "애국가"
  | "고전"
  | "속담"
  | "명언"
  | "에세이"
  | "한국사"
  | "과학"
  | "CS"
  | "AI단편";

export type TypingLanguage = "ko" | "en";

export type Strictness = "relaxed" | "strict";

export type TypingResult = {
  mode: TypingMode;
  language: TypingLanguage;
  durationSeconds: number;
  typedChars: number;
  correctChars: number;
  incorrectChars: number;
  uncorrectedErrors: number;
  rawCpm: number;
  cpm: number;
  wpm: number;
  accuracy: number;
  finishedAt: number;
  lessonId: string;
};

export type PerKeyStat = {
  key: string;
  attempts: number;
  correct: number;
};

export type ProblemKey = PerKeyStat & {
  accuracy: number;
};
