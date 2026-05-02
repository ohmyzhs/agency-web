'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  previousTpm?: number;
  show: boolean;
};

export function BestRibbon({ previousTpm, show }: Props) {
  const reduced = useReducedMotion();

  if (!show) return null;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="flex items-center gap-2 rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-4 py-2"
    >
      <span className="text-lg">🏆</span>
      <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
        새 최고 기록!
        {previousTpm !== undefined && (
          <span className="ml-1 font-normal opacity-70">
            이전: {Math.round(previousTpm)} 타/분
          </span>
        )}
      </span>
    </motion.div>
  );
}
