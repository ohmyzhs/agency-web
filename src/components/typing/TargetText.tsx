"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { statusFor, type CharStatus } from "@/lib/typing/metrics";
import type { TypingMode } from "@/lib/typing/types";

type TargetTextProps = {
  target: string;
  typed: string;
  isComposing: boolean;
  mode?: TypingMode;
};

const colorByStatus: Record<CharStatus, string> = {
  correct: "text-zinc-400 dark:text-zinc-500",
  incorrect: "text-red-600 underline decoration-red-500 decoration-2 dark:text-red-400",
  pending: "text-foreground bg-amber-200/80 dark:bg-amber-700/50 rounded-sm",
  untyped: "text-foreground",
};

const COMPACT_MODES = new Set<TypingMode>(["keyboard-zone", "word", "speed-test"]);

function ZoneTargetText({ target, typed }: { target: string; typed: string }) {
  const chars = useMemo(() => Array.from(target), [target]);
  const total = chars.length;
  const cursorIndex = Math.min(Array.from(typed).length, total);
  const progress = total > 0 ? Math.min(100, Math.round((cursorIndex / total) * 100)) : 0;

  const LEFT = 3;
  const RIGHT = 4;
  const leftStart = Math.max(0, cursorIndex - LEFT);
  const rightEnd = Math.min(total, cursorIndex + RIGHT + 1);

  const leftChars = chars.slice(leftStart, cursorIndex);
  const currentChar = cursorIndex < total ? chars[cursorIndex] : null;
  const rightChars = chars.slice(cursorIndex + 1, rightEnd);

  const renderPreview = (ch: string, key: string, faded: boolean) => {
    return (
      <span
        key={key}
        aria-hidden="true"
        className={[
          "inline-flex h-12 min-w-[2.25rem] items-center justify-center rounded-md border border-border/70 bg-background px-2 font-mono text-xl",
          faded ? "opacity-40" : "opacity-70",
        ].join(" ")}
      >
        {ch}
      </span>
    );
  };

  return (
    <section
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      aria-label="자리연습 입력 안내"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5 text-xs text-muted">
        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-sm">
          자리연습
        </span>
        <span className="tabular-nums">{cursorIndex} / {total}</span>
      </div>
      <div className="h-1 bg-border/70" aria-hidden="true">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-center gap-3 px-4 py-8 sm:gap-4 sm:py-10">
        <div className="flex items-center gap-1.5 sm:gap-2 [mask-image:linear-gradient(to_right,transparent_0%,black_60%,black_100%)]">
          {leftChars.map((ch, i) => renderPreview(ch, `l-${leftStart + i}`, true))}
        </div>

        <div
          className="flex min-w-[8.5rem] flex-col items-center justify-center rounded-2xl border-2 border-primary bg-primary/10 px-6 py-5 shadow-md ring-4 ring-primary/15 transition-transform duration-200 ease-out sm:min-w-[10rem] sm:px-8 sm:py-6"
          aria-live="polite"
          aria-label={currentChar ? `입력할 자리 ${currentChar}` : "완료"}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80">
            입력할 자리
          </span>
          <span className="mt-2 font-mono text-5xl font-bold leading-none tracking-tight text-foreground sm:text-6xl">
            {currentChar === null ? "✓" : currentChar === " " ? "␣" : currentChar}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 [mask-image:linear-gradient(to_left,transparent_0%,black_60%,black_100%)]">
          {rightChars.map((ch, i) => renderPreview(ch, `r-${cursorIndex + 1 + i}`, false))}
        </div>
      </div>
    </section>
  );
}

function StandardTargetText({ target, typed, isComposing, mode }: Required<TargetTextProps>) {
  const statuses = useMemo(() => statusFor(target, typed, isComposing), [target, typed, isComposing]);
  const chars = useMemo(() => Array.from(target), [target]);
  const cursorIndex = Math.min(Array.from(typed).length, chars.length);
  const progress = target.length > 0 ? Math.min(100, Math.round((cursorIndex / chars.length) * 100)) : 0;
  const compact = COMPACT_MODES.has(mode);
  const refIndex = chars.length === 0 ? -1 : Math.min(cursorIndex, chars.length - 1);

  const windowRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const win = windowRef.current;
    if (!inner || !win) return;
    const cs = getComputedStyle(inner);
    const parsed = parseFloat(cs.lineHeight);
    const fallback = compact ? 44 : 40;
    const lh = Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;

    win.style.height = `${lh * 2}px`;

    const cursor = cursorRef.current;
    let offset = 0;
    if (cursor) {
      const top = cursor.offsetTop;
      const lineIdx = Math.max(0, Math.round(top / lh));
      offset = lineIdx * lh;
    }
    inner.style.transform = `translateY(-${offset}px)`;
  }, [typed, target, mode, compact, isComposing]);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      aria-label="연습 지문"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-2.5 text-xs text-muted">
        <span className="font-medium uppercase tracking-wider">지문</span>
        <span className="tabular-nums">{cursorIndex} / {chars.length}</span>
      </div>
      <div className="h-1 bg-border/70" aria-hidden="true">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
      <div
        ref={windowRef}
        className="relative overflow-hidden px-4 py-4 sm:px-6 [mask-image:linear-gradient(to_bottom,black_0%,black_55%,rgba(0,0,0,0.4)_100%)]"
        style={{ height: compact ? 88 : 80 }}
      >
        <div
          ref={innerRef}
          className={[
            "transition-transform duration-200 ease-out will-change-transform",
            "break-words [overflow-wrap:anywhere] [word-break:keep-all]",
            compact
              ? "font-mono text-2xl font-medium leading-[1.6] tracking-[0.06em] sm:text-3xl"
              : "font-sans text-xl font-medium leading-9 sm:text-2xl sm:leading-10",
          ].join(" ")}
        >
          {chars.map((char, i) => {
            const status = statuses[i];
            const isCursor = i === cursorIndex && !isComposing;
            const display = char === " " ? " " : char;
            const cursorClass = isCursor
              ? "rounded-sm bg-amber-200/70 text-foreground dark:bg-amber-700/40"
              : colorByStatus[status];
            return (
              <span
                key={`${char}-${i}`}
                ref={i === refIndex ? cursorRef : undefined}
                className={cursorClass}
              >
                {display}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function TargetText({ target, typed, isComposing, mode = "sentence" }: TargetTextProps) {
  if (mode === "keyboard-zone") {
    return <ZoneTargetText target={target} typed={typed} />;
  }

  return (
    <StandardTargetText
      target={target}
      typed={typed}
      isComposing={isComposing}
      mode={mode}
    />
  );
}
