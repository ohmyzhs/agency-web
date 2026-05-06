'use client';
/**
 * WordDefense — Phaser 3 host. The game now ships with keyed PNG assets
 * (space bg, ship, meteors, explosion sheet). The visible input box is a
 * small overlay that tracks the active target via aim events from the scene.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { disassemble } from 'es-hangul';
import { useDB } from '@/lib/typing/db/provider';
import { useSoundFx } from '@/hooks/useSoundFx';
import type { StageLevel } from '@/lib/typing/types';
import { STAGE_LIST } from '@/lib/typing/metrics-jamo';
import type { AimState } from './scenes/GameScene';

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
  const { playKey, play, playBgm, stopBgm } = useSoundFx();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const typedDisplayRef = useRef<HTMLSpanElement | null>(null);
  const gameRef = useRef<import('phaser').Game | null>(null);
  const busRef = useRef<import('phaser').Events.EventEmitter | null>(null);
  const prevJamoRef = useRef<string>('');
  const aimRef = useRef<AimState>({ x: SCENE_WIDTH / 2, y: SCENE_HEIGHT - 110, typed: '', active: false });

  const [stage, setStage] = useState<StageLevel>(400);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'gameover' | 'clear'>('idle');
  const [hud, setHud] = useState<HudState>({ wave: 1, hp: 100, score: 0, combo: 1 });
  const [final, setFinal] = useState<{ score: number; wave: number; comboMax: number } | null>(null);
  const submittedRef = useRef(false);

  // Position the overlay relative to the actual canvas rect inside the host
  // (Phaser FIT mode can letterbox even with matching aspect ratios).
  const applyAimToOverlay = useCallback(() => {
    const host = hostRef.current;
    const overlay = overlayRef.current;
    if (!host || !overlay) return;
    const canvas = gameRef.current?.canvas ?? host.querySelector('canvas');
    if (!canvas) return;
    const hostRect = host.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const offsetLeft = canvasRect.left - hostRect.left;
    const offsetTop = canvasRect.top - hostRect.top;
    const aim = aimRef.current;
    const px = offsetLeft + (aim.x / SCENE_WIDTH) * canvasRect.width;
    const py = offsetTop + (aim.y / SCENE_HEIGHT) * canvasRect.height;
    overlay.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
    overlay.dataset.active = aim.active ? '1' : '0';
    if (typedDisplayRef.current) {
      typedDisplayRef.current.textContent = aim.typed;
    }
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
      aimRef.current = a;
      applyAimToOverlay();
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

    game.scale.on('resize', applyAimToOverlay);

    game.scene.start('GameScene', { stage, bus });
    submittedRef.current = false;
    setFinal(null);
    setPhase('playing');
    setHud({ wave: 1, hp: 100, score: 0, combo: 1 });
    if (inputRef.current) inputRef.current.value = '';
    prevJamoRef.current = '';
    playBgm().catch(() => {});
    setTimeout(() => inputRef.current?.focus(), 50);
    requestAnimationFrame(applyAimToOverlay);
  }, [stage, play, playBgm, stopBgm, applyAimToOverlay]);

  // Keep overlay positioning fresh on host resize (e.g., orientation change).
  useEffect(() => {
    const onResize = () => applyAimToOverlay();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [applyAimToOverlay]);

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

  // IME-safe incremental jamo emission. The visible text box uses scene-owned
  // `aim.typed` (assembled progress), so the raw input element can stay
  // invisible while still capturing keystrokes / IME composition.
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const cur = disassemble(v);
    const prev = prevJamoRef.current;
    let i = 0;
    while (i < prev.length && i < cur.length && prev[i] === cur[i]) i++;
    for (let k = i; k < cur.length; k++) {
      busRef.current?.emit('jamo', cur[k]);
      playKey().catch(() => {});
    }
    prevJamoRef.current = cur;
  }, [playKey]);

  // The scene clears `aim` to `{ active: false, typed: '' }` whenever a
  // meteor is destroyed by the player or a miss releases the lock. Mirror
  // that by flushing the hidden capture input so jamo diffing stays in sync.
  useEffect(() => {
    if (phase !== 'playing') return;
    const bus = busRef.current;
    if (!bus) return;
    let lastActive = false;
    const onAim = (a: AimState) => {
      if (lastActive && !a.active) {
        if (inputRef.current) inputRef.current.value = '';
        prevJamoRef.current = '';
      }
      lastActive = a.active;
    };
    bus.on('aim', onAim);
    return () => {
      bus.off('aim', onAim);
    };
  }, [phase]);

  return (
    <div className="space-y-3">
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

        {/* Aim overlay — small input box that follows the active meteor.
            transform-positioned via aim events; not part of React render path. */}
        <div
          ref={overlayRef}
          aria-hidden={phase !== 'playing'}
          className="pointer-events-none absolute left-0 top-0 z-10 flex flex-col items-center gap-1 transition-opacity duration-150 data-[active=0]:opacity-80 data-[active=1]:opacity-100"
          style={{ transform: 'translate3d(-9999px, -9999px, 0)' }}
        >
          <div className="rounded-md border border-primary/70 bg-black/70 px-2.5 py-1 font-mono text-base font-bold text-white shadow-[0_0_12px_rgba(255,91,31,0.55)] backdrop-blur-sm">
            <span ref={typedDisplayRef} className="block min-w-[3.5ch] text-center tracking-[0.05em]">
              &nbsp;
            </span>
          </div>
        </div>

        {/* Hidden capture input — focusable for IME, visually hidden so the
            visible 5-char box (scene-driven) is the only typed UI. */}
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={onInputChange}
          disabled={phase !== 'playing'}
          aria-label="단어 입력"
          className="absolute h-px w-px overflow-hidden border-0 p-0 opacity-0"
          style={{ left: 0, top: 0, clipPath: 'inset(50%)' }}
        />
      </div>

      {phase === 'playing' && (
        <p className="text-center text-xs text-muted">
          입력 박스는 우주선 위에 있습니다. 화면을 클릭하면 키 입력이 다시 활성화됩니다.
        </p>
      )}
    </div>
  );
}
