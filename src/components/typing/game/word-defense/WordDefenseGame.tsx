'use client';
/**
 * WordDefense — Phaser 3 host. Words fall, jamo input destroys them.
 * Renders with primitives (rect + text); no sprite assets required.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { disassemble } from 'es-hangul';
import { useDB } from '@/lib/typing/db/provider';
import type { StageLevel } from '@/lib/typing/types';
import { STAGE_LIST } from '@/lib/typing/metrics-jamo';

type HudState = { wave: number; hp: number; score: number; combo: number };

type GameModule = {
  Phaser: typeof import('phaser');
  GameScene: typeof import('./scenes/GameScene').GameScene;
};

let modulePromise: Promise<GameModule> | null = null;
async function loadGameModule(): Promise<GameModule> {
  if (!modulePromise) {
    modulePromise = (async () => {
      const [{ default: Phaser }, { GameScene }] = await Promise.all([
        import('phaser'),
        import('./scenes/GameScene'),
      ]);
      return { Phaser, GameScene };
    })();
  }
  return modulePromise;
}

export function WordDefenseGame() {
  const db = useDB();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const gameRef = useRef<import('phaser').Game | null>(null);
  const busRef = useRef<import('phaser').Events.EventEmitter | null>(null);

  const [stage, setStage] = useState<StageLevel>(400);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'gameover' | 'clear'>('idle');
  const [hud, setHud] = useState<HudState>({ wave: 1, hp: 100, score: 0, combo: 1 });
  const [final, setFinal] = useState<{ score: number; wave: number; comboMax: number } | null>(null);
  const submittedRef = useRef(false);

  const start = useCallback(async () => {
    const { Phaser, GameScene } = await loadGameModule();

    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const bus = new Phaser.Events.EventEmitter();
    busRef.current = bus;
    bus.on('hud', (h: HudState) => setHud(h));
    bus.on('gameover', (f: { score: number; wave: number; comboMax: number }) => {
      setFinal(f); setPhase('gameover');
    });
    bus.on('clear', (f: { score: number; wave: number; comboMax: number }) => {
      setFinal(f); setPhase('clear');
    });

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: hostRef.current!,
      backgroundColor: '#0c0c0e',
      scene: [GameScene],
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });
    gameRef.current = game;

    game.scene.start('GameScene', { stage, bus });
    submittedRef.current = false;
    setFinal(null);
    setPhase('playing');
    setHud({ wave: 1, hp: 100, score: 0, combo: 1 });
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [stage]);

  useEffect(() => () => {
    gameRef.current?.destroy(true);
    gameRef.current = null;
  }, []);

  // Persist score on game end.
  useEffect(() => {
    if (!db || !final) return;
    if (submittedRef.current) return;
    submittedRef.current = true;
    db.insertGameScore({
      game: 'word-defense',
      stage,
      score: final.score,
      wave: final.wave,
      combo_max: Math.round(final.comboMax * 10),
      finished_at: Date.now(),
    }).catch(() => {});
  }, [final, db, stage]);

  // Translate keystrokes to jamo events.
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!v) return;
    // Decompose entire current value into jamo, send the LAST jamo
    // (handles both Korean syllables and ascii letters)
    const last = v[v.length - 1];
    const jamos = disassemble(last);
    for (const j of jamos) {
      busRef.current?.emit('jamo', j);
    }
    // Clear so we always get the next keystroke fresh
    e.target.value = '';
  }, []);

  return (
    <div className="space-y-3">
      {/* Stage picker (idle only) */}
      {phase === 'idle' && (
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
            도전단계 선택
          </p>
          <div className="flex flex-wrap gap-1">
            {STAGE_LIST.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStage(s as StageLevel)}
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  s === stage
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-background text-muted hover:border-primary/50'
                }`}
              >
                {s}타
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HUD */}
      {phase !== 'idle' && (
        <div className="grid grid-cols-4 gap-2 rounded-lg border border-border bg-card p-3 text-center text-sm tabular-nums">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">웨이브</p>
            <p className="font-semibold">{hud.wave} / 7</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">HP</p>
            <p className={`font-semibold ${hud.hp < 30 ? 'text-red-500' : ''}`}>{Math.round(hud.hp)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">점수</p>
            <p className="font-semibold">{hud.score.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">콤보</p>
            <p className="font-semibold">×{hud.combo.toFixed(1)}</p>
          </div>
        </div>
      )}

      {/* Phaser host */}
      <div
        ref={hostRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-[#0c0c0e]"
      >
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold">워드 디펜스</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              떨어지는 한국어 단어를 자모 단위로 입력해 부숩니다. 빨강은 데미지 ↑, 보라는 슬로우모션, 금색은 점수 2배. 콤보를 ×3.0까지 쌓아 보세요.
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-6 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary/90"
            >
              시작하기
            </button>
          </div>
        )}
        {(phase === 'gameover' || phase === 'clear') && final && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 text-center">
            <h2 className="text-3xl font-bold text-white">
              {phase === 'clear' ? '🏆 클리어!' : '게임 오버'}
            </h2>
            <p className="mt-3 text-lg text-white">
              점수 {final.score.toLocaleString()} · 웨이브 {final.wave} · 최고 콤보 ×{(final.comboMax).toFixed(1)}
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-6 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary/90"
            >
              다시 도전
            </button>
          </div>
        )}
      </div>

      {/* Hidden input to capture keystrokes (IME-friendly via change-and-clear) */}
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={onInputChange}
        placeholder={phase === 'playing' ? '여기에 입력하세요' : '시작 후 자동 포커스됩니다'}
        disabled={phase !== 'playing'}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-base outline-none focus:border-primary"
      />
    </div>
  );
}
