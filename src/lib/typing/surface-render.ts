import { assemble } from "es-hangul";
import { decomposeForKeystrokes } from "./korean-keyboard";

export type TypingSurfaceCharStatus = "correct" | "incorrect" | "pending" | "untyped";

export type TypingSurfacePart = {
  key: string;
  text: string;
  status: TypingSurfaceCharStatus;
  isCursor?: boolean;
};

export type TypingSurfaceCache = {
  target: string;
  chars: string[];
  charStrokeStarts: number[];
  charStrokes: string[][];
  targetStrokes: string[];
};

function isHangulSyllable(char: string): boolean {
  const code = char.codePointAt(0);
  return code !== undefined && code >= 0xac00 && code <= 0xd7a3;
}

function composeStrokePrefix(strokes: string[]): string {
  if (strokes.length === 0) return "";
  return assemble(strokes);
}

export function buildTypingSurfaceCache(target: string): TypingSurfaceCache {
  const chars = Array.from(target);
  const charStrokeStarts: number[] = [];
  const charStrokes: string[][] = [];
  const targetStrokes: string[] = [];

  chars.forEach((char) => {
    charStrokeStarts.push(targetStrokes.length);
    const strokes = decomposeForKeystrokes(char);
    charStrokes.push(strokes);
    targetStrokes.push(...strokes);
  });

  return { target, chars, charStrokeStarts, charStrokes, targetStrokes };
}

export function buildTypingSurfaceParts(
  target: string,
  typed: string,
  isComposing: boolean,
  cache: TypingSurfaceCache = buildTypingSurfaceCache(target),
): { parts: TypingSurfacePart[]; cursorIndex: number; totalChars: number } {
  const typedStrokes = decomposeForKeystrokes(typed);
  const typedStrokeCount = typedStrokes.length;
  const parts: TypingSurfacePart[] = [];
  let visualCursor = cache.chars.length;
  let cursorPartIndex = -1;

  cache.chars.forEach((char, charIndex) => {
    const targetStrokes = cache.charStrokes[charIndex] ?? [];
    const strokeStart = cache.charStrokeStarts[charIndex] ?? 0;
    const remaining = typedStrokeCount - strokeStart;
    const consumed = Math.min(Math.max(remaining, 0), targetStrokes.length);
    const hasAny = consumed > 0;
    const fullyTyped = consumed >= targetStrokes.length;
    const typedSlice = hasAny ? typedStrokes.slice(strokeStart, strokeStart + consumed) : [];
    const matched = hasAny && typedSlice.every((stroke, index) => stroke === targetStrokes[index]);
    const isCurrent = !fullyTyped && visualCursor === cache.chars.length;

    if (isCurrent) {
      visualCursor = charIndex;
      cursorPartIndex = parts.length;
    }

    if (isHangulSyllable(char) && hasAny && !fullyTyped) {
      const prefix = composeStrokePrefix(typedSlice);
      const status: TypingSurfaceCharStatus = matched ? (isComposing ? "pending" : "correct") : "incorrect";
      parts.push({
        key: `${charIndex}-${char}`,
        text: prefix || char,
        status,
        isCursor: false,
      });
    } else {
      const status: TypingSurfaceCharStatus = !hasAny
        ? "untyped"
        : matched && fullyTyped
          ? "correct"
          : fullyTyped
            ? "incorrect"
            : "pending";
      parts.push({
        key: `${charIndex}-${char}`,
        text: char,
        status,
        isCursor: false,
      });
    }
  });

  const completedChars = parts.filter((part) => part.status === "correct" || part.status === "incorrect").length;
  const cursorIndex = Math.min(visualCursor === cache.chars.length ? completedChars : visualCursor, cache.chars.length);
  if (cursorPartIndex >= 0 && !isComposing) {
    parts[cursorPartIndex] = { ...parts[cursorPartIndex], isCursor: true };
  }

  return { parts, cursorIndex, totalChars: cache.chars.length };
}
