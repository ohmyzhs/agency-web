"use client";

import JSZip from "jszip";
import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";

const ICON_SIZES = [16, 32, 48, 180, 192, 512];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

type GeneratedIcon = {
  size: number;
  fileName: string;
  dataUrl: string;
  blob: Blob;
};

type SourceImage = {
  fileName: string;
  width: number;
  height: number;
  url: string;
};

type GenerationResult =
  | { ok: true; icons: GeneratedIcon[]; manifest: string }
  | { ok: false; error: string };

function sanitizeBaseName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const cleaned = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "zhs-icon";
}

function loadImageFromFile(file: File): Promise<SourceImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일을 선택해 주세요. PNG, JPG, SVG 파일을 권장합니다."));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("10MB 이하의 이미지를 선택해 주세요."));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ fileName: file.name, width: image.naturalWidth, height: image.naturalHeight, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러오지 못했습니다. 다른 파일로 다시 시도해 주세요."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("아이콘 이미지를 생성하지 못했습니다."));
    }, "image/png");
  });
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

async function generateIcons(
  source: SourceImage,
  baseName: string,
  background: string,
  paddingPercent: number,
  radiusPercent: number,
): Promise<GeneratedIcon[]> {
  const image = new Image();
  image.src = source.url;
  await image.decode();

  const icons: GeneratedIcon[] = [];

  for (const size of ICON_SIZES) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("브라우저가 Canvas 생성을 지원하지 않습니다.");

    const radius = size * (radiusPercent / 100);
    if (background !== "transparent") {
      ctx.save();
      roundedRectPath(ctx, 0, 0, size, size, radius);
      ctx.fillStyle = background;
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    roundedRectPath(ctx, 0, 0, size, size, radius);
    ctx.clip();

    const padding = size * (paddingPercent / 100);
    const available = Math.max(1, size - padding * 2);
    const ratio = Math.min(available / source.width, available / source.height);
    const drawWidth = source.width * ratio;
    const drawHeight = source.height * ratio;
    const x = (size - drawWidth) / 2;
    const y = (size - drawHeight) / 2;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
    ctx.restore();

    const blob = await canvasToBlob(canvas);
    icons.push({
      size,
      fileName: `${baseName}-${size}x${size}.png`,
      dataUrl: canvas.toDataURL("image/png"),
      blob,
    });
  }

  return icons;
}

function buildManifest(baseName: string) {
  const icons = ICON_SIZES.filter((size) => size >= 180).map((size) => ({
    src: `/icons/${baseName}-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png",
    purpose: size >= 192 ? "any maskable" : "any",
  }));

  return JSON.stringify(
    {
      name: "Your app name",
      short_name: "App",
      icons,
      theme_color: "#181514",
      background_color: "#f3efe7",
      display: "standalone",
    },
    null,
    2,
  );
}

async function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function IconFaviconGenerator() {
  const { locale } = useLocale();
  const [source, setSource] = useState<SourceImage | null>(null);
  const [baseName, setBaseName] = useState("zhs-icon");
  const [background, setBackground] = useState("transparent");
  const [customBackground, setCustomBackground] = useState("#f3efe7");
  const [padding, setPadding] = useState(12);
  const [radius, setRadius] = useState(18);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = locale === "ko"
    ? {
        upload: "이미지 업로드",
        uploadHint: "PNG, JPG, SVG 권장 · 10MB 이하 · 파일은 브라우저 안에서만 처리됩니다.",
        choose: "파일 선택",
        name: "파일 이름 접두어",
        bg: "배경",
        transparent: "투명",
        custom: "색상 사용",
        padding: "패딩",
        radius: "둥근 모서리",
        generate: "아이콘 세트 생성",
        generating: "생성 중...",
        downloadZip: "PNG 세트 + manifest ZIP 다운로드",
        downloadOne: "다운로드",
        manifest: "manifest.json",
        copyManifest: "manifest 복사",
        source: "원본",
        preview: "생성된 아이콘",
        empty: "원본 이미지를 선택하면 favicon, Apple touch icon, PWA 아이콘 크기로 자동 생성합니다.",
        copied: "복사되었습니다.",
      }
    : {
        upload: "Upload image",
        uploadHint: "PNG, JPG, or SVG recommended · up to 10MB · processed locally in your browser.",
        choose: "Choose file",
        name: "File name prefix",
        bg: "Background",
        transparent: "Transparent",
        custom: "Use color",
        padding: "Padding",
        radius: "Corner radius",
        generate: "Generate icon set",
        generating: "Generating...",
        downloadZip: "Download PNG set + manifest ZIP",
        downloadOne: "Download",
        manifest: "manifest.json",
        copyManifest: "Copy manifest",
        source: "Source",
        preview: "Generated icons",
        empty: "Choose a source image to generate favicon, Apple touch icon, and PWA icon sizes.",
        copied: "Copied.",
      };

  const effectiveBackground = background === "transparent" ? "transparent" : customBackground;
  const canGenerate = Boolean(source) && baseName.trim().length > 0;

  const manifestHtml = useMemo(() => {
    const safeName = sanitizeBaseName(baseName);
    return [
      `<link rel="icon" type="image/png" sizes="32x32" href="/icons/${safeName}-32x32.png">`,
      `<link rel="apple-touch-icon" sizes="180x180" href="/icons/${safeName}-180x180.png">`,
      `<link rel="manifest" href="/manifest.json">`,
    ].join("\n");
  }, [baseName]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      if (source) URL.revokeObjectURL(source.url);
      const loaded = await loadImageFromFile(file);
      setSource(loaded);
      setBaseName(sanitizeBaseName(file.name));
      setResult(null);
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "이미지를 불러오지 못했습니다." });
    }
  }

  async function handleGenerate() {
    if (!source) return;
    setIsGenerating(true);
    try {
      const safeName = sanitizeBaseName(baseName);
      const icons = await generateIcons(source, safeName, effectiveBackground, padding, radius);
      setResult({ ok: true, icons, manifest: buildManifest(safeName) });
      setBaseName(safeName);
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "아이콘 생성에 실패했습니다." });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleZipDownload() {
    if (!result?.ok) return;
    const zip = new JSZip();
    const iconsFolder = zip.folder("icons");
    for (const icon of result.icons) {
      iconsFolder?.file(icon.fileName, icon.blob);
    }
    zip.file("manifest.json", result.manifest);
    zip.file("head-tags.html", manifestHtml);
    const blob = await zip.generateAsync({ type: "blob" });
    await downloadBlob(blob, `${sanitizeBaseName(baseName)}-favicon-set.zip`);
  }

  async function handleManifestCopy() {
    if (!result?.ok) return;
    await navigator.clipboard.writeText(`${result.manifest}\n\n${manifestHtml}`);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="sr-only"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.upload}</p>
        <p className="mt-2 text-sm text-muted">{t.uploadHint}</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t.choose}
        </button>
      </div>

      {source ? (
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.source}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={source.url} alt="Source icon preview" className="mt-3 aspect-square w-full rounded-lg border border-border object-contain p-3" />
            <p className="mt-2 text-xs text-muted">{source.fileName}</p>
            <p className="text-xs text-muted">{source.width} × {source.height}px</p>
          </div>

          <div className="space-y-4 rounded-xl border border-border p-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.name}</span>
              <input value={baseName} onChange={(event) => setBaseName(event.target.value)} className={inputClass} />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium">{t.bg}</span>
                <select value={background} onChange={(event) => setBackground(event.target.value)} className={inputClass}>
                  <option value="transparent">{t.transparent}</option>
                  <option value="custom">{t.custom}</option>
                </select>
              </label>
              {background === "custom" && (
                <label className="block space-y-1">
                  <span className="text-sm font-medium">{t.custom}</span>
                  <div className="flex gap-2">
                    <input type="color" value={customBackground} onChange={(event) => setCustomBackground(event.target.value)} className="h-10 w-12 rounded-lg border border-border" />
                    <input value={customBackground} onChange={(event) => setCustomBackground(event.target.value)} className={inputClass} />
                  </div>
                </label>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-sm font-medium">{t.padding}: {padding}%</span>
                <input type="range" min="0" max="30" value={padding} onChange={(event) => setPadding(Number(event.target.value))} className="w-full" />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">{t.radius}: {radius}%</span>
                <input type="range" min="0" max="50" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="w-full" />
              </label>
            </div>

            <button
              type="button"
              disabled={!canGenerate || isGenerating}
              onClick={() => void handleGenerate()}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? t.generating : t.generate}
            </button>
          </div>
        </div>
      ) : (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">{t.empty}</output>
      )}

      {result?.ok === false && (
        <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {result.error}
        </output>
      )}

      {result?.ok && (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-xl bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">{t.preview}</p>
              <p className="text-xs text-muted">favicon, Apple touch icon, PWA manifest 크기 세트를 생성했습니다.</p>
            </div>
            <button type="button" onClick={() => void handleZipDownload()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              {t.downloadZip}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {result.icons.map((icon) => (
              <div key={icon.size} className="rounded-lg border border-border p-3 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={icon.dataUrl} alt={`${icon.size} icon preview`} className="mx-auto h-16 w-16 rounded-md object-contain" />
                <p className="mt-2 text-xs font-medium">{icon.size}×{icon.size}</p>
                <button type="button" onClick={() => void downloadBlob(icon.blob, icon.fileName)} className="mt-2 text-xs font-semibold text-primary hover:underline">
                  {t.downloadOne}
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{t.manifest}</p>
              <button type="button" onClick={() => void handleManifestCopy()} className="text-xs font-semibold text-primary hover:underline" title={t.copied}>
                {t.copyManifest}
              </button>
            </div>
            <pre className="mt-3 max-h-72 overflow-auto rounded-lg bg-background p-3 text-xs leading-relaxed text-muted">{result.manifest}</pre>
            <pre className="mt-3 overflow-auto rounded-lg bg-background p-3 text-xs leading-relaxed text-muted">{manifestHtml}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
