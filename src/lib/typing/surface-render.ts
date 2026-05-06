import { assemble } from "es-hangul";
import { decomposeForKeystrokes } from "./korean-keyboard";

export type TypingSurfaceCharStatus = "correct" | "incorrect" | "pending" | "untyped";

export type TypingSurfacePart = {
  key: string;
  text: string;
  status: TypingSurfaceCharStatus;
  isCursor?: boolean;
};

function isHangulSyllable(char: string): boolean {
  const code = char.codePointAt(0);
  return code !== undefined && code >= 0xac00 && code <= 0xd7a3;
}

function composeStrokePrefix(strokes: string[]): string {
  if (strokes.length === 0) return "";
  return assemble(strokes);
}

export function buildTypingSurfaceParts(
  target: string,
  typed: string,
  isComposing: boolean,
): { parts: TypingSurfacePart[]; cursorIndex: number; totalChars: number } {
  const chars = Array.from(target);
  const typedStrokes = decomposeForKeystrokes(typed);
  const parts: TypingSurfacePart[] = [];
  let strokeCursor = 0;
  let visualCursor = chars.length;
  let cursorPartIndex = -1;

  chars.forEach((char, charIndex) => {
    const targetStrokes = decomposeForKeystrokes(char);
    const typedSlice = typedStrokes.slice(strokeCursor, strokeCursor + targetStrokes.length);
    const consumed = Math.min(typedSlice.length, targetStrokes.length);
    const hasAny = consumed > 0;
    const fullyTyped = consumed >= targetStrokes.length;
    const matched = consumed > 0 && typedSlice.every((stroke, index) => stroke === targetStrokes[index]);
    const isCurrent = !fullyTyped && visualCursor === chars.length;

    if (isCurrent) {
      visualCursor = charIndex;
      cursorPartIndex = parts.length;
    }

    if (isHangulSyllable(char) && hasAny && !fullyTyped) {
      const prefix = composeStrokePrefix(typedSlice);
      const status: TypingSurfaceCharStatus = matched ? (isComposing ? "pending" : "correct") : "incorrect";
      parts.push({
        key: `${charIndex}-${char}-partial-${typedSlice.join("")}`,
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

    if (hasAny) strokeCursor += consumed;
  });

  if (visualCursor === chars.length && typedStrokes.length < decomposeForKeystrokes(target).length) {
    visualCursor = Math.min(Array.from(typed).length, chars.length);
  }

  const completedChars = parts.filter((part) => part.status === "correct" || part.status === "incorrect").length;
  const cursorIndex = Math.min(visualCursor === chars.length ? completedChars : visualCursor, chars.length);
  if (cursorPartIndex >= 0 && !isComposing) {
    parts[cursorPartIndex] = { ...parts[cursorPartIndex], isCursor: true };
  }

  return { parts, cursorIndex, totalChars: chars.length };
}
