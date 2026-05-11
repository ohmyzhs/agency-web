import type { Post } from "@/lib/post-types";
import { getToolBySlug, getToolContent } from "@/lib/tools";

export type PostsLocale = "ko" | "en";
export type DisplayPostType = "tool-guide" | "retrospective" | "experiment" | "news-note" | "daily";

export function getDisplayPostType(post: Post): DisplayPostType {
  if (post.kind === "guide" && (post.relatedToolSlugs?.length ?? 0) > 0) return "tool-guide";
  if (post.kind === "site-note") return "retrospective";
  if (post.kind === "experiment") return "experiment";
  if (post.kind === "daily") return "daily";
  return "news-note";
}

const typeLabels: Record<PostsLocale, Record<DisplayPostType, string>> = {
  ko: {
    "tool-guide": "툴 상세가이드",
    retrospective: "회고",
    experiment: "실험",
    "news-note": "뉴스/노트",
    daily: "일상",
  },
  en: {
    "tool-guide": "Tool guide",
    retrospective: "Retrospective",
    experiment: "Experiment",
    "news-note": "News / Note",
    daily: "Daily",
  },
};

const categoryLabels: Record<PostsLocale, Record<string, string>> = {
  ko: {
    "korea-living": "한국 생활",
    automation: "자동화",
    developer: "개발자",
    ai: "AI",
    "it-news": "IT 소식",
    daily: "일상",
    culture: "문화",
    experiments: "실험",
    "site-notes": "사이트 기록",
  },
  en: {
    "korea-living": "Korea living",
    automation: "Automation",
    developer: "Developer",
    ai: "AI",
    "it-news": "IT news",
    daily: "Daily",
    culture: "Culture",
    experiments: "Experiments",
    "site-notes": "Site notes",
  },
};

export function getPostTypeLabel(post: Post, locale: PostsLocale) {
  return typeLabels[locale][getDisplayPostType(post)];
}

export function getPostCategoryLabel(category: string, locale: PostsLocale) {
  return categoryLabels[locale][category] ?? category;
}

export function getRelatedToolLabels(post: Post, locale: PostsLocale, limit = 3) {
  return (post.relatedToolSlugs ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getToolBySlug>> => Boolean(tool))
    .slice(0, limit)
    .map((tool) => ({ slug: tool.slug, label: getToolContent(tool, locale).shortTitle }));
}
