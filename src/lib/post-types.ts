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
