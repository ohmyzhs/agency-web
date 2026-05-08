"use client";

import type { PostCategory } from "@/lib/post-types";
import { useMemo } from "react";

type PostThumbnailProps = {
  title: string;
  category: PostCategory;
  thumbnailUrl?: string;
  className?: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  "korea-living": "from-blue-500/20 to-indigo-500/20",
  automation: "from-emerald-500/20 to-teal-500/20",
  developer: "from-slate-500/20 to-zinc-500/20",
  ai: "from-purple-500/20 to-pink-500/20",
  "it-news": "from-orange-500/20 to-amber-500/20",
  daily: "from-gray-500/20 to-slate-500/20",
  culture: "from-rose-500/20 to-orange-500/20",
  experiments: "from-cyan-500/20 to-blue-500/20",
};

export function PostThumbnail({ title, category, thumbnailUrl, className = "" }: PostThumbnailProps) {
  const gradientClass = CATEGORY_COLORS[category] || "from-slate-500/20 to-zinc-500/20";
  
  // Seed-based stable random pattern
  const patternId = useMemo(() => `pattern-${title.length}-${category}`, [title, category]);

  if (thumbnailUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} flex items-center justify-center p-6 ${className}`}>
      {/* Decorative SVG Pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40L40 0M-10 10L10 -10M30 50L50 30" stroke="currentColor" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted/60 mb-2">
          {category}
        </span>
        <div className="h-px w-8 bg-primary/30 mb-4" />
        <span className="text-xs font-medium text-foreground/40 leading-relaxed px-4 line-clamp-2">
          {title}
        </span>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
