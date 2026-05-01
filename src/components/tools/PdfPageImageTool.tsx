"use client";

import JSZip from "jszip";
import { useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

type RenderedPage = {
  page: number;
  fileName: string;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
};

type PdfSource = {
  file: File;
  pageCount: number;
};

type RenderResult =
  | { ok: true; pages: RenderedPage[] }
  | { ok: false; error: string };

function parsePageRanges(input: string, pageCount: number): number[] {
  const text = input.trim();
  if (!text || text.toLowerCase() === "all") return Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = new Set<number>();
  for (const chunk of text.split(",")) {
    const token = chunk.trim();
    if (!token) continue;
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < 1 || start > pageCount || end > pageCount || start > end) throw new Error(`페이지 범위가 올바르지 않습니다: ${token}`);
      for (let page = start; page <= end; page += 1) pages.add(page);
    } else {
      const page = Number(token);
      if (!Number.isInteger(page) || page < 1 || page > pageCount) throw new Error(`페이지 번호가 올바르지 않습니다: ${token}`);
      pages.add(page);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: "image/png" | "image/jpeg", quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("이미지 생성에 실패했습니다.")), type, type === "image/png" ? undefined : quality);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("미리보기 생성에 실패했습니다."));
    reader.readAsDataURL(blob);
  });
}

export default function PdfPageImageTool() {
  const { locale } = useLocale();
  const [source, setSource] = useState<PdfSource | null>(null);
  const [pageRange, setPageRange] = useState("1");
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [scale, setScale] = useState("2");
  const [quality, setQuality] = useState(0.9);
  const [isRendering, setIsRendering] = useState(false);
  const [result, setResult] = useState<RenderResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = locale === "ko"
    ? {
        upload: "PDF 업로드",
        hint: "PDF 페이지를 PNG/JPG 이미지로 렌더링합니다. 파일은 브라우저 안에서 처리됩니다.",
        choose: "PDF 선택",
        range: "페이지 범위",
        format: "이미지 포맷",
        scale: "렌더 배율",
        quality: "JPG 품질",
        render: "이미지로 변환",
        rendering: "렌더링 중...",
        downloadAll: "ZIP 다운로드",
        download: "다운로드",
        empty: "PDF를 선택한 뒤 페이지 범위를 지정하세요. 예: 1, 1-3, all",
        local: "pdf.js를 브라우저에서 사용합니다. 스캔 PDF는 페이지 이미지로 변환되지만 OCR 텍스트 추출은 하지 않습니다.",
      }
    : {
        upload: "Upload PDF",
        hint: "Render PDF pages to PNG/JPG images locally in your browser.",
        choose: "Choose PDF",
        range: "Page range",
        format: "Image format",
        scale: "Render scale",
        quality: "JPG quality",
        render: "Render pages",
        rendering: "Rendering...",
        downloadAll: "Download ZIP",
        download: "Download",
        empty: "Choose a PDF and set page range. Examples: 1, 1-3, all",
        local: "This uses pdf.js in the browser. Scanned PDFs render as images; OCR text extraction is not included.",
      };

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setResult(null);
    try {
      if (file.size > MAX_FILE_SIZE) throw new Error("50MB 이하 PDF만 처리할 수 있습니다.");
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
      const pdfDocument = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      setSource({ file, pageCount: pdfDocument.numPages });
      setPageRange(pdfDocument.numPages > 1 ? "1-3" : "1");
    } catch (error) {
      setSource(null);
      setResult({ ok: false, error: error instanceof Error ? error.message : "PDF를 읽지 못했습니다." });
    }
  }

  async function renderPages() {
    if (!source) return;
    setIsRendering(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
      const pdfDocument = await pdfjs.getDocument({ data: await source.file.arrayBuffer() }).promise;
      const pages = parsePageRanges(pageRange, source.pageCount).slice(0, 30);
      const rendered: RenderedPage[] = [];
      const numericScale = Math.min(4, Math.max(0.5, Number(scale) || 2));
      const ext = format === "image/png" ? "png" : "jpg";
      const base = sanitizeFileBaseName(source.file.name, "pdf-page");

      for (const pageNumber of pages) {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: numericScale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas를 생성하지 못했습니다.");
        if (format === "image/jpeg") {
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const blob = await canvasToBlob(canvas, format, quality);
        rendered.push({
          page: pageNumber,
          fileName: `${base}-page-${String(pageNumber).padStart(3, "0")}.${ext}`,
          blob,
          dataUrl: await blobToDataUrl(blob),
          width: canvas.width,
          height: canvas.height,
        });
      }
      setResult({ ok: true, pages: rendered });
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "페이지 렌더링에 실패했습니다." });
    } finally {
      setIsRendering(false);
    }
  }

  async function downloadZip() {
    if (!result?.ok) return;
    const zip = new JSZip();
    for (const page of result.pages) zip.file(page.fileName, page.blob);
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "pdf-pages.zip");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(event) => void handleFile(event.target.files?.[0])} />
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.upload}</p>
        <p className="mt-2 text-sm text-muted">{t.hint}</p>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.choose}</button>
      </div>

      {source ? (
        <div className="grid gap-4 rounded-xl border border-border p-4 md:grid-cols-4 md:items-end">
          <div className="md:col-span-4">
            <p className="text-sm font-semibold">{source.file.name}</p>
            <p className="text-xs text-muted">{source.pageCount} pages · {fileSizeLabel(source.file.size)}</p>
          </div>
          <label className="block space-y-1">
            <span className="text-sm font-medium">{t.range}</span>
            <input value={pageRange} onChange={(event) => setPageRange(event.target.value)} className={inputClass} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">{t.format}</span>
            <select value={format} onChange={(event) => setFormat(event.target.value as "image/png" | "image/jpeg")} className={inputClass}>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">{t.scale}</span>
            <input inputMode="decimal" value={scale} onChange={(event) => setScale(event.target.value)} className={inputClass} />
          </label>
          {format === "image/jpeg" && (
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.quality}: {Math.round(quality * 100)}%</span>
              <input type="range" min="0.4" max="1" step="0.01" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full" />
            </label>
          )}
          <button type="button" disabled={isRendering} onClick={() => void renderPages()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 md:col-span-4">{isRendering ? t.rendering : t.render}</button>
        </div>
      ) : <output className="block rounded-lg bg-accent p-4 text-sm text-muted">{t.empty}</output>}

      <p className="text-xs leading-relaxed text-fg-3">{t.local}</p>
      {result?.ok === false && <output className="block rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{result.error}</output>}
      {result?.ok && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl bg-accent p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold">{result.pages.length} pages rendered</p>
            <button type="button" onClick={() => void downloadZip()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">{t.downloadAll}</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.pages.map((page) => (
              <div key={page.fileName} className="rounded-lg border border-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.dataUrl} alt={page.fileName} className="aspect-[3/4] w-full rounded-md bg-accent object-contain p-2" />
                <p className="mt-2 text-xs font-semibold">Page {page.page}</p>
                <p className="text-xs text-muted">{page.width}×{page.height} · {fileSizeLabel(page.blob.size)}</p>
                <button type="button" onClick={() => downloadBlob(page.blob, page.fileName)} className="mt-2 text-xs font-semibold text-primary hover:underline">{t.download}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
