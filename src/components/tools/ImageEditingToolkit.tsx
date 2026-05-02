"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";

type Mode = "resize" | "crop" | "watermark" | "mosaic" | "palette" | "metadata";
const modes: Mode[] = ["resize", "crop", "watermark", "mosaic", "palette", "metadata"];

type Source = { file: File; url: string; width: number; height: number };
const inputClass = "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function loadImage(file: File): Promise<Source> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("이미지 파일만 선택할 수 있습니다."));
    if (file.size > 20 * 1024 * 1024) return reject(new Error("20MB 이하 이미지만 처리할 수 있습니다."));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ file, url, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("이미지를 불러오지 못했습니다.")); };
    img.src = url;
  });
}
function blobFromCanvas(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => b ? resolve(b) : reject(new Error("이미지 출력에 실패했습니다.")), type, quality));
}
async function drawSource(source: Source) {
  const img = new Image();
  img.src = source.url;
  await img.decode();
  return img;
}
function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export default function ImageEditingToolkit() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("resize");
  const [source, setSource] = useState<Source | null>(null);
  const [maxWidth, setMaxWidth] = useState("1200");
  const [maxHeight, setMaxHeight] = useState("1200");
  const [quality, setQuality] = useState(0.82);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: "0", y: "0", w: "800", h: "800" });
  const [watermark, setWatermark] = useState("© Zero Human Studio");
  const [mosaicSize, setMosaicSize] = useState(18);
  const [palette, setPalette] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const label = locale === "ko" ? {
    intro: "이미지 압축, 리사이즈/크롭/회전, EXIF 제거용 재저장, 워터마크, 모자이크/블러, 색상 팔레트를 브라우저에서 처리합니다.", choose: "이미지 선택", download: "처리 후 다운로드", palette: "팔레트 추출", local: "Canvas로 다시 저장하면 대부분의 원본 EXIF/메타데이터가 제거됩니다. HEIC 등 브라우저가 직접 읽지 못하는 포맷은 제한될 수 있습니다.",
    tabs: { resize: "압축·리사이즈", crop: "크롭·회전", watermark: "워터마크", mosaic: "모자이크", palette: "색상 추출", metadata: "메타데이터" } as Record<Mode,string>,
  } : {
    intro: "Compress, resize/crop/rotate, strip EXIF by re-saving, watermark, mosaic/blur, and extract palettes in the browser.", choose: "Choose image", download: "Process & download", palette: "Extract palette", local: "Canvas re-export removes most original EXIF/metadata. Browser-unreadable formats such as HEIC may be limited.",
    tabs: { resize: "Compress/resize", crop: "Crop/rotate", watermark: "Watermark", mosaic: "Mosaic", palette: "Palette", metadata: "Metadata" } as Record<Mode,string>,
  };

  const meta = useMemo(() => source ? [
    ["File", source.file.name], ["Type", source.file.type || "unknown"], ["Size", fileSizeLabel(source.file.size)], ["Dimensions", `${source.width}×${source.height}`], ["Modified", new Date(source.file.lastModified).toLocaleString()],
  ] : [], [source]);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    try {
      if (source) URL.revokeObjectURL(source.url);
      setSource(await loadImage(file));
      setMessage(null);
      setPalette([]);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Error"); }
  }

  async function process(download = true) {
    if (!source) return;
    setMessage(null);
    const img = await drawSource(source);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    if (mode === "crop") {
      const sx = Math.max(0, Number(crop.x) || 0), sy = Math.max(0, Number(crop.y) || 0);
      const sw = Math.min(source.width - sx, Number(crop.w) || source.width), sh = Math.min(source.height - sy, Number(crop.h) || source.height);
      const rotated = rotation % 180 !== 0;
      canvas.width = rotated ? sh : sw; canvas.height = rotated ? sw : sh;
      ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, sx, sy, sw, sh, -sw / 2, -sh / 2, sw, sh);
    } else {
      const scale = mode === "resize" ? Math.min(1, (Number(maxWidth) || source.width) / source.width, (Number(maxHeight) || source.height) / source.height) : 1;
      canvas.width = Math.max(1, Math.round(source.width * scale)); canvas.height = Math.max(1, Math.round(source.height * scale));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (mode === "watermark") {
        ctx.font = `${Math.max(18, Math.round(canvas.width / 32))}px sans-serif`; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
        const pad = Math.round(canvas.width * 0.035); const metrics = ctx.measureText(watermark);
        ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(canvas.width - metrics.width - pad * 1.6, canvas.height - pad * 2.1, metrics.width + pad, pad * 1.4);
        ctx.fillStyle = "white"; ctx.fillText(watermark, canvas.width - pad, canvas.height - pad);
      }
      if (mode === "mosaic") {
        const small = document.createElement("canvas"); const sctx = small.getContext("2d"); if (!sctx) return;
        const factor = Math.max(4, mosaicSize); small.width = Math.max(1, Math.round(canvas.width / factor)); small.height = Math.max(1, Math.round(canvas.height / factor));
        sctx.drawImage(canvas, 0, 0, small.width, small.height); ctx.imageSmoothingEnabled = false; ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, canvas.width, canvas.height);
      }
      if (mode === "palette") {
        const sampleCanvas = document.createElement("canvas"); const sctx = sampleCanvas.getContext("2d"); if (!sctx) return;
        sampleCanvas.width = 80; sampleCanvas.height = 80; sctx.drawImage(img, 0, 0, 80, 80);
        const data = sctx.getImageData(0, 0, 80, 80).data; const buckets = new Map<string, number>();
        for (let i = 0; i < data.length; i += 16) { const hex = rgbToHex(Math.round(data[i] / 32) * 32, Math.round(data[i + 1] / 32) * 32, Math.round(data[i + 2] / 32) * 32); buckets.set(hex, (buckets.get(hex) ?? 0) + 1); }
        setPalette([...buckets.entries()].sort((a,b) => b[1] - a[1]).slice(0, 12).map(([hex]) => hex));
      }
    }
    if (download && mode !== "palette" && mode !== "metadata") {
      const blob = await blobFromCanvas(canvas, "image/jpeg", quality);
      downloadBlob(blob, `${sanitizeFileBaseName(source.file.name, "image")}-${mode}.jpg`);
      setMessage(`${fileSizeLabel(source.file.size)} → ${fileSizeLabel(blob.size)}`);
    }
  }

  return <div className="space-y-5">
    <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted"><p>{label.intro}</p><p className="mt-1 text-xs">{label.local}</p></div>
    <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
    <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{label.choose}</button>
    {source && <div className="grid gap-5 lg:grid-cols-[280px_1fr]"><div className="space-y-3"><img src={source.url} alt="preview" className="max-h-80 rounded-lg border border-border object-contain" />{meta.map(([k,v]) => <p key={k} className="text-xs text-muted"><strong>{k}:</strong> {v}</p>)}</div><div className="space-y-4"><div className="flex flex-wrap gap-2">{modes.map((m) => <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full border px-3 py-2 text-sm ${mode === m ? "border-primary bg-primary text-white" : "border-border"}`}>{label.tabs[m]}</button>)}</div>
      {mode === "resize" && <div className="grid gap-3 sm:grid-cols-3"><input className={inputClass} value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)} placeholder="Max width" /><input className={inputClass} value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)} placeholder="Max height" /><input className={inputClass} type="number" min="0.1" max="1" step="0.01" value={quality} onChange={(e) => setQuality(Number(e.target.value))} /></div>}
      {mode === "crop" && <div className="grid gap-3 sm:grid-cols-5">{(["x","y","w","h"] as const).map((k) => <input key={k} className={inputClass} value={crop[k]} onChange={(e) => setCrop({...crop, [k]: e.target.value})} placeholder={k} />)}<select className={inputClass} value={rotation} onChange={(e) => setRotation(Number(e.target.value))}><option value={0}>0°</option><option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option></select></div>}
      {mode === "watermark" && <input className={`${inputClass} w-full`} value={watermark} onChange={(e) => setWatermark(e.target.value)} />}
      {mode === "mosaic" && <input className={inputClass} type="range" min="6" max="48" value={mosaicSize} onChange={(e) => setMosaicSize(Number(e.target.value))} />}
      {mode === "palette" && <button type="button" onClick={() => void process(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">{label.palette}</button>}
      {palette.length > 0 && <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{palette.map((hex) => <div key={hex} className="rounded border border-border p-2 text-xs"><div className="mb-2 h-10 rounded" style={{ backgroundColor: hex }} />{hex}</div>)}</div>}
      {mode !== "palette" && mode !== "metadata" && <button type="button" onClick={() => void process(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{label.download}</button>}
      {message && <p className="text-sm text-muted">{message}</p>}
    </div></div>}
  </div>;
}
