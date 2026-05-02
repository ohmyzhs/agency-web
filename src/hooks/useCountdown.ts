'use client';
import { useEffect, useRef, useState } from 'react';

export type CountdownState = 'idle' | 'counting' | 'done';

export function useCountdown(seconds = 3, onDone?: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const [state, setState] = useState<CountdownState>('idle');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

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
    if (remaining <= 0) {
      setState('done');
      onDoneRef.current?.();
      return;
    }
    const id = window.setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [state, remaining]);

  return { remaining, state, start, cancel };
}
