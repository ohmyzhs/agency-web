"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-512";

type ParsedSecret = {
  secret: string;
  issuer: string;
  account: string;
};

type TotpResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function parseSecretInput(raw: string): ParsedSecret {
  const trimmed = raw.trim();
  if (!trimmed) return { secret: "", issuer: "", account: "" };

  if (trimmed.toLowerCase().startsWith("otpauth://")) {
    try {
      const url = new URL(trimmed);
      const secret = url.searchParams.get("secret") ?? "";
      const issuerFromQuery = url.searchParams.get("issuer") ?? "";
      const label = decodeURIComponent(url.pathname.replace(/^\//, ""));
      const [issuerFromLabel, ...accountParts] = label.split(":");
      const account = accountParts.length > 0 ? accountParts.join(":") : issuerFromLabel;
      const issuer = issuerFromQuery || (accountParts.length > 0 ? issuerFromLabel : "");
      return { secret, issuer, account };
    } catch {
      return { secret: trimmed, issuer: "", account: "" };
    }
  }

  return { secret: trimmed, issuer: "", account: "" };
}

function normalizeBase32(secret: string): string {
  return secret.toUpperCase().replace(/\s+/g, "").replace(/-/g, "").replace(/=+$/g, "");
}

function decodeBase32(secret: string): Uint8Array {
  const normalized = normalizeBase32(secret);
  if (!normalized) throw new Error("Secret is empty.");

  let bits = "";
  const bytes: number[] = [];
  for (const char of normalized) {
    const value = base32Alphabet.indexOf(char);
    if (value === -1) {
      throw new Error(`Invalid Base32 character: ${char}`);
    }
    bits += value.toString(2).padStart(5, "0");
    while (bits.length >= 8) {
      bytes.push(Number.parseInt(bits.slice(0, 8), 2));
      bits = bits.slice(8);
    }
  }

  if (bytes.length === 0) throw new Error("Secret is too short to decode.");
  return new Uint8Array(bytes);
}

function counterToBytes(counter: number): Uint8Array {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;
  view.setUint32(0, high, false);
  view.setUint32(4, low, false);
  return new Uint8Array(buffer);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function generateTotp(secret: string, now: number, period: number, digits: number, algorithm: Algorithm): Promise<TotpResult> {
  try {
    if (!globalThis.crypto?.subtle) {
      return { ok: false, error: "Web Crypto API is not available in this browser." };
    }
    const keyBytes = decodeBase32(secret);
    const counter = Math.floor(now / 1000 / period);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      toArrayBuffer(keyBytes),
      { name: "HMAC", hash: algorithm },
      false,
      ["sign"],
    );
    const counterBytes = counterToBytes(counter);
    const signature = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, toArrayBuffer(counterBytes)));
    const offset = signature[signature.length - 1] & 0x0f;
    const binary =
      ((signature[offset] & 0x7f) << 24) |
      ((signature[offset + 1] & 0xff) << 16) |
      ((signature[offset + 2] & 0xff) << 8) |
      (signature[offset + 3] & 0xff);
    const modulo = 10 ** digits;
    const code = String(binary % modulo).padStart(digits, "0");
    return { ok: true, code };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not generate the verification code." };
  }
}

function secondsRemaining(now: number, period: number): number {
  return period - (Math.floor(now / 1000) % period);
}

export default function TwoFactorCodeGenerator() {
  const { locale } = useLocale();
  const isKo = locale === "ko";
  const [input, setInput] = useState("JBSWY3DPEHPK3PXP");
  const [period, setPeriod] = useState(30);
  const [digits, setDigits] = useState(6);
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-1");
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<TotpResult>({ ok: false, error: "" });
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseSecretInput(input), [input]);
  const normalizedSecret = useMemo(() => normalizeBase32(parsed.secret), [parsed.secret]);
  const remain = secondsRemaining(now, period);
  const progress = ((period - remain) / period) * 100;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!normalizedSecret) return;
    generateTotp(normalizedSecret, now, period, digits, algorithm).then((next) => {
      if (!cancelled) setResult(next);
    });
    return () => {
      cancelled = true;
    };
  }, [normalizedSecret, now, period, digits, algorithm]);

  const displayResult: TotpResult = normalizedSecret
    ? result
    : { ok: false, error: isKo ? "2FA 시크릿을 입력하세요." : "Enter a 2FA secret." };

  async function copyCode() {
    if (!displayResult.ok) return;
    await navigator.clipboard.writeText(displayResult.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-300/40 bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
        <strong>{isKo ? "보안 안내" : "Security note"}</strong>
        <p className="mt-1 leading-relaxed">
          {isKo
            ? "코드는 브라우저에서 생성되지만 2FA 시크릿은 계정 접근에 필요한 민감정보입니다. 공용 기기나 화면 공유 중에는 실제 시크릿을 붙여넣지 마세요."
            : "Codes are generated in your browser, but a 2FA secret is sensitive account-access material. Do not paste real secrets on shared devices or during screen sharing."}
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium">{isKo ? "2FA 시크릿 또는 otpauth URL" : "2FA secret or otpauth URL"}</span>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={4}
          spellCheck={false}
          className="mt-2 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          placeholder="JBSWY3DPEHPK3PXP"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium">{isKo ? "주기" : "Period"}</span>
          <select value={period} onChange={(event) => setPeriod(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2">
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">{isKo ? "자리수" : "Digits"}</span>
          <select value={digits} onChange={(event) => setDigits(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2">
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Algorithm</span>
          <select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as Algorithm)} className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2">
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </label>
      </div>

      {(parsed.issuer || parsed.account) && (
        <div className="rounded-lg border border-border bg-background p-3 text-sm text-muted">
          {parsed.issuer && <p><strong>Issuer:</strong> {parsed.issuer}</p>}
          {parsed.account && <p><strong>Account:</strong> {parsed.account}</p>}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-background p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{isKo ? "현재 verification code" : "Current verification code"}</p>
        {displayResult.ok ? (
          <>
            <div className="mt-3 font-mono text-5xl font-black tracking-[0.16em] text-foreground md:text-6xl">{displayResult.code}</div>
            <button
              type="button"
              onClick={copyCode}
              className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              {copied ? (isKo ? "복사됨" : "Copied") : (isKo ? "코드 복사" : "Copy code")}
            </button>
          </>
        ) : (
          <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">{displayResult.error}</p>
        )}
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted">
          {isKo ? `다음 코드까지 ${remain}초` : `${remain}s until the next code`}
        </p>
      </div>

      <div className="rounded-lg border border-border p-4 text-sm text-muted">
        <p className="font-medium text-foreground">{isKo ? "지원 형식" : "Supported input"}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Base32 secret: <code className="font-mono">JBSWY3DPEHPK3PXP</code></li>
          <li>otpauth URL: <code className="font-mono">otpauth://totp/Issuer:account?secret=...</code></li>
          <li>{isKo ? "일반적인 앱 기본값: 6자리, SHA-1, 30초" : "Common authenticator defaults: 6 digits, SHA-1, 30 seconds"}</li>
        </ul>
      </div>
    </div>
  );
}
