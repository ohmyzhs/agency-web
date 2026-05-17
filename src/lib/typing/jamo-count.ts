import { isEquivalentTypingStroke } from './korean-keyboard';

/**
 * 한국 표준 "타" 단위 자모 카운터.
 * 한컴타자 2024-04-24 음절→자소 기준 변경을 따름.
 *
 * - 받침 있는 음절(예: 간): 초성+중성+종성 = 3타
 * - 받침 없는 음절(예: 가): 초성+중성      = 2타
 * - 단일 자모 (ㄱ~ㅣ 범위): 1타
 * - 영문/숫자/공백:          1타
 *
 * 이중모음(ㅘ 등)은 키보드 입력 모델에서 2타이지만,
 * 이 함수는 텍스트 기반 자모 수만 센다.
 * 키 입력 모델이 필요한 경우 korean-keyboard.ts의 decomposeForKeystrokes 사용.
 */

const HANGUL_BASE = 0xac00;
const HANGUL_END  = 0xd7a3;
const JAMO_START  = 0x3131;
const JAMO_END    = 0x318e;

export function jamoCountOf(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code >= HANGUL_BASE && code <= HANGUL_END) {
    const offset = code - HANGUL_BASE;
    const jongseong = offset % 28;
    return jongseong > 0 ? 3 : 2;
  }
  if (code >= JAMO_START && code <= JAMO_END) return 1;
  return 1; // 영문/숫자/공백/특수문자
}

export function jamoCountOfText(text: string): number {
  let count = 0;
  for (const ch of text) count += jamoCountOf(ch);
  return count;
}

/**
 * 두 문자열을 자모 단위로 비교해 정타/오타 자모 수를 반환.
 * target과 typed가 완전히 같은 자리의 자모를 비교.
 *
 * 한글은 자소 분해 없이 음절 단위로 정오 판단.
 * (음절이 맞으면 해당 음절의 모든 자모를 correct로 처리)
 */
export function countCorrectJamo(target: string, typed: string): {
  jamoCorrect: number;
  jamoIncorrect: number;
  jamoTyped: number;
} {
  let jamoCorrect = 0;
  let jamoIncorrect = 0;
  const maxIdx = Math.min(target.length, typed.length);

  for (let i = 0; i < maxIdx; i++) {
    const tc = jamoCountOf(target[i]);
    if (isEquivalentTypingStroke(target[i], typed[i])) {
      jamoCorrect += tc;
    } else {
      // 자모 수는 typed 기준 (잘못 입력된 문자의 자모 수)
      jamoIncorrect += jamoCountOf(typed[i]);
    }
  }
  // 초과 입력된 부분도 incorrect
  for (let i = maxIdx; i < typed.length; i++) {
    jamoIncorrect += jamoCountOf(typed[i]);
  }

  return {
    jamoCorrect,
    jamoIncorrect,
    jamoTyped: jamoCorrect + jamoIncorrect,
  };
}
