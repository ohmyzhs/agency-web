'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  label: string;
  value: string | number;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export function StatChip({ label, value, highlight = false, size = 'md' }: Props) {
  const reduced = useReducedMotion();

  const valueSizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

  return (
    <div className={`flex flex-col items-center gap-0.5 ${highlight ? 'text-primary' : ''}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <motion.p
        key={String(value)}
        initial={reduced ? false : { opacity: 0.5, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.14 }}
        className={`${valueSizes[size]} tabular-nums font-semibold`}
      >
        {value}
      </motion.p>
    </div>
  );
}
