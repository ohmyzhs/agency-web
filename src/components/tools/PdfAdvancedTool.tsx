"use client";

import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";

type Result = { text: string; pageCount: number; name: string } | { error: string } | null;
const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

async function extractPdfText(file: File): Promise<{ text: string; pageCount: number }> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ").replace(/\s+/g, " ").trim();
    pages.push(`--- Page ${pageNo} ---\n${text}`);
  }
  return { text: pages.join("\n\n"), pageCount: pdf.numPages };
}
async function deletePages(file: File, ranges: string) {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const remove = parseRanges(ranges, pdf.getPageCount());
  const keep = Array.from({ length: pdf.getPageCount() }, (_, i) => i).filter((i) => !remove.has(i));
  const out = await PDFDocument.create();
  const pages = await out.copyPages(pdf, keep);
  for (const p of pages) out.addPage(p);
  return new Blob([await out.save() as BlobPart], { type: "application/pdf" });
}
function parseRanges(input: string, pageCount: number) {
  const set = new Set<number>();
  for (const raw of input.split(",")) {
    const part = raw.trim(); if (!part) continue;
    const range = part.match(/^(\d+)-(\d+)$/);
    if (range) { const a = Number(range[1]), b = Number(range[2]); for (let p = a; p <= b; p += 1) if (p >= 1 && p <= pageCount) set.add(p - 1); }
    else { const p = Number(part); if (p >= 1 && p <= pageCount) set.add(p - 1); }
  }
  return set;
}
async function twoUp(file: File) {
  const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const pageCount = pdf.getPageCount();
  for (let i = 0; i < pageCount; i += 2) {
    const sourcePages = [i, i + 1].filter((pageIndex) => pageIndex < pageCount);
    const embedded = await Promise.all(sourcePages.map((pageIndex) => out.embedPage(pdf.getPage(pageIndex))));
    const first = pdf.getPage(i);
    const second = i + 1 < pageCount ? pdf.getPage(i + 1) : null;
    const aw = first.getWidth(), ah = first.getHeight();
    const bw = second?.getWidth() ?? aw, bh = second?.getHeight() ?? ah;
    const page = out.addPage([aw + bw, Math.max(ah, bh)]);
    page.drawPage(embedded[0], { x: 0, y: Math.max(ah, bh) - ah, width: aw, height: ah });
    if (embedded[1]) page.drawPage(embedded[1], { x: aw, y: Math.max(ah, bh) - bh, width: bw, height: bh });
  }
  return new Blob([await out.save() as BlobPart], { type: "application/pdf" });
}

export default function PdfAdvancedTool() {
  const { locale } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState("1");
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const t = locale === "ko" ? {
    title: "PDF 텍스트 추출 · 페이지 삭제 · 2쪽 모아찍기", choose: "PDF 선택", extract: "텍스트 추출", delete: "페이지 삭제 PDF", two: "2쪽을 1쪽으로 병합", pages: "삭제할 페이지", downloadTxt: "TXT 다운로드", local: "파일은 서버로 업로드되지 않습니다. 스캔 PDF는 OCR이 아니므로 텍스트가 없을 수 있습니다.",
  } : {
    title: "PDF text extraction, page delete, 2-up merge", choose: "Choose PDF", extract: "Extract text", delete: "Delete pages PDF", two: "Merge 2 pages into 1", pages: "Pages to delete", downloadTxt: "Download TXT", local: "Files are not uploaded. Scanned PDFs may contain no text because this is not OCR.",
  };
  async function pick(files: FileList | null) { const f = files?.[0]; if (f) { setFile(f); setResult(null); } }
  async function run(kind: "extract" | "delete" | "two") {
    if (!file) return; setWorking(true); setResult(null);
    try {
      if (kind === "extract") { const out = await extractPdfText(file); setResult({ ...out, name: file.name }); }
      if (kind === "delete") { const blob = await deletePages(file, ranges); downloadBlob(blob, `${sanitizeFileBaseName(file.name, "pdf")}-deleted.pdf`); }
      if (kind === "two") { const blob = await twoUp(file); downloadBlob(blob, `${sanitizeFileBaseName(file.name, "pdf")}-2up.pdf`); }
    } catch (err) { setResult({ error: err instanceof Error ? err.message : "PDF 작업에 실패했습니다." }); }
    finally { setWorking(false); }
  }
  return <div className="space-y-5">
    <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted"><p className="font-medium text-foreground">{t.title}</p><p className="mt-1 text-xs">{t.local}</p></div>
    <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => void pick(e.target.files)} />
    <button type="button" onClick={() => inputRef.current?.click()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{t.choose}</button>
    {file && <div className="space-y-4 rounded-xl border border-border p-4"><p className="text-sm font-semibold">{file.name} · {fileSizeLabel(file.size)}</p><div className="flex flex-wrap gap-2"><button disabled={working} onClick={() => void run("extract")} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">{t.extract}</button><button disabled={working} onClick={() => void run("two")} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">{t.two}</button></div><label className="block max-w-sm"><span className="text-sm font-medium">{t.pages}</span><input className={inputClass} value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1,3-5" /></label><button disabled={working} onClick={() => void run("delete")} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">{t.delete}</button></div>}
    {result && ("error" in result ? <p className="rounded bg-red-50 p-3 text-sm text-red-700">{result.error}</p> : <div className="space-y-3"><p className="text-sm text-muted">{result.pageCount} pages · {result.text.length.toLocaleString()} chars</p><textarea readOnly value={result.text} rows={12} className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs" /><button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => downloadBlob(new Blob([result.text], { type: "text/plain;charset=utf-8" }), `${sanitizeFileBaseName(result.name, "pdf")}.txt`)}>{t.downloadTxt}</button></div>)}
  </div>;
}
