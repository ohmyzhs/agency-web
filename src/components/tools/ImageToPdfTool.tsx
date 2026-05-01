"use client";

import { PDFDocument, rgb } from "pdf-lib";
import { useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";

const MAX_FILES = 30;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

type ImageItem = {
  id: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
};

type OutputResult =
  | { ok: true; blob: Blob; fileName: string; pageCount: number; size: number }
  | { ok: false; error: string };

function readImage(file: File): Promise<ImageItem> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error(`${file.name}: 이미지 파일만 선택할 수 있습니다.`));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`${file.name}: 20MB 이하 이미지만 처리할 수 있습니다.`));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`${file.name}: 파일을 읽지 못했습니다.`));
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const image = new Image();
      image.onload = () => resolve({ id: `${file.name}-${file.size}-${crypto.randomUUID()}`, file, dataUrl, width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error(`${file.name}: 브라우저가 이미지를 디코딩하지 못했습니다.`));
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function hexToRgb01(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  if (!Number.isFinite(value)) return rgb(1, 1, 1);
  return rgb(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255);
}

function targetSize(image: ImageItem, mode: "fit" | "fill", pageWidth: number, pageHeight: number, margin: number) {
  const availableWidth = Math.max(1, pageWidth - margin * 2);
  const availableHeight = Math.max(1, pageHeight - margin * 2);
  const imageRatio = image.width / image.height;
  const boxRatio = availableWidth / availableHeight;
  let width = availableWidth;
  let height = availableHeight;
  if ((mode === "fit" && imageRatio > boxRatio) || (mode === "fill" && imageRatio < boxRatio)) {
    height = width / imageRatio;
  } else {
    width = height * imageRatio;
  }
  return { width, height, x: (pageWidth - width) / 2, y: (pageHeight - height) / 2 };
}

export default function ImageToPdfTool() {
  const { locale } = useLocale();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"auto" | "a4-portrait" | "a4-landscape">("auto");
  const [fitMode, setFitMode] = useState<"fit" | "fill">("fit");
  const [margin, setMargin] = useState("24");
  const [background, setBackground] = useState("#ffffff");
  const [outputName, setOutputName] = useState("images-to-pdf");
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<OutputResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = locale === "ko"
    ? {
        upload: "이미지 업로드",
        hint: "여러 이미지를 순서대로 PDF 페이지로 묶습니다. 최대 30개, 각 20MB 이하.",
        choose: "이미지 선택",
        selected: "선택된 이미지",
        pageSize: "페이지 크기",
        fitMode: "배치 방식",
        margin: "여백 pt",
        bg: "배경색",
        output: "출력 파일명",
        build: "PDF 만들기",
        working: "생성 중...",
        download: "PDF 다운로드",
        fit: "전체 보이기",
        fill: "페이지 채우기",
        auto: "이미지 크기 그대로",
        a4p: "A4 세로",
        a4l: "A4 가로",
        empty: "이미지를 선택하면 위/아래 버튼으로 순서를 바꾼 뒤 PDF로 묶을 수 있습니다.",
        local: "모든 처리는 브라우저 안에서 수행됩니다. 사진 EXIF 메타데이터는 PDF에 별도로 보존하지 않습니다.",
      }
    : {
        upload: "Upload images",
        hint: "Combine images into a PDF, one image per page. Up to 30 files, 20MB each.",
        choose: "Choose images",
        selected: "Selected images",
        pageSize: "Page size",
        fitMode: "Placement",
        margin: "Margin pt",
        bg: "Background",
        output: "Output file name",
        build: "Build PDF",
        working: "Building...",
        download: "Download PDF",
        fit: "Fit entire image",
        fill: "Fill page",
        auto: "Use image size",
        a4p: "A4 portrait",
        a4l: "A4 landscape",
        empty: "Choose images, reorder with up/down buttons, then build a PDF.",
        local: "Everything runs in the browser. Photo EXIF metadata is not separately preserved in the PDF.",
      };

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setResult(null);
    try {
      const items = await Promise.all(Array.from(files).slice(0, MAX_FILES).map(readImage));
      setImages(items);
      if (items[0]) setOutputName(sanitizeFileBaseName(items[0].file.name, "images-to-pdf"));
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "이미지를 불러오지 못했습니다." });
    }
  }

  function move(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function buildPdf() {
    if (images.length === 0) return;
    setIsWorking(true);
    try {
      const pdf = await PDFDocument.create();
      const marginValue = Math.min(144, Math.max(0, Number(margin) || 0));
      for (const image of images) {
        const bytes = await image.file.arrayBuffer();
        const embedded = image.file.type.includes("png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        let width = image.width;
        let height = image.height;
        if (pageSize === "a4-portrait") [width, height] = [595.28, 841.89];
        if (pageSize === "a4-landscape") [width, height] = [841.89, 595.28];
        const page = pdf.addPage([width, height]);
        page.drawRectangle({ x: 0, y: 0, width, height, color: hexToRgb01(background) });
        const placement = pageSize === "auto" ? { x: 0, y: 0, width, height } : targetSize(image, fitMode, width, height, marginValue);
        page.drawImage(embedded, placement);
      }
      const bytes = await pdf.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResult({ ok: true, blob, fileName: `${sanitizeFileBaseName(outputName, "images-to-pdf")}.pdf`, pageCount: images.length, size: blob.size });
    } catch (error) {
      const message = error instanceof Error ? error.message : "PDF 생성에 실패했습니다.";
      setResult({ ok: false, error: message.includes("SOI") || message.includes("PNG") ? "현재 MVP는 PNG/JPG 이미지를 안정적으로 지원합니다. WebP/AVIF는 이미지 포맷 컨버터로 PNG/JPG 변환 후 다시 시도하세요." : message });
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" multiple className="sr-only" onChange={(event) => void handleFiles(event.target.files)} />
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.upload}</p>
        <p className="mt-2 text-sm text-muted">{t.hint}</p>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.choose}</button>
      </div>

      {images.length === 0 ? <output className="block rounded-lg bg-accent p-4 text-sm text-muted">{t.empty}</output> : (
        <div className="space-y-4 rounded-xl border border-border p-4">
          <p className="text-sm font-semibold">{t.selected}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div key={image.id} className="rounded-lg border border-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.dataUrl} alt={image.file.name} className="aspect-video w-full rounded-md bg-accent object-contain p-2" />
                <p className="mt-2 truncate text-xs font-semibold">#{index + 1} {image.file.name}</p>
                <p className="text-xs text-muted">{image.width}×{image.height} · {fileSizeLabel(image.file.size)}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => move(index, -1)} className="rounded border border-border px-2 py-1 text-xs">↑</button>
                  <button type="button" onClick={() => move(index, 1)} className="rounded border border-border px-2 py-1 text-xs">↓</button>
                  <button type="button" onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))} className="rounded border border-border px-2 py-1 text-xs">×</button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.pageSize}</span>
              <select value={pageSize} onChange={(event) => setPageSize(event.target.value as typeof pageSize)} className={inputClass}>
                <option value="auto">{t.auto}</option>
                <option value="a4-portrait">{t.a4p}</option>
                <option value="a4-landscape">{t.a4l}</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.fitMode}</span>
              <select value={fitMode} onChange={(event) => setFitMode(event.target.value as typeof fitMode)} className={inputClass}>
                <option value="fit">{t.fit}</option>
                <option value="fill">{t.fill}</option>
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.margin}</span>
              <input value={margin} onChange={(event) => setMargin(event.target.value)} className={inputClass} />
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.bg}</span>
              <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-background" />
            </label>
            <label className="block space-y-1 md:col-span-2">
              <span className="text-sm font-medium">{t.output}</span>
              <input value={outputName} onChange={(event) => setOutputName(event.target.value)} className={inputClass} />
            </label>
          </div>
          <button type="button" disabled={isWorking} onClick={() => void buildPdf()} className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">{isWorking ? t.working : t.build}</button>
        </div>
      )}

      <p className="text-xs leading-relaxed text-fg-3">{t.local}</p>
      {result?.ok === false && <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{result.error}</output>}
      {result?.ok && (
        <div className="flex flex-col gap-3 rounded-xl bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">{result.fileName}</p>
            <p className="text-xs text-muted">{result.pageCount} pages · {fileSizeLabel(result.size)}</p>
          </div>
          <button type="button" onClick={() => downloadBlob(result.blob, result.fileName)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.download}</button>
        </div>
      )}
    </div>
  );
}
