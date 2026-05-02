"use client";

import { useMemo } from "react";
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
  pending: "text-foreground bg-amber-200/80 dark:bg-amber-700/50 rounded-sm shadow-[0_0_0_3px_rgba(251,191,36,0.16)]",
  untyped: "text-foreground/85",
};

const COMPACT_MODES = new Set<TypingMode>(["keyboard-zone", "word", "speed-test"]);

export default function TargetText({ target, typed, isComposing, mode = "sentence" }: TargetTextProps) {
  const statuses = useMemo(() => statusFor(target, typed, isComposing), [target, typed, isComposing]);
  const chars = useMemo(() => Array.from(target), [target]);
  const cursorIndex = Math.min(Array.from(typed).length, chars.length);
  const progress = target.length > 0 ? Math.min(100, Math.round((cursorIndex / chars.length) * 100)) : 0;
  const compact = COMPACT_MODES.has(mode);

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
        className={[
          "max-h-[34vh] min-h-[132px] overflow-y-auto overscroll-contain px-4 py-5 sm:px-6",
          "break-words [overflow-wrap:anywhere] [word-break:keep-all]",
          compact
            ? "font-mono text-2xl leading-relaxed tracking-[0.08em] sm:text-3xl"
            : "font-sans text-xl leading-9 sm:text-2xl sm:leading-10",
        ].join(" ")}
      >
        {chars.map((char, i) => {
          const status = statuses[i];
          const isCursor = i === cursorIndex && !isComposing;
          const display = char === " " ? "\u00a0" : char;
          return (
            <span
              key={`${char}-${i}`}
              className={`${colorByStatus[status]} ${
                isCursor ? "border-l-2 border-primary -ml-[2px] pl-[1px] animate-pulse" : ""
              }`}
            >
              {display}
            </span>
          );
        })}
      </div>
    </section>
  );
}
