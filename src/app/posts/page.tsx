import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { PostsIndex, type PostsIndexInitialFilters } from "@/components/posts/posts-index";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Posts",
  description: "Tool notes, IT news, Korea living guides, and field notes from Zero Human Studio.",
  path: "/posts",
});

type PostsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const initialFilters: PostsIndexInitialFilters = {
    type: firstParam(params?.type),
    category: firstParam(params?.category),
    tool: firstParam(params?.tool),
    q: firstParam(params?.q),
    sort: firstParam(params?.sort),
  };

  return <PostsIndex posts={getAllPosts()} initialFilters={initialFilters} />;
}
