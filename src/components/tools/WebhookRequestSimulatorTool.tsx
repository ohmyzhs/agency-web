"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers";

type Header = { id: string; key: string; value: string };
type Result = { ok: true; status: number; statusText: string; timeMs: number; headers: [string, string][]; body: string } | { ok: false; error: string } | null;

export default function WebhookRequestSimulatorTool() {
  const { locale } = useLocale();
  const [url, setUrl] = useState("https://httpbin.org/post");
  const [method, setMethod] = useState("POST");
  const [headers, setHeaders] = useState<Header[]>([{ id: crypto.randomUUID(), key: "Content-Type", value: "application/json" }]);
  const [body, setBody] = useState('{\n  "event": "test",\n  "source": "oh-my-zhs"\n}');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const t = locale === "ko" ? {
    title: "요청 설정", url: "URL", method: "Method", headers: "Headers", body: "Body", send: "요청 보내기", sending: "전송 중...", add: "헤더 추가", note: "브라우저 fetch로 요청합니다. CORS가 허용되지 않은 대상은 실패할 수 있으며, 비밀 토큰은 공개 브라우저 환경에서 사용하지 마세요."
  } : {
    title: "Request", url: "URL", method: "Method", headers: "Headers", body: "Body", send: "Send request", sending: "Sending...", add: "Add header", note: "Requests use browser fetch. Targets that do not allow CORS may fail; do not paste secret tokens into a public browser tool."
  };

  function updateHeader(id: string, patch: Partial<Header>) {
    setHeaders((current) => current.map((header) => header.id === id ? { ...header, ...patch } : header));
  }

  async function send() {
    setIsSending(true);
    setResult(null);
    try {
      const headerObject = Object.fromEntries(headers.filter((h) => h.key.trim()).map((h) => [h.key.trim(), h.value]));
      const started = performance.now();
      const response = await fetch(url, {
        method,
        headers: headerObject,
        body: ["GET", "HEAD"].includes(method) ? undefined : body,
      });
      const text = await response.text();
      setResult({ ok: true, status: response.status, statusText: response.statusText, timeMs: Math.round(performance.now() - started), headers: [...response.headers.entries()], body: text.slice(0, 12000) });
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "요청에 실패했습니다. CORS 또는 네트워크 정책을 확인하세요." });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-accent p-4 text-sm text-muted">{t.note}</p>
      <div className="space-y-4 rounded-xl border border-border p-4">
        <p className="text-sm font-semibold">{t.title}</p>
        <div className="grid gap-3 md:grid-cols-[140px_1fr]">
          <label className="space-y-1"><span className="text-sm font-medium">{t.method}</span><select value={method} onChange={(event) => setMethod(event.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option><option>HEAD</option></select></label>
          <label className="space-y-1"><span className="text-sm font-medium">{t.url}</span><input value={url} onChange={(event) => setUrl(event.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" /></label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between"><span className="text-sm font-medium">{t.headers}</span><button type="button" onClick={() => setHeaders((current) => [...current, { id: crypto.randomUUID(), key: "", value: "" }])} className="text-xs font-semibold text-primary hover:underline">{t.add}</button></div>
          {headers.map((header) => <div key={header.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]"><input value={header.key} onChange={(event) => updateHeader(header.id, { key: event.target.value })} placeholder="Header" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><input value={header.value} onChange={(event) => updateHeader(header.id, { value: event.target.value })} placeholder="Value" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" /><button type="button" onClick={() => setHeaders((current) => current.filter((h) => h.id !== header.id))} className="rounded-lg border border-border px-3 py-2 text-sm">×</button></div>)}
        </div>
        {!(["GET", "HEAD"].includes(method)) && <label className="space-y-1"><span className="text-sm font-medium">{t.body}</span><textarea value={body} onChange={(event) => setBody(event.target.value)} rows={8} className="block w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm" /></label>}
        <button type="button" disabled={isSending} onClick={() => void send()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{isSending ? t.sending : t.send}</button>
      </div>
      {result?.ok === false && <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</output>}
      {result?.ok && <div className="space-y-3 rounded-xl border border-border p-4"><p className="text-sm font-semibold">HTTP {result.status} {result.statusText} · {result.timeMs}ms</p><details open><summary className="cursor-pointer text-sm font-medium">Headers</summary><pre className="mt-2 overflow-auto rounded-lg bg-accent p-3 text-xs">{result.headers.map(([k, v]) => `${k}: ${v}`).join("\n")}</pre></details><details open><summary className="cursor-pointer text-sm font-medium">Body</summary><pre className="mt-2 max-h-[420px] overflow-auto rounded-lg bg-accent p-3 text-xs">{result.body}</pre></details></div>}
    </div>
  );
}
