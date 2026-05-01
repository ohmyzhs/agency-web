"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";

function parseRows(input: string): string[][] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(line.includes("\t") ? "\t" : ",").map((cell) => cell.trim()));
}

function padCell(cell: string, width: number) {
  return `${cell}${" ".repeat(Math.max(0, width - cell.length))}`;
}

type ParsedTable = {
  header: string[];
  body: string[][];
};

function buildTable(input: string): { markdown: string; table: ParsedTable | null } {
  const rows = parseRows(input);
  if (!rows.length) return { markdown: "", table: null };
  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalized = rows.map((row) => Array.from({ length: columnCount }, (_, index) => row[index] ?? ""));
  const widths = Array.from({ length: columnCount }, (_, index) => Math.max(3, ...normalized.map((row) => row[index].length)));
  const [header, ...body] = normalized;
  const line = (row: string[]) => `| ${row.map((cell, index) => padCell(cell, widths[index])).join(" | ")} |`;
  const separator = `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`;
  const markdown = [line(header), separator, ...body.map(line)].join("\n");
  return { markdown, table: { header, body } };
}

export default function MarkdownTableGenerator() {
  const { locale } = useLocale();
  const [input, setInput] = useState("Tool,Status,Category\nPyeong Converter,Live,Korea Living\nKST Time,Live,Time & Money\nJSON Validator,Live,Developer");
  const [copied, setCopied] = useState(false);

  const { markdown, table } = useMemo(() => buildTable(input), [input]);

  const onCopy = async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const t = locale === "ko"
    ? { input: "CSV 또는 탭 구분 행", preview: "미리보기", markdown: "마크다운", lines: "줄", empty: "행을 입력하면 표가 생성됩니다.", copy: "복사", copied: "복사됨", note: "첫 행이 헤더가 됩니다. 셀에 쉼표가 포함되면 탭(\\t) 구분을 사용하세요." }
    : { input: "CSV or tab-separated rows", preview: "Preview", markdown: "Markdown", lines: "lines", empty: "Paste rows to generate a table.", copy: "Copy", copied: "Copied", note: "The first row becomes the header. Use commas for simple CSV, or tabs when cell text contains commas." };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">{t.input}</span>
        <textarea
          rows={7}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </label>

      {table && (
        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
            <span>{t.preview}</span>
            <span className="text-muted">{table.body.length + 1} rows</span>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[24rem] border-collapse text-sm">
              <thead>
                <tr>
                  {table.header.map((cell, idx) => (
                    <th
                      key={`${idx}-${cell}`}
                      className="border-b border-border px-3 py-2 text-left font-medium"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.body.map((row, rowIdx) => (
                  <tr key={rowIdx} className="border-b border-border last:border-b-0">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-3 py-2 align-top text-muted">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
          <span>{t.markdown}</span>
          <div className="flex items-center gap-3">
            <span className="text-muted">{markdown ? `${markdown.split(/\r?\n/).length} ${t.lines}` : "empty"}</span>
            <button
              type="button"
              onClick={onCopy}
              disabled={!markdown}
              className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-sm">{markdown || t.empty}</pre>
      </div>

      <p className="text-xs text-muted">{t.note}</p>
    </div>
  );
}
