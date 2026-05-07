import { assemble, disassemble } from 'es-hangul';

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

export type WordDefenseInputMeteor = {
  id: number;
  word: string;
  matched: number;
};

export type WordDefenseInputState = {
  activeTargetId: number | null;
  matchedById: Map<number, number>;
  pendingInput: string;
  completeTargetId: number | null;
};

function safeStrokeText(value: string): string {
  try {
    return disassemble(value);
  } catch {
    return value;
  }
}

function strokePrefixLength(input: string, target: string): number {
  if (!input) return 0;
  let i = 0;
  while (i < input.length && i < target.length && input[i] === target[i]) i += 1;
  return i;
}

/**
 * Resolve the editable text box value against current meteors.
 *
 * The game input intentionally behaves like a normal text field: users can
 * backspace, rewrite IME composition, or leave a temporary typo in the box
 * without the game clearing the field or releasing progress. This pure helper
 * recomputes target progress from the current full input value instead of
 * treating each keystroke as an irreversible event.
 */
export function resolveWordDefenseInput(args: {
  input: string;
  meteors: WordDefenseInputMeteor[];
  activeTargetId: number | null;
}): WordDefenseInputState {
  const input = args.input;
  const inputSeq = safeStrokeText(input);
  const matchedById = new Map(args.meteors.map((meteor) => [meteor.id, 0]));

  if (!inputSeq) {
    return {
      activeTargetId: null,
      matchedById,
      pendingInput: '',
      completeTargetId: null,
    };
  }

  const active = args.activeTargetId === null
    ? null
    : args.meteors.find((meteor) => meteor.id === args.activeTargetId) ?? null;

  const candidates = active ? [active] : args.meteors;
  let best: { meteor: WordDefenseInputMeteor; matched: number; targetSeq: string } | null = null;

  for (const meteor of candidates) {
    const targetSeq = safeStrokeText(meteor.word);
    const matched = strokePrefixLength(inputSeq, targetSeq);
    if (matched === 0) continue;
    if (!best || matched > best.matched) best = { meteor, matched, targetSeq };
  }

  if (!best) {
    return {
      activeTargetId: active?.id ?? null,
      matchedById,
      pendingInput: input,
      completeTargetId: null,
    };
  }

  matchedById.set(best.meteor.id, best.matched);
  const completeTargetId = best.matched >= best.targetSeq.length && inputSeq === best.targetSeq
    ? best.meteor.id
    : null;

  return {
    activeTargetId: best.meteor.id,
    matchedById,
    pendingInput: completeTargetId ? '' : input,
    completeTargetId,
  };
}
