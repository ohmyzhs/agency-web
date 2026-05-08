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
    searchLabel: "도구 라이브러리 검색",
    searchPlaceholder: "무엇을 해결하고 싶으신가요?",
    filterAll: "전체",
    favorites: "즐겨찾기",
    favoritesEmptyTitle: "아직 즐겨찾기한 도구가 없습니다.",
    favoritesEmptyBody: "도구 카드의 별표를 눌러 상단에 고정해 보세요.",
    resultSummary: "{count}개의 실용 지능 도구가 준비되어 있습니다.",
    clear: "필터 초기화",
    quickTitle: "프로페셔널 워크플로우",
    quickBody: "ZHS의 모든 도구는 전문가의 실제 작업 흐름을 연구하여 설계되었습니다.",
    integrationTitle: "정밀하게 조율된 시스템",
    integrationBody: "단순한 계산기를 넘어, 각 도구는 데이터의 흐름과 한계를 명확히 설명합니다.",
    open: "열기",
    favoriteAdd: "즐겨찾기 추가",
    favoriteRemove: "즐겨찾기 해제",
    noResultsTitle: "검색 결과가 없습니다.",
    noResultsBody: "다른 키워드로 검색하거나 전체 라이브러리를 둘러보세요.",
    viewModeLabel: "보기 방식",
    viewGrid: "그리드",
    viewList: "컴팩트",
  },
  en: {
    searchLabel: "Search Tool Library",
    searchPlaceholder: "What problem can we solve today?",
    filterAll: "All Collection",
    favorites: "Favorites",
    favoritesEmptyTitle: "No favorites yet.",
    favoritesEmptyBody: "Click the star icon to pin tools to the top.",
    resultSummary: "{count} practical intelligence tools available.",
    clear: "Reset",
    quickTitle: "Professional Workflow",
    quickBody: "Every tool is designed based on real-world professional requirements.",
    integrationTitle: "Precisely Calibrated",
    integrationBody: "Beyond simple calculators, we explain the data flow and limits.",
    open: "Open",
    favoriteAdd: "Add favorite",
    favoriteRemove: "Remove favorite",
    noResultsTitle: "No matching tools.",
    noResultsBody: "Try another keyword or browse the full collection.",
    viewModeLabel: "View",
    viewGrid: "Grid",
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

  const resultSummary = strings.resultSummary.replace("{count}", String(filteredTools.length));
  const isFavoritesEmpty = filter === "favorites" && favorites.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Header */}
      <section className="mb-12">
        <span className="zhs-eyebrow text-primary">Tool Library</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl text-gradient">
          {t.tools.indexTitle}
        </h1>
        <p className="mt-6 text-xl text-muted max-w-2xl leading-relaxed">{resultSummary}</p>
      </section>

      {/* Control Bar */}
      <section className="mb-16 zhs-card p-6 md:p-8 shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1 relative">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={strings.searchPlaceholder}
              className="w-full bg-accent/30 rounded-2xl px-6 py-4 text-lg outline-none border-2 border-transparent focus:border-primary/20 transition-all placeholder:text-muted/60"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-accent/30 p-1 border border-border">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "grid" ? "bg-background text-primary shadow-sm" : "text-muted hover:text-foreground"}`}
              >
                {strings.viewGrid}
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "list" ? "bg-background text-primary shadow-sm" : "text-muted hover:text-foreground"}`}
              >
                {strings.viewList}
              </button>
            </div>
            {(query || filter !== "all") && (
              <button
                onClick={() => { setQuery(""); setFilter("all"); }}
                className="px-4 py-2 text-sm font-bold text-muted hover:text-primary transition-colors"
              >
                {strings.clear}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            {strings.filterAll}
          </FilterChip>
          <FilterChip active={filter === "favorites"} onClick={() => setFilter("favorites")}>
            ★ {strings.favorites}
          </FilterChip>
          {categoryFilters.map((category) => (
            <FilterChip
              key={category}
              active={filter === category}
              onClick={() => setFilter(category)}
            >
              {t.categories[category] ?? category}
            </FilterChip>
          ))}
        </div>
      </section>

      {/* Content */}
      {isFavoritesEmpty ? (
        <EmptyState title={strings.favoritesEmptyTitle} body={strings.favoritesEmptyBody} />
      ) : groupedTools.length === 0 ? (
        <EmptyState title={strings.noResultsTitle} body={strings.noResultsBody} />
      ) : (
        <div className="space-y-20">
          {groupedTools.map((group) => (
            <section key={group.category} className="animate-fade-in-up">
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  {t.categories[group.category] ?? group.category}
                </h2>
                <div className="h-px flex-1 bg-border/50" />
                <span className="font-mono text-sm font-bold text-muted">{group.tools.length}</span>
              </div>
              
              {viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                <ul className="space-y-4">
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

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold border-2 transition-all ${
        active
          ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
          : "border-border bg-background text-muted hover:border-foreground/20 hover:text-foreground"
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
  openLabel,
}: {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteAddLabel: string;
  favoriteRemoveLabel: string;
  openLabel: string;
}) {
  const { locale } = useLocale();
  const content = getToolContent(tool, locale);

  return (
    <article className="zhs-card zhs-card-hover group relative p-6 flex flex-col justify-between">
      <Link href={`/tools/${tool.slug}`} className="absolute inset-0 z-0" />
      <div>
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
            {tool.category}
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
            className={`relative z-10 p-2 rounded-full border transition-all ${
              isFavorite ? "border-primary bg-primary text-white" : "border-border text-muted hover:border-primary hover:text-primary"
            }`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </button>
        </div>
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
          {content.title}
        </h3>
        <p className="mt-2 text-sm text-muted/80 leading-relaxed line-clamp-3">
          {content.description}
        </p>
      </div>
      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex gap-2">
          {content.examples.slice(0, 1).map((ex) => (
            <span key={ex.label} className="text-[11px] font-bold text-muted/40 uppercase tracking-tighter">
              {ex.label}
            </span>
          ))}
        </div>
        <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
          {openLabel} <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </span>
      </div>
    </article>
  );
}

function CatalogToolRow({
  tool,
  isFavorite,
  onToggleFavorite,
}: {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteAddLabel: string;
  favoriteRemoveLabel: string;
  openLabel: string;
}) {
  const { locale } = useLocale();
  const content = getToolContent(tool, locale);

  return (
    <li className="zhs-card zhs-card-hover group relative px-6 py-4 flex items-center gap-6">
      <Link href={`/tools/${tool.slug}`} className="absolute inset-0 z-0" />
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
        className={`relative z-10 shrink-0 p-2 rounded-xl border transition-all ${
          isFavorite ? "border-primary bg-primary text-white" : "border-border text-muted hover:border-primary hover:text-primary"
        }`}
      >
        ★
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-extrabold group-hover:text-primary transition-colors truncate">
          {content.title}
        </h3>
        <p className="text-xs text-muted truncate">{content.description}</p>
      </div>
      <div className="hidden sm:block text-[10px] font-black uppercase text-muted/40 tracking-widest shrink-0">
        {tool.category}
      </div>
    </li>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-24 text-center zhs-card border-dashed border-2 p-12">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 text-muted max-w-sm mx-auto">{body}</p>
    </div>
  );
}
