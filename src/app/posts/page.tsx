import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { PostsIndex } from "@/components/posts/posts-index";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Posts",
  description: "Tool notes, IT news, Korea living guides, and field notes from Zero Human Studio.",
  path: "/posts",
});

export default function PostsPage() {
  return <PostsIndex posts={getAllPosts()} />;
}
