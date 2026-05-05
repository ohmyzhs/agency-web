'use client';

import type { FingerId, KeyHint, ShiftSide } from '@/lib/typing/korean-keyboard';
import KoreanKeyboard from '../KoreanKeyboard';
import { HandOverlay } from './HandOverlay';
import type { ZoneId } from '@/lib/typing/korean-keyboard';

type Props = {
  expectedKey?: KeyHint;
  highlightZone?: ZoneId;
  showHangul?: boolean;
};

const FINGER_NAME: Record<FingerId, string> = {
  L5: '왼손 새끼',
  L4: '왼손 약지',
  L3: '왼손 중지',
  L2: '왼손 검지',
  L1: '왼손 엄지',
  R1: '오른손 엄지',
  R2: '오른손 검지',
  R3: '오른손 중지',
  R4: '오른손 약지',
  R5: '오른손 새끼',
};

function shiftLabel(side?: ShiftSide) {
  if (side === 'left') return '왼쪽 Shift';
  if (side === 'right') return '오른쪽 Shift';
  return null;
}

export function KeyboardFingerGuide({ expectedKey, highlightZone, showHangul = true }: Props) {
  const baseFinger = expectedKey?.finger ? FINGER_NAME[expectedKey.finger] : null;
  const shift = shiftLabel(expectedKey?.shiftSide);
  const hintParts = [shift, baseFinger].filter(Boolean);
  const keyLabel = expectedKey?.hangul ?? expectedKey?.base ?? expectedKey?.code;

  return (
    <section
      aria-label="통합 키보드 손가락 가이드"
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">키보드 · 손가락 가이드</p>
          <p className="mt-1 text-sm text-muted">
            {keyLabel
              ? `다음 키 ${keyLabel} · ${hintParts.join(' + ') || '손가락 위치 확인'}`
              : '다음 글자를 누르면 필요한 키와 손가락을 함께 강조합니다.'}
          </p>
        </div>
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted">
          두벌식 기준
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <KoreanKeyboard
            expectedKey={expectedKey}
            highlightZone={highlightZone}
            showHangul={showHangul}
            variant="embedded"
          />
        </div>
        <div className="border-t border-border lg:border-l lg:border-t-0">
          <HandOverlay
            expectedFinger={expectedKey?.finger}
            shiftSide={expectedKey?.shiftSide}
            extraFingers={expectedKey?.extraFingers}
            variant="embedded"
          />
        </div>
      </div>
    </section>
  );
}
