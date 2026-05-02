"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";

type Mode = "counter" | "base64" | "url" | "diff" | "jwt" | "hash" | "uuid" | "regex";
const modes: Mode[] = ["counter", "base64", "url", "diff", "jwt", "hash", "uuid", "regex"];

const labels: Record<"ko" | "en", Record<Mode, string>> = {
  ko: { counter: "글자수", base64: "Base64", url: "URL 인코딩", diff: "텍스트 diff", jwt: "JWT", hash: "해시", uuid: "UUID", regex: "정규식" },
  en: { counter: "Counter", base64: "Base64", url: "URL encode", diff: "Text diff", jwt: "JWT", hash: "Hash", uuid: "UUID", regex: "Regex" },
};

const sample = `Zero Human Studio\n작은 도구를 빠르게 검증합니다.`;

function byteLength(value: string) {
  return new TextEncoder().encode(value).length;
}
function safeBase64Encode(value: string) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(value)));
}
function safeBase64Decode(value: string) {
  return new TextDecoder().decode(Uint8Array.from(atob(value.trim()), (c) => c.charCodeAt(0)));
}
function parseJwtPart(part: string) {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return JSON.stringify(JSON.parse(safeBase64Decode(padded)), null, 2);
}
async function digest(algorithm: AlgorithmIdentifier, value: string) {
  const hash = await crypto.subtle.digest(algorithm, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function diffLines(a: string, b: string) {
  const left = a.split(/\r?\n/);
  const right = b.split(/\r?\n/);
  const max = Math.max(left.length, right.length);
  const rows: { i: number; left: string; right: string; same: boolean }[] = [];
  for (let i = 0; i < max; i += 1) rows.push({ i: i + 1, left: left[i] ?? "", right: right[i] ?? "", same: (left[i] ?? "") === (right[i] ?? "") });
  return rows;
}

export default function DeveloperTextToolkit() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("counter");
  const [text, setText] = useState(sample);
  const [second, setSecond] = useState(`${sample}\n새 줄`);
  const [regex, setRegex] = useState("도구|tool");
  const [flags, setFlags] = useState("gi");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const c = locale === "ko" ? {
    intro: "Batch 1 기본 유입 도구를 한 워크스페이스에 묶었습니다. 글자수, Base64, URL 인코딩, diff, JWT, 해시, UUID, 정규식 테스트를 브라우저 로컬에서 처리합니다.",
    input: "입력", second: "비교 대상", output: "결과", runHash: "해시 생성", uuid: "UUID 생성", regex: "정규식", flags: "플래그", matches: "매칭 결과", copy: "복사", invalid: "처리할 수 없는 입력입니다.",
  } : {
    intro: "Batch 1 core traffic tools are grouped into one workspace: counters, Base64, URL encoding, diff, JWT decode, hashes, UUID, and regex testing, all browser-local.",
    input: "Input", second: "Compare with", output: "Output", runHash: "Generate hashes", uuid: "Generate UUID", regex: "Regex", flags: "Flags", matches: "Matches", copy: "Copy", invalid: "Could not process this input.",
  };

  const counter = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    return { chars: text.length, noSpaces: text.replace(/\s/g, "").length, words, lines: text ? text.split(/\r?\n/).length : 0, bytes: byteLength(text) };
  }, [text]);

  const output = useMemo(() => {
    try {
      if (mode === "base64") return `Encode:\n${safeBase64Encode(text)}\n\nDecode current input if Base64:\n${safeBase64Decode(text)}`;
      if (mode === "url") return `encodeURIComponent:\n${encodeURIComponent(text)}\n\ndecodeURIComponent if encoded:\n${decodeURIComponent(text)}`;
      if (mode === "jwt") {
        const parts = text.trim().split(".");
        if (parts.length < 2) throw new Error("JWT needs at least header.payload");
        return `Header:\n${parseJwtPart(parts[0])}\n\nPayload:\n${parseJwtPart(parts[1])}\n\nSignature present: ${parts.length >= 3 ? "yes" : "no"}`;
      }
      if (mode === "uuid") return Array.from({ length: 6 }, () => crypto.randomUUID()).join("\n");
      return "";
    } catch (err) {
      return err instanceof Error ? err.message : c.invalid;
    }
  }, [c.invalid, mode, text]);

  const regexResult = useMemo(() => {
    try {
      const r = new RegExp(regex, flags);
      return Array.from(text.matchAll(r)).map((m) => ({ text: m[0], index: m.index ?? 0 })).slice(0, 100);
    } catch {
      return null;
    }
  }, [flags, regex, text]);

  async function handleHash() {
    setError(null);
    try {
      const [sha1, sha256, sha384, sha512] = await Promise.all([
        digest("SHA-1", text), digest("SHA-256", text), digest("SHA-384", text), digest("SHA-512", text),
      ]);
      setHashes({ SHA1: sha1, SHA256: sha256, SHA384: sha384, SHA512: sha512 });
    } catch (err) {
      setError(err instanceof Error ? err.message : c.invalid);
    }
  }

  return <div className="space-y-5">
    <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted">{c.intro}</div>
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
      {modes.map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`shrink-0 rounded-full border px-3 py-2 text-sm font-medium ${mode === item ? "border-primary bg-primary text-white" : "border-border bg-background text-muted hover:text-foreground"}`}>{labels[locale][item]}</button>)}
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block"><span className="text-sm font-medium">{c.input}</span><textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="mt-2 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm outline-none focus:border-primary" /></label>
      {mode === "diff" ? <label className="block"><span className="text-sm font-medium">{c.second}</span><textarea value={second} onChange={(e) => setSecond(e.target.value)} rows={10} className="mt-2 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm outline-none focus:border-primary" /></label> : <div className="rounded-lg border border-border bg-background p-4">
        <div className="text-sm font-medium">{c.output}</div>
        {mode === "counter" && <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><Stat label="Chars" value={counter.chars} /><Stat label="No spaces" value={counter.noSpaces} /><Stat label="Words" value={counter.words} /><Stat label="Lines" value={counter.lines} /><Stat label="Bytes" value={counter.bytes} /></div>}
        {mode === "hash" && <div className="mt-3 space-y-3"><button type="button" onClick={handleHash} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{c.runHash}</button>{error && <p className="text-sm text-red-600">{error}</p>}{Object.entries(hashes).map(([k, v]) => <div key={k}><div className="text-xs font-semibold text-muted">{k}</div><code className="block break-all rounded bg-card p-2 text-xs">{v}</code></div>)}</div>}
        {mode === "regex" && <div className="mt-3 space-y-3"><div className="grid grid-cols-[1fr_96px] gap-2"><input value={regex} onChange={(e) => setRegex(e.target.value)} className="rounded border border-border bg-background px-3 py-2 font-mono text-sm" placeholder={c.regex} /><input value={flags} onChange={(e) => setFlags(e.target.value)} className="rounded border border-border bg-background px-3 py-2 font-mono text-sm" placeholder={c.flags} /></div>{regexResult === null ? <p className="text-sm text-red-600">Invalid regex</p> : <div className="space-y-1 text-sm">{regexResult.map((m, i) => <div key={`${m.index}-${i}`} className="rounded bg-card px-2 py-1"><code>{m.text}</code> @ {m.index}</div>)}{regexResult.length === 0 && <span className="text-muted">0 matches</span>}</div>}</div>}
        {!["counter", "hash", "regex"].includes(mode) && <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-card p-3 text-xs">{output}</pre>}
      </div>}
    </div>

    {mode === "diff" && <div className="overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-card text-xs text-muted"><tr><th className="p-2">#</th><th className="p-2">A</th><th className="p-2">B</th></tr></thead><tbody>{diffLines(text, second).map((row) => <tr key={row.i} className={row.same ? "" : "bg-accent"}><td className="p-2 text-xs text-muted">{row.i}</td><td className="p-2 font-mono text-xs">{row.left}</td><td className="p-2 font-mono text-xs">{row.right}</td></tr>)}</tbody></table></div>}
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg bg-card p-3"><div className="text-xs text-muted">{label}</div><div className="text-xl font-semibold">{value.toLocaleString()}</div></div>;
}
