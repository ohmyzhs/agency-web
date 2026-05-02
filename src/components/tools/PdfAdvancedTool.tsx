"use client";

import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";

type Mode = "extract" | "delete" | "two-up" | "crop";
type Result = { text: string; pageCount: number; name: string } | { error: string } | { ok: string } | null;

type CropMargins = { top: string; right: string; bottom: string; left: string };
const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function parseRanges(input: string, pageCount: number) {
  const set = new Set<number>();
  for (const raw of input.split(",")) {
    const part = raw.trim();
    if (!part) continue;
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < 1 || start > end || start > pageCount) throw new Error(`Invalid page range: ${part}`);
      for (let page = start; page <= Math.min(end, pageCount); page += 1) set.add(page - 1);
    } else {
      const page = Number(part);
      if (!Number.isInteger(page) || page < 1 || page > pageCount) throw new Error(`Invalid page: ${part}`);
      set.add(page - 1);
    }
  }
  return set;
}

async function extractPdfText(file: File, pageRanges: string): Promise<{ text: string; pageCount: number }> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const selected = pageRanges.trim() ? parseRanges(pageRanges, pdf.numPages) : new Set(Array.from({ length: pdf.numPages }, (_, i) => i));
  const pages: string[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    if (!selected.has(pageNo - 1)) continue;
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ").replace(/\s+/g, " ").trim();
    pages.push(`--- Page ${pageNo} ---\n${text || "(no selectable text)"}`);
  }
  return { text: pages.join("\n\n"), pageCount: pdf.numPages };
}

async function deletePages(file: File, ranges: string) {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const remove = parseRanges(ranges, pdf.getPageCount());
  if (remove.size === 0) throw new Error("삭제할 페이지를 입력하세요.");
  if (remove.size >= pdf.getPageCount()) throw new Error("모든 페이지를 삭제할 수는 없습니다.");
  const keep = Array.from({ length: pdf.getPageCount() }, (_, i) => i).filter((i) => !remove.has(i));
  const out = await PDFDocument.create();
  const pages = await out.copyPages(pdf, keep);
  for (const p of pages) out.addPage(p);
  return new Blob([await out.save() as BlobPart], { type: "application/pdf" });
}

async function cropPdf(file: File, margins: CropMargins) {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const top = Number(margins.top) || 0;
  const right = Number(margins.right) || 0;
  const bottom = Number(margins.bottom) || 0;
  const left = Number(margins.left) || 0;
  for (const page of pdf.getPages()) {
    const width = page.getWidth();
    const height = page.getHeight();
    const nextWidth = width - left - right;
    const nextHeight = height - top - bottom;
    if (nextWidth <= 10 || nextHeight <= 10) throw new Error("Crop margins are larger than a page.");
    page.setCropBox(left, bottom, nextWidth, nextHeight);
    page.setMediaBox(left, bottom, nextWidth, nextHeight);
  }
  return new Blob([await pdf.save() as BlobPart], { type: "application/pdf" });
}

async function twoUp(file: File, orientation: "horizontal" | "vertical") {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const pageCount = pdf.getPageCount();
  for (let i = 0; i < pageCount; i += 2) {
    const pageIndexes = [i, i + 1].filter((pageIndex) => pageIndex < pageCount);
    const embedded = await Promise.all(pageIndexes.map((pageIndex) => out.embedPage(pdf.getPage(pageIndex))));
    const first = pdf.getPage(i);
    const second = i + 1 < pageCount ? pdf.getPage(i + 1) : null;
    const aw = first.getWidth();
    const ah = first.getHeight();
    const bw = second?.getWidth() ?? aw;
    const bh = second?.getHeight() ?? ah;
    if (orientation === "vertical") {
      const page = out.addPage([Math.max(aw, bw), ah + bh]);
      page.drawPage(embedded[0], { x: 0, y: bh, width: aw, height: ah });
      if (embedded[1]) page.drawPage(embedded[1], { x: 0, y: 0, width: bw, height: bh });
    } else {
      const page = out.addPage([aw + bw, Math.max(ah, bh)]);
      page.drawPage(embedded[0], { x: 0, y: Math.max(ah, bh) - ah, width: aw, height: ah });
      if (embedded[1]) page.drawPage(embedded[1], { x: aw, y: Math.max(ah, bh) - bh, width: bw, height: bh });
    }
  }
  return new Blob([await out.save() as BlobPart], { type: "application/pdf" });
}

export default function PdfAdvancedTool() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("extract");
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState("1");
  const [textRanges, setTextRanges] = useState("");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [margins, setMargins] = useState<CropMargins>({ top: "24", right: "24", bottom: "24", left: "24" });
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const t = locale === "ko" ? {
    title: "PDF 텍스트 추출 · 페이지 삭제 · 2쪽 모아찍기 · 자르기",
    choose: "PDF 선택",
    extract: "텍스트 추출",
    delete: "페이지 삭제 PDF 만들기",
    two: "2쪽을 1쪽으로 병합",
    crop: "여백 자르기 PDF 만들기",
    pages: "삭제할 페이지",
    textPages: "텍스트 추출 페이지(비우면 전체)",
    orientation: "배치 방향",
    margins: "자를 여백(pt)",
    downloadTxt: "TXT 다운로드",
    local: "파일은 서버로 업로드되지 않습니다. 스캔 PDF는 OCR이 아니므로 텍스트가 없을 수 있습니다. PDF 자르기는 crop/media box 조정 방식입니다.",
    tabs: { extract: "텍스트 추출", delete: "페이지 삭제", "two-up": "2-up 병합", crop: "여백 자르기" } as Record<Mode, string>,
  } : {
    title: "PDF text extraction, page delete, 2-up merge, and crop",
    choose: "Choose PDF",
    extract: "Extract text",
    delete: "Build page-deleted PDF",
    two: "Merge 2 pages into 1",
    crop: "Build cropped PDF",
    pages: "Pages to delete",
    textPages: "Pages for text extraction (blank = all)",
    orientation: "Layout direction",
    margins: "Crop margins (pt)",
    downloadTxt: "Download TXT",
    local: "Files are not uploaded. Scanned PDFs may contain no text because this is not OCR. PDF crop adjusts crop/media boxes.",
    tabs: { extract: "Text", delete: "Delete pages", "two-up": "2-up", crop: "Crop" } as Record<Mode, string>,
  };

  async function pick(files: FileList | null) {
    const next = files?.[0];
    if (!next) return;
    if (!next.name.toLowerCase().endsWith(".pdf") && next.type !== "application/pdf") {
      setResult({ error: "PDF 파일만 선택할 수 있습니다." });
      return;
    }
    setFile(next);
    setResult(null);
  }

  async function run() {
    if (!file) return;
    setWorking(true);
    setResult(null);
    try {
      if (mode === "extract") {
        const out = await extractPdfText(file, textRanges);
        setResult({ ...out, name: file.name });
      }
      if (mode === "delete") {
        const blob = await deletePages(file, ranges);
        downloadBlob(blob, `${sanitizeFileBaseName(file.name, "pdf")}-deleted.pdf`);
        setResult({ ok: `${file.name} → ${fileSizeLabel(blob.size)}` });
      }
      if (mode === "two-up") {
        const blob = await twoUp(file, orientation);
        downloadBlob(blob, `${sanitizeFileBaseName(file.name, "pdf")}-2up.pdf`);
        setResult({ ok: `${file.name} → ${fileSizeLabel(blob.size)}` });
      }
      if (mode === "crop") {
        const blob = await cropPdf(file, margins);
        downloadBlob(blob, `${sanitizeFileBaseName(file.name, "pdf")}-cropped.pdf`);
        setResult({ ok: `${file.name} → ${fileSizeLabel(blob.size)}` });
      }
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "PDF 작업에 실패했습니다." });
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted">
        <p className="font-medium text-foreground">{t.title}</p>
        <p className="mt-1 text-xs">{t.local}</p>
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => void pick(e.target.files)} />
      <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{t.choose}</button>

      {file && <div className="space-y-4 rounded-xl border border-border p-4">
        <p className="text-sm font-semibold">{file.name} · {fileSizeLabel(file.size)}</p>
        <div className="flex flex-wrap gap-2">{(["extract", "delete", "two-up", "crop"] as Mode[]).map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-full border px-3 py-2 text-sm ${mode === item ? "border-primary bg-primary text-white" : "border-border hover:bg-accent"}`}>{t.tabs[item]}</button>)}</div>

        {mode === "extract" && <label className="block max-w-md"><span className="text-sm font-medium">{t.textPages}</span><input className={inputClass} value={textRanges} onChange={(e) => setTextRanges(e.target.value)} placeholder="all or 1,3-5" /></label>}
        {mode === "delete" && <label className="block max-w-md"><span className="text-sm font-medium">{t.pages}</span><input className={inputClass} value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1,3-5" /></label>}
        {mode === "two-up" && <label className="block max-w-md"><span className="text-sm font-medium">{t.orientation}</span><select className={inputClass} value={orientation} onChange={(e) => setOrientation(e.target.value as "horizontal" | "vertical")}><option value="horizontal">horizontal</option><option value="vertical">vertical</option></select></label>}
        {mode === "crop" && <div className="space-y-2"><p className="text-sm font-medium">{t.margins}</p><div className="grid gap-2 sm:grid-cols-4">{(["top", "right", "bottom", "left"] as const).map((key) => <label key={key} className="grid gap-1 text-sm"><span>{key}</span><input className={inputClass} value={margins[key]} onChange={(e) => setMargins({ ...margins, [key]: e.target.value })} /></label>)}</div></div>}

        <button disabled={working} onClick={() => void run()} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent disabled:opacity-50">{mode === "extract" ? t.extract : mode === "delete" ? t.delete : mode === "two-up" ? t.two : t.crop}</button>
      </div>}

      {result && ("error" in result ? <p className="rounded bg-red-50 p-3 text-sm text-red-700">{result.error}</p> : "ok" in result ? <p className="rounded bg-accent p-3 text-sm text-muted">{result.ok}</p> : <div className="space-y-3"><p className="text-sm text-muted">{result.pageCount} pages · {result.text.length.toLocaleString()} chars</p><textarea readOnly value={result.text} rows={12} className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs" /><button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => downloadBlob(new Blob([result.text], { type: "text/plain;charset=utf-8" }), `${sanitizeFileBaseName(result.name, "pdf")}.txt`)}>{t.downloadTxt}</button></div>)}
    </div>
  );
}
