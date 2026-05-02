'use client';
import { useEffect, useState } from 'react';

export type CountdownState = 'idle' | 'counting' | 'done';

export function useCountdown(seconds = 3, onDone?: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const [state, setState] = useState<CountdownState>('idle');

  function start() {
    setRemaining(seconds);
    setState('counting');
  }

  function cancel() {
    setRemaining(seconds);
    setState('idle');
  }

  useEffect(() => {
    if (state !== 'counting') return;
    const id = window.setTimeout(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setState('done');
          onDone?.();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearTimeout(id);
  }, [onDone, state, remaining]);

  return { remaining, state, start, cancel };
}
