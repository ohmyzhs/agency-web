'use client';
/**
 * 현재 입력 위치 기준으로 다음에 눌러야 할 키를 계산한다.
 *
 * 한글 문장/낱말/장문은 textarea 값이 음절 단위로 들어오지만,
 * 가이드는 실제 두벌식 타건 순서(초성 → 중성 → 종성)로 움직여야 한다.
 * 예: "팀원"은 target/typed의 문자열 인덱스가 아니라
 * ㅌ → ㅣ → ㅁ → ㅇ → ㅜ → ㅓ → ㄴ 순서로 안내한다.
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

    const targetSeq = decomposeForKeystrokes(target);
    const typedSeq = decomposeForKeystrokes(typed);
    const next = targetSeq[typedSeq.length];
    if (!next) return undefined;
    return keyHintForChar(next);
  }, [target, typed, mode]);
}
