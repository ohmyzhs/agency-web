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

export function PostPageShell({ post, relatedPosts }: { post: Post; relatedPosts: Post[] }) {
  const { locale, t } = useLocale();
  const content = getPostContent(post, locale);
  const minutesLabel = locale === "ko" ? `약 ${post.readingMinutes}분` : `${post.readingMinutes} min read`;
  const updatedLabel = post.updatedAt
    ? (locale === "ko" ? `수정 ${post.updatedAt}` : `Updated ${post.updatedAt}`)
    : null;

  const relatedTools = (post.relatedToolSlugs ?? [])
    .map((slug) => getToolBySlug(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getToolBySlug>> => Boolean(tool));

  const backLabel = locale === "ko" ? "← 글 목록" : "← All posts";
  const relatedToolsLabel = locale === "ko" ? "관련 도구" : "Related tools";
  const relatedPostsLabel = locale === "ko" ? "관련 글" : "Related posts";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/posts" className="inline-block text-sm text-muted hover:text-foreground transition-colors">
        {backLabel}
      </Link>

      <article className="mt-6">
        <header className="border-b border-border pb-6">
          <div className="flex items-center gap-2 text-xs text-muted">
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
            <p className="zhs-eyebrow">{relatedToolsLabel}</p>
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

        {relatedPosts.length > 0 && (
          <section className="mt-10 border-t border-border pt-8">
            <p className="zhs-eyebrow">{relatedPostsLabel}</p>
            <ul className="mt-3 space-y-2 font-mono text-[13px]">
              {relatedPosts.map((rel) => {
                const relContent = getPostContent(rel, locale);
                return <li key={rel.slug}><Link href={`/posts/${rel.slug}`} className="text-muted hover:text-foreground">{relContent.title}</Link></li>;
              })}
            </ul>
          </section>
        )}

        <p className="sr-only">{t.tools.relatedTools}</p>
      </article>
    </div>
  );
}
