import type { Locale } from "./i18n";

export type PostKind =
  | "guide"
  | "it-news"
  | "daily"
  | "tool-note"
  | "experiment"
  | "site-note";

export type PostCategory =
  | "korea-living"
  | "automation"
  | "developer"
  | "ai"
  | "it-news"
  | "daily"
  | "culture"
  | "experiments"
  | "site-notes";

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

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

export function getPostContent(post: Post, locale: Locale): LocalizedPostContent {
  if (locale === "ko" && post.ko) return post.ko;
  return post.en;
}
