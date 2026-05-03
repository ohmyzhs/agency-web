'use client';
/**
 * Howler.js 기반 사운드 이펙트 훅.
 * 사용자 첫 인터랙션 전까지 AudioContext가 잠겨 있으므로 lazy init.
 */
import { useCallback, useEffect, useRef } from 'react';
import { useTypingSettings } from '@/stores/useTypingSettings';

type SoundName =
  | 'key1' | 'key2' | 'key3' | 'key4'
  | 'miss'
  | 'count-tick-1' | 'count-tick-2' | 'count-tick-3'
  | 'count-go'
  | 'complete'
  | 'tada'
  | 'game-hit'
  | 'game-boom'
  | 'bgm';

const SOUND_PATHS: Record<SoundName, string> = {
  key1:           '/typing/sfx/key-1.wav',
  key2:           '/typing/sfx/key-2.wav',
  key3:           '/typing/sfx/key-3.wav',
  key4:           '/typing/sfx/key-4.wav',
  miss:           '/typing/sfx/miss.wav',
  'count-tick-1': '/typing/sfx/count-tick-1.wav',
  'count-tick-2': '/typing/sfx/count-tick-2.wav',
  'count-tick-3': '/typing/sfx/count-tick-3.wav',
  'count-go':     '/typing/sfx/count-go.wav',
  complete:       '/typing/sfx/complete.wav',
  tada:           '/typing/sfx/tada.wav',
  'game-hit':     '/typing/sfx/game-hit.wav',
  'game-boom':    '/typing/sfx/game-boom.wav',
  bgm:            '/typing/sfx/bgm-loop.mp3',
};

// Public sound names (effect channel). Excludes raw key tones and bgm.
type EffectName = Exclude<SoundName, 'key1' | 'key2' | 'key3' | 'key4' | 'bgm'>;

// Backward-compatible aliases used by older callers.
const ALIASES: Record<string, SoundName> = {
  error: 'miss',
  'countdown-tick': 'count-tick-1',
  'countdown-go': 'count-go',
  best: 'tada',
};

type HowlInstance = {
  volume: (v: number) => void;
  play: () => void;
  stop: () => void;
  loop: (v: boolean) => void;
  playing: () => boolean;
  once: (event: string, fn: () => void) => void;
  state: () => 'unloaded' | 'loading' | 'loaded';
};

type Wrapper = {
  howl: HowlInstance;
  play: (volume: number) => void;
  stop: () => void;
  setVolume: (v: number) => void;
};

const cache = new Map<SoundName, Wrapper>();
let HowlCtor: (new (opts: Record<string, unknown>) => HowlInstance) | null = null;

async function getHowl() {
  if (HowlCtor) return HowlCtor;
  const mod = await import('howler');
  HowlCtor = mod.Howl as unknown as new (opts: Record<string, unknown>) => HowlInstance;
  return HowlCtor;
}

async function getOrLoad(name: SoundName, opts?: { loop?: boolean }): Promise<Wrapper> {
  const existing = cache.get(name);
  if (existing) return existing;

  const Howl = await getHowl();
  const howl = new Howl({
    src: [SOUND_PATHS[name]],
    preload: true,
    loop: opts?.loop ?? false,
    html5: name === 'bgm',
    onloaderror: () => { /* missing sfx → silent */ },
    onplayerror: () => { /* autoplay block → silent */ },
  });

  const wrapper: Wrapper = {
    howl,
    play: (vol: number) => {
      howl.volume(Math.max(0, Math.min(1, vol)));
      const playNow = () => {
        try { howl.play(); } catch { /* swallow */ }
      };
      if (howl.state() === 'loaded') playNow();
      else howl.once('load', playNow);
    },
    stop: () => {
      try { howl.stop(); } catch { /* swallow */ }
    },
    setVolume: (v: number) => {
      howl.volume(Math.max(0, Math.min(1, v)));
    },
  };
  cache.set(name, wrapper);
  return wrapper;
}

function resolveName(name: string): SoundName {
  if (name in SOUND_PATHS) return name as SoundName;
  if (name in ALIASES) return ALIASES[name];
  return 'miss';
}

export function useSoundFx() {
  const volumeKey = useTypingSettings(s => s.volumeKeySound);
  const volumeEffect = useTypingSettings(s => s.volumeEffect);
  const volumeBgm = useTypingSettings(s => s.volumeBgm);
  const unlockedRef = useRef(false);
  const bgmRef = useRef<Wrapper | null>(null);

  // Unlock AudioContext on first user gesture, preload basic sounds.
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      void getOrLoad('key1');
      void getOrLoad('key2');
      void getOrLoad('key3');
      void getOrLoad('key4');
      void getOrLoad('miss');
    };
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => {
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('pointerdown', unlock);
    };
  }, []);

  // Live-update bgm volume when slider changes.
  useEffect(() => {
    bgmRef.current?.setVolume(volumeBgm);
  }, [volumeBgm]);

  const playKey = useCallback(async () => {
    if (volumeKey <= 0) return;
    const idx = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
    const s = await getOrLoad(`key${idx}` as SoundName);
    s.play(volumeKey);
  }, [volumeKey]);

  const play = useCallback(async (name: EffectName | 'error' | 'countdown-tick' | 'countdown-go' | 'best') => {
    if (volumeEffect <= 0) return;
    const resolved = resolveName(name);
    const s = await getOrLoad(resolved);
    s.play(volumeEffect);
  }, [volumeEffect]);

  const playBgm = useCallback(async () => {
    if (volumeBgm <= 0) return;
    const s = await getOrLoad('bgm', { loop: true });
    bgmRef.current = s;
    s.howl.loop(true);
    if (!s.howl.playing()) s.play(volumeBgm);
    else s.setVolume(volumeBgm);
  }, [volumeBgm]);

  const stopBgm = useCallback(() => {
    bgmRef.current?.stop();
  }, []);

  return { playKey, play, playBgm, stopBgm };
}
