"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";
import { PostCard } from "@/components/posts/post-card";
import { getPostsByKind } from "@/lib/posts";

export function GuidesPage() {
  const { t, locale } = useLocale();
  const guidePosts = getPostsByKind("guide");

  const guidePostsHeading = locale === "ko" ? "가이드 글" : "Guide posts";
  const seeAllPostsLabel = locale === "ko" ? "전체 글 보기 →" : "See all posts →";

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
        {"// guides"}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">{t.guidesPage.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">{t.guidesPage.lead}</p>

      {guidePosts.length > 0 && (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">{guidePostsHeading}</h2>
            <Link href="/posts" className="font-mono text-[12px] uppercase tracking-wider text-primary hover:text-primary-dark">
              {seeAllPostsLabel}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {guidePosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 space-y-8">
        {t.guidesPage.sections.map((section) => (
          <section key={section.title} className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold">{section.title}</h2>
            <div className="mt-4 space-y-3 text-muted">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {section.links.map((link) => (
                <Link
                  key={link.slug}
                  href={link.slug === "_disclaimer" ? "/disclaimer" : `/tools/${link.slug}`}
                  className="rounded border border-border px-3 py-2 font-mono text-sm text-foreground transition-colors hover:bg-card"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
