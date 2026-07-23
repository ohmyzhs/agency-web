"use client";

import { useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";
import { downloadBlob, fileSizeLabel, sanitizeFileBaseName } from "@/lib/browser-download";
import {
  markdownToPdf,
  markdownToPdfLimits,
  type MarkdownPdfMargins,
  type MarkdownPdfPageSize,
} from "@/lib/markdown-to-pdf";

const SAMPLE_KO = `# Markdown → PDF

브라우저에서 **로컬**로 변환하는 간단한 도구입니다.

## 지원 요소

- 제목 (H1–H3)
- 문단, **굵게**, *기울임*
- 순서/비순서 목록
- 인용과 코드 블록
- 간단한 표

1. 마크다운을 붙여넣습니다
2. 페이지 크기와 여백을 고릅니다
3. PDF를 다운로드합니다

> 서버 업로드 없이 브라우저 Canvas + pdf-lib로 생성합니다.

\`\`\`ts
const pdf = await markdownToPdf(source);
\`\`\`

| 항목 | 상태 |
| --- | --- |
| 한글 | 지원 |
| 이미지 임베드 | 미지원 |
| 최대 페이지 | ${markdownToPdfLimits.maxPages}
`;

const SAMPLE_EN = `# Markdown to PDF

A simple **browser-local** converter.

## Supported

- Headings (H1–H3)
- Paragraphs, **bold**, *italic*
- Ordered/unordered lists
- Quotes and fenced code
- Simple tables

1. Paste Markdown
2. Choose page size and margins
3. Download the PDF

> Nothing is uploaded. Rendering uses Canvas + pdf-lib.

\`\`\`ts
const pdf = await markdownToPdf(source);
\`\`\`

| Item | Status |
| --- | --- |
| Korean text | Supported |
| Embedded images | Not supported |
| Max pages | ${markdownToPdfLimits.maxPages}
`;

const inputClass =
  "mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

type BuildResult =
  | { ok: true; blob: Blob; fileName: string; pageCount: number; size: number }
  | { ok: false; error: string };

export default function MarkdownToPdfTool() {
  const { locale } = useLocale();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [markdown, setMarkdown] = useState(locale === "ko" ? SAMPLE_KO : SAMPLE_EN);
  const [title, setTitle] = useState("");
  const [pageSize, setPageSize] = useState<MarkdownPdfPageSize>("a4");
  const [margins, setMargins] = useState<MarkdownPdfMargins>("normal");
  const [outputName, setOutputName] = useState("markdown");
  const [isWorking, setIsWorking] = useState(false);
  const [result, setResult] = useState<BuildResult | null>(null);

  const t = useMemo(
    () =>
      locale === "ko"
        ? {
            intro:
              "Markdown을 PDF로 변환합니다. 제목·목록·인용·코드·간단한 표를 브라우저 안에서 렌더링하며 서버로 업로드하지 않습니다.",
            local: `최대 ${markdownToPdfLimits.maxInputChars.toLocaleString()}자, 약 ${markdownToPdfLimits.maxPages}페이지. 이미지는 링크로만 남고 본문에 삽입되지 않습니다. 한글은 기기 시스템 폰트로 그려집니다.`,
            markdown: "Markdown",
            title: "표지 제목 (선택)",
            titlePh: "비우면 본문 첫 제목을 그대로 사용",
            pageSize: "페이지 크기",
            margins: "여백",
            output: "파일명",
            a4: "A4",
            letter: "Letter",
            narrow: "좁게",
            normal: "보통",
            wide: "넓게",
            load: " .md 파일 불러오기",
            sample: "샘플 불러오기",
            clear: "비우기",
            build: "PDF 만들기",
            working: "생성 중...",
            download: "PDF 다운로드",
            chars: "자",
            pages: "페이지",
            empty: "Markdown을 입력하거나 .md 파일을 불러오세요.",
            fileError: "텍스트(.md/.txt) 파일만 불러올 수 있습니다.",
            tooLarge: "파일이 너무 큽니다. 2MB 이하만 지원합니다.",
          }
        : {
            intro:
              "Convert Markdown to PDF in the browser. Headings, lists, quotes, code, and simple tables render locally with no upload.",
            local: `Up to ${markdownToPdfLimits.maxInputChars.toLocaleString()} characters and about ${markdownToPdfLimits.maxPages} pages. Images stay as link text and are not embedded. CJK text uses the device system font.`,
            markdown: "Markdown",
            title: "Cover title (optional)",
            titlePh: "Leave empty to keep the document heading as-is",
            pageSize: "Page size",
            margins: "Margins",
            output: "File name",
            a4: "A4",
            letter: "Letter",
            narrow: "Narrow",
            normal: "Normal",
            wide: "Wide",
            load: "Load .md file",
            sample: "Load sample",
            clear: "Clear",
            build: "Build PDF",
            working: "Building...",
            download: "Download PDF",
            chars: "chars",
            pages: "pages",
            empty: "Paste Markdown or load a .md file.",
            fileError: "Only text (.md/.txt) files are supported.",
            tooLarge: "File is too large. Keep it under 2MB.",
          },
    [locale],
  );

  const charCount = markdown.length;

  async function handleFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setResult(null);
    if (file.size > 2 * 1024 * 1024) {
      setResult({ ok: false, error: t.tooLarge });
      return;
    }
    const isText =
      file.type.startsWith("text/") ||
      /\.(md|markdown|txt)$/i.test(file.name) ||
      file.type === "";
    if (!isText) {
      setResult({ ok: false, error: t.fileError });
      return;
    }
    try {
      const text = await file.text();
      setMarkdown(text);
      setOutputName(sanitizeFileBaseName(file.name, "markdown"));
    } catch {
      setResult({ ok: false, error: t.fileError });
    }
  }

  async function build() {
    if (!markdown.trim()) {
      setResult({ ok: false, error: t.empty });
      return;
    }
    setIsWorking(true);
    setResult(null);
    try {
      const built = await markdownToPdf(markdown, {
        pageSize,
        margins,
        title: title.trim() || undefined,
      });
      setResult({
        ok: true,
        blob: built.blob,
        fileName: `${sanitizeFileBaseName(outputName, "markdown")}.pdf`,
        pageCount: built.pageCount,
        size: built.bytes,
      });
    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof Error ? error.message : t.empty,
      });
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-accent p-4">
        <p className="text-sm leading-relaxed text-muted">{t.intro}</p>
        <p className="mt-2 text-xs leading-relaxed text-fg-3">{t.local}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt,text/markdown,text/plain"
          className="sr-only"
          onChange={(event) => void handleFile(event.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {t.load}
        </button>
        <button
          type="button"
          onClick={() => {
            setMarkdown(locale === "ko" ? SAMPLE_KO : SAMPLE_EN);
            setResult(null);
          }}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {t.sample}
        </button>
        <button
          type="button"
          onClick={() => {
            setMarkdown("");
            setResult(null);
          }}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
        >
          {t.clear}
        </button>
      </div>

      <label className="block">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{t.markdown}</span>
          <span className="font-mono text-xs text-muted">
            {charCount.toLocaleString()} {t.chars}
          </span>
        </div>
        <textarea
          value={markdown}
          onChange={(event) => {
            setMarkdown(event.target.value);
            setResult(null);
          }}
          rows={16}
          spellCheck={false}
          className={`${inputClass} mt-2 font-mono text-[13px] leading-relaxed`}
          placeholder={t.empty}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="block">
          <span className="text-sm font-medium">{t.title}</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t.titlePh}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{t.pageSize}</span>
          <select
            value={pageSize}
            onChange={(event) => setPageSize(event.target.value as MarkdownPdfPageSize)}
            className={inputClass}
          >
            <option value="a4">{t.a4}</option>
            <option value="letter">{t.letter}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">{t.margins}</span>
          <select
            value={margins}
            onChange={(event) => setMargins(event.target.value as MarkdownPdfMargins)}
            className={inputClass}
          >
            <option value="narrow">{t.narrow}</option>
            <option value="normal">{t.normal}</option>
            <option value="wide">{t.wide}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">{t.output}</span>
          <input
            value={outputName}
            onChange={(event) => setOutputName(event.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void build()}
          disabled={isWorking || !markdown.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isWorking ? t.working : t.build}
        </button>
        {result?.ok && (
          <button
            type="button"
            onClick={() => downloadBlob(result.blob, result.fileName)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            {t.download}
          </button>
        )}
      </div>

      {result?.ok && (
        <output className="block rounded-lg border border-border bg-background p-4 text-sm">
          <p className="font-semibold">{result.fileName}</p>
          <p className="mt-1 text-muted">
            {result.pageCount} {t.pages} · {fileSizeLabel(result.size)}
          </p>
        </output>
      )}
      {result && !result.ok && (
        <output className="block rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {result.error}
        </output>
      )}
    </div>
  );
}
