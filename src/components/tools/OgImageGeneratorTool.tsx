"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob } from "@/lib/browser-download";

const templates = {
  zhs: { name: "ZHS Dark", bg: "#101820", accent: "#ffcc66", text: "#ffffff", sub: "#d9e2ec" },
  clean: { name: "Clean Light", bg: "#f8fafc", accent: "#2563eb", text: "#0f172a", sub: "#475569" },
  neon: { name: "Neon", bg: "#14001f", accent: "#22d3ee", text: "#f8fafc", sub: "#c084fc" },
};

type TemplateKey = keyof typeof templates;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) current = test;
    else {
      if (current) lines.push(current);
      if (ctx.measureText(word).width > maxWidth) {
        let chunk = "";
        for (const char of word) {
          const next = chunk + char;
          if (ctx.measureText(next).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = char;
          } else chunk = next;
        }
        current = chunk;
      } else current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function makeImage(title: string, subtitle: string, badge: string, templateKey: TemplateKey): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas를 생성하지 못했습니다."));
      return;
    }
    const theme = templates[templateKey];
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(980, 120, 10, 980, 120, 520);
    gradient.addColorStop(0, `${theme.accent}cc`);
    gradient.addColorStop(1, `${theme.bg}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `${theme.accent}88`;
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    ctx.fillStyle = theme.accent;
    ctx.font = "700 28px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(badge || "ZERO HUMAN STUDIO", 86, 114);

    ctx.fillStyle = theme.text;
    ctx.font = "800 74px system-ui, -apple-system, Segoe UI, sans-serif";
    const titleLines = wrapText(ctx, title || "OG Image Generator", 960).slice(0, 3);
    let y = 235;
    for (const line of titleLines) {
      ctx.fillText(line, 86, y);
      y += 86;
    }

    ctx.fillStyle = theme.sub;
    ctx.font = "500 34px system-ui, -apple-system, Segoe UI, sans-serif";
    const subtitleLines = wrapText(ctx, subtitle || "Create a social preview image in your browser.", 900).slice(0, 2);
    y += 18;
    for (const line of subtitleLines) {
      ctx.fillText(line, 88, y);
      y += 44;
    }

    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(1048, 492, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.bg;
    ctx.font = "900 48px system-ui, sans-serif";
    ctx.fillText("Z", 1031, 510);

    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG 생성에 실패했습니다.")), "image/png");
  });
}

function blobToUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export default function OgImageGeneratorTool() {
  const { locale } = useLocale();
  const [title, setTitle] = useState(locale === "ko" ? "복잡한 작업을 빠르게 끝내는 실용 도구" : "Practical tools for faster workflows");
  const [subtitle, setSubtitle] = useState(locale === "ko" ? "브라우저에서 바로 만들고 다운로드하는 1200×630 썸네일" : "Create a 1200×630 social preview image in the browser");
  const [badge, setBadge] = useState("ZERO HUMAN STUDIO");
  const [template, setTemplate] = useState<TemplateKey>("zhs");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const revokeRef = useRef<string | null>(null);

  const t = useMemo(() => locale === "ko" ? {
    title: "제목",
    subtitle: "부제목",
    badge: "상단 배지",
    template: "템플릿",
    generate: "이미지 생성",
    download: "PNG 다운로드",
    hint: "OG/Twitter/X/카카오 공유에 자주 쓰는 1200×630 PNG를 브라우저 Canvas로 생성합니다.",
  } : {
    title: "Title",
    subtitle: "Subtitle",
    badge: "Top badge",
    template: "Template",
    generate: "Generate image",
    download: "Download PNG",
    hint: "Create a 1200×630 PNG for OpenGraph, Twitter/X, Kakao, and social previews using browser Canvas.",
  }, [locale]);

  async function generate() {
    setError(null);
    try {
      const nextBlob = await makeImage(title, subtitle, badge, template);
      if (revokeRef.current) URL.revokeObjectURL(revokeRef.current);
      const url = blobToUrl(nextBlob);
      revokeRef.current = url;
      setBlob(nextBlob);
      setPreviewUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지를 만들지 못했습니다.");
    }
  }

  return (
    <div className="space-y-5">
      <p className="rounded-lg bg-accent p-4 text-sm text-muted">{t.hint}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">{t.title}</span>
          <textarea value={title} onChange={(event) => setTitle(event.target.value)} rows={3} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{t.subtitle}</span>
          <textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} rows={3} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{t.badge}</span>
          <input value={badge} onChange={(event) => setBadge(event.target.value)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">{t.template}</span>
          <select value={template} onChange={(event) => setTemplate(event.target.value as TemplateKey)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
            {Object.entries(templates).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void generate()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.generate}</button>
        {blob && <button type="button" onClick={() => downloadBlob(blob, "og-image.png")} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">{t.download}</button>}
      </div>
      {error && <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</output>}
      {previewUrl && (
        <div className="rounded-xl border border-border p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Generated OG preview" className="w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
