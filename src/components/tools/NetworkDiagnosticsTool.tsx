"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers";

type IpResult = { ip: string; source?: string } | { error: string } | null;

export default function NetworkDiagnosticsTool() {
  const { locale } = useLocale();
  const [ipResult, setIpResult] = useState<IpResult>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t =
    locale === "ko"
      ? {
          title: "내 IP 확인",
          description: "현재 접속 환경의 공인 IP 주소를 확인합니다.",
          check: "내 IP 확인",
          loading: "확인 중...",
          label: "공인 IP",
          source: "확인 소스",
          failed: "IP 확인에 실패했습니다.",
        }
      : {
          title: "Check My IP",
          description: "Check the public IP address for your current connection.",
          check: "Check my IP",
          loading: "Checking...",
          label: "Public IP",
          source: "Source",
          failed: "Failed to check IP.",
        };

  async function checkIp() {
    setIsLoading(true);
    setIpResult(null);
    try {
      const response = await fetch("/api/network/myip", { cache: "no-store" });
      const data = await response.json();
      setIpResult(response.ok ? data : { error: data.error || t.failed });
    } catch (error) {
      setIpResult({ error: error instanceof Error ? error.message : t.failed });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-border p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted">{t.description}</p>
          </div>
          <button
            type="button"
            onClick={() => void checkIp()}
            disabled={isLoading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? t.loading : t.check}
          </button>
        </div>

        {ipResult && "error" in ipResult && (
          <output className="mt-4 block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {ipResult.error}
          </output>
        )}

        {ipResult && "ip" in ipResult && (
          <output className="mt-4 block rounded-lg bg-accent p-4">
            <span className="block text-xs font-medium uppercase tracking-wider text-muted">{t.label}</span>
            <span className="mt-1 block break-all font-mono text-2xl font-semibold">{ipResult.ip}</span>
            {ipResult.source && <span className="mt-2 block break-all text-xs text-muted">{t.source}: {ipResult.source}</span>}
          </output>
        )}
      </section>
    </div>
  );
}
