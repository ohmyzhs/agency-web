import type { Locale } from "./i18n";

export type PostKind =
  | "guide"
  | "news-explainer"
  | "comparison"
  | "workflow"
  | "trend-note"
  | "retrospective"
  | "experiment"
  | "site-note"
  | "release-note"
  | "it-news"
  | "daily"
  | "tool-note";

export type PublicPostCategory =
  | "ai-insight"
  | "practical-guide"
  | "comparison-recommendation"
  | "work-productivity"
  | "digital-trends";

export type LegacyPostCategory =
  | "korea-living"
  | "automation"
  | "developer"
  | "ai"
  | "it-news"
  | "daily"
  | "culture"
  | "experiments"
  | "site-notes"
  | "file-media";

export type PostCategory = PublicPostCategory | LegacyPostCategory;

export type PostInline =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; text: string; href: string };

export type PostTableAlign = "left" | "center" | "right";
export type PostTableCell = { text: string; inline?: PostInline[] };

export type PostBlock =
  | { type: "p"; text: string; inline?: PostInline[] }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[]; inlineItems?: PostInline[][] }
  | { type: "ol"; items: string[]; inlineItems?: PostInline[][] }
  | { type: "callout"; text: string; inline?: PostInline[] }
  | { type: "table"; headers: PostTableCell[]; rows: PostTableCell[][]; align: PostTableAlign[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "code"; code: string; language?: string }
  | { type: "hr" }
  | { type: "button"; text: string; href: string };

export type SourceLink = { label: string; url: string };

export type LocalizedPostContent = {
  title: string;
  description: string;
  body: PostBlock[];
};

export type Post = {
  slug: string;
  kind: PostKind;
  category: PostCategory;
  locale: "ko" | "en" | "both";
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  tags: string[];
  relatedToolSlugs?: string[];
  sourceLinks?: SourceLink[];
  en: LocalizedPostContent;
  ko?: LocalizedPostContent;
};

export const publicPostCategories = [
  "ai-insight",
  "practical-guide",
  "comparison-recommendation",
  "work-productivity",
  "digital-trends",
] as const satisfies readonly PublicPostCategory[];

export function isPublicPostCategory(category: string): category is PublicPostCategory {
  return (publicPostCategories as readonly string[]).includes(category);
}

export function getPostContent(post: Post, locale: Locale): LocalizedPostContent {
  if (locale === "ko" && post.ko) return post.ko;
  return post.en;
}
