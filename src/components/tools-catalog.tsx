"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useLocale } from "@/components/providers";
import {
  getAllTools,
  getToolContent,
  type Tool,
  type ToolCategory,
} from "@/lib/tools";

const FAVORITES_KEY = "zhs.favoriteTools";
const FAVORITES_EVENT = "zhs:favorites-changed";

const CATEGORY_ORDER: ToolCategory[] = [
  "file-media",
  "developer-automation",
  "micro-utility",
  "time-money",
  "korea-living",
  "network-diagnostics",
  "business-automation",
];

type CategoryFilter = "all" | "favorites" | ToolCategory;

function subscribeFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

function readFavoriteSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(FAVORITES_KEY) ?? "";
}

function parseFavorites(snapshot: string) {
  try {
    const value = JSON.parse(snapshot);
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeFavorites(next: string[]) {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...new Set(next)].sort()));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

function useFavoriteTools() {
  const snapshot = useSyncExternalStore(subscribeFavorites, readFavoriteSnapshot, () => "");
  const favorites = useMemo(() => parseFavorites(snapshot), [snapshot]);
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = (slug: string) => {
    const next = favoriteSet.has(slug)
      ? favorites.filter((item) => item !== slug)
      : [...favorites, slug];
    writeFavorites(next);
  };

  return { favorites, favoriteSet, toggleFavorite };
}

const copy = {
  ko: {
    searchLabel: "도구 검색",
    searchPlaceholder: "예: PDF, 이미지, JSON, 시간, IP, 슬러그",
    filterAll: "전체",
    favorites: "즐겨찾기",
    favoritesEmptyTitle: "아직 즐겨찾기한 도구가 없습니다.",
    favoritesEmptyBody: "자주 쓰는 도구 카드의 별표를 눌러 상단에 모아둘 수 있습니다.",
    resultSummary: "{count}개 도구 표시 중",
    clear: "초기화",
    quickTitle: "빠른 선택",
    quickBody: "검색, 카테고리, 즐겨찾기를 한 화면에서 처리하도록 바꿨습니다. 도구가 더 늘어나도 긴 티어 목록을 훑지 않아도 됩니다.",
    integrationTitle: "기능 통합 검토",
    integrationBody:
      "현재 22개 도구 기준으로 인접 기능은 통합 검토했습니다. PDF 3종은 PDF 도구 모음으로 이미 통합했고, 이미지 계열은 변환·아이콘·OG가 목적이 달라 유지, 웹훅은 요청 테스트와 페이로드 포맷팅으로 분리, 단위 변환은 범용 변환기와 한국 생활 특화 도구를 병행하는 구조가 낫습니다. 네트워크는 사용자 결정대로 내 IP 확인 단일 기능만 유지합니다.",
    open: "열기",
    favoriteAdd: "즐겨찾기 추가",
    favoriteRemove: "즐겨찾기 해제",
    noResultsTitle: "검색 결과가 없습니다.",
    noResultsBody: "다른 키워드나 카테고리로 다시 찾아보세요.",
  },
  en: {
    searchLabel: "Search tools",
    searchPlaceholder: "Try PDF, image, JSON, time, IP, slug",
    filterAll: "All",
    favorites: "Favorites",
    favoritesEmptyTitle: "No favorite tools yet.",
    favoritesEmptyBody: "Star tools you use often and they will stay one tap away.",
    resultSummary: "Showing {count} tools",
    clear: "Reset",
    quickTitle: "Fast selection",
    quickBody: "Search, categories, and favorites now live in one simple picker so the catalog can grow without forcing users through long tier lists.",
    integrationTitle: "Functional consolidation review",
    integrationBody:
      "The current 22 tools have been reviewed for adjacent workflows. The three PDF operations are already consolidated into PDF Toolkit. Image conversion, icon/favicon, and OG image generation stay separate because their intent differs. Webhook request testing and payload formatting stay separate. The generic unit converter works alongside Korea-specific living tools. Network remains a single Check My IP tool by prior product decision.",
    open: "Open",
    favoriteAdd: "Add favorite",
    favoriteRemove: "Remove favorite",
    noResultsTitle: "No matching tools.",
    noResultsBody: "Try another keyword or category.",
  },
};

export function ToolsCatalog() {
  const { locale, t } = useLocale();
  const strings = copy[locale];
  const allTools = getAllTools();
  const { favorites, favoriteSet, toggleFavorite } = useFavoriteTools();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const categoryCounts = useMemo(() => {
    const counts = new Map<ToolCategory, number>();
    allTools.forEach((tool) => counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1));
    return counts;
  }, [allTools]);

  const categoryFilters = useMemo(
    () => CATEGORY_ORDER.filter((category) => (categoryCounts.get(category) ?? 0) > 0),
    [categoryCounts],
  );

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allTools.filter((tool) => {
      if (filter === "favorites" && !favoriteSet.has(tool.slug)) return false;
      if (filter !== "all" && filter !== "favorites" && tool.category !== filter) return false;
      if (!normalizedQuery) return true;

      const content = getToolContent(tool, locale);
      const englishText = [
        tool.title,
        tool.shortTitle,
        tool.description,
        tool.slug,
        tool.category,
        ...tool.examples.flatMap((example) => [example.label, example.input, example.output]),
      ].join(" ");
      const localizedText = [
        content.title,
        content.shortTitle,
        content.description,
        ...content.examples.flatMap((example) => [example.label, example.input, example.output]),
      ].join(" ");
      return `${englishText} ${localizedText}`.toLowerCase().includes(normalizedQuery);
    });
  }, [allTools, favoriteSet, filter, locale, query]);

  const groupedTools = useMemo(
    () =>
      categoryFilters
        .map((category) => ({
          category,
          tools: filteredTools.filter((tool) => tool.category === category),
        }))
        .filter((group) => group.tools.length > 0),
    [categoryFilters, filteredTools],
  );

  const countSummary = t.tools.countSummary.replace("{count}", String(allTools.length));
  const resultSummary = strings.resultSummary.replace("{count}", String(filteredTools.length));
  const isFavoritesEmpty = filter === "favorites" && favorites.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {t.tools.indexEyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t.tools.indexTitle}
        </h1>
        <p className="mt-3 text-lg text-muted">{t.tools.indexLead}</p>
        <p className="mt-4 text-sm text-muted">{countSummary}</p>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-medium">{strings.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={strings.searchPlaceholder}
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-primary hover:text-foreground"
          >
            {strings.clear}
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            {strings.filterAll} <span className="text-xs opacity-70">{allTools.length}</span>
          </FilterChip>
          <FilterChip active={filter === "favorites"} onClick={() => setFilter("favorites")}>
            ★ {strings.favorites} <span className="text-xs opacity-70">{favorites.length}</span>
          </FilterChip>
          {categoryFilters.map((category) => (
            <FilterChip
              key={category}
              active={filter === category}
              onClick={() => setFilter(category)}
            >
              {t.categories[category] ?? category} <span className="text-xs opacity-70">{categoryCounts.get(category)}</span>
            </FilterChip>
          ))}
        </div>

        <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
          <div className="rounded-xl border border-line-soft bg-background p-4">
            <div className="font-semibold text-foreground">{strings.quickTitle}</div>
            <p className="mt-1 leading-relaxed">{strings.quickBody}</p>
          </div>
          <div className="rounded-xl border border-line-soft bg-background p-4">
            <div className="font-semibold text-foreground">{strings.integrationTitle}</div>
            <p className="mt-1 leading-relaxed">{strings.integrationBody}</p>
          </div>
        </div>
      </section>

      <div className="mt-8 flex items-center justify-between gap-3 text-sm text-muted">
        <span>{resultSummary}</span>
        {filter !== "all" && (
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="font-medium text-primary hover:text-primary-dark"
          >
            {strings.filterAll}
          </button>
        )}
      </div>

      {isFavoritesEmpty ? (
        <EmptyState title={strings.favoritesEmptyTitle} body={strings.favoritesEmptyBody} />
      ) : groupedTools.length === 0 ? (
        <EmptyState title={strings.noResultsTitle} body={strings.noResultsBody} />
      ) : (
        <div className="mt-6 space-y-10">
          {groupedTools.map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{t.categories[group.category] ?? group.category}</h2>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">
                  {group.tools.length}
                </span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool) => (
                  <CatalogToolCard
                    key={tool.slug}
                    tool={tool}
                    isFavorite={favoriteSet.has(tool.slug)}
                    onToggleFavorite={() => toggleFavorite(tool.slug)}
                    favoriteAddLabel={strings.favoriteAdd}
                    favoriteRemoveLabel={strings.favoriteRemove}
                    openLabel={strings.open}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-background text-muted hover:border-primary hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function CatalogToolCard({
  tool,
  isFavorite,
  onToggleFavorite,
  favoriteAddLabel,
  favoriteRemoveLabel,
  openLabel,
}: {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteAddLabel: string;
  favoriteRemoveLabel: string;
  openLabel: string;
}) {
  const { locale, t } = useLocale();
  const content = getToolContent(tool, locale);
  const tierLabel = t.tools.tierLabel.replace("{tier}", String(tool.tier));
  const categoryLabel = t.categories[tool.category] ?? tool.category;

  return (
    <article className="hover-lift group relative rounded-xl border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="rounded-full bg-accent px-2 py-0.5">{tierLabel}</span>
          <span>{categoryLabel}</span>
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? favoriteRemoveLabel : favoriteAddLabel}
          title={isFavorite ? favoriteRemoveLabel : favoriteAddLabel}
          className={`relative z-10 rounded-full border px-2 py-1 text-sm transition-colors ${
            isFavorite
              ? "border-primary bg-accent text-primary"
              : "border-border text-muted hover:border-primary hover:text-primary"
          }`}
        >
          ★
        </button>
      </div>
      <h3 className="mt-3 text-lg font-semibold transition-colors group-hover:text-primary">
        <Link href={`/tools/${tool.slug}`} className="after:absolute after:inset-0">
          {content.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{content.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {content.examples.slice(0, 2).map((example) => (
          <span key={example.label} className="rounded-md bg-card px-2 py-0.5 text-xs text-muted">
            {example.label}
          </span>
        ))}
      </div>
      <span className="mt-4 inline-flex text-sm font-medium text-primary">
        {openLabel} →
      </span>
    </article>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}
