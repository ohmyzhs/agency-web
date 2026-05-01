import fs from "node:fs";
import path from "node:path";
import type { Post, PostBlock, PostCategory, PostKind, SourceLink } from "./post-types";
export type { LocalizedPostContent, Post, PostBlock, PostCategory, PostKind, SourceLink } from "./post-types";
export { getPostContent } from "./post-types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .trim();
}

function parseMarkdownBody(markdown: string): PostBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: PostBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "p", text: stripInlineMarkdown(paragraph.join(" ")) });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length > 0) {
      blocks.push({ type: "ul", items: list.map(stripInlineMarkdown) });
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "---") {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("# ")) continue;
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: stripInlineMarkdown(line.slice(3)) });
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: stripInlineMarkdown(line.slice(4)) });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "callout", text: stripInlineMarkdown(line.slice(2)) });
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }
    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  return blocks;
}

function parsePost(filePath: string): Post | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { frontmatter, markdown } = parseFrontmatter(raw);
  if (asString(frontmatter.status, "draft") !== "published") return null;

  const title = asString(frontmatter.title);
  const description = asString(frontmatter.description);
  const slug = asString(frontmatter.slug, path.basename(filePath, ".md"));
  if (!title || !description || !slug) return null;

  const publishedAt = asString(frontmatter.publishedAt, asString(frontmatter.created));
  const updatedAt = asString(frontmatter.updatedAt, asString(frontmatter.updated));
  const readingMinutes = Number(asString(frontmatter.readingMinutes, "4"));

  return {
    slug,
    kind: asString(frontmatter.kind, "guide") as PostKind,
    category: asString(frontmatter.category, "developer") as PostCategory,
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

export function getAllPosts(): Post[] {
  return walkMarkdownFiles(POSTS_DIR)
    .map(parsePost)
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByKind(kind: PostKind): Post[] {
  return getAllPosts().filter((post) => post.kind === kind);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category)
    .slice(0, limit);
}
