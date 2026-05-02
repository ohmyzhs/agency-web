export type MetricsInput = {
  target: string;
  typed: string;
  startedAt: number | null;
  finishedAt: number | null;
};

export type LiveMetrics = {
  typedChars: number;
  correctChars: number;
  incorrectChars: number;
  accuracy: number;
  cpm: number;
  wpm: number;
  rawCpm: number;
  elapsedSeconds: number;
};

export function computeLiveMetrics({
  target,
  typed,
  startedAt,
  finishedAt,
}: MetricsInput): LiveMetrics {
  const elapsedMs =
    startedAt === null
      ? 0
      : (finishedAt ?? Date.now()) - startedAt;
  const elapsedSeconds = Math.max(elapsedMs / 1000, 0);
  const minutes = elapsedSeconds / 60;

  let correct = 0;
  for (let i = 0; i < typed.length; i += 1) {
    if (i < target.length && typed[i] === target[i]) correct += 1;
  }
  const typedChars = typed.length;
  const incorrect = Math.max(typedChars - correct, 0);
  const cpm = minutes > 0 ? correct / minutes : 0;
  const rawCpm = minutes > 0 ? typedChars / minutes : 0;
  const wpm = minutes > 0 ? correct / 5 / minutes : 0;
  const accuracy = typedChars > 0 ? correct / typedChars : 0;

  return {
    typedChars,
    correctChars: correct,
    incorrectChars: incorrect,
    accuracy,
    cpm,
    wpm,
    rawCpm,
    elapsedSeconds,
  };
}

// Char-status array used by the target text renderer.
// "pending" = the actively-composing character (don't flag as error during IME composition).
export type CharStatus = "correct" | "incorrect" | "pending" | "untyped";

export function statusFor(
  target: string,
  typed: string,
  isComposing: boolean,
): CharStatus[] {
  const out: CharStatus[] = [];
  const composingIndex = isComposing ? typed.length - 1 : -1;
  for (let i = 0; i < target.length; i += 1) {
    if (i >= typed.length) {
      out.push("untyped");
    } else if (i === composingIndex) {
      out.push("pending");
    } else if (typed[i] === target[i]) {
      out.push("correct");
    } else {
      out.push("incorrect");
    }
  }
  return out;
}
