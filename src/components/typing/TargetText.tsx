"use client";

import { useMemo } from "react";
import { statusFor, type CharStatus } from "@/lib/typing/metrics";

type TargetTextProps = {
  target: string;
  typed: string;
  isComposing: boolean;
};

const colorByStatus: Record<CharStatus, string> = {
  correct: "text-foreground",
  incorrect: "text-red-600 underline decoration-red-500 decoration-2 dark:text-red-400",
  pending: "text-foreground bg-yellow-200/60 dark:bg-yellow-700/40 rounded-sm",
  untyped: "text-muted",
};

export default function TargetText({ target, typed, isComposing }: TargetTextProps) {
  const statuses = useMemo(() => statusFor(target, typed, isComposing), [target, typed, isComposing]);
  const cursorIndex = Math.min(typed.length, target.length);

  return (
    <div
      className="select-none whitespace-pre-wrap break-keep rounded-lg border border-border bg-background p-5 font-mono text-xl leading-relaxed md:text-2xl md:leading-loose"
      aria-label="Target text"
    >
      {Array.from(target).map((char, i) => {
        const status = statuses[i];
        const isCursor = i === cursorIndex && !isComposing;
        return (
          <span
            key={i}
            className={`${colorByStatus[status]} ${
              isCursor ? "border-l-2 border-primary -ml-[2px] pl-[1px]" : ""
            }`}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </div>
  );
}
