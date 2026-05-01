"use client";

import JSZip from "jszip";
import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 20;
const outputFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"] as const;

type OutputFormat = (typeof outputFormats)[number];

type SourceImage = {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
};

type ConvertedImage = {
  id: string;
  sourceName: string;
  fileName: string;
  width: number;
  height: number;
  blob: Blob;
  dataUrl: string;
};

type ConvertResult =
  | { ok: true; images: ConvertedImage[] }
  | { ok: false; error: string };

const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function extensionFor(format: OutputFormat) {
  if (format === "image/png") return "png";
  if (format === "image/jpeg") return "jpg";
  if (format === "image/webp") return "webp";
  return "avif";
}

function labelFor(format: OutputFormat) {
  if (format === "image/png") return "PNG";
  if (format === "image/jpeg") return "JPG";
  if (format === "image/webp") return "WebP";
  return "AVIF";
}

function sanitizeBaseName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "converted-image";
}

function fileSizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function loadImage(file: File): Promise<SourceImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error(`${file.name}: 이미지 파일이 아닙니다.`));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`${file.name}: 20MB 이하 이미지만 처리할 수 있습니다.`));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      resolve({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        url,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name}: 이미지를 불러오지 못했습니다.`));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`${labelFor(format)} 출력을 지원하지 않거나 변환에 실패했습니다.`));
      },
      format,
      format === "image/png" ? undefined : quality,
    );
  });
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("미리보기 생성에 실패했습니다."));
    reader.readAsDataURL(blob);
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function convertImage(
  source: SourceImage,
  format: OutputFormat,
  quality: number,
  maxWidth: number,
  maxHeight: number,
  backgroundColor: string,
): Promise<ConvertedImage> {
  const image = new Image();
  image.src = source.url;
  await image.decode();

  const widthLimit = maxWidth > 0 ? maxWidth : source.width;
  const heightLimit = maxHeight > 0 ? maxHeight : source.height;
  const ratio = Math.min(1, widthLimit / source.width, heightLimit / source.height);
  const targetWidth = Math.max(1, Math.round(source.width * ratio));
  const targetHeight = Math.max(1, Math.round(source.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("브라우저가 Canvas 변환을 지원하지 않습니다.");

  if (format === "image/jpeg") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await canvasToBlob(canvas, format, quality);
  const dataUrl = await readBlobAsDataUrl(blob);
  const ext = extensionFor(format);
  const fileName = `${sanitizeBaseName(source.file.name)}-${targetWidth}x${targetHeight}.${ext}`;

  return {
    id: `${source.id}-${format}`,
    sourceName: source.file.name,
    fileName,
    width: targetWidth,
    height: targetHeight,
    blob,
    dataUrl,
  };
}

export default function ImageFormatConverter() {
  const { locale } = useLocale();
  const [sources, setSources] = useState<SourceImage[]>([]);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(0.82);
  const [maxWidth, setMaxWidth] = useState("1920");
  const [maxHeight, setMaxHeight] = useState("1080");
  const [jpegBackground, setJpegBackground] = useState("#ffffff");
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = locale === "ko"
    ? {
        upload: "이미지 업로드",
        uploadHint: "PNG, JPG, WebP, SVG 등 브라우저가 읽을 수 있는 이미지 · 최대 20개 · 각 20MB 이하",
        choose: "파일 선택",
        selected: "선택된 이미지",
        format: "출력 포맷",
        quality: "품질",
        maxWidth: "최대 너비(px)",
        maxHeight: "최대 높이(px)",
        bg: "JPG 배경색",
        convert: "이미지 변환",
        converting: "변환 중...",
        downloadAll: "전체 ZIP 다운로드",
        download: "다운로드",
        clear: "초기화",
        result: "변환 결과",
        local: "파일은 서버로 업로드되지 않고 브라우저 안에서 변환됩니다. JPG 출력은 투명 영역을 선택한 배경색으로 채웁니다.",
        empty: "이미지를 선택하면 포맷 변환, 리사이즈, 품질 조절 결과를 미리보고 다운로드할 수 있습니다.",
      }
    : {
        upload: "Upload images",
        uploadHint: "PNG, JPG, WebP, SVG, or other browser-readable images · max 20 files · 20MB each",
        choose: "Choose files",
        selected: "Selected images",
        format: "Output format",
        quality: "Quality",
        maxWidth: "Max width (px)",
        maxHeight: "Max height (px)",
        bg: "JPG background",
        convert: "Convert images",
        converting: "Converting...",
        downloadAll: "Download ZIP",
        download: "Download",
        clear: "Clear",
        result: "Converted results",
        local: "Files are converted in your browser and are not uploaded. JPG output fills transparent pixels with the selected background.",
        empty: "Choose images to preview format conversion, resize, quality settings, and downloads.",
      };

  const parsedMaxWidth = useMemo(() => Math.max(0, Number.parseInt(maxWidth, 10) || 0), [maxWidth]);
  const parsedMaxHeight = useMemo(() => Math.max(0, Number.parseInt(maxHeight, 10) || 0), [maxHeight]);
  const totalInputSize = useMemo(() => sources.reduce((sum, item) => sum + item.file.size, 0), [sources]);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setResult(null);
    const nextFiles = Array.from(files).slice(0, MAX_FILES);
    try {
      for (const source of sources) URL.revokeObjectURL(source.url);
      const loaded = await Promise.all(nextFiles.map(loadImage));
      setSources(loaded);
    } catch (error) {
      setSources([]);
      setResult({ ok: false, error: error instanceof Error ? error.message : "이미지를 불러오지 못했습니다." });
    }
  }

  function handleClear() {
    for (const source of sources) URL.revokeObjectURL(source.url);
    setSources([]);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleConvert() {
    if (sources.length === 0) return;
    setIsConverting(true);
    try {
      const converted = await Promise.all(
        sources.map((source) => convertImage(source, format, quality, parsedMaxWidth, parsedMaxHeight, jpegBackground)),
      );
      setResult({ ok: true, images: converted });
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "이미지 변환에 실패했습니다." });
    } finally {
      setIsConverting(false);
    }
  }

  async function handleZipDownload() {
    if (!result?.ok) return;
    const zip = new JSZip();
    for (const image of result.images) {
      zip.file(image.fileName, image.blob);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, `converted-images-${extensionFor(format)}.zip`);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={(event) => void handleFiles(event.target.files)}
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

      {sources.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{t.selected}</p>
                <p className="text-xs text-muted">{sources.length} files · {fileSizeLabel(totalInputSize)}</p>
              </div>
              <button type="button" onClick={handleClear} className="text-xs font-semibold text-primary hover:underline">
                {t.clear}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sources.map((source) => (
                <div key={source.id} className="rounded-lg border border-border p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={source.url} alt={source.file.name} className="aspect-square w-full rounded-md object-contain bg-accent p-2" />
                  <p className="mt-2 truncate text-xs font-medium">{source.file.name}</p>
                  <p className="text-xs text-muted">{source.width}×{source.height} · {fileSizeLabel(source.file.size)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-border p-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.format}</span>
              <select value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)} className={inputClass}>
                {outputFormats.map((item) => <option key={item} value={item}>{labelFor(item)}</option>)}
              </select>
            </label>

            {format !== "image/png" && (
              <label className="block space-y-1">
                <span className="text-sm font-medium">{t.quality}: {Math.round(quality * 100)}%</span>
                <input type="range" min="0.3" max="1" step="0.01" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full" />
              </label>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="text-sm font-medium">{t.maxWidth}</span>
                <input inputMode="numeric" value={maxWidth} onChange={(event) => setMaxWidth(event.target.value)} className={inputClass} />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">{t.maxHeight}</span>
                <input inputMode="numeric" value={maxHeight} onChange={(event) => setMaxHeight(event.target.value)} className={inputClass} />
              </label>
            </div>

            {format === "image/jpeg" && (
              <label className="block space-y-1">
                <span className="text-sm font-medium">{t.bg}</span>
                <div className="flex gap-2">
                  <input type="color" value={jpegBackground} onChange={(event) => setJpegBackground(event.target.value)} className="h-10 w-12 rounded-lg border border-border" />
                  <input value={jpegBackground} onChange={(event) => setJpegBackground(event.target.value)} className={inputClass} />
                </div>
              </label>
            )}

            <button
              type="button"
              disabled={isConverting || sources.length === 0}
              onClick={() => void handleConvert()}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isConverting ? t.converting : t.convert}
            </button>
          </div>
        </div>
      ) : (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">{t.empty}</output>
      )}

      <p className="text-xs leading-relaxed text-fg-3">{t.local}</p>

      {result?.ok === false && (
        <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {result.error}
        </output>
      )}

      {result?.ok && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">{t.result}</p>
              <p className="text-xs text-muted">{result.images.length} files · {labelFor(format)}</p>
            </div>
            <button type="button" onClick={() => void handleZipDownload()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
              {t.downloadAll}
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.images.map((image) => (
              <div key={image.id} className="rounded-lg border border-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.dataUrl} alt={image.fileName} className="aspect-video w-full rounded-md object-contain bg-accent p-2" />
                <p className="mt-2 truncate text-xs font-semibold">{image.fileName}</p>
                <p className="text-xs text-muted">{image.width}×{image.height} · {fileSizeLabel(image.blob.size)}</p>
                <button type="button" onClick={() => downloadBlob(image.blob, image.fileName)} className="mt-2 text-xs font-semibold text-primary hover:underline">
                  {t.download}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
