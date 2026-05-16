import * as fs from "node:fs";
import * as path from "node:path";
import type { Post, PostBlock, PostCategory, PostInline, PostKind, PostTableAlign, PostTableCell, SourceLink } from "./post-types";
export type { LocalizedPostContent, Post, PostBlock, PostCategory, PostInline, PostKind, SourceLink } from "./post-types";
export { getPostContent } from "./post-types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const UPDATES_DIR = path.join(process.cwd(), "content", "updates");

type FrontmatterValue = string | string[] | Record<string, string>[];
type Frontmatter = Record<string, FrontmatterValue>;

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdownFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".md")) return [fullPath];
    return [];
  });
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; markdown: string } {
  if (!raw.startsWith("---")) return { frontmatter: {}, markdown: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: {}, markdown: raw };
  const yaml = raw.slice(3, end).trim();
  const markdown = raw.slice(end + 4).trim();
  const frontmatter: Frontmatter = {};
  const lines = yaml.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.startsWith(" ")) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, inlineValue] = match;
    const value = inlineValue.trim();

    if (value === "[]") {
      frontmatter[key] = [];
      continue;
    }

    if (value) {
      frontmatter[key] = value.replace(/^['"]|['"]$/g, "");
      continue;
    }

    const list: string[] = [];
    const objectList: Record<string, string>[] = [];
    while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1])) {
      index += 1;
      const itemLine = lines[index].trim().slice(2).trim();
      const objectMatch = itemLine.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (objectMatch) {
        const item: Record<string, string> = {
          [objectMatch[1]]: objectMatch[2].replace(/^['"]|['"]$/g, ""),
        };
        while (index + 1 < lines.length && /^\s{4}[A-Za-z0-9_-]+:/.test(lines[index + 1])) {
          index += 1;
          const nestedMatch = lines[index].trim().match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
          if (nestedMatch) item[nestedMatch[1]] = nestedMatch[2].replace(/^['"]|['"]$/g, "");
        }
        objectList.push(item);
      } else {
        list.push(itemLine.replace(/^['"]|['"]$/g, ""));
      }
    }
    frontmatter[key] = objectList.length > 0 ? objectList : list;
  }

  return { frontmatter, markdown };
}

function asString(value: FrontmatterValue | undefined, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: FrontmatterValue | undefined): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function asSourceLinks(value: FrontmatterValue | undefined): SourceLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, string> => typeof item === "object" && !Array.isArray(item))
    .map((item) => ({ label: item.label ?? item.title ?? item.url ?? "Source", url: item.url ?? "" }))
    .filter((item) => item.url);
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/^\|(.+)\|$/g, "$1")
    .trim();
}

function normalizeInlineMarkdown(text: string): string {
  return text.replace(/^\|(.+)\|$/g, "$1").trim();
}

function parseInlineMarkdown(text: string): PostInline[] {
  const normalized = normalizeInlineMarkdown(text);
  const parts: PostInline[] = [];
  const inlinePattern = /(`([^`]+)`)|\*\*([^*]+)\*\*|__([^_]+)__|(?<!\*)\*([^*]+)\*(?!\*)|\[([^\]]+)\]\(([^)]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(normalized)) !== null) {
    if (match.index > cursor) {
      parts.push({ type: "text", text: normalized.slice(cursor, match.index) });
    }

    if (match[2]) parts.push({ type: "code", text: match[2] });
    else if (match[3] || match[4]) parts.push({ type: "strong", text: match[3] ?? match[4] });
    else if (match[5]) parts.push({ type: "em", text: match[5] });
    else if (match[6] && match[7]) parts.push({ type: "link", text: stripInlineMarkdown(match[6]), href: match[7] });

    cursor = match.index + match[0].length;
  }

  if (cursor < normalized.length) {
    parts.push({ type: "text", text: normalized.slice(cursor) });
  }

  return parts.length > 0 ? parts : [{ type: "text", text: normalized }];
}

function inlinePlainText(inline: PostInline[]): string {
  return inline.map((part) => part.text).join("").trim();
}

function buildDescription(markdown: string, fallbackTitle: string): string {
  const paragraph = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && !line.startsWith("-") && !line.startsWith(">") && !line.startsWith("|") && !line.startsWith("!"));
  const description = stripInlineMarkdown(paragraph ?? fallbackTitle);
  return description.length > 160 ? `${description.slice(0, 157)}...` : description;
}

function parseImageMarkdown(line: string): { alt: string; src: string; caption?: string } | null {
  const match = line.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]+)")?\)$/);
  if (!match) return null;
  return { alt: match[1], src: match[2], caption: match[3] };
}

function parseButtonMarkdown(line: string): { text: string; href: string } | null {
  const match = line.match(/^\[!button\s+([^\]]+)\]\(([^)]+)\)$/i) ?? line.match(/^\[([^\]]+)\]\(([^)]+)\)\{\.button\}$/i);
  if (!match) return null;
  return { text: stripInlineMarkdown(match[1]).trim(), href: match[2].trim() };
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableRow(line: string): boolean {
  return /^\|.*\|$/.test(line.trim());
}

function isTableSeparator(line: string): boolean {
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function parseTableAlign(separatorLine: string): PostTableAlign[] {
  return splitTableRow(separatorLine).map((cell) => {
    const trimmed = cell.trim();
    if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
    if (trimmed.endsWith(":")) return "right";
    return "left";
  });
}

function tableCell(text: string): PostTableCell {
  const inline = parseInlineMarkdown(text);
  return { text: inlinePlainText(inline), inline };
}

function parseMarkdownBody(markdown: string): PostBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: PostBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let orderedList: string[] = [];
  let codeFence: { language?: string; lines: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      const inline = parseInlineMarkdown(paragraph.join(" "));
      blocks.push({ type: "p", text: inlinePlainText(inline), inline });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length > 0) {
      const inlineItems = list.map(parseInlineMarkdown);
      blocks.push({ type: "ul", items: inlineItems.map(inlinePlainText), inlineItems });
      list = [];
    }
  };
  const flushOrderedList = () => {
    if (orderedList.length > 0) {
      const inlineItems = orderedList.map(parseInlineMarkdown);
      blocks.push({ type: "ol", items: inlineItems.map(inlinePlainText), inlineItems });
      orderedList = [];
    }
  };
  const flushLists = () => {
    flushList();
    flushOrderedList();
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    const fenceMatch = line.match(/^```\s*([A-Za-z0-9_-]+)?\s*$/);
    if (fenceMatch) {
      if (codeFence) {
        blocks.push({ type: "code", code: codeFence.lines.join("\n"), language: codeFence.language });
        codeFence = null;
      } else {
        flushParagraph();
        flushLists();
        codeFence = { language: fenceMatch[1], lines: [] };
      }
      continue;
    }

    if (codeFence) {
      codeFence.lines.push(rawLine);
      continue;
    }

    if (!line) {
      flushParagraph();
      flushLists();
      continue;
    }

    if (line === "---" || line === "***" || line === "___") {
      flushParagraph();
      flushLists();
      blocks.push({ type: "hr" });
      continue;
    }

    if (line.startsWith("# ")) continue;
    if (line.startsWith("## ")) {
      flushParagraph();
      flushLists();
      blocks.push({ type: "h2", text: stripInlineMarkdown(line.slice(3)) });
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushLists();
      blocks.push({ type: "h3", text: stripInlineMarkdown(line.slice(4)) });
      continue;
    }
    if (isTableRow(line) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      flushParagraph();
      flushLists();
      const headers = splitTableRow(line).map(tableCell);
      const align = parseTableAlign(lines[index + 1]);
      const rows: PostTableCell[][] = [];
      index += 2;
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(splitTableRow(lines[index]).map(tableCell));
        index += 1;
      }
      index -= 1;
      blocks.push({ type: "table", headers, rows, align });
      continue;
    }
    const image = parseImageMarkdown(line);
    if (image) {
      flushParagraph();
      flushLists();
      blocks.push({ type: "image", ...image });
      continue;
    }
    const button = parseButtonMarkdown(line);
    if (button) {
      flushParagraph();
      flushLists();
      blocks.push({ type: "button", ...button });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushLists();
      const inline = parseInlineMarkdown(line.slice(2));
      blocks.push({ type: "callout", text: inlinePlainText(inline), inline });
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      flushOrderedList();
      list.push(line.slice(2));
      continue;
    }
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushList();
      orderedList.push(orderedMatch[1]);
      continue;
    }
    flushLists();
    paragraph.push(line);
  }
  flushParagraph();
  flushLists();
  if (codeFence) blocks.push({ type: "code", code: codeFence.lines.join("\n"), language: codeFence.language });
  return blocks;
}

function parsePost(filePath: string): Post | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, markdown } = parseFrontmatter(raw);
  if (asString(frontmatter.status, "draft") !== "published") return null;

  const title = asString(frontmatter.title);
  const slug = asString(frontmatter.slug, path.basename(filePath, ".md"));
  const description = asString(frontmatter.description, buildDescription(markdown, title));
  if (!title || !description || !slug) return null;

  const publishedAt = asString(frontmatter.publishedAt, asString(frontmatter.created));
  const updatedAt = asString(frontmatter.updatedAt, asString(frontmatter.updated));
  const readingMinutes = Number(asString(frontmatter.readingMinutes, "4"));

  return {
    slug,
    kind: asString(frontmatter.kind, "guide") as PostKind,
    category: asString(frontmatter.category, "practical-guide") as PostCategory,
    locale: asString(frontmatter.locale, "ko") as Post["locale"],
    publishedAt,
    updatedAt: updatedAt || undefined,
    readingMinutes: Number.isFinite(readingMinutes) ? readingMinutes : 4,
    tags: asStringArray(frontmatter.tags),
    relatedToolSlugs: asStringArray(frontmatter.related_tools),
    sourceLinks: asSourceLinks(frontmatter.sourceLinks),
    en: { title, description, body: parseMarkdownBody(markdown) },
    ko: { title, description, body: parseMarkdownBody(markdown) },
  };
}

function getPublishedFromDir(dir: string): Post[] {
  return walkMarkdownFiles(dir)
    .map(parsePost)
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getAllPosts(): Post[] {
  return getPublishedFromDir(POSTS_DIR);
}

export function getAllUpdates(): Post[] {
  return getPublishedFromDir(UPDATES_DIR).filter((post) => post.kind === "release-note" || post.kind === "site-note");
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByKind(kind: PostKind): Post[] {
  return getAllPosts().filter((post) => post.kind === kind);
}

export function getPostsByRelatedTool(toolSlug: string, limit?: number): Post[] {
  const matches = getAllPosts().filter((post) => post.relatedToolSlugs?.includes(toolSlug));
  return typeof limit === "number" ? matches.slice(0, limit) : matches;
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const toolSlugs = post.relatedToolSlugs ?? [];
  return getAllPosts()
    .filter((candidate) => {
      if (candidate.slug === post.slug) return false;
      if (toolSlugs.length > 0 && candidate.relatedToolSlugs?.some((slug) => toolSlugs.includes(slug))) return true;
      return candidate.category === post.category;
    })
    .slice(0, limit);
}
