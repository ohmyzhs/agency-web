"use client";

import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";

const MAX_FILES = 12;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const inputClass = "block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

type PdfSource = {
  id: string;
  file: File;
  pageCount: number;
  range: string;
  include: boolean;
};

type WorkspaceResult =
  | { ok: true; blob: Blob; fileName: string; pageCount: number; size: number }
  | { ok: false; error: string };

function parsePageRanges(input: string, pageCount: number): number[] {
  const normalized = input.trim();
  if (!normalized || normalized.toLowerCase() === "all") {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const pages = new Set<number>();
  for (const part of normalized.split(",")) {
    const token = part.trim();
    if (!token) continue;
    const range = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < 1 || start > pageCount || end > pageCount || start > end) {
        throw new Error(`페이지 범위가 올바르지 않습니다: ${token}`);
      }
      for (let page = start; page <= end; page += 1) pages.add(page - 1);
      continue;
    }
    const single = Number(token);
    if (!Number.isInteger(single) || single < 1 || single > pageCount) {
      throw new Error(`페이지 번호가 올바르지 않습니다: ${token}`);
    }
    pages.add(single - 1);
  }

  if (pages.size === 0) throw new Error("추출할 페이지가 없습니다.");
  return [...pages].sort((a, b) => a - b);
}

async function inspectPdf(file: File): Promise<PdfSource> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error(`${file.name}: PDF 파일만 선택할 수 있습니다.`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${file.name}: 50MB 이하 PDF만 처리할 수 있습니다.`);
  }
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    pageCount: pdf.getPageCount(),
    range: "all",
    include: true,
  };
}

export default function PdfWorkspaceTool() {
  const { locale } = useLocale();
  const [sources, setSources] = useState<PdfSource[]>([]);
  const [outputName, setOutputName] = useState("merged-document");
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<WorkspaceResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = locale === "ko"
    ? {
        upload: "PDF 업로드",
        uploadHint: "최대 12개 · 각 50MB 이하 · 브라우저 안에서 병합/분할/재정렬합니다.",
        choose: "PDF 선택",
        selected: "선택된 PDF",
        range: "페이지 범위",
        include: "포함",
        up: "위로",
        down: "아래로",
        remove: "삭제",
        output: "출력 파일명",
        build: "새 PDF 만들기",
        working: "처리 중...",
        download: "PDF 다운로드",
        clear: "초기화",
        empty: "PDF를 선택하면 파일 순서와 페이지 범위를 조정해 새 PDF를 만들 수 있습니다. 예: all, 1, 1-3, 1,4,6-8",
        local: "파일은 서버로 업로드되지 않습니다. 암호화/손상 PDF나 매우 큰 PDF는 브라우저 메모리 한계로 실패할 수 있습니다.",
      }
    : {
        upload: "Upload PDFs",
        uploadHint: "Up to 12 files · 50MB each · merge, split, and reorder locally in the browser.",
        choose: "Choose PDFs",
        selected: "Selected PDFs",
        range: "Page range",
        include: "Include",
        up: "Up",
        down: "Down",
        remove: "Remove",
        output: "Output file name",
        build: "Build PDF",
        working: "Working...",
        download: "Download PDF",
        clear: "Clear",
        empty: "Choose PDFs, then adjust file order and page ranges to build a new PDF. Examples: all, 1, 1-3, 1,4,6-8",
        local: "Files are not uploaded. Encrypted, damaged, or very large PDFs may fail because of browser memory limits.",
      };

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setResult(null);
    try {
      const selected = Array.from(files).slice(0, MAX_FILES);
      const inspected = await Promise.all(selected.map(inspectPdf));
      setSources(inspected);
      if (inspected[0]) setOutputName(sanitizeFileBaseName(inspected[0].file.name, "merged-document"));
    } catch (error) {
      setSources([]);
      setResult({ ok: false, error: error instanceof Error ? error.message : "PDF를 불러오지 못했습니다." });
    }
  }

  function updateSource(id: string, patch: Partial<PdfSource>) {
    setSources((current) => current.map((source) => source.id === id ? { ...source, ...patch } : source));
  }

  function moveSource(index: number, direction: -1 | 1) {
    setSources((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function clear() {
    setSources([]);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function buildPdf() {
    setIsWorking(true);
    try {
      const output = await PDFDocument.create();
      let copiedPages = 0;
      for (const source of sources.filter((item) => item.include)) {
        const pageIndexes = parsePageRanges(source.range, source.pageCount);
        const pdf = await PDFDocument.load(await source.file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await output.copyPages(pdf, pageIndexes);
        for (const page of pages) output.addPage(page);
        copiedPages += pages.length;
      }
      if (copiedPages === 0) throw new Error("포함된 페이지가 없습니다.");
      const bytes = await output.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const fileName = `${sanitizeFileBaseName(outputName, "merged-document")}.pdf`;
      setResult({ ok: true, blob, fileName, pageCount: copiedPages, size: blob.size });
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "PDF 생성에 실패했습니다." });
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" multiple className="sr-only" onChange={(event) => void handleFiles(event.target.files)} />
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.upload}</p>
        <p className="mt-2 text-sm text-muted">{t.uploadHint}</p>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          {t.choose}
        </button>
      </div>

      {sources.length === 0 ? (
        <output className="block rounded-lg bg-accent p-4 text-sm text-muted">{t.empty}</output>
      ) : (
        <div className="space-y-4 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">{t.selected}</p>
            <button type="button" onClick={clear} className="text-xs font-semibold text-primary hover:underline">{t.clear}</button>
          </div>
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div key={source.id} className="grid gap-3 rounded-lg border border-border p-3 lg:grid-cols-[80px_1fr_180px_180px] lg:items-center">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span className="font-mono">#{index + 1}</span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" checked={source.include} onChange={(event) => updateSource(source.id, { include: event.target.checked })} />
                    {t.include}
                  </label>
                </div>
                <div>
                  <p className="truncate text-sm font-semibold">{source.file.name}</p>
                  <p className="text-xs text-muted">{source.pageCount} pages · {fileSizeLabel(source.file.size)}</p>
                </div>
                <label className="block space-y-1">
                  <span className="text-xs font-medium text-muted">{t.range}</span>
                  <input value={source.range} onChange={(event) => updateSource(source.id, { range: event.target.value })} className={inputClass} />
                </label>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button type="button" onClick={() => moveSource(index, -1)} className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-accent">{t.up}</button>
                  <button type="button" onClick={() => moveSource(index, 1)} className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-accent">{t.down}</button>
                  <button type="button" onClick={() => setSources((current) => current.filter((item) => item.id !== source.id))} className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-accent">{t.remove}</button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block space-y-1">
              <span className="text-sm font-medium">{t.output}</span>
              <input value={outputName} onChange={(event) => setOutputName(event.target.value)} className={inputClass} />
            </label>
            <button type="button" disabled={isWorking || sources.length === 0} onClick={() => void buildPdf()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              {isWorking ? t.working : t.build}
            </button>
          </div>
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
