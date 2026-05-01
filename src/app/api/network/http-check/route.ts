import { NextResponse } from "next/server";

function safeUrl(raw: string) {
  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http/https URLs are allowed");
  return url;
}

export async function POST(request: Request) {
  try {
    const { url: rawUrl } = await request.json();
    const url = safeUrl(String(rawUrl || ""));
    const started = Date.now();
    const response = await fetch(url, { method: "HEAD", redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(8000) });
    return NextResponse.json({
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      elapsedMs: Date.now() - started,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Check failed" }, { status: 400 });
  }
}
