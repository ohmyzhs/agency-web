"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const DEFAULT_WIDTH = 96;

const palettes = {
  classic: "@%#*+=-:. ",
  dense: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
  blocks: "█▓▒░ ",
  minimal: "#*+=-. ",
} as const;

type PaletteKey = keyof typeof palettes;

type SourceImage = {
  fileName: string;
  fileSize: number;
  url: string;
  width: number;
  height: number;
};

type AsciiResult = {
  text: string;
  width: number;
  height: number;
  sourceName: string;
};

const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary";
const buttonClass = "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass = "rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary";

function fileSizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function sanitizeBaseName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "ascii-image";
}

function downloadText(text: string, fileName: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function loadImageFromFile(file: File): Promise<SourceImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 업로드할 수 있습니다."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("12MB 이하 이미지만 처리할 수 있습니다."));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({
        fileName: file.name,
        fileSize: file.size,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러오지 못했습니다."));
    };
    image.src = url;
  });
}

async function renderAscii({
  source,
  width,
  palette,
  invert,
  contrast,
}: {
  source: SourceImage;
  width: number;
  palette: PaletteKey;
  invert: boolean;
  contrast: number;
}): Promise<AsciiResult> {
  const image = new Image();
  image.src = source.url;
  await image.decode();

  const safeWidth = Math.min(220, Math.max(24, Math.round(width)));
  const charAspect = 0.48;
  const targetHeight = Math.max(1, Math.round((source.height / source.width) * safeWidth * charAspect));

  const canvas = document.createElement("canvas");
  canvas.width = safeWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("브라우저가 Canvas 처리를 지원하지 않습니다.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, safeWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, safeWidth, targetHeight);

  const imageData = ctx.getImageData(0, 0, safeWidth, targetHeight).data;
  const chars = palettes[palette];
  const gamma = Math.min(2.4, Math.max(0.4, contrast));
  const lines: string[] = [];

  for (let y = 0; y < targetHeight; y += 1) {
    let line = "";
    for (let x = 0; x < safeWidth; x += 1) {
      const index = (y * safeWidth + x) * 4;
      const alpha = imageData[index + 3] / 255;
      const r = imageData[index] * alpha + 255 * (1 - alpha);
      const g = imageData[index + 1] * alpha + 255 * (1 - alpha);
      const b = imageData[index + 2] * alpha + 255 * (1 - alpha);
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const adjusted = Math.pow(luminance, gamma);
      const brightness = invert ? 1 - adjusted : adjusted;
      const charIndex = Math.min(chars.length - 1, Math.max(0, Math.round(brightness * (chars.length - 1))));
      line += chars[charIndex];
    }
    lines.push(line.replace(/\s+$/g, ""));
  }

  return {
    text: lines.join("\n"),
    width: safeWidth,
    height: targetHeight,
    sourceName: source.fileName,
  };
}

export default function ImageToAsciiArtTool() {
  const { locale } = useLocale();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previousUrlRef = useRef<string | null>(null);
  const [source, setSource] = useState<SourceImage | null>(null);
  const [width, setWidth] = useState(String(DEFAULT_WIDTH));
  const [palette, setPalette] = useState<PaletteKey>("classic");
  const [invert, setInvert] = useState(false);
  const [contrast, setContrast] = useState("1");
  const [result, setResult] = useState<AsciiResult | null>(null);
  const [error, setError] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = locale === "ko"
    ? {
        title: "이미지 → ASCII 아트",
        lead: "사진이나 로고를 글자만으로 구성된 ASCII 텍스트로 변환합니다. 결과는 복사하거나 .txt로 다운로드할 수 있습니다.",
        upload: "이미지 업로드",
        uploadHint: "PNG, JPG, WebP, GIF, SVG 등 브라우저가 읽을 수 있는 이미지 · 12MB 이하 · 서버 업로드 없음",
        choose: "파일 선택",
        selected: "선택된 이미지",
        outputWidth: "출력 너비(문자 수)",
        charset: "문자 팔레트",
        contrast: "명암 보정",
        invert: "밝기 반전",
        generate: "ASCII 생성",
        generating: "생성 중...",
        result: "ASCII 결과",
        copy: "복사",
        copied: "복사됨",
        download: "TXT 다운로드",
        clear: "초기화",
        empty: "이미지를 선택하고 너비·문자 팔레트를 조정하면 여기에 ASCII 결과가 표시됩니다.",
        local: "이미지는 브라우저 Canvas에서만 읽습니다. 사진은 서버로 업로드되지 않습니다.",
        scan: "작은 폭은 메신저에 붙여넣기 좋고, 큰 폭은 파일/문서에서 더 세밀하게 보입니다.",
        dimensions: "원본 크기",
        outputSize: "출력 크기",
        paletteLabels: {
          classic: "클래식 (@%#)",
          dense: "고밀도 긴 팔레트",
          blocks: "블록 문자",
          minimal: "미니멀",
        },
      }
    : {
        title: "Image to ASCII Art",
        lead: "Convert a photo or logo into plain-text ASCII art. Copy the result or download it as a .txt file.",
        upload: "Upload image",
        uploadHint: "PNG, JPG, WebP, GIF, SVG, or another browser-readable image · 12MB max · no server upload",
        choose: "Choose file",
        selected: "Selected image",
        outputWidth: "Output width (characters)",
        charset: "Character palette",
        contrast: "Tone adjustment",
        invert: "Invert brightness",
        generate: "Generate ASCII",
        generating: "Generating...",
        result: "ASCII result",
        copy: "Copy",
        copied: "Copied",
        download: "Download TXT",
        clear: "Clear",
        empty: "Choose an image and adjust width or palette to generate ASCII text here.",
        local: "The image is read only through browser Canvas. Photos are not uploaded to a server.",
        scan: "Narrow widths paste well into messengers; wider outputs keep more detail for documents and files.",
        dimensions: "Original size",
        outputSize: "Output size",
        paletteLabels: {
          classic: "Classic (@%#)",
          dense: "Dense long palette",
          blocks: "Block characters",
          minimal: "Minimal",
        },
      };

  const parsedWidth = useMemo(() => {
    const value = Number(width);
    if (!Number.isFinite(value)) return DEFAULT_WIDTH;
    return Math.min(220, Math.max(24, Math.round(value)));
  }, [width]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setResult(null);
    setCopied(false);
    try {
      const loaded = await loadImageFromFile(file);
      if (previousUrlRef.current) URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = loaded.url;
      setSource(loaded);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "이미지를 불러오지 못했습니다.");
    }
  }

  async function handleGenerate() {
    if (!source) return;
    setIsRendering(true);
    setError("");
    setCopied(false);
    try {
      const generated = await renderAscii({
        source,
        width: parsedWidth,
        palette,
        invert,
        contrast: Number(contrast),
      });
      setResult(generated);
    } catch (renderError) {
      setError(renderError instanceof Error ? renderError.message : "ASCII 생성에 실패했습니다.");
    } finally {
      setIsRendering(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
  }

  function handleClear() {
    if (previousUrlRef.current) URL.revokeObjectURL(previousUrlRef.current);
    previousUrlRef.current = null;
    setSource(null);
    setResult(null);
    setError("");
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold">{t.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t.lead}</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section className="space-y-4 rounded-xl border border-border bg-background p-4">
          <div>
            <h3 className="font-semibold">{t.upload}</h3>
            <p className="mt-1 text-sm text-muted">{t.uploadHint}</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <button type="button" className={secondaryButtonClass} onClick={() => fileInputRef.current?.click()}>
            {t.choose}
          </button>

          {source && (
            <div className="rounded-xl border border-line-soft bg-card p-3 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element -- Blob/object URLs from local uploads cannot be optimized by next/image. */}
              <img src={source.url} alt="" className="max-h-56 w-full rounded-lg object-contain" />
              <div className="mt-3 space-y-1 text-muted">
                <p className="font-medium text-foreground">{t.selected}: {source.fileName}</p>
                <p>{fileSizeLabel(source.fileSize)}</p>
                <p>{t.dimensions}: {source.width}×{source.height}px</p>
              </div>
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium">{t.outputWidth}</span>
            <input
              type="number"
              min={24}
              max={220}
              value={width}
              onChange={(event) => setWidth(event.target.value)}
              className={`${inputClass} mt-1`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">{t.charset}</span>
            <select value={palette} onChange={(event) => setPalette(event.target.value as PaletteKey)} className={`${inputClass} mt-1`}>
              {(Object.keys(palettes) as PaletteKey[]).map((key) => (
                <option key={key} value={key}>{t.paletteLabels[key]}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium">{t.contrast}: {Number(contrast).toFixed(1)}</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={contrast}
              onChange={(event) => setContrast(event.target.value)}
              className="mt-2 w-full accent-primary"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={invert} onChange={(event) => setInvert(event.target.checked)} className="h-4 w-4 accent-primary" />
            {t.invert}
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass} disabled={!source || isRendering} onClick={handleGenerate}>
              {isRendering ? t.generating : t.generate}
            </button>
            <button type="button" className={secondaryButtonClass} onClick={handleClear}>
              {t.clear}
            </button>
          </div>

          <div className="rounded-lg bg-accent p-3 text-sm leading-relaxed text-muted">
            <p>{t.local}</p>
            <p className="mt-1">{t.scan}</p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{t.result}</h3>
              {result && <p className="mt-1 text-sm text-muted">{t.outputSize}: {result.width}×{result.height} chars</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={secondaryButtonClass} disabled={!result} onClick={handleCopy}>
                {copied ? t.copied : t.copy}
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                disabled={!result}
                onClick={() => result && downloadText(result.text, `${sanitizeBaseName(result.sourceName)}-ascii.txt`)}
              >
                {t.download}
              </button>
            </div>
          </div>

          {result ? (
            <pre className="mt-4 max-h-[620px] overflow-auto rounded-xl border border-line-soft bg-[#0f1115] p-4 font-mono text-[8px] leading-[0.72rem] text-[#f2f2f2] sm:text-[9px] sm:leading-[0.78rem]">
              {result.text}
            </pre>
          ) : (
            <div className="mt-4 flex min-h-72 items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
              {t.empty}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
