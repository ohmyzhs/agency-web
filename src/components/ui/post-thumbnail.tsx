"use client";

import type { PostCategory } from "@/lib/post-types";
import { useMemo } from "react";

type PostThumbnailProps = {
  title: string;
  category: PostCategory;
  thumbnailUrl?: string;
  className?: string;
};

const CATEGORY_STYLES: Record<string, { gradient: string; pattern: string; color: string }> = {
  "korea-living": {
    gradient: "from-blue-600/10 to-indigo-600/5",
    pattern: "M0 0h10v10H0z",
    color: "text-blue-500"
  },
  automation: {
    gradient: "from-emerald-600/10 to-teal-600/5",
    pattern: "M5 0v10M0 5h10",
    color: "text-emerald-500"
  },
  developer: {
    gradient: "from-slate-600/10 to-zinc-600/5",
    pattern: "M0 10L10 0M-1 1l2-2M9 11l2-2",
    color: "text-slate-500"
  },
  ai: {
    gradient: "from-purple-600/10 to-pink-600/5",
    pattern: "M0 0l10 10M10 0L0 10",
    color: "text-purple-500"
  },
  "it-news": {
    gradient: "from-orange-600/10 to-amber-600/5",
    pattern: "M0 5h10",
    color: "text-orange-500"
  },
  daily: {
    gradient: "from-gray-600/10 to-slate-600/5",
    pattern: "M5 0v10",
    color: "text-gray-500"
  },
  culture: {
    gradient: "from-rose-600/10 to-orange-600/5",
    pattern: "M0 0h10v10H0z",
    color: "text-rose-500"
  },
  experiments: {
    gradient: "from-cyan-600/10 to-blue-600/5",
    pattern: "M2 2h6v6H2z",
    color: "text-cyan-500"
  },
};

export function PostThumbnail({ title, category, thumbnailUrl, className = "" }: PostThumbnailProps) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.developer;

  const patternId = useMemo(() => `pattern-${title.length}-${category}-${title.slice(0,3)}`, [title, category]);

  if (thumbnailUrl) {
    return (
      <div className={`relative overflow-hidden bg-muted ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} flex items-center justify-center p-8 ${className}`}>
      {/* Decorative Grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`${patternId}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId}-grid)`} />
      </svg>

      {/* Unique Category Pattern */}
      <svg className={`absolute inset-0 h-full w-full opacity-10 ${style.color}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse">
            <path d={style.pattern} stroke="currentColor" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50 dark:bg-black/20 shadow-sm border border-white/20 backdrop-blur-sm ${style.color}`}>
           <span className="text-lg font-black italic">{category.charAt(0).toUpperCase()}</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted/60 mb-2">
          {category}
        </span>
        <div className="h-1 w-6 bg-primary/20 rounded-full mb-4" />
        <span className="text-[11px] font-bold text-foreground/30 leading-tight px-4 line-clamp-1 max-w-[200px]">
          {title}
        </span>
      </div>

      {/* Visual Depth Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </div>
  );
}
