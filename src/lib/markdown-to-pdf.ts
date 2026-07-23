import { PDFDocument } from "pdf-lib";

export type MarkdownPdfPageSize = "a4" | "letter";
export type MarkdownPdfMargins = "narrow" | "normal" | "wide";

export type MarkdownToPdfOptions = {
  pageSize?: MarkdownPdfPageSize;
  margins?: MarkdownPdfMargins;
  title?: string;
};

export type MarkdownToPdfResult = {
  blob: Blob;
  pageCount: number;
  bytes: number;
};

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "hr" }
  | { type: "table"; rows: string[][] };

type TextRun = {
  text: string;
  x: number;
  font: string;
  fill: string;
};

type DrawItem =
  | { kind: "space"; height: number }
  | { kind: "hr"; height: number }
  | {
      kind: "band";
      height: number;
      background?: string;
      bar?: { x: number; width: number; color: string };
      runs: TextRun[];
      baseline: number;
    };

const PAGE = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
} as const;

const MARGIN = {
  narrow: 36,
  normal: 54,
  wide: 72,
} as const;

const MAX_INPUT_CHARS = 120_000;
const MAX_PAGES = 40;
const SCALE = 2;

const FONT_STACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';
const MONO_STACK =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

function stripInlineMarkers(raw: string): string {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .trim();
}

function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((cell) => stripInlineMarkers(cell.trim()));
}

function isTableSeparator(line: string): boolean {
  return /^\|?[\s:-]+\|[\s|:-]*\|?$/.test(line.trim());
}

export function parseMarkdownBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (/^```/.test(trimmed)) {
      const fence = trimmed.slice(0, 3);
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith(fence)) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: "code", text: codeLines.join("\n") });
      continue;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      const level = Math.min(trimmed.match(/^#+/)?.[0].length ?? 1, 3) as 1 | 2 | 3;
      const text = stripInlineMarkers(trimmed.replace(/^#{1,3}\s+/, ""));
      blocks.push({ type: `h${level}`, text });
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    if (trimmed.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const rows: string[][] = [parseTableRow(trimmed)];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(parseTableRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(stripInlineMarkers(lines[i].trim().replace(/^>\s?/, "")));
        i += 1;
      }
      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(stripInlineMarkers(lines[i].trim().replace(/^[-*+]\s+/, "")));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(stripInlineMarkers(lines[i].trim().replace(/^\d+\.\s+/, "")));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraph: string[] = [stripInlineMarkers(trimmed)];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,3}\s+/.test(lines[i].trim()) &&
      !/^```/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i].trim()) &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim()) &&
      !(lines[i].includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
    ) {
      paragraph.push(stripInlineMarkers(lines[i].trim()));
      i += 1;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [""];
  const lines: string[] = [];
  let current = "";

  const pushCurrent = () => {
    if (current) {
      lines.push(current);
      current = "";
    }
  };

  for (const word of text.split(/(\s+)/)) {
    if (!word) continue;
    if (/\s+/.test(word) && !current) continue;
    const test = current + word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
      continue;
    }

    if (current) pushCurrent();

    const bare = word.trimStart();
    if (ctx.measureText(bare).width <= maxWidth) {
      current = bare;
      continue;
    }

    let chunk = "";
    for (const char of bare) {
      const next = chunk + char;
      if (ctx.measureText(next).width > maxWidth && chunk) {
        lines.push(chunk);
        chunk = char;
      } else {
        chunk = next;
      }
    }
    current = chunk;
  }

  pushCurrent();
  return lines.length ? lines : [""];
}

function pushWrappedLines(
  items: DrawItem[],
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string,
  fill: string,
  lineHeight: number,
  x = 0,
  background?: string,
) {
  ctx.font = font;
  for (const line of wrapText(ctx, text, maxWidth)) {
    items.push({
      kind: "band",
      height: lineHeight,
      background,
      runs: [{ text: line, x, font, fill }],
      baseline: 2,
    });
  }
}

function buildDrawList(
  ctx: CanvasRenderingContext2D,
  blocks: Block[],
  contentWidth: number,
): DrawItem[] {
  const items: DrawItem[] = [];

  for (const block of blocks) {
    if (block.type === "h1") {
      items.push({ kind: "space", height: 8 });
      pushWrappedLines(items, ctx, block.text, contentWidth, `700 28px ${FONT_STACK}`, "#111827", 36);
      items.push({ kind: "space", height: 8 });
      continue;
    }
    if (block.type === "h2") {
      items.push({ kind: "space", height: 6 });
      pushWrappedLines(items, ctx, block.text, contentWidth, `700 22px ${FONT_STACK}`, "#111827", 30);
      items.push({ kind: "space", height: 6 });
      continue;
    }
    if (block.type === "h3") {
      items.push({ kind: "space", height: 4 });
      pushWrappedLines(items, ctx, block.text, contentWidth, `700 18px ${FONT_STACK}`, "#1f2937", 26);
      items.push({ kind: "space", height: 4 });
      continue;
    }
    if (block.type === "p") {
      pushWrappedLines(items, ctx, block.text, contentWidth, `400 13px ${FONT_STACK}`, "#1f2937", 20);
      items.push({ kind: "space", height: 10 });
      continue;
    }
    if (block.type === "quote") {
      ctx.font = `400 13px ${FONT_STACK}`;
      const lines = wrapText(ctx, block.text, contentWidth - 18);
      lines.forEach((line, index) => {
        items.push({
          kind: "band",
          height: 20,
          background: index === 0 || index === lines.length - 1 ? "#f9fafb" : "#f9fafb",
          bar: { x: 0, width: 3, color: "#9ca3af" },
          runs: [{ text: line, x: 14, font: `400 13px ${FONT_STACK}`, fill: "#4b5563" }],
          baseline: 2,
        });
      });
      items.push({ kind: "space", height: 10 });
      continue;
    }
    if (block.type === "ul" || block.type === "ol") {
      block.items.forEach((item, index) => {
        const bullet = block.type === "ul" ? "•" : `${index + 1}.`;
        ctx.font = `400 13px ${FONT_STACK}`;
        const lines = wrapText(ctx, item, contentWidth - 22);
        lines.forEach((line, lineIndex) => {
          const prefix = lineIndex === 0 ? `${bullet} ` : "   ";
          items.push({
            kind: "band",
            height: 20,
            runs: [{ text: `${prefix}${line}`, x: 8, font: `400 13px ${FONT_STACK}`, fill: "#1f2937" }],
            baseline: 2,
          });
        });
      });
      items.push({ kind: "space", height: 8 });
      continue;
    }
    if (block.type === "code") {
      ctx.font = `400 11.5px ${MONO_STACK}`;
      const rawLines = block.text.length ? block.text.split("\n") : [""];
      const wrapped: string[] = [];
      for (const raw of rawLines) {
        wrapped.push(...wrapText(ctx, raw.length ? raw : " ", contentWidth - 24));
      }
      items.push({ kind: "space", height: 4 });
      items.push({
        kind: "band",
        height: 10,
        background: "#f3f4f6",
        runs: [],
        baseline: 0,
      });
      for (const line of wrapped) {
        items.push({
          kind: "band",
          height: 17,
          background: "#f3f4f6",
          runs: [{ text: line, x: 12, font: `400 11.5px ${MONO_STACK}`, fill: "#111827" }],
          baseline: 2,
        });
      }
      items.push({
        kind: "band",
        height: 10,
        background: "#f3f4f6",
        runs: [],
        baseline: 0,
      });
      items.push({ kind: "space", height: 10 });
      continue;
    }
    if (block.type === "hr") {
      items.push({ kind: "space", height: 6 });
      items.push({ kind: "hr", height: 12 });
      items.push({ kind: "space", height: 6 });
      continue;
    }
    if (block.type === "table") {
      const colCount = Math.max(...block.rows.map((row) => row.length), 1);
      const colWidth = contentWidth / colCount;
      for (const [rowIndex, row] of block.rows.entries()) {
        const cells = Array.from({ length: colCount }, (_, idx) => row[idx] ?? "");
        const font = rowIndex === 0 ? `700 12px ${FONT_STACK}` : `400 12px ${FONT_STACK}`;
        ctx.font = font;
        const cellLines = cells.map((cell) => wrapText(ctx, cell, colWidth - 12));
        const lineCount = Math.max(...cellLines.map((lines) => lines.length), 1);
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
          const runs: TextRun[] = [];
          for (let col = 0; col < colCount; col += 1) {
            const text = cellLines[col][lineIndex] ?? "";
            runs.push({
              text,
              x: col * colWidth + 6,
              font,
              fill: "#111827",
            });
          }
          items.push({
            kind: "band",
            height: lineIndex === 0 ? 20 : 16,
            background: rowIndex === 0 ? "#f3f4f6" : undefined,
            runs,
            baseline: 3,
          });
        }
        items.push({ kind: "hr", height: 8 });
      }
      items.push({ kind: "space", height: 8 });
    }
  }

  return items;
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("PNG export failed"))), "image/png");
  });
  return new Uint8Array(await blob.arrayBuffer());
}

export async function markdownToPdf(
  markdown: string,
  options: MarkdownToPdfOptions = {},
): Promise<MarkdownToPdfResult> {
  if (typeof document === "undefined") {
    throw new Error("Markdown to PDF runs in the browser only.");
  }

  const input = markdown ?? "";
  if (!input.trim()) {
    throw new Error("Markdown is empty.");
  }
  if (input.length > MAX_INPUT_CHARS) {
    throw new Error(`Markdown is too long (max ${MAX_INPUT_CHARS.toLocaleString()} characters).`);
  }

  const pageSize = options.pageSize ?? "a4";
  const margins = options.margins ?? "normal";
  const { width: pageWidth, height: pageHeight } = PAGE[pageSize];
  const margin = MARGIN[margins];
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) throw new Error("Canvas is unavailable.");

  const blocks = parseMarkdownBlocks(input);
  if (options.title?.trim()) {
    blocks.unshift({ type: "h1", text: options.title.trim() });
  }

  const drawItems = buildDrawList(measureCtx, blocks, contentWidth);
  if (!drawItems.length) {
    throw new Error("Nothing to render.");
  }

  type PageSlice = { items: DrawItem[] };
  const pages: PageSlice[] = [];
  let current: DrawItem[] = [];
  let used = 0;

  const flush = () => {
    if (!current.length) return;
    pages.push({ items: current });
    current = [];
    used = 0;
  };

  for (const item of drawItems) {
    if (used + item.height > contentHeight && current.length) flush();
    current.push(item);
    used += item.height;
    if (pages.length + 1 > MAX_PAGES) {
      throw new Error(`PDF would exceed ${MAX_PAGES} pages. Shorten the Markdown.`);
    }
  }
  flush();

  if (!pages.length) throw new Error("Nothing to render.");

  const pdf = await PDFDocument.create();

  for (const page of pages) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(pageWidth * SCALE);
    canvas.height = Math.floor(pageHeight * SCALE);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable.");
    ctx.scale(SCALE, SCALE);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageWidth, pageHeight);

    let y = margin;
    for (const item of page.items) {
      if (item.kind === "space") {
        y += item.height;
        continue;
      }
      if (item.kind === "hr") {
        ctx.strokeStyle = "#d1d5db";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin, y + item.height / 2);
        ctx.lineTo(pageWidth - margin, y + item.height / 2);
        ctx.stroke();
        y += item.height;
        continue;
      }

      if (item.background) {
        ctx.fillStyle = item.background;
        ctx.fillRect(margin, y, contentWidth, item.height);
      }
      if (item.bar) {
        ctx.fillStyle = item.bar.color;
        ctx.fillRect(margin + item.bar.x, y, item.bar.width, item.height);
      }
      ctx.textBaseline = "top";
      for (const run of item.runs) {
        ctx.font = run.font;
        ctx.fillStyle = run.fill;
        ctx.fillText(run.text, margin + run.x, y + item.baseline);
      }
      y += item.height;
    }

    const pngBytes = await canvasToPngBytes(canvas);
    const image = await pdf.embedPng(pngBytes);
    const pdfPage = pdf.addPage([pageWidth, pageHeight]);
    pdfPage.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });
  }

  const saved = await pdf.save();
  const blob = new Blob([Uint8Array.from(saved)], { type: "application/pdf" });
  return { blob, pageCount: pages.length, bytes: blob.size };
}

export const markdownToPdfLimits = {
  maxInputChars: MAX_INPUT_CHARS,
  maxPages: MAX_PAGES,
};
