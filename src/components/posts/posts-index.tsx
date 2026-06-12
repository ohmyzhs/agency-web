"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import { PostCard } from "@/components/posts/post-card";
import { comparePostsNewestFirst, comparePostsOldestFirst, filterPostsForLocale, getPostContent, type Post } from "@/lib/post-types";
import {
  getDisplayPostType,
  getPostCategoryLabel,
  getPostTypeLabel,
  getPublicPostCategoryLabel,
  getRelatedToolLabels,
  normalizePostCategory,
  publicCategoryOrder,
  type DisplayPostType,
} from "@/components/posts/post-labels";

const allTypes = ["guide", "news-explainer", "comparison", "workflow", "trend", "retrospective", "experiment"] as const;
type TypeFilter = "all" | DisplayPostType;
type SortMode = "newest" | "oldest" | "reading";
type CategoryFilter = "all" | string;
type ToolFilter = "all" | string;

export type PostsIndexInitialFilters = {
  type?: string;
  category?: string;
  tool?: string;
  q?: string;
  sort?: string;
};

function coerceTypeFilter(value?: string): TypeFilter {
  if (value && allTypes.includes(value as Exclude<DisplayPostType, "update">)) return value as DisplayPostType;
  return "all";
}

function coerceSortMode(value?: string): SortMode {
  if (value === "oldest" || value === "reading") return value;
  return "newest";
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

type CategoryQuickItem = {
  value: CategoryFilter;
  label: string;
  count: number;
  hasNew: boolean;
};

const newBadgeWindowMs = 1000 * 60 * 60 * 24 * 7;

function parsePostTime(post: Post) {
  const value = post.sortAt || post.publishedAt;
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function MobileCategoryQuickMenu({
  items,
  active,
  locale,
  onSelect,
}: {
  items: CategoryQuickItem[];
  active: CategoryFilter;
  locale: "ko" | "en";
  onSelect: (category: CategoryFilter) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 min-[1480px]:hidden">
      {open && (
        <nav
          className="mb-3 w-[min(21rem,calc(100vw-2rem))] rounded-3xl border border-border bg-background/96 p-3 shadow-[0_20px_70px_rgba(15,23,42,0.22)] backdrop-blur-xl"
          aria-label={locale === "ko" ? "모바일 카테고리 빠른 이동" : "Mobile category quick navigation"}
        >
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/70">
                {locale === "ko" ? "카테고리" : "Categories"}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-muted/60">
                {locale === "ko" ? "빠른 이동" : "Quick menu"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-sm font-black text-muted"
              aria-label={locale === "ko" ? "퀵메뉴 닫기" : "Close quick menu"}
            >
              ×
            </button>
          </div>

          <div className="space-y-1.5">
            {items.map((item) => {
              const selected = active === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onSelect(item.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left transition-colors ${selected ? "bg-primary text-white" : "text-muted hover:bg-card hover:text-foreground"}`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border text-[12px] ${selected ? "border-white/30 bg-white/15" : "border-border bg-card text-muted/55"}`}>
                    ▤
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-extrabold">{item.label}</span>
                  {item.hasNew && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${selected ? "bg-white text-primary" : "bg-primary/10 text-primary"}`}>
                      new
                    </span>
                  )}
                  <span className={`font-mono text-[11px] font-bold ${selected ? "text-white/75" : "text-muted/45"}`}>{item.count}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-border bg-foreground px-4 py-3 text-xs font-black uppercase tracking-widest text-background shadow-[0_14px_38px_rgba(15,23,42,0.28)]"
        aria-expanded={open}
        aria-label={locale === "ko" ? "카테고리 퀵메뉴 열기" : "Open category quick menu"}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/15">▤</span>
        {locale === "ko" ? "글 메뉴" : "Posts"}
      </button>
    </div>
  );
}

function DesktopCategoryQuickMenu({
  items,
  active,
  locale,
  onSelect,
}: {
  items: CategoryQuickItem[];
  active: CategoryFilter;
  locale: "ko" | "en";
  onSelect: (category: CategoryFilter) => void;
}) {
  return (
    <aside className="fixed top-32 right-[max(1rem,calc((100vw-72rem)/2-17rem))] z-40 hidden w-60 min-[1480px]:block">
      <div className="rounded-3xl border border-border bg-background/92 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/70">
              {locale === "ko" ? "카테고리" : "Categories"}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-muted/60">
              {locale === "ko" ? "빠른 이동" : "Quick menu"}
            </p>
          </div>
          <span className="rounded-full border border-border bg-card px-2 py-1 font-mono text-[10px] font-bold text-muted/55">
            {items[0]?.count ?? 0}
          </span>
        </div>

        <div className="space-y-1.5">
          {items.map((item) => {
            const selected = active === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onSelect(item.value)}
                className={`group flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left transition-colors ${selected ? "bg-primary text-white" : "text-muted hover:bg-card hover:text-foreground"}`}
              >
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xl border text-[12px] ${selected ? "border-white/30 bg-white/15" : "border-border bg-card text-muted/55 group-hover:text-primary"}`}>
                  ▤
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-extrabold">
                  {item.label}
                </span>
                {item.hasNew && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${selected ? "bg-white text-primary" : "bg-primary/10 text-primary"}`}>
                    new
                  </span>
                )}
                <span className={`font-mono text-[11px] font-bold ${selected ? "text-white/75" : "text-muted/45"}`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 rounded-2xl border border-dashed border-border bg-card/55 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted/45">
            {locale === "ko" ? "프로모션 슬롯" : "Promo slot"}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted/55">
            {locale === "ko" ? "나중에 배너나 추천 링크를 넣기 좋은 자리입니다." : "Reserved for a future banner or recommended link."}
          </p>
        </div>
      </div>
    </aside>
  );
}

export function PostsIndex({ posts, initialFilters = {} }: { posts: Post[]; initialFilters?: PostsIndexInitialFilters }) {
  const { locale } = useLocale();
  const localizedPosts = useMemo(() => filterPostsForLocale(posts, locale), [posts, locale]);
  const availableCategories = useMemo(() => {
    const present = new Set(localizedPosts.map((post) => normalizePostCategory(post.category, post.kind)));
    return publicCategoryOrder.filter((category) => present.has(category));
  }, [localizedPosts]);

  const availableTools = useMemo(
    () => uniqueSorted(localizedPosts.flatMap((post) => post.relatedToolSlugs ?? [])),
    [localizedPosts],
  );

  const [typeFilter, setTypeFilter] = useState<TypeFilter>(() => coerceTypeFilter(initialFilters.type));
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(() => (
    initialFilters.category && localizedPosts.some((post) => normalizePostCategory(post.category, post.kind) === initialFilters.category)
      ? initialFilters.category
      : "all"
  ));
  const [toolFilter, setToolFilter] = useState<ToolFilter>(() => (
    initialFilters.tool && availableTools.includes(initialFilters.tool)
      ? initialFilters.tool
      : "all"
  ));
  const [sortMode, setSortMode] = useState<SortMode>(() => coerceSortMode(initialFilters.sort));
  const [query, setQuery] = useState(() => initialFilters.q ?? "");

  const searchablePosts = useMemo(() => localizedPosts.map((post) => {
    const content = getPostContent(post, locale);
    const publicCategory = normalizePostCategory(post.category, post.kind);
    const relatedTools = getRelatedToolLabels(post, locale, 10);
    const haystack = [
      content.title,
      content.description,
      post.kind,
      post.category,
      publicCategory,
      getPostCategoryLabel(post.category, locale),
      getPublicPostCategoryLabel(post.category, locale, post.kind),
      getPostTypeLabel(post, locale),
      ...post.tags,
      ...(post.relatedToolSlugs ?? []),
      ...relatedTools.map((tool) => tool.label),
    ].join(" ").toLowerCase();
    return { post, content, publicCategory, haystack };
  }), [localizedPosts, locale]);

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return searchablePosts
      .filter(({ post, publicCategory, haystack }) => {
        if (getDisplayPostType(post) === "update") return false;
        if (typeFilter !== "all" && getDisplayPostType(post) !== typeFilter) return false;
        if (categoryFilter !== "all" && publicCategory !== categoryFilter) return false;
        if (toolFilter !== "all" && !(post.relatedToolSlugs ?? []).includes(toolFilter)) return false;
        if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
        return true;
      })
      .map(({ post }) => post)
      .sort((a, b) => {
        if (sortMode === "oldest") return comparePostsOldestFirst(a, b);
        if (sortMode === "reading") return b.readingMinutes - a.readingMinutes;
        return comparePostsNewestFirst(a, b);
      });
  }, [searchablePosts, typeFilter, categoryFilter, toolFilter, query, sortMode]);

  const categoryQuickItems = useMemo<CategoryQuickItem[]>(() => {
    const postsForMenu = localizedPosts.filter((post) => getDisplayPostType(post) !== "update");
    const newestTime = postsForMenu.reduce((latest, post) => Math.max(latest, parsePostTime(post)), 0);
    const isNewPost = (post: Post) => newestTime > 0 && newestTime - parsePostTime(post) <= newBadgeWindowMs;
    const allItem: CategoryQuickItem = {
      value: "all",
      label: locale === "ko" ? "전체보기" : "All posts",
      count: postsForMenu.length,
      hasNew: postsForMenu.some(isNewPost),
    };

    const categoryItems = availableCategories.map((category) => {
      const categoryPosts = postsForMenu.filter((post) => normalizePostCategory(post.category, post.kind) === category);
      return {
        value: category,
        label: getPostCategoryLabel(category, locale),
        count: categoryPosts.length,
        hasNew: categoryPosts.some(isNewPost),
      };
    });

    return [allItem, ...categoryItems];
  }, [availableCategories, localizedPosts, locale]);

  const selectQuickCategory = (category: CategoryFilter) => {
    setCategoryFilter(category);
    setTypeFilter("all");
    setToolFilter("all");
    setSortMode("newest");
    setQuery("");
  };

  const eyebrow = locale === "ko" ? "// AI 운영 블로그" : "// AI-operated blog";
  const title = locale === "ko" ? "AI와 실무를 연결하는 글" : "Posts for AI and practical work";
  const lead =
    locale === "ko"
      ? "최신 AI 뉴스 해설, 실용 가이드, 비교·추천, 업무 자동화와 디지털 트렌드를 한 곳에서 정리합니다. 모든 글은 출처와 맥락을 바탕으로 AI 편집 시스템의 관점에서 작성됩니다."
      : "AI explainers, practical guides, comparisons, productivity workflows, and digital trend notes from an AI-operated editorial system.";

  const allLabel = locale === "ko" ? "전체" : "All";
  const typeOptions: { value: TypeFilter; label: string }[] = [
    { value: "all", label: allLabel },
    ...allTypes
      .filter((type) => localizedPosts.some((post) => getDisplayPostType(post) === type))
      .map((type) => ({
        value: type,
        label: locale === "ko"
          ? ({ guide: "가이드", "news-explainer": "뉴스 해설", comparison: "비교", workflow: "워크플로우", trend: "트렌드", retrospective: "제작 기록", experiment: "실험" }[type])
          : ({ guide: "Guides", "news-explainer": "Explainers", comparison: "Comparisons", workflow: "Workflows", trend: "Trends", retrospective: "Build notes", experiment: "Experiments" }[type]),
      })),
  ];

  const featuredPosts = localizedPosts
    .filter((post) => getDisplayPostType(post) !== "update")
    .filter((post) => getDisplayPostType(post) === "guide" || getDisplayPostType(post) === "retrospective")
    .slice(0, 3);

  const resetFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setToolFilter("all");
    setSortMode("newest");
    setQuery("");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <section className="mb-12">
        <p className="zhs-eyebrow text-primary/60">{eyebrow}</p>
        <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl text-gradient">{title}</h1>
        <p className="mt-8 max-w-3xl text-xl text-muted leading-relaxed">{lead}</p>
      </section>

      {featuredPosts.length > 0 && (
        <section className="mb-12 rounded-3xl border border-border bg-card/50 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted/70">
              {locale === "ko" ? "먼저 읽기 좋은 글" : "Featured posts"}
            </h2>
            <span className="font-mono text-[11px] text-muted/40">{localizedPosts.length} posts</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredPosts.map((post) => {
              const content = getPostContent(post, locale);
              return (
                <button
                  key={post.slug}
                  type="button"
                  onClick={() => {
                    setTypeFilter(getDisplayPostType(post));
                    setCategoryFilter("all");
                    setToolFilter("all");
                    setQuery(content.title);
                  }}
                  className="rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-primary"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    {getPostTypeLabel(post, locale)}
                  </span>
                  <span className="mt-2 block line-clamp-2 text-sm font-extrabold leading-tight text-foreground">
                    {content.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-10 rounded-3xl border border-border bg-background/80 p-4 md:p-5" aria-label={locale === "ko" ? "글 필터" : "Post filters"}>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_160px]">
          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "검색" : "Search"}
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === "ko" ? "제목, 태그, 관련 툴 검색" : "Search title, tags, tools"}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium outline-none transition-colors placeholder:text-muted/40 focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "카테고리" : "Category"}
            </span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="all">{locale === "ko" ? "전체 카테고리" : "All categories"}</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>{getPostCategoryLabel(category, locale)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "관련 툴" : "Related tool"}
            </span>
            <select
              value={toolFilter}
              onChange={(event) => setToolFilter(event.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="all">{locale === "ko" ? "전체 툴" : "All tools"}</option>
              {availableTools.map((slug) => {
                const pseudoPost = { relatedToolSlugs: [slug] } as Post;
                const label = getRelatedToolLabels(pseudoPost, locale, 1)[0]?.label ?? slug;
                return <option key={slug} value={slug}>{label}</option>;
              })}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-muted/60">
              {locale === "ko" ? "정렬" : "Sort"}
            </span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="w-full rounded-2xl border border-border bg-card px-3 py-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="newest">{locale === "ko" ? "최신순" : "Newest"}</option>
              <option value="oldest">{locale === "ko" ? "오래된순" : "Oldest"}</option>
              <option value="reading">{locale === "ko" ? "긴 글 우선" : "Reading time"}</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SegmentedTabs<TypeFilter>
            ariaLabel={locale === "ko" ? "글 유형 필터" : "Post type filter"}
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
            size="sm"
          />
          <div className="flex items-center gap-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted/50">
              {locale === "ko" ? `${visiblePosts.length}개 결과` : `${visiblePosts.length} results`}
            </p>
            {(query || typeFilter !== "all" || categoryFilter !== "all" || toolFilter !== "all" || sortMode !== "newest") && (
              <button type="button" onClick={resetFilters} className="rounded-full border border-border px-3 py-1.5 text-[11px] font-bold text-muted transition-colors hover:border-primary hover:text-primary">
                {locale === "ko" ? "초기화" : "Reset"}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <div className="col-span-full py-20 text-center zhs-card border-dashed">
             <p className="text-muted font-bold uppercase tracking-widest italic">
              {locale === "ko" ? "조건에 맞는 글이 없습니다." : "No matching posts found."}
             </p>
             <button type="button" onClick={resetFilters} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
              {locale === "ko" ? "필터 초기화" : "Reset filters"}
             </button>
          </div>
        )}
      </div>

      <DesktopCategoryQuickMenu
        items={categoryQuickItems}
        active={categoryFilter}
        locale={locale}
        onSelect={selectQuickCategory}
      />
      <MobileCategoryQuickMenu
        items={categoryQuickItems}
        active={categoryFilter}
        locale={locale}
        onSelect={selectQuickCategory}
      />
    </div>
  );
}
