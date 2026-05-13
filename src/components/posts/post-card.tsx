"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getPostContent, type Post } from "@/lib/post-types";
import { PostThumbnail } from "@/components/ui/post-thumbnail";
import { getPostTypeLabel, getPublicPostCategoryLabel, getRelatedToolLabels } from "@/components/posts/post-labels";

export function PostCard({ post }: { post: Post }) {
  const { locale } = useLocale();
  const content = getPostContent(post, locale);
  const typeLabel = getPostTypeLabel(post, locale);
  const categoryLabel = getPublicPostCategoryLabel(post.category, locale, post.kind);
  const minutesLabel = locale === "ko" ? `${post.readingMinutes}분 분량` : `${post.readingMinutes} min`;
  const relatedTools = getRelatedToolLabels(post, locale, 3);

  return (
    <article className="zhs-card zhs-card-hover group relative overflow-hidden flex flex-col h-full">
      <Link href={`/posts/${post.slug}`} className="absolute inset-0 z-20" aria-label={content.title} />
      
      <PostThumbnail 
        title={content.title} 
        category={post.category} 
        className="aspect-[16/10] z-10 transition-transform duration-700 group-hover:scale-105"
      />

      <div className="p-6 flex flex-col flex-1 relative z-10 bg-card">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary/70 group-hover:text-primary transition-colors">
            {typeLabel}
          </span>
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted/60">
            {categoryLabel}
          </span>
          <span className="ml-auto text-[11px] font-bold text-muted/40 uppercase">
            {post.publishedAt}
          </span>
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
          {content.title}
        </h3>
        
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted/80">
          {content.description}
        </p>

        {relatedTools.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2" aria-label={locale === "ko" ? "관련 도구" : "Related tools"}>
            {relatedTools.map((tool) => (
              <span key={tool.slug} className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] font-bold text-muted/60">
                {tool.label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-6 flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-muted/40">{minutesLabel}</span>
          <div className="h-1 w-12 bg-border group-hover:bg-primary group-hover:w-16 transition-all rounded-full" />
        </div>
      </div>
    </article>
  );
}
