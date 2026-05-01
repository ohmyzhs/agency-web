"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { getPostContent, type Post, type PostBlock } from "@/lib/post-types";
import { getToolBySlug, getToolContent } from "@/lib/tools";

function renderBlock(block: PostBlock, index: number) {
  switch (block.type) {
    case "h2":
      return <h2 key={index} className="mt-10 text-2xl font-bold tracking-tight">{block.text}</h2>;
    case "h3":
      return <h3 key={index} className="mt-6 text-lg font-semibold tracking-tight">{block.text}</h3>;
    case "p":
      return <p key={index} className="mt-4 text-[15px] leading-relaxed text-muted">{block.text}</p>;
    case "ul":
      return (
        <ul key={index} className="mt-4 space-y-2 pl-5 text-[15px] leading-relaxed text-muted">
          {block.items.map((item, idx) => <li key={idx} className="list-disc">{item}</li>)}
        </ul>
      );
    case "callout":
      return (
        <aside key={index} className="mt-6 rounded-lg border border-border bg-accent px-4 py-3 text-sm leading-relaxed text-foreground">
          {block.text}
        </aside>
      );
  }
}

type PostPageShellProps = {
  post: Post;
  relatedPosts: Post[];
  allPosts: Post[];
};

type PostNavLabels = {
  back: string;
  navigator: string;
  latest: string;
  sameCategory: string;
  previous: string;
  next: string;
  relatedPosts: string;
  relatedTools: string;
  readMore: string;
};

function getLabels(locale: "ko" | "en"): PostNavLabels {
  if (locale === "ko") {
    return {
      back: "← 글 목록",
      navigator: "다른 글 보기",
      latest: "최근 글",
      sameCategory: "같은 주제",
      previous: "이전 글",
      next: "다음 글",
      relatedPosts: "관련 글",
      relatedTools: "관련 도구",
      readMore: "읽기",
    };
  }

  return {
    back: "← All posts",
    navigator: "Browse posts",
    latest: "Latest posts",
    sameCategory: "Same topic",
    previous: "Previous post",
    next: "Next post",
    relatedPosts: "Related posts",
    relatedTools: "Related tools",
    readMore: "Read",
  };
}

function getAdjacentPosts(allPosts: Post[], currentSlug: string) {
  const index = allPosts.findIndex((candidate) => candidate.slug === currentSlug);
  return {
    newer: index > 0 ? allPosts[index - 1] : undefined,
    older: index >= 0 && index < allPosts.length - 1 ? allPosts[index + 1] : undefined,
  };
}

function SmallPostLink({ post, label }: { post: Post; label?: string }) {
  const { locale } = useLocale();
  const content = getPostContent(post, locale);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-lg border border-border bg-background p-3 transition-colors hover:border-foreground"
    >
      {label && <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>}
      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
        {content.title}
      </p>
      <p className="mt-1 font-mono text-[11px] text-muted">{post.publishedAt} · {post.readingMinutes}m</p>
    </Link>
  );
}

function PostNavigator({
  currentPost,
  allPosts,
  relatedPosts,
  labels,
}: {
  currentPost: Post;
  allPosts: Post[];
  relatedPosts: Post[];
  labels: PostNavLabels;
}) {
  const latestPosts = allPosts.filter((candidate) => candidate.slug !== currentPost.slug).slice(0, 5);
  const sameCategoryPosts = relatedPosts.slice(0, 4);

  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="zhs-eyebrow">{labels.navigator}</p>
          <Link href="/posts" className="font-mono text-[11px] text-muted transition-colors hover:text-foreground">
            /posts
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {latestPosts.map((navPost) => <SmallPostLink key={navPost.slug} post={navPost} />)}
        </div>
      </div>

      {sameCategoryPosts.length > 0 && (
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="zhs-eyebrow">{labels.sameCategory}</p>
          <div className="mt-4 space-y-2">
            {sameCategoryPosts.map((navPost) => <SmallPostLink key={navPost.slug} post={navPost} />)}
          </div>
        </div>
      )}
    </aside>
  );
}

function AdjacentPostCard({ post, label, align = "left" }: { post?: Post; label: string; align?: "left" | "right" }) {
  const { locale } = useLocale();
  if (!post) return <div className="hidden rounded-xl border border-transparent md:block" aria-hidden="true" />;

  const content = getPostContent(post, locale);
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group block rounded-xl border border-border bg-background p-4 transition-colors hover:border-foreground ${align === "right" ? "text-right" : ""}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-semibold leading-snug text-foreground group-hover:text-primary">{content.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">{content.description}</p>
    </Link>
  );
}

export function PostPageShell({ post, relatedPosts, allPosts }: PostPageShellProps) {
  const { locale, t } = useLocale();
  const content = getPostContent(post, locale);
  const minutesLabel = locale === "ko" ? `약 ${post.readingMinutes}분` : `${post.readingMinutes} min read`;
  const updatedLabel = post.updatedAt
    ? (locale === "ko" ? `수정 ${post.updatedAt}` : `Updated ${post.updatedAt}`)
    : null;
  const labels = getLabels(locale);
  const adjacentPosts = getAdjacentPosts(allPosts, post.slug);

  const relatedTools = (post.relatedToolSlugs ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getToolBySlug>> => Boolean(tool));

  const bottomRecommendations = relatedPosts.length > 0
    ? relatedPosts
    : allPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/posts" className="inline-block text-sm text-muted transition-colors hover:text-foreground">
          {labels.back}
        </Link>
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs md:hidden">
          {allPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 4).map((navPost) => {
            const navContent = getPostContent(navPost, locale);
            return (
              <Link
                key={navPost.slug}
                href={`/posts/${navPost.slug}`}
                className="shrink-0 rounded-full border border-border px-3 py-1.5 font-mono text-muted transition-colors hover:border-foreground hover:text-foreground"
              >
                {navContent.title}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,760px)_320px] lg:items-start">
        <article className="min-w-0">
          <header className="border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-mono">{post.publishedAt}</span>
              <span className="font-mono text-fg-3">·</span>
              <span className="font-mono">{minutesLabel}</span>
              {updatedLabel && <><span className="font-mono text-fg-3">·</span><span className="font-mono">{updatedLabel}</span></>}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{content.title}</h1>
            <p className="mt-3 text-lg text-muted">{content.description}</p>
          </header>

          <div className="prose-reset mt-2">{content.body.map((block, idx) => renderBlock(block, idx))}</div>

          {post.sourceLinks && post.sourceLinks.length > 0 && (
            <section className="mt-10 rounded-lg border border-border p-5">
              <p className="zhs-eyebrow">{locale === "ko" ? "출처" : "Sources"}</p>
              <ul className="mt-2 space-y-1 text-sm">
                {post.sourceLinks.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground">
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {relatedTools.length > 0 && (
            <section className="mt-10">
              <p className="zhs-eyebrow">{labels.relatedTools}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedTools.map((tool) => {
                  const toolContent = getToolContent(tool, locale);
                  return (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-foreground hover:text-foreground">
                      {toolContent.shortTitle}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <nav aria-label={labels.navigator} className="mt-12 grid gap-3 border-t border-border pt-8 md:grid-cols-2">
            <AdjacentPostCard post={adjacentPosts.older} label={labels.previous} />
            <AdjacentPostCard post={adjacentPosts.newer} label={labels.next} align="right" />
          </nav>

          {bottomRecommendations.length > 0 && (
            <section className="mt-10">
              <div className="flex items-center justify-between gap-3">
                <p className="zhs-eyebrow">{labels.relatedPosts}</p>
                <Link href="/posts" className="font-mono text-xs text-muted transition-colors hover:text-foreground">
                  {labels.readMore} →
                </Link>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {bottomRecommendations.slice(0, 3).map((rel) => <SmallPostLink key={rel.slug} post={rel} />)}
              </div>
            </section>
          )}

          <p className="sr-only">{t.tools.relatedTools}</p>
        </article>

        <div className="hidden lg:block">
          <PostNavigator currentPost={post} allPosts={allPosts} relatedPosts={relatedPosts} labels={labels} />
        </div>
      </div>
    </div>
  );
}
