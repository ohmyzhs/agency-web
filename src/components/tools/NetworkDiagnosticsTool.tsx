"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers";

type IpResult = { ip: string; source: string } | { error: string } | null;
type HttpResult = { url: string; status: number; statusText: string; elapsedMs: number; headers: Record<string, string> } | { error: string } | null;

export default function NetworkDiagnosticsTool() {
  const { locale } = useLocale();
  const [ipResult, setIpResult] = useState<IpResult>(null);
  const [httpUrl, setHttpUrl] = useState("https://oh-my-zhs.com");
  const [httpResult, setHttpResult] = useState<HttpResult>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const t = locale === "ko" ? {
    myip: "내 공인 IP 확인", checkIp: "IP 확인", http: "HTTP 상태/헤더 체크", checkHttp: "HTTP 확인", limitations: "브라우저에서는 ICMP ping, traceroute, OS 수준 nslookup을 직접 실행할 수 없습니다. 이 도구는 가능한 범위인 공인 IP 확인과 서버 API를 통한 HTTP HEAD 체크만 제공합니다.",
  } : {
    myip: "Public IP", checkIp: "Check IP", http: "HTTP status/header check", checkHttp: "Check HTTP", limitations: "Browsers cannot directly run ICMP ping, traceroute, or OS-level nslookup. This tool provides the feasible subset: public IP and server-side HTTP HEAD checks.",
  };

  async function checkIp() {
    setLoading("ip");
    try {
      const response = await fetch("/api/network/myip", { cache: "no-store" });
      setIpResult(await response.json());
    } catch (error) {
      setIpResult({ error: error instanceof Error ? error.message : "IP check failed" });
    } finally { setLoading(null); }
  }

  async function checkHttp() {
    setLoading("http");
    try {
      const response = await fetch("/api/network/http-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: httpUrl }) });
      setHttpResult(await response.json());
    } catch (error) {
      setHttpResult({ error: error instanceof Error ? error.message : "HTTP check failed" });
    } finally { setLoading(null); }
  }

  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-accent p-4 text-sm text-muted">{t.limitations}</p>
      <section className="rounded-xl border border-border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h3 className="text-sm font-semibold">{t.myip}</h3><button type="button" onClick={() => void checkIp()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{loading === "ip" ? "..." : t.checkIp}</button></div>
        {ipResult && <pre className="mt-3 overflow-auto rounded-lg bg-accent p-3 text-xs">{JSON.stringify(ipResult, null, 2)}</pre>}
      </section>
      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold">{t.http}</h3>
        <div className="grid gap-2 md:grid-cols-[1fr_auto]"><input value={httpUrl} onChange={(event) => setHttpUrl(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><button type="button" onClick={() => void checkHttp()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{loading === "http" ? "..." : t.checkHttp}</button></div>
        {httpResult && <pre className="max-h-[420px] overflow-auto rounded-lg bg-accent p-3 text-xs">{JSON.stringify(httpResult, null, 2)}</pre>}
      </section>
    </div>
  );
}
