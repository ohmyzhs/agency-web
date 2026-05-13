import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { getAllUpdates, getPostContent } from "@/lib/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Updates",
  description: "Visitor-friendly release notes and site updates from Zero Human Studio.",
  path: "/updates",
});

export default function UpdatesPage() {
  const updates = getAllUpdates();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <section className="mb-12">
        <p className="zhs-eyebrow text-primary/60">Release notes</p>
        <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl text-gradient">Updates</h1>
        <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted">
          사이트 기능 추가, 콘텐츠 구조 변경, 중요한 개선사항을 방문자 관점에서 짧게 정리합니다. GitHub 변경 이력보다 읽기 쉬운 운영 노트입니다.
        </p>
      </section>

      {updates.length > 0 ? (
        <div className="space-y-5">
          {updates.map((update) => {
            const content = getPostContent(update, "ko");
            return (
              <article key={update.slug} className="rounded-3xl border border-border bg-card/70 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-mono">{update.publishedAt}</span>
                  <span className="font-mono text-fg-3">·</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-black uppercase tracking-widest text-primary/70">
                    Release note
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-foreground">{content.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{content.description}</p>
                <div className="mt-6 space-y-2">
                  {content.body.slice(0, 5).map((block, index) => {
                    if (block.type === "h2") return <h3 key={index} className="pt-3 text-sm font-black uppercase tracking-widest text-muted/70">{block.text}</h3>;
                    if (block.type === "ul") return <ul key={index} className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
                    if (block.type === "p") return <p key={index} className="text-sm leading-relaxed text-muted">{block.text}</p>;
                    return null;
                  })}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted">
          아직 공개된 업데이트 노트가 없습니다.
        </div>
      )}

      <div className="mt-12 rounded-3xl border border-border bg-background p-6">
        <p className="text-sm leading-relaxed text-muted">
          개발자용 상세 변경 이력은 <Link href="https://github.com/ohmyzhs/agency-web" className="font-bold text-primary" target="_blank">GitHub repository</Link>에서 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
