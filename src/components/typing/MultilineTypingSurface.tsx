"use client";

import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { CharStatus } from "@/lib/typing/metrics";
import { decomposeForKeystrokes } from "@/lib/typing/korean-keyboard";
import type { TypingMode } from "@/lib/typing/types";
import TypingInput from "./TypingInput";

type MultilineTypingSurfaceProps = {
  target: string;
  typed: string;
  isComposing: boolean;
  mode: TypingMode;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onValueChange: (value: string) => void;
  onCompositionChange: (composing: boolean) => void;
  onKeyDownCapture?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
};

const colorByStatus: Record<CharStatus, string> = {
  correct: "text-muted/70",
  incorrect: "text-red-600 underline decoration-red-500 decoration-2 dark:text-red-400",
  pending: "text-foreground bg-amber-200/80 dark:bg-amber-700/50 rounded-sm",
  untyped: "text-foreground/80",
};


function isHangulSyllable(char: string): boolean {
  const code = char.codePointAt(0);
  return code !== undefined && code >= 0xac00 && code <= 0xd7a3;
}

type RenderPart = {
  key: string;
  text: string;
  status: CharStatus;
  isCursor?: boolean;
  jamo?: boolean;
};

function buildJamoAwareParts(target: string, typed: string, isComposing: boolean): { parts: RenderPart[]; cursorIndex: number; totalChars: number } {
  const chars = Array.from(target);
  const typedChars = Array.from(typed);
  const typedStrokes = decomposeForKeystrokes(typed);
  const parts: RenderPart[] = [];
  let strokeCursor = 0;
  let visualCursor = chars.length;

  chars.forEach((char, charIndex) => {
    const targetStrokes = decomposeForKeystrokes(char);
    const remainingStrokes = typedStrokes.slice(strokeCursor);
    const typedSlice = remainingStrokes.slice(0, targetStrokes.length);
    const matched = typedSlice.filter((stroke, idx) => stroke === targetStrokes[idx]).length;
    const consumed = Math.min(typedSlice.length, targetStrokes.length);
    const hasAny = consumed > 0;
    const fullyTyped = consumed >= targetStrokes.length;
    const typedChar = typedChars[charIndex];
    const isCurrent = !fullyTyped && visualCursor === chars.length;
    if (isCurrent) visualCursor = charIndex;

    if (isHangulSyllable(char) && hasAny && !fullyTyped) {
      targetStrokes.forEach((stroke, strokeIndex) => {
        const typedStroke = typedSlice[strokeIndex];
        const status: CharStatus = typedStroke === undefined
          ? 'untyped'
          : typedStroke === stroke
          ? (isComposing && strokeIndex === consumed - 1 ? 'pending' : 'correct')
          : 'incorrect';
        parts.push({
          key: `${charIndex}-${strokeIndex}-${stroke}`,
          text: typedStroke ?? stroke,
          status,
          isCursor: strokeIndex === consumed && !isComposing,
          jamo: true,
        });
      });
    } else {
      const status: CharStatus = !hasAny
        ? 'untyped'
        : typedChar === char || matched === targetStrokes.length
        ? 'correct'
        : fullyTyped
        ? 'incorrect'
        : 'pending';
      parts.push({
        key: `${charIndex}-${char}`,
        text: char === "\n" ? "\n" : char,
        status: isComposing && hasAny && !fullyTyped ? 'pending' : status,
        isCursor: isCurrent && !isComposing,
      });
    }
    if (hasAny) strokeCursor += consumed;
  });

  if (visualCursor === chars.length && typed.length < target.length) visualCursor = typed.length;
  return { parts, cursorIndex: Math.min(typed.length, chars.length), totalChars: chars.length };
}

function visibleLinesForMode(mode: TypingMode): number {
  if (mode === "longform") return 5;
  if (mode === "sentence") return 1;
  return 3;
}

function lineClassForMode(mode: TypingMode): string {
  if (mode === "word" || mode === "speed-test") {
    return "font-mono text-2xl font-medium leading-[1.65] tracking-[0.04em] sm:text-3xl";
  }
  if (mode === "longform") {
    return "font-sans text-lg font-medium leading-9 sm:text-xl sm:leading-10";
  }
  return "font-sans text-xl font-medium leading-9 sm:text-2xl sm:leading-10";
}

export function MultilineTypingSurface({
  target,
  typed,
  isComposing,
  mode,
  inputRef,
  onValueChange,
  onCompositionChange,
  onKeyDownCapture,
  disabled,
}: MultilineTypingSurfaceProps) {
  const { parts, cursorIndex, totalChars } = useMemo(() => buildJamoAwareParts(target, typed, isComposing), [target, typed, isComposing]);
  const progress = totalChars > 0 ? Math.min(100, Math.round((cursorIndex / totalChars) * 100)) : 0;
  const refIndex = parts.findIndex((part) => part.isCursor);
  const visibleLines = visibleLinesForMode(mode);

  const windowRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const focusInput = useCallback(() => {
    const el = inputRef.current;
    if (!el || disabled) return;
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }
  }, [disabled, inputRef]);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const win = windowRef.current;
    if (!inner || !win) return;
    const cs = getComputedStyle(inner);
    const parsed = parseFloat(cs.lineHeight);
    const fallback = mode === "longform" ? 40 : 38;
    const lineHeight = Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    const maxOffset = Math.max(0, inner.scrollHeight - lineHeight * visibleLines);

    win.style.height = `${lineHeight * visibleLines}px`;

    const cursor = cursorRef.current;
    let offset = 0;
    if (cursor) {
      const lineIdx = Math.max(0, Math.round(cursor.offsetTop / lineHeight));
      const anchorLine = Math.max(0, Math.floor(visibleLines / 2));
      offset = Math.min(maxOffset, Math.max(0, (lineIdx - anchorLine) * lineHeight));
    }
    inner.style.transform = `translateY(-${offset}px)`;
  }, [typed, target, mode, visibleLines, isComposing]);

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/10"
      aria-label="문단형 타자 입력면"
      onMouseDown={(event) => {
        event.preventDefault();
        focusInput();
      }}
      onTouchStart={() => focusInput()}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5 text-xs text-muted">
        <span className="font-medium uppercase tracking-wider">지문에 바로 입력</span>
        <span className="tabular-nums">{cursorIndex} / {totalChars}</span>
      </div>
      <div className="h-1 bg-border/70" aria-hidden="true">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div
        ref={windowRef}
        className="relative overflow-hidden px-4 py-4 sm:px-6 [mask-image:linear-gradient(to_bottom,black_0%,black_78%,rgba(0,0,0,0.45)_100%)]"
      >
        <div
          ref={innerRef}
          className={[
            "transition-transform duration-200 ease-out will-change-transform",
            "break-words [overflow-wrap:anywhere] [word-break:keep-all]",
            lineClassForMode(mode),
          ].join(" ")}
        >
          {parts.map((part, i) => {
            const cursorClass = part.isCursor
              ? "rounded-sm bg-amber-200/80 text-foreground dark:bg-amber-700/50"
              : colorByStatus[part.status];

            return (
              <span
                key={part.key}
                ref={i === refIndex ? cursorRef : undefined}
                className={[cursorClass, part.jamo ? "mx-0.5 inline-block min-w-[0.7em] text-center" : ""].join(" ")}
              >
                {part.text}
              </span>
            );
          })}
          {totalChars === 0 && (
            <span className="text-muted">지문을 불러오는 중입니다.</span>
          )}
        </div>
      </div>

      <TypingInput
        ref={inputRef}
        value={typed}
        onValueChange={onValueChange}
        onCompositionChange={onCompositionChange}
        onKeyDownCapture={onKeyDownCapture}
        disabled={disabled}
        ariaLabel="타자 입력"
        variant="surface"
        rows={mode === "sentence" ? 1 : undefined}
      />
    </section>
  );
}
