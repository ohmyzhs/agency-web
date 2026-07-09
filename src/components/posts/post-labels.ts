import type { Post, PostCategory, PostKind, PublicPostCategory } from "@/lib/post-types";
import { isNewsPost } from "@/lib/post-types";
import { getToolBySlug, getToolContent } from "@/lib/tools";

export type PostsLocale = "ko" | "en";
export type DisplayPostType = "guide" | "news-explainer" | "comparison" | "workflow" | "trend" | "retrospective" | "experiment" | "daily" | "update";

/** Categories shown on /posts (blog archive). Daily/news live under /news. */
export const publicCategoryOrder = [
  "ai-insight",
  "practical-guide",
  "comparison-recommendation",
  "work-productivity",
  "digital-trends",
] as const satisfies readonly PublicPostCategory[];

/** Categories shown on /news. */
export const newsCategoryOrder = [
  "news-ai-insight",
  "news-general",
  "news-economy",
] as const satisfies readonly PublicPostCategory[];

export function normalizePostCategory(category: PostCategory, kind?: PostKind): PublicPostCategory {
  if (category === "news-ai-insight" || category === "news-general" || category === "news-economy") {
    return category;
  }
  if (category === "daily-issue" || kind === "daily") return "news-ai-insight";
  if (
    category === "ai-insight"
    || category === "practical-guide"
    || category === "comparison-recommendation"
    || category === "work-productivity"
    || category === "digital-trends"
  ) {
    return category;
  }
  if (kind === "comparison") return "comparison-recommendation";
  if (kind === "workflow") return "work-productivity";
  if (kind === "trend-note" || kind === "it-news" || kind === "news-explainer") return "digital-trends";
  if (kind === "site-note" || kind === "release-note" || kind === "experiment") return "digital-trends";

  switch (category) {
    case "ai":
      return "ai-insight";
    case "automation":
      return "work-productivity";
    case "it-news":
    case "culture":
    case "experiments":
    case "site-notes":
    case "daily":
      return "digital-trends";
    case "korea-living":
    case "developer":
    case "file-media":
    default:
      return "practical-guide";
  }
}

export function getDisplayPostType(post: Post): DisplayPostType {
  if (post.kind === "release-note") return "update";
  if (post.kind === "comparison") return "comparison";
  if (post.kind === "workflow") return "workflow";
  if (post.kind === "trend-note" || post.kind === "it-news") return "trend";
  if (post.kind === "news-explainer") return "news-explainer";
  if (post.kind === "retrospective" || post.kind === "site-note") return "retrospective";
  if (post.kind === "experiment") return "experiment";
  if (post.kind === "daily") return "daily";
  return "guide";
}

const typeLabels: Record<PostsLocale, Record<DisplayPostType, string>> = {
  ko: {
    guide: "실용 가이드",
    "news-explainer": "뉴스 해설",
    comparison: "비교·추천",
    workflow: "업무 흐름",
    trend: "트렌드 노트",
    retrospective: "제작 기록",
    experiment: "실험",
    daily: "데일리 뉴스",
    update: "업데이트",
  },
  en: {
    guide: "Guide",
    "news-explainer": "News explainer",
    comparison: "Comparison",
    workflow: "Workflow",
    trend: "Trend note",
    retrospective: "Build note",
    experiment: "Experiment",
    daily: "Daily news",
    update: "Update",
  },
};

const categoryLabels: Record<PostsLocale, Record<string, string>> = {
  ko: {
    "ai-insight": "AI 인사이트",
    "practical-guide": "실용 가이드",
    "comparison-recommendation": "비교·추천",
    "work-productivity": "업무 생산성",
    "digital-trends": "디지털 트렌드",
    "daily-issue": "AI 인사이트",
    "news-ai-insight": "AI 인사이트",
    "news-general": "일반",
    "news-economy": "경제",
    "korea-living": "한국 생활",
    automation: "자동화",
    developer: "개발자",
    ai: "AI",
    "it-news": "IT 소식",
    daily: "일상",
    culture: "문화",
    experiments: "실험",
    "site-notes": "사이트 기록",
    "file-media": "파일·미디어",
  },
  en: {
    "ai-insight": "AI insight",
    "practical-guide": "Practical guide",
    "comparison-recommendation": "Comparisons",
    "work-productivity": "Work productivity",
    "digital-trends": "Digital trends",
    "daily-issue": "AI insight",
    "news-ai-insight": "AI insight",
    "news-general": "General",
    "news-economy": "Economy",
    "korea-living": "Korea living",
    automation: "Automation",
    developer: "Developer",
    ai: "AI",
    "it-news": "IT news",
    daily: "Daily",
    culture: "Culture",
    experiments: "Experiments",
    "site-notes": "Site notes",
    "file-media": "File / media",
  },
};

export function getPostTypeLabel(post: Post, locale: PostsLocale) {
  return typeLabels[locale][getDisplayPostType(post)];
}

export function getPostCategoryLabel(category: string, locale: PostsLocale) {
  return categoryLabels[locale][category] ?? category;
}

export function getPublicPostCategoryLabel(category: PostCategory, locale: PostsLocale, kind?: PostKind) {
  return getPostCategoryLabel(normalizePostCategory(category, kind), locale);
}

export function getRelatedToolLabels(post: Post, locale: PostsLocale, limit = 3) {
  return (post.relatedToolSlugs ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getToolBySlug>> => Boolean(tool))
    .slice(0, limit)
    .map((tool) => ({ slug: tool.slug, label: getToolContent(tool, locale).shortTitle }));
}

export function isNewsArchivePost(post: Post): boolean {
  return isNewsPost(post);
}
