"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

export default function WorkPage() {
  const { locale } = useLocale();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
        {locale === "ko" ? "// experiments" : "// experiments"}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">
        {locale === "ko" ? "실험실" : "Experiments"}
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        {locale === "ko"
          ? "아직 포트폴리오처럼 꾸밀 만큼의 실험은 공개하지 않았습니다. 쓸모가 확인된 것만 도구 목록에 올립니다."
          : "There is no dressed-up portfolio here yet. Experiments appear only when they become useful enough to ship as tools."}
      </p>
      <div className="mt-10 rounded-lg border border-border bg-card p-8">
        <h2 className="text-2xl font-bold">
          {locale === "ko" ? "지금 볼 수 있는 것" : "What is public now"}
        </h2>
        <p className="mt-3 text-muted">
          {locale === "ko"
            ? "현재 공개된 작업물은 도구 카탈로그에 모여 있습니다. 평수, 시간, 환율, JSON, LLM 비용처럼 실제로 바로 쓰는 작은 도구들입니다."
            : "The public work lives in the tools catalog: small utilities for pyeong, time, currency, JSON, LLM costs, and everyday automation."}
        </p>
        <Link
          href="/tools"
          className="mt-6 inline-block rounded bg-primary px-5 py-3 font-mono text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {locale === "ko" ? "도구 열기 →" : "Open the tools →"}
        </Link>
      </div>
    </div>
  );
}
