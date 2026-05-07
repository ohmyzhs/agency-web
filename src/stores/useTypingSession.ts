/**
 * 타이핑 세션 상태 — 비영속 (휘발성).
 * 진행 중인 세션의 모든 런타임 상태를 담는다.
 */
import { create } from 'zustand';
import type { TypingMode, TypingLanguage, StageLevel } from '@/lib/typing/types';
import type { KeyHint } from '@/lib/typing/korean-keyboard';

export type SessionPhase =
  | 'idle'        // 아직 시작 전
  | 'countdown'   // 3-2-1 카운트다운 중
  | 'running'     // 타이핑 중
  | 'finished';   // 완료

type TypingSessionState = {
  // 세션 메타
  phase: SessionPhase;
  mode: TypingMode;
  language: TypingLanguage;
  stage: StageLevel;
  lessonId: string;
  contentSeed: string;

  // 타이핑 내용
  target: string;
  typed: string;
  isComposing: boolean;

  // 타이밍
  startedAt: number | null;
  finishedAt: number | null;
  countdownStartedAt: number | null;

  // 키보드 힌트
  pendingKey: KeyHint | undefined;

  // 여러 줄 모드용
  currentLineIdx: number;
  totalLines: number;
};

type TypingSessionActions = {
  setMode: (mode: TypingMode) => void;
  setLanguage: (lang: TypingLanguage) => void;
  setStage: (stage: StageLevel) => void;
  setLessonId: (id: string) => void;
  setTarget: (target: string, seed?: string) => void;
  setTyped: (typed: string) => void;
  setIsComposing: (v: boolean) => void;
  setPendingKey: (key: KeyHint | undefined) => void;
  setCurrentLineIdx: (idx: number) => void;

  startCountdown: () => void;
  startSession: () => void;
  finishSession: () => void;
  reset: () => void;
};

const defaultState: TypingSessionState = {
  phase: 'idle',
  mode: 'sentence',
  language: 'en',
  stage: 400,
  lessonId: 'default',
  contentSeed: '',
  target: '',
  typed: '',
  isComposing: false,
  startedAt: null,
  finishedAt: null,
  countdownStartedAt: null,
  pendingKey: undefined,
  currentLineIdx: 0,
  totalLines: 1,
};

export const useTypingSession = create<TypingSessionState & TypingSessionActions>((set) => ({
  ...defaultState,

  setMode: (mode) => set({ mode }),
  setLanguage: (language) => set({ language }),
  setStage: (stage) => set({ stage }),
  setLessonId: (lessonId) => set({ lessonId }),
  setTarget: (target, seed) =>
    set({
      target,
      contentSeed: seed ?? String(Date.now()),
      typed: '',
      isComposing: false,
      phase: 'idle',
      startedAt: null,
      finishedAt: null,
      countdownStartedAt: null,
    }),
  setTyped: (typed) => set({ typed }),
  setIsComposing: (isComposing) => set({ isComposing }),
  setPendingKey: (pendingKey) => set({ pendingKey }),
  setCurrentLineIdx: (currentLineIdx) => set({ currentLineIdx }),

  startCountdown: () =>
    set({ phase: 'countdown', countdownStartedAt: Date.now() }),

  startSession: () =>
    set({ phase: 'running', startedAt: Date.now(), finishedAt: null }),

  finishSession: () =>
    set({ phase: 'finished', finishedAt: Date.now() }),

  reset: () =>
    set({
      ...defaultState,
      // preserve user-selected config
    }),
}));
