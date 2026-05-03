'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RingProgress } from './RingProgress';
import { useCountdown } from '@/hooks/useCountdown';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSoundFx } from '@/hooks/useSoundFx';
import type { SessionPhase } from '@/stores/useTypingSession';

type Props = {
  /** 카운트다운 활성화 여부 */
  enabled: boolean;
  onStart: () => void;
  /** 카운트다운 초 (기본 3) */
  seconds?: number;
  /** phase === 'countdown'이 되면 시작 트리거 */
  phase: SessionPhase;
};

export function CountdownGate({ enabled, onStart, seconds = 3, phase }: Props) {
  const reduced = useReducedMotion();
  const { play } = useSoundFx();
  const { remaining, state, start } = useCountdown(seconds, () => {
    play('countdown-go').catch(() => {});
    onStart();
  });

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (!enabled) {
      onStart();
      return;
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (state !== 'counting') return;
    const tickName =
      remaining >= 3 ? 'count-tick-3' :
      remaining === 2 ? 'count-tick-2' :
      'count-tick-1';
    play(tickName).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  if (!enabled || state === 'idle' || state === 'done') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <RingProgress progress={remaining / seconds} size={320} strokeWidth={12}>
        <AnimatePresence mode="wait">
          <motion.p
            key={remaining}
            initial={reduced ? false : { opacity: 0, scale: 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? {} : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="font-mono text-[140px] font-bold leading-none tabular-nums text-primary"
          >
            {remaining}
          </motion.p>
        </AnimatePresence>
      </RingProgress>
    </div>
  );
}
