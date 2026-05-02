"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";

type Mode = "resize" | "crop" | "watermark" | "mosaic" | "palette" | "metadata";
type OutputFormat = "image/jpeg" | "image/png" | "image/webp";
type Anchor = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

const modes: Mode[] = ["resize", "crop", "watermark", "mosaic", "palette", "metadata"];
const inputClass = "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

type Source = { file: File; url: string; width: number; height: number };
type ImageResult = { blob: Blob; fileName: string; width: number; height: number } | null;

type Copy = {
  intro: string;
  choose: string;
  download: string;
  palette: string;
  local: string;
  clear: string;
  noFile: string;
  result: string;
  copy: string;
  copied: string;
  format: string;
  quality: string;
  maxWidth: string;
  maxHeight: string;
  apply: string;
  cropHelp: string;
  watermarkText: string;
  watermarkAnchor: string;
  opacity: string;
  mosaicSize: string;
  metadataHelp: string;
  tabs: Record<Mode, string>;
};

const copyByLocale: Record<"ko" | "en", Copy> = {
  ko: {
    intro: "이미지 압축, 리사이즈/크롭/회전, EXIF 제거용 재저장, 워터마크, 모자이크/블러, 색상 팔레트를 브라우저에서 처리합니다.",
    choose: "이미지 선택",
    download: "다운로드",
    palette: "팔레트 추출",
    local: "파일은 서버로 업로드되지 않습니다. Canvas로 다시 저장하면 대부분의 원본 EXIF/메타데이터가 제거됩니다. HEIC 등 브라우저가 직접 읽지 못하는 포맷은 제한될 수 있습니다.",
    clear: "초기화",
    noFile: "이미지를 선택하면 편집 옵션과 결과 미리보기가 표시됩니다.",
    result: "처리 결과",
    copy: "복사",
    copied: "복사됨",
    format: "출력 포맷",
    quality: "품질",
    maxWidth: "최대 너비",
    maxHeight: "최대 높이",
    apply: "처리하기",
    cropHelp: "x/y/w/h는 원본 이미지 기준 픽셀입니다. 회전은 크롭 영역에 적용됩니다.",
    watermarkText: "워터마크 문구",
    watermarkAnchor: "위치",
    opacity: "불투명도",
    mosaicSize: "모자이크 강도",
    metadataHelp: "브라우저가 제공하는 파일 정보와 이미지 크기만 표시합니다. 자세한 EXIF 파서는 포함하지 않으며, 재저장 결과는 대부분의 EXIF를 포함하지 않습니다.",
    tabs: { resize: "압축·리사이즈", crop: "크롭·회전", watermark: "워터마크", mosaic: "모자이크", palette: "색상 추출", metadata: "메타데이터" },
  },
  en: {
    intro: "Compress, resize/crop/rotate, strip EXIF by re-saving, watermark, mosaic/blur, and extract palettes in the browser.",
    choose: "Choose image",
    download: "Download",
    palette: "Extract palette",
    local: "Files are not uploaded. Canvas re-export removes most original EXIF/metadata. Browser-unreadable formats such as HEIC may be limited.",
    clear: "Clear",
    noFile: "Choose an image to see editing options and a result preview.",
    result: "Result",
    copy: "Copy",
    copied: "Copied",
    format: "Output format",
    quality: "Quality",
    maxWidth: "Max width",
    maxHeight: "Max height",
    apply: "Process",
    cropHelp: "x/y/w/h are source-image pixels. Rotation is applied to the cropped area.",
    watermarkText: "Watermark text",
    watermarkAnchor: "Position",
    opacity: "Opacity",
    mosaicSize: "Mosaic strength",
    metadataHelp: "Shows browser-available file info and dimensions only. A detailed EXIF parser is not included; re-exported results usually omit EXIF.",
    tabs: { resize: "Compress/resize", crop: "Crop/rotate", watermark: "Watermark", mosaic: "Mosaic", palette: "Palette", metadata: "Metadata" },
  },
};

function loadImage(file: File): Promise<Source> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 선택할 수 있습니다."));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      reject(new Error("20MB 이하 이미지만 처리할 수 있습니다."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ file, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러오지 못했습니다."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: OutputFormat, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("이미지 출력에 실패했습니다."))), type, type === "image/png" ? undefined : quality);
  });
}

async function decodeImage(source: Source) {
  const img = new Image();
  img.src = source.url;
  await img.decode();
  return img;
}

function extension(format: OutputFormat) {
  if (format === "image/png") return "png";
  if (format === "image/webp") return "webp";
  return "jpg";
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
}

function anchorPoint(anchor: Anchor, width: number, height: number, pad: number) {
  if (anchor === "top-left") return { x: pad, y: pad, align: "left" as CanvasTextAlign, baseline: "top" as CanvasTextBaseline };
  if (anchor === "top-right") return { x: width - pad, y: pad, align: "right" as CanvasTextAlign, baseline: "top" as CanvasTextBaseline };
  if (anchor === "bottom-left") return { x: pad, y: height - pad, align: "left" as CanvasTextAlign, baseline: "bottom" as CanvasTextBaseline };
  if (anchor === "center") return { x: width / 2, y: height / 2, align: "center" as CanvasTextAlign, baseline: "middle" as CanvasTextBaseline };
  return { x: width - pad, y: height - pad, align: "right" as CanvasTextAlign, baseline: "bottom" as CanvasTextBaseline };
}

function drawBackgroundForJpeg(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
}

export default function ImageEditingToolkit() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("resize");
  const [source, setSource] = useState<Source | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [maxWidth, setMaxWidth] = useState("1200");
  const [maxHeight, setMaxHeight] = useState("1200");
  const [quality, setQuality] = useState(0.82);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: "0", y: "0", w: "800", h: "800" });
  const [watermark, setWatermark] = useState("© Zero Human Studio");
  const [anchor, setAnchor] = useState<Anchor>("bottom-right");
  const [opacity, setOpacity] = useState(0.85);
  const [mosaicSize, setMosaicSize] = useState(18);
  const [palette, setPalette] = useState<string[]>([]);
  const [result, setResult] = useState<ImageResult>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const t = copyByLocale[locale];

  const metadata = useMemo(() => source ? [
    ["File", source.file.name],
    ["Type", source.file.type || "unknown"],
    ["Size", fileSizeLabel(source.file.size)],
    ["Dimensions", `${source.width.toLocaleString()}×${source.height.toLocaleString()}`],
    ["Last modified", new Date(source.file.lastModified).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")],
  ] : [], [locale, source]);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      if (source) URL.revokeObjectURL(source.url);
      if (result) URL.revokeObjectURL(URL.createObjectURL(result.blob));
      const loaded = await loadImage(file);
      setSource(loaded);
      setCrop({ x: "0", y: "0", w: String(Math.min(loaded.width, 1200)), h: String(Math.min(loaded.height, 1200)) });
      setMaxWidth(String(Math.min(loaded.width, 1600)));
      setMaxHeight(String(Math.min(loaded.height, 1600)));
      setMessage(null);
      setPalette([]);
      setResult(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error");
    }
  }

  function clear() {
    if (source) URL.revokeObjectURL(source.url);
    setSource(null);
    setResult(null);
    setPalette([]);
    setMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function processImage(shouldDownload = false) {
    if (!source) return;
    setMessage(null);
    setPalette([]);
    const img = await decodeImage(source);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    if (mode === "crop") {
      const sx = Math.min(source.width - 1, Math.max(0, Number(crop.x) || 0));
      const sy = Math.min(source.height - 1, Math.max(0, Number(crop.y) || 0));
      const sw = Math.max(1, Math.min(source.width - sx, Number(crop.w) || source.width));
      const sh = Math.max(1, Math.min(source.height - sy, Number(crop.h) || source.height));
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      const rotated = normalizedRotation === 90 || normalizedRotation === 270;
      canvas.width = rotated ? sh : sw;
      canvas.height = rotated ? sw : sh;
      if (format === "image/jpeg") drawBackgroundForJpeg(ctx, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((normalizedRotation * Math.PI) / 180);
      ctx.drawImage(img, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
    } else {
      const scale = mode === "resize" ? Math.min(1, (Number(maxWidth) || source.width) / source.width, (Number(maxHeight) || source.height) / source.height) : 1;
      canvas.width = Math.max(1, Math.round(source.width * scale));
      canvas.height = Math.max(1, Math.round(source.height * scale));
      if (format === "image/jpeg") drawBackgroundForJpeg(ctx, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (mode === "watermark") {
        const pad = Math.round(Math.min(canvas.width, canvas.height) * 0.04);
        const fontSize = Math.max(18, Math.round(canvas.width / 30));
        const point = anchorPoint(anchor, canvas.width, canvas.height, pad);
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = `700 ${fontSize}px sans-serif`;
        ctx.textAlign = point.align;
        ctx.textBaseline = point.baseline;
        const metrics = ctx.measureText(watermark);
        const rectW = metrics.width + pad;
        const rectH = fontSize * 1.55;
        const rectX = point.align === "right" ? point.x - rectW : point.align === "center" ? point.x - rectW / 2 : point.x - pad / 2;
        const rectY = point.baseline === "bottom" ? point.y - rectH : point.baseline === "middle" ? point.y - rectH / 2 : point.y - pad / 2;
        ctx.fillStyle = "rgba(0,0,0,.48)";
        ctx.fillRect(rectX, rectY, rectW, rectH);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(watermark, point.x, point.y);
        ctx.restore();
      }

      if (mode === "mosaic") {
        const factor = Math.max(4, mosaicSize);
        const small = document.createElement("canvas");
        const sctx = small.getContext("2d");
        if (!sctx) throw new Error("Canvas not supported");
        small.width = Math.max(1, Math.round(canvas.width / factor));
        small.height = Math.max(1, Math.round(canvas.height / factor));
        sctx.drawImage(canvas, 0, 0, small.width, small.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, canvas.width, canvas.height);
      }

      if (mode === "palette") {
        const sampleCanvas = document.createElement("canvas");
        const sctx = sampleCanvas.getContext("2d");
        if (!sctx) throw new Error("Canvas not supported");
        sampleCanvas.width = 96;
        sampleCanvas.height = 96;
        sctx.drawImage(img, 0, 0, 96, 96);
        const data = sctx.getImageData(0, 0, 96, 96).data;
        const buckets = new Map<string, number>();
        for (let i = 0; i < data.length; i += 16) {
          if (data[i + 3] < 120) continue;
          const hex = rgbToHex(Math.round(data[i] / 24) * 24, Math.round(data[i + 1] / 24) * 24, Math.round(data[i + 2] / 24) * 24);
          buckets.set(hex, (buckets.get(hex) ?? 0) + 1);
        }
        setPalette([...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([hex]) => hex));
        return;
      }
    }

    if (mode === "metadata") return;
    const blob = await canvasToBlob(canvas, format, quality);
    const next = { blob, fileName: `${sanitizeFileBaseName(source.file.name, "image")}-${mode}.${extension(format)}`, width: canvas.width, height: canvas.height };
    setResult(next);
    setMessage(`${fileSizeLabel(source.file.size)} → ${fileSizeLabel(blob.size)} · ${next.width}×${next.height}`);
    if (shouldDownload) downloadBlob(blob, next.fileName);
  }

  async function copyColor(hex: string) {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    window.setTimeout(() => setCopied(null), 1200);
  }

  const resultUrl = useMemo(() => (result ? URL.createObjectURL(result.blob) : null), [result]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted">
        <p>{t.intro}</p>
        <p className="mt-1 text-xs">{t.local}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
        <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          {t.choose}
        </button>
        {source && <button type="button" onClick={clear} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">{t.clear}</button>}
      </div>

      {!source ? <output className="block rounded-lg bg-card p-4 text-sm text-muted">{t.noFile}</output> : (
        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={source.url} alt="preview" className="max-h-80 w-full rounded-lg border border-border object-contain" />
            {metadata.map(([key, value]) => <p key={key} className="text-xs text-muted"><strong>{key}:</strong> {value}</p>)}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {modes.map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-full border px-3 py-2 text-sm ${mode === item ? "border-primary bg-primary text-white" : "border-border hover:bg-accent"}`}>{t.tabs[item]}</button>)}
            </div>

            {mode !== "palette" && mode !== "metadata" && (
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1 text-sm"><span>{t.format}</span><select className={inputClass} value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></label>
                <label className="grid gap-1 text-sm"><span>{t.quality}</span><input className={inputClass} type="number" min="0.1" max="1" step="0.01" value={quality} onChange={(e) => setQuality(Number(e.target.value))} /></label>
              </div>
            )}

            {mode === "resize" && <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1 text-sm"><span>{t.maxWidth}</span><input className={inputClass} inputMode="numeric" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} /></label><label className="grid gap-1 text-sm"><span>{t.maxHeight}</span><input className={inputClass} inputMode="numeric" value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} /></label></div>}

            {mode === "crop" && <div className="space-y-2"><p className="text-xs text-muted">{t.cropHelp}</p><div className="grid gap-3 sm:grid-cols-5">{(["x", "y", "w", "h"] as const).map((key) => <label key={key} className="grid gap-1 text-sm"><span>{key}</span><input className={inputClass} inputMode="numeric" value={crop[key]} onChange={(e) => setCrop({ ...crop, [key]: e.target.value })} /></label>)}<label className="grid gap-1 text-sm"><span>rotate</span><select className={inputClass} value={rotation} onChange={(e) => setRotation(Number(e.target.value))}><option value={0}>0°</option><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option></select></label></div></div>}

            {mode === "watermark" && <div className="grid gap-3 sm:grid-cols-3"><label className="grid gap-1 text-sm sm:col-span-3"><span>{t.watermarkText}</span><input className={inputClass} value={watermark} onChange={(e) => setWatermark(e.target.value)} /></label><label className="grid gap-1 text-sm"><span>{t.watermarkAnchor}</span><select className={inputClass} value={anchor} onChange={(e) => setAnchor(e.target.value as Anchor)}><option value="bottom-right">Bottom right</option><option value="bottom-left">Bottom left</option><option value="top-right">Top right</option><option value="top-left">Top left</option><option value="center">Center</option></select></label><label className="grid gap-1 text-sm"><span>{t.opacity}</span><input className={inputClass} type="number" min="0.1" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} /></label></div>}

            {mode === "mosaic" && <label className="grid gap-1 text-sm"><span>{t.mosaicSize}: {mosaicSize}</span><input className="w-full" type="range" min="6" max="48" value={mosaicSize} onChange={(e) => setMosaicSize(Number(e.target.value))} /></label>}

            {mode === "metadata" && <div className="rounded-lg bg-card p-4 text-sm text-muted"><p>{t.metadataHelp}</p></div>}

            {mode === "palette" ? <button type="button" onClick={() => void processImage(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">{t.palette}</button> : mode !== "metadata" && <button type="button" onClick={() => void processImage(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{t.apply}</button>}

            {palette.length > 0 && <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{palette.map((hex) => <button type="button" key={hex} onClick={() => void copyColor(hex)} className="rounded border border-border p-2 text-left text-xs hover:bg-accent"><span className="mb-2 block h-10 rounded" style={{ backgroundColor: hex }} />{hex} <span className="text-muted">{copied === hex ? t.copied : t.copy}</span></button>)}</div>}

            {result && resultUrl && <div className="space-y-3 rounded-lg border border-border p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{t.result}: {result.fileName}</p><button type="button" onClick={() => downloadBlob(result.blob, result.fileName)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">{t.download}</button></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resultUrl} alt="processed preview" className="max-h-80 w-full rounded bg-card object-contain" />
            </div>}
            {message && <p className="text-sm text-muted">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
