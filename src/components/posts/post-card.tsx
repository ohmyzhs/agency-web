"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getPostContent, type Post } from "@/lib/post-types";
import { PostThumbnail } from "@/components/ui/post-thumbnail";

const kindLabelKo: Record<Post["kind"], string> = {
  guide: "가이드",
  "it-news": "IT 소식",
  daily: "일상",
  "tool-note": "도구 노트",
  experiment: "실험",
  "site-note": "사이트 노트",
};

const kindLabelEn: Record<Post["kind"], string> = {
  guide: "Guide",
  "it-news": "IT news",
  daily: "Daily",
  "tool-note": "Tool note",
  experiment: "Experiment",
  "site-note": "Site note",
};

export function PostCard({ post }: { post: Post }) {
  const { locale } = useLocale();
  const content = getPostContent(post, locale);
  const kindLabel = locale === "ko" ? kindLabelKo[post.kind] : kindLabelEn[post.kind];
  const minutesLabel = locale === "ko" ? `${post.readingMinutes}분 분량` : `${post.readingMinutes} min`;

  return (
    <article className="zhs-card zhs-card-hover group relative overflow-hidden flex flex-col h-full">
      <Link href={`/posts/${post.slug}`} className="absolute inset-0 z-20" />
      
      <PostThumbnail 
        title={content.title} 
        category={post.category} 
        className="aspect-[16/10] z-10 transition-transform duration-700 group-hover:scale-105"
      />

      <div className="p-6 flex flex-col flex-1 relative z-10 bg-card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
            {kindLabel}
          </span>
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted/40 uppercase">
            <span>{post.publishedAt}</span>
          </div>
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
          {content.title}
        </h3>
        
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted/80">
          {content.description}
        </p>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-muted/40">{minutesLabel}</span>
          <div className="h-1 w-12 bg-border group-hover:bg-primary group-hover:w-16 transition-all rounded-full" />
        </div>
      </div>
    </article>
  );
}
