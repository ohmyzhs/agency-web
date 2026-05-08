"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import { PostCard } from "@/components/posts/post-card";
import { getPostContent, type Post, type PostKind } from "@/lib/post-types";

type Filter = "all" | PostKind;

export function PostsIndex({ posts }: { posts: Post[] }) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const visiblePosts = useMemo(
    () => (filter === "all" ? posts : posts.filter((post) => post.kind === filter)),
    [posts, filter],
  );

  const eyebrow = locale === "ko" ? "// 지식 저장소" : "// intelligence archive";
  const title = locale === "ko" ? "글과 기록" : "Studio Archive";
  const lead =
    locale === "ko"
      ? "프로페셔널 빌드 로그, 기술 가이드, 그리고 자동화 시대의 통찰을 기록합니다."
      : "Technical build logs, practical guides, and insights for the automated intelligence era.";

  const filterLabels = locale === "ko"
    ? { all: "전체", guide: "가이드", "it-news": "소식", daily: "일상", "tool-note": "도구", experiment: "실험", "site-note": "기록" }
    : { all: "All Archive", guide: "Guide", "it-news": "News", daily: "Daily", "tool-note": "Tool", experiment: "Experiment", "site-note": "Note" };

  const availableKinds = new Set(posts.map((post) => post.kind));
  const options: { value: Filter; label: string }[] = [
    { value: "all", label: filterLabels.all },
    ...(availableKinds.has("guide") ? [{ value: "guide" as const, label: filterLabels.guide }] : []),
    ...(availableKinds.has("it-news") ? [{ value: "it-news" as const, label: filterLabels["it-news"] }] : []),
    ...(availableKinds.has("daily") ? [{ value: "daily" as const, label: filterLabels.daily }] : []),
    ...(availableKinds.has("tool-note") ? [{ value: "tool-note" as const, label: filterLabels["tool-note"] }] : []),
    ...(availableKinds.has("experiment") ? [{ value: "experiment" as const, label: filterLabels.experiment }] : []),
    ...(availableKinds.has("site-note") ? [{ value: "site-note" as const, label: filterLabels["site-note"] }] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <section className="mb-20">
        <p className="zhs-eyebrow text-primary/60">{eyebrow}</p>
        <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl text-gradient">{title}</h1>
        <p className="mt-8 max-w-2xl text-xl text-muted leading-relaxed">{lead}</p>
      </section>

      <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
        <div className="flex-1">
          <div className="mb-12">
            <SegmentedTabs<Filter>
              ariaLabel={locale === "ko" ? "카테고리 필터" : "Archive filter"}
              value={filter}
              onChange={setFilter}
              options={options}
              size="sm"
            />
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {visiblePosts.length > 0 ? (
              visiblePosts.map((post) => <PostCard key={post.slug} post={post} />)
            ) : (
              <div className="col-span-full py-20 text-center zhs-card border-dashed">
                 <p className="text-muted font-bold uppercase tracking-widest italic">No matching records found.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:w-80 space-y-12">
           <div className="zhs-card p-8 bg-card/50 backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted/60 mb-8">Latest Insights</h3>
              <div className="space-y-8">
                {posts.slice(0, 5).map((post) => {
                  const content = getPostContent(post, locale);
                  return (
                    <a
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group block"
                    >
                      <div className="text-[10px] font-black uppercase text-primary/40 mb-1 group-hover:text-primary transition-colors">{post.category}</div>
                      <span className="text-sm font-extrabold leading-tight block group-hover:text-primary transition-colors">{content.title}</span>
                      <span className="mt-2 block font-mono text-[10px] text-muted/40 uppercase tracking-tighter">{post.publishedAt}</span>
                    </a>
                  );
                })}
              </div>
           </div>

           <div className="px-4">
              <p className="text-[10px] font-bold text-muted/30 leading-relaxed uppercase tracking-widest">
                The archive is updated weekly with new research, build logs, and technical trends.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
