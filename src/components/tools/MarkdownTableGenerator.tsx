"use client";

import { useMemo, useState } from "react";

function parseRows(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(line.includes("\t") ? "\t" : ",").map((cell) => cell.trim()));
}

function padCell(cell: string, width: number) {
  return `${cell}${" ".repeat(Math.max(0, width - cell.length))}`;
}

function toMarkdownTable(input: string) {
  const rows = parseRows(input);
  if (!rows.length) return "";
  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalized = rows.map((row) => Array.from({ length: columnCount }, (_, index) => row[index] ?? ""));
  const widths = Array.from({ length: columnCount }, (_, index) => Math.max(3, ...normalized.map((row) => row[index].length)));
  const [header, ...body] = normalized;
  const line = (row: string[]) => `| ${row.map((cell, index) => padCell(cell, widths[index])).join(" | ")} |`;
  const separator = `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`;
  return [line(header), separator, ...body.map(line)].join("\n");
}

export default function MarkdownTableGenerator() {
  const [input, setInput] = useState("Tool,Status,Category\nLLM Cost,Ready,Business\nROI Calculator,Ready,Business");
  const markdown = useMemo(() => toMarkdownTable(input), [input]);

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">CSV or tab-separated rows</span>
        <textarea
          rows={7}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </label>

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
          <span>Markdown table</span>
          <span className="text-muted">{markdown ? `${markdown.split(/\r?\n/).length} lines` : "empty"}</span>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-sm">{markdown || "Paste rows to generate a table."}</pre>
      </div>

      <p className="text-xs text-muted">The first row becomes the header. Use commas for simple CSV or tabs when cell text contains commas.</p>
    </div>
  );
}
