/**
 * 워드 디펜스 게임 상태 — 종료 시 DB insert.
 */
import { create } from 'zustand';

export type GamePhase = 'idle' | 'playing' | 'gameover' | 'clear';

type TypingGameState = {
  phase: GamePhase;
  score: number;
  hp: number;
  wave: number;
  combo: number;
  comboMax: number;
  stage: number;
  startedAt: number | null;
  finishedAt: number | null;
};

type TypingGameActions = {
  startGame: (stage: number) => void;
  addScore: (delta: number) => void;
  hitHP: (damage: number) => void;
  nextWave: () => void;
  addCombo: () => void;
  breakCombo: () => void;
  endGame: (result: 'gameover' | 'clear') => void;
  resetGame: () => void;
};

const defaultState: TypingGameState = {
  phase: 'idle',
  score: 0,
  hp: 100,
  wave: 1,
  combo: 1,
  comboMax: 1,
  stage: 400,
  startedAt: null,
  finishedAt: null,
};

export const useTypingGame = create<TypingGameState & TypingGameActions>((set) => ({
  ...defaultState,

  startGame: (stage) =>
    set({ ...defaultState, phase: 'playing', stage, startedAt: Date.now() }),

  addScore: (delta) =>
    set((s) => ({ score: s.score + Math.round(delta * s.combo) })),

  hitHP: (damage) =>
    set((s) => {
      const hp = Math.max(0, s.hp - damage);
      return hp <= 0 ? { hp, phase: 'gameover', finishedAt: Date.now() } : { hp };
    }),

  nextWave: () =>
    set((s) => ({ wave: s.wave + 1 })),

  addCombo: () =>
    set((s) => {
      const combo = Math.min(s.combo + 0.5, 3.0);
      return { combo, comboMax: Math.max(s.comboMax, combo) };
    }),

  breakCombo: () =>
    set((s) => ({ combo: Math.max(1, s.combo * 0.5) })),

  endGame: (result) =>
    set({ phase: result, finishedAt: Date.now() }),

  resetGame: () =>
    set(defaultState),
}));
