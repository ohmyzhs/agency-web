import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { NewsIndex, type NewsIndexInitialFilters } from "@/components/posts/news-index";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = createPageMetadata({
  title: "News",
  description: "Daily AI/tech news briefings and curated newsletters from Zero Human Studio.",
  path: "/news",
});

type NewsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const initialFilters: NewsIndexInitialFilters = {
    type: firstParam(params?.type),
    category: firstParam(params?.category),
    tool: firstParam(params?.tool),
    q: firstParam(params?.q),
    sort: firstParam(params?.sort),
  };

  return <NewsIndex posts={getAllPosts()} initialFilters={initialFilters} />;
}
