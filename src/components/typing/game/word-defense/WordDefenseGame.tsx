'use client';
/**
 * WordDefense — Phaser 3 host. The game now ships with keyed PNG assets
 * (space bg, ship, meteors, explosion sheet). The visible input box is a
 * small overlay that tracks the active target via aim events from the scene.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDB } from '@/lib/typing/db/provider';
import { useSoundFx } from '@/hooks/useSoundFx';
import type { StageLevel, TypingLanguage } from '@/lib/typing/types';
import { STAGE_LIST } from '@/lib/typing/metrics-jamo';
import { useLocale } from '@/components/providers';
import { START_WAVES, type StartWave, WAVES_TO_CLEAR } from './config';
type AimState = { typed: string; active: boolean };

type HudState = { wave: number; hp: number; score: number; combo: number };

type GameModule = {
  Phaser: typeof import('phaser');
  GameScene: typeof import('./scenes/GameScene').GameScene;
};

const SCENE_WIDTH = 800;
const SCENE_HEIGHT = 600;

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
  const { locale } = useLocale();
  const { playKey, play, playBgm, stopBgm } = useSoundFx();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const gameRef = useRef<import('phaser').Game | null>(null);
  const busRef = useRef<import('phaser').Events.EventEmitter | null>(null);
  const aimRef = useRef<AimState>({ typed: '', active: false });

  const [stage, setStage] = useState<StageLevel>(400);
  const [language, setLanguage] = useState<TypingLanguage>(locale === 'ko' ? 'ko' : 'en');
  const [startWave, setStartWave] = useState<StartWave>(1);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'gameover' | 'clear'>('idle');
  const [hud, setHud] = useState<HudState>({ wave: 1, hp: 100, score: 0, combo: 1 });
  const [final, setFinal] = useState<{ score: number; wave: number; comboMax: number } | null>(null);
  const submittedRef = useRef(false);

  const syncInputFromAim = useCallback((a: AimState) => {
    aimRef.current = a;
    const input = inputRef.current;
    if (!input) return;
    if (!a.active && input.value !== '') input.value = '';
  }, []);

  const start = useCallback(async () => {
    const { Phaser, GameScene } = await loadGameModule();

    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const bus = new Phaser.Events.EventEmitter();
    busRef.current = bus;
    bus.on('hud', (h: HudState) => setHud(h));
    bus.on('hit', () => { play('game-hit').catch(() => {}); });
    bus.on('miss', () => { play('miss').catch(() => {}); });
    bus.on('boom', () => { play('game-boom').catch(() => {}); });
    bus.on('aim', (a: AimState) => {
      syncInputFromAim(a);
    });
    bus.on('gameover', (f: { score: number; wave: number; comboMax: number }) => {
      setFinal(f); setPhase('gameover');
      stopBgm();
      play('game-boom').catch(() => {});
    });
    bus.on('clear', (f: { score: number; wave: number; comboMax: number }) => {
      setFinal(f); setPhase('clear');
      stopBgm();
      play('tada').catch(() => {});
    });

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT,
      parent: hostRef.current!,
      backgroundColor: '#05060c',
      scene: [GameScene],
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });
    gameRef.current = game;

    game.scale.on('resize', () => {});

    game.scene.start('GameScene', { stage, language, startWave, bus });
    submittedRef.current = false;
    aimRef.current = { typed: '', active: false };
    setFinal(null);
    setPhase('playing');
    setHud({ wave: startWave, hp: 100, score: 0, combo: 1 });
    if (inputRef.current) inputRef.current.value = '';
    playBgm().catch(() => {});
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
  }, [stage, language, startWave, play, playBgm, stopBgm, syncInputFromAim]);

  useEffect(() => () => {
    gameRef.current?.destroy(true);
    gameRef.current = null;
    stopBgm();
  }, [stopBgm]);

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

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    busRef.current?.emit('inputText', e.target.value);
    playKey().catch(() => {});
  }, [playKey]);

  return (
    <div className="space-y-3">
      {phase === 'idle' && (
        <div className="grid gap-3 rounded-lg border border-border bg-card p-3 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
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
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">언어</p>
            <div className="flex flex-wrap gap-1">
              {(['ko', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    lang === language ? 'border-primary bg-primary text-white' : 'border-border bg-background text-muted hover:border-primary/50'
                  }`}
                >
                  {lang === 'ko' ? '한국어' : 'English'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">시작 웨이브</p>
            <div className="flex flex-wrap gap-1">
              {START_WAVES.map((wave) => (
                <button
                  key={wave}
                  type="button"
                  onClick={() => setStartWave(wave)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    wave === startWave ? 'border-primary bg-primary text-white' : 'border-border bg-background text-muted hover:border-primary/50'
                  }`}
                >
                  W{wave}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {phase !== 'idle' && (
        <div className="grid grid-cols-4 gap-2 rounded-lg border border-border bg-card p-3 text-center text-sm tabular-nums">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">웨이브</p>
            <p className="font-semibold">{hud.wave} / {WAVES_TO_CLEAR}</p>
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

      {/* Phaser host + overlay input */}
      <div
        ref={hostRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-[#05060c]"
        onClick={() => {
          if (phase === 'playing') inputRef.current?.focus();
        }}
      >
        {phase === 'idle' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold">워드 디펜스</h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              한국어/영어 단어 운석을 요격합니다. 입력하면 우주선이 목표를 추적하고 미사일을 발사합니다. 빨강은 데미지 ↑, 보라는 슬로우모션, 금색은 점수 2배입니다.
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
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 text-center">
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

      {phase === 'playing' && (
        <div className="mx-auto max-w-sm rounded-xl border border-primary/50 bg-card p-3 text-center shadow-sm">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted" htmlFor="word-defense-input">
            단어 입력
          </label>
          <input
            id="word-defense-input"
            ref={inputRef}
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={onInputChange}
            disabled={phase !== 'playing'}
            aria-label="단어 입력"
            placeholder="보이는 단어를 그대로 입력하세요"
            className="block w-full rounded-lg border border-border bg-background px-4 py-3 text-center font-mono text-xl font-semibold outline-none ring-primary/30 focus:border-primary focus:ring-4"
          />
          <p className="mt-2 text-xs text-muted">
            일반 텍스트상자처럼 입력하고 Backspace로 고칠 수 있습니다. 단어를 완성하면 자동으로 다음 목표로 넘어갑니다.
          </p>
        </div>
      )}
    </div>
  );
}
