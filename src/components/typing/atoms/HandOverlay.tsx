'use client';
/**
 * Minimal SVG hand overlay — highlights the finger expected to press next.
 * Placeholder geometry (no detailed anatomy assets yet).
 */
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { FingerId, ShiftSide } from '@/lib/typing/korean-keyboard';

type Finger = FingerId;

const FINGER_COLOR: Record<Finger, string> = {
  L5: '#f9a8d4', L4: '#c4b5fd', L3: '#7dd3fc', L2: '#86efac', L1: '#fcd34d',
  R1: '#fcd34d', R2: '#86efac', R3: '#7dd3fc', R4: '#c4b5fd', R5: '#f9a8d4',
};

const FINGER_LABEL: Record<Finger, string> = {
  L5: '왼5', L4: '왼4', L3: '왼3', L2: '왼2', L1: '왼1',
  R1: '오1', R2: '오2', R3: '오3', R4: '오4', R5: '오5',
};

// Layout: 10 fingertips in a 2-row layout (5 left + 5 right with gap)
const FINGERS: Array<{ id: Finger; cx: number; cy: number }> = [
  { id: 'L5', cx: 30,  cy: 20 },
  { id: 'L4', cx: 65,  cy: 8  },
  { id: 'L3', cx: 100, cy: 4  },
  { id: 'L2', cx: 135, cy: 8  },
  { id: 'L1', cx: 170, cy: 36 },
  { id: 'R1', cx: 230, cy: 36 },
  { id: 'R2', cx: 265, cy: 8  },
  { id: 'R3', cx: 300, cy: 4  },
  { id: 'R4', cx: 335, cy: 8  },
  { id: 'R5', cx: 370, cy: 20 },
];

type Props = {
  expectedFinger?: Finger;
  shiftSide?: ShiftSide;
  extraFingers?: Finger[];
};

export function HandOverlay({ expectedFinger, shiftSide, extraFingers = [] }: Props) {
  const reduced = useReducedMotion();
  const shiftFinger: Finger | undefined = shiftSide === 'left' ? 'L5' : shiftSide === 'right' ? 'R5' : undefined;
  const highlightedFingers = Array.from(new Set([expectedFinger, shiftFinger, ...extraFingers].filter(Boolean))) as Finger[];
  const label = highlightedFingers.length > 0
    ? `${shiftSide ? `${shiftSide === 'left' ? '왼Shift' : '오Shift'} + ` : ''}${highlightedFingers
        .filter((finger) => finger !== shiftFinger)
        .map((finger) => FINGER_LABEL[finger])
        .join(' + ')}`
    : '대기';

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted">
        <span>손가락 가이드</span>
        <span>{label}</span>
      </div>
      <svg viewBox="0 0 400 80" className="h-16 w-full">
        {/* palm shapes */}
        <path d="M 10 70 Q 100 70 170 60 L 170 78 L 10 78 Z" fill="currentColor" opacity="0.06" />
        <path d="M 230 60 Q 300 70 390 70 L 390 78 L 230 78 Z" fill="currentColor" opacity="0.06" />
        <line x1="10"  y1="70" x2="170" y2="60" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
        <line x1="230" y1="60" x2="390" y2="70" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />

        {FINGERS.map(f => {
          const isExpected = f.id === expectedFinger;
          const isShift = f.id === shiftFinger;
          const isExtra = extraFingers.includes(f.id);
          const color = FINGER_COLOR[f.id];
          // Connector line from palm to fingertip
          const palmY = 70;
          const palmX = f.cx + (f.id.startsWith('L')
            ? -((f.cx - 90) * 0.05)
            :  ((310 - f.cx) * 0.05));
          return (
            <g key={f.id}>
              <line
                x1={palmX} y1={palmY}
                x2={f.cx}  y2={f.cy + 6}
                stroke={isExpected || isShift || isExtra ? color : 'currentColor'}
                strokeOpacity={isExpected || isShift || isExtra ? 0.9 : 0.25}
                strokeWidth={isExpected || isShift || isExtra ? 2 : 1}
              />
              <motion.circle
                cx={f.cx}
                cy={f.cy}
                fill={isExpected || isShift || isExtra ? color : 'currentColor'}
                fillOpacity={isExpected || isShift || isExtra ? 1 : 0.3}
                initial={{ r: isExpected || isShift || isExtra ? 8 : 5 }}
                animate={
                  (isExpected || isShift || isExtra) && !reduced
                    ? { r: [8, 11, 8] }
                    : { r: isExpected || isShift || isExtra ? 8 : 5 }
                }
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
