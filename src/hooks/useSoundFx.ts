'use client';
/**
 * Howler.js 기반 사운드 이펙트 훅.
 * 사용자 첫 인터랙션 전까지 AudioContext가 잠겨 있으므로 lazy init.
 */
import { useCallback, useEffect, useRef } from 'react';
import { useTypingSettings } from '@/stores/useTypingSettings';

type SoundName =
  | 'key1' | 'key2' | 'key3' | 'key4'
  | 'error'
  | 'countdown-tick'
  | 'countdown-go'
  | 'complete'
  | 'best';

const SOUND_PATHS: Record<SoundName, string> = {
  key1:            '/typing/sfx/key1.wav',
  key2:            '/typing/sfx/key2.wav',
  key3:            '/typing/sfx/key3.wav',
  key4:            '/typing/sfx/key4.wav',
  error:           '/typing/sfx/error.wav',
  'countdown-tick':'/typing/sfx/countdown-tick.wav',
  'countdown-go':  '/typing/sfx/countdown-go.wav',
  complete:        '/typing/sfx/complete.wav',
  best:            '/typing/sfx/best.wav',
};

export function useSoundFx() {
  const volumeKey = useTypingSettings(s => s.volumeKeySound);
  const volumeEffect = useTypingSettings(s => s.volumeEffect);
  // Howl 인스턴스 캐시
  const cache = useRef<Map<SoundName, { play: (volume: number) => void }>>(new Map());
  const unlockedRef = useRef(false);

  const getOrLoad = useCallback(async (name: SoundName) => {
    const existing = cache.current.get(name);
    if (existing) return existing;

    // lazy import to avoid SSR issues
    const { Howl } = await import('howler');
    const howl = new Howl({
      src: [SOUND_PATHS[name]],
      preload: true,
      onloaderror: () => { /* 사운드 파일 없을 때 무음 처리 */ },
    });
    let loaded = false;
    howl.once('load', () => { loaded = true; });
    const wrapper = {
      play: (vol: number) => {
        if (!loaded) return;
        howl.volume(vol);
        howl.play();
      },
    };
    cache.current.set(name, wrapper);
    return wrapper;
  }, []);

  // Unlock AudioContext on first user gesture
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      // preload all sounds
      Object.keys(SOUND_PATHS).forEach(k => getOrLoad(k as SoundName));
    };
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => {
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('pointerdown', unlock);
    };
  }, [getOrLoad]);

  const playKey = useCallback(async () => {
    const idx = (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4;
    const s = await getOrLoad(`key${idx}` as SoundName);
    s.play(volumeKey);
  }, [getOrLoad, volumeKey]);

  const play = useCallback(async (name: Exclude<SoundName, 'key1'|'key2'|'key3'|'key4'>) => {
    const s = await getOrLoad(name);
    s.play(volumeEffect);
  }, [getOrLoad, volumeEffect]);

  return { playKey, play };
}
