'use client';
/**
 * 현재 입력 위치 기준으로 다음에 눌러야 할 키를 계산한다.
 * 자리연습: target의 다음 자모를 직접 매핑.
 * 나머지 모드: 남은 텍스트를 자소 분해 후 첫 자소를 매핑.
 */
import { useMemo } from 'react';
import {
  decomposeForKeystrokes,
  keyHintForChar,
  type KeyHint,
} from '@/lib/typing/korean-keyboard';

type Options = {
  target: string;
  typed: string;
  mode: string;
};

export function useNextExpectedKey({ target, typed, mode }: Options): KeyHint | undefined {
  return useMemo(() => {
    if (mode === 'keyboard-zone') {
      const nextChar = target[typed.length];
      if (!nextChar) return undefined;
      return keyHintForChar(nextChar);
    }

    const remaining = target.slice(typed.length);
    const seq = decomposeForKeystrokes(remaining);
    const next = seq[0];
    if (!next || next === ' ') return undefined;
    return keyHintForChar(next);
  }, [target, typed, mode]);
}
