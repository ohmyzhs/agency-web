"use client";

import { useMemo } from "react";
import type { PerKeyStat, ProblemKey } from "@/lib/typing/types";

type ProblemKeysProps = {
  stats: Record<string, PerKeyStat>;
  language: "ko" | "en";
};

function computeProblems(stats: Record<string, PerKeyStat>): ProblemKey[] {
  return Object.values(stats)
    .filter((s) => s.attempts >= 5)
    .map((s) => ({ ...s, accuracy: s.correct / s.attempts }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 6);
}

export default function ProblemKeys({ stats, language }: ProblemKeysProps) {
  const problems = useMemo(() => computeProblems(stats), [stats]);

  if (problems.length === 0) {
    return (
      <div className="rounded-lg border border-border p-4 text-sm text-muted">
        {language === "ko"
          ? "약점 키 데이터를 모으는 중입니다. 짧은 세션을 몇 번 더 마치면 자동으로 표시됩니다."
          : "Collecting weak-key data. Finish a few short sessions and your problem keys will appear here."}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {language === "ko" ? "약점 키 (정확도 낮은 순)" : "Problem keys (lowest accuracy first)"}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {problems.map((p) => (
          <div
            key={p.key}
            className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
          >
            <span className="font-mono text-base">{p.key === " " ? "␣" : p.key}</span>
            <span className="text-xs text-muted">
              {(p.accuracy * 100).toFixed(0)}% · {p.attempts}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        {language === "ko"
          ? "최근 세션의 자모/키 통계를 기반으로 계산합니다. 데이터는 브라우저에만 저장됩니다."
          : "Computed from your recent jamo/key stats. Stored only in your browser."}
      </p>
    </div>
  );
}
