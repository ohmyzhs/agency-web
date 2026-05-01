"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getPostContent, type Post } from "@/lib/posts";

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
  const minutesLabel = locale === "ko" ? `약 ${post.readingMinutes}분` : `${post.readingMinutes} min read`;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-md border border-border bg-background p-6 transition-colors hover:border-foreground"
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="rounded-full bg-accent px-2 py-0.5 font-mono uppercase tracking-wider">
          {kindLabel}
        </span>
        <span className="font-mono">{post.publishedAt}</span>
        <span className="font-mono text-fg-3">·</span>
        <span className="font-mono">{minutesLabel}</span>
      </div>
      <h3 className="mt-3 font-mono text-lg font-semibold tracking-tight text-foreground group-hover:text-primary">
        {content.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{content.description}</p>
    </Link>
  );
}
