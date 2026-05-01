"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";
import { PostCard } from "@/components/posts/post-card";
import { getAllPosts, type PostKind } from "@/lib/posts";

type Filter = "all" | PostKind;

export function PostsIndex() {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("all");

  const allPosts = useMemo(() => getAllPosts(), []);
  const visiblePosts = useMemo(
    () => (filter === "all" ? allPosts : allPosts.filter((post) => post.kind === filter)),
    [allPosts, filter],
  );

  const eyebrow = locale === "ko" ? "// 글" : "// posts";
  const title = locale === "ko" ? "글" : "Posts";
  const lead =
    locale === "ko"
      ? "도구 사용 노트, IT 소식, 일상에서 정리한 메모를 모아두는 곳입니다. 새 글이 추가되면 가장 위로 올라옵니다."
      : "Tool notes, IT news, and short field notes from working between Korea and global contexts. Newest posts appear first.";

  const filterLabels = locale === "ko"
    ? { all: "전체", guide: "가이드", news: "IT 소식", daily: "일상", tool: "도구 노트", experiment: "실험", site: "사이트 노트" }
    : { all: "All", guide: "Guide", news: "IT news", daily: "Daily", tool: "Tool note", experiment: "Experiment", site: "Site note" };

  // Only show filters that have posts.
  const availableKinds = new Set(allPosts.map((post) => post.kind));
  const options: { value: Filter; label: string }[] = [
    { value: "all", label: filterLabels.all },
    ...(availableKinds.has("guide") ? [{ value: "guide" as const, label: filterLabels.guide }] : []),
    ...(availableKinds.has("it-news") ? [{ value: "it-news" as const, label: filterLabels.news }] : []),
    ...(availableKinds.has("daily") ? [{ value: "daily" as const, label: filterLabels.daily }] : []),
    ...(availableKinds.has("tool-note") ? [{ value: "tool-note" as const, label: filterLabels.tool }] : []),
    ...(availableKinds.has("experiment") ? [{ value: "experiment" as const, label: filterLabels.experiment }] : []),
    ...(availableKinds.has("site-note") ? [{ value: "site-note" as const, label: filterLabels.site }] : []),
  ];

  const empty = locale === "ko" ? "아직 글이 없습니다." : "No posts yet.";

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">{lead}</p>

      <div className="mt-10">
        <SegmentedTabs<Filter>
          ariaLabel={locale === "ko" ? "글 종류 필터" : "Post kind filter"}
          value={filter}
          onChange={setFilter}
          options={options}
          size="sm"
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="text-muted">{empty}</p>
        )}
      </div>
    </div>
  );
}
