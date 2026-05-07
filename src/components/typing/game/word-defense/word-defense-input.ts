import { assemble } from 'es-hangul';

export type CaptureDiff = {
  emitted: string[];
  nextPrevious: string;
  shouldClearInput: boolean;
};

/**
 * Diff a browser IME text input against the last emitted jamo string.
 *
 * Korean IME composition can rewrite the whole input value while a syllable is
 * still being composed. This helper only emits newly appended jamo and treats
 * replacement/deletion as a resync point instead of replaying stale characters.
 */
export function diffCaptureJamo(previous: string, current: string): CaptureDiff {
  let i = 0;
  while (i < previous.length && i < current.length && previous[i] === current[i]) i += 1;

  if (i < previous.length) {
    return {
      emitted: [],
      nextPrevious: current,
      shouldClearInput: current.length === 0,
    };
  }

  const emitted = Array.from(current.slice(i));
  return {
    emitted,
    nextPrevious: current,
    shouldClearInput: false,
  };
}

export function displayTypedProgress(strokes: string[]): string {
  if (strokes.length === 0) return '';
  try {
    return assemble(strokes);
  } catch {
    return strokes.join('');
  }
}
