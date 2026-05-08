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
const VIEW_MODE_KEY = "zhs.toolsViewMode";
const VIEW_MODE_EVENT = "zhs:tools-view-mode-changed";

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
type ViewMode = "grid" | "list";

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

function subscribeViewMode(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(VIEW_MODE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(VIEW_MODE_EVENT, callback);
  };
}

function readViewModeSnapshot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(VIEW_MODE_KEY) ?? "";
}

function parseViewMode(snapshot: string): ViewMode {
  return snapshot === "list" ? "list" : "grid";
}

function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const snapshot = useSyncExternalStore(subscribeViewMode, readViewModeSnapshot, () => "");
  const mode = useMemo(() => parseViewMode(snapshot), [snapshot]);
  const setMode = (next: ViewMode) => {
    window.localStorage.setItem(VIEW_MODE_KEY, next);
    window.dispatchEvent(new Event(VIEW_MODE_EVENT));
  };
  return [mode, setMode];
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
      "현재 23개 도구 기준으로 인접 기능은 통합 검토했습니다. PDF 3종은 PDF 도구 모음으로 이미 통합했고, 이미지 계열은 변환·ASCII·아이콘·OG가 목적이 달라 유지, 웹훅은 요청 테스트와 페이로드 포맷팅으로 분리, 단위 변환은 범용 변환기와 한국 생활 특화 도구를 병행하는 구조가 낫습니다. 네트워크는 사용자 결정대로 내 IP 확인 단일 기능만 유지합니다.",
    open: "열기",
    favoriteAdd: "즐겨찾기 추가",
    favoriteRemove: "즐겨찾기 해제",
    noResultsTitle: "검색 결과가 없습니다.",
    noResultsBody: "다른 키워드나 카테고리로 다시 찾아보세요.",
    viewModeLabel: "보기 방식",
    viewGrid: "타일",
    viewList: "간단",
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
      "The current 23 tools have been reviewed for adjacent workflows. The three PDF operations are already consolidated into PDF Toolkit. Image conversion, image-to-ASCII, icon/favicon, and OG image generation stay separate because their intent differs. Webhook request testing and payload formatting stay separate. The generic unit converter works alongside Korea-specific living tools. Network remains a single Check My IP tool by prior product decision.",
    open: "Open",
    favoriteAdd: "Add favorite",
    favoriteRemove: "Remove favorite",
    noResultsTitle: "No matching tools.",
    noResultsBody: "Try another keyword or category.",
    viewModeLabel: "View",
    viewGrid: "Tiles",
    viewList: "Compact",
  },
};

export function ToolsCatalog() {
  const { locale, t } = useLocale();
  const strings = copy[locale];
  const allTools = getAllTools();
  const { favorites, favoriteSet, toggleFavorite } = useFavoriteTools();
  const [viewMode, setViewMode] = useViewMode();
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

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>{resultSummary}</span>
        <div className="flex items-center gap-3">
          {filter !== "all" && (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="font-medium text-primary hover:text-primary-dark"
            >
              {strings.filterAll}
            </button>
          )}
          <div
            role="group"
            aria-label={strings.viewModeLabel}
            className="inline-flex overflow-hidden rounded-lg border border-border"
          >
            <ViewModeButton
              active={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              label={strings.viewGrid}
            >
              <GridIcon />
            </ViewModeButton>
            <ViewModeButton
              active={viewMode === "list"}
              onClick={() => setViewMode("list")}
              label={strings.viewList}
            >
              <ListIcon />
            </ViewModeButton>
          </div>
        </div>
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
              {viewMode === "grid" ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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
              ) : (
                <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
                  {group.tools.map((tool) => (
                    <CatalogToolRow
                      key={tool.slug}
                      tool={tool}
                      isFavorite={favoriteSet.has(tool.slug)}
                      onToggleFavorite={() => toggleFavorite(tool.slug)}
                      favoriteAddLabel={strings.favoriteAdd}
                      favoriteRemoveLabel={strings.favoriteRemove}
                      openLabel={strings.open}
                    />
                  ))}
                </ul>
              )}
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
    <article className="hover-lift group relative rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-lg">
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
          className={`relative z-10 rounded-full border px-2 py-0.5 text-sm transition-colors ${
            isFavorite
              ? "border-primary bg-accent text-primary"
              : "border-border text-muted hover:border-primary hover:text-primary"
          }`}
        >
          ★
        </button>
      </div>
      <h3 className="mt-2.5 text-base font-semibold transition-colors group-hover:text-primary">
        <Link href={`/tools/${tool.slug}`} className="after:absolute after:inset-0">
          {content.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{content.description}</p>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {content.examples.slice(0, 2).map((example) => (
            <span key={example.label} className="rounded-md bg-card px-2 py-0.5 text-xs text-muted">
              {example.label}
            </span>
          ))}
        </div>
        <span className="text-sm font-medium text-primary">
          {openLabel} →
        </span>
      </div>
    </article>
  );
}

function CatalogToolRow({
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
  const categoryLabel = t.categories[tool.category] ?? tool.category;

  return (
    <li className="group relative flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-card">
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? favoriteRemoveLabel : favoriteAddLabel}
        title={isFavorite ? favoriteRemoveLabel : favoriteAddLabel}
        className={`relative z-10 shrink-0 rounded-full border px-2 py-0.5 text-sm transition-colors ${
          isFavorite
            ? "border-primary bg-accent text-primary"
            : "border-border text-muted hover:border-primary hover:text-primary"
        }`}
      >
        ★
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
            <Link href={`/tools/${tool.slug}`} className="after:absolute after:inset-0">
              {content.title}
            </Link>
          </h3>
          <span className="shrink-0 text-xs text-muted">{categoryLabel}</span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{content.description}</p>
      </div>
      <span
        aria-label={openLabel}
        className="shrink-0 text-sm font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100"
      >
        →
      </span>
    </li>
  );
}

function ViewModeButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-background text-muted hover:text-foreground"
      }`}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function GridIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="3" y1="4" x2="13" y2="4" />
      <line x1="3" y1="8" x2="13" y2="8" />
      <line x1="3" y1="12" x2="13" y2="12" />
    </svg>
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
