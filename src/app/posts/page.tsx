import type { Metadata } from "next";
import { PostsIndex } from "@/components/posts/posts-index";

export const metadata: Metadata = {
  title: "Posts",
  description:
    "Tool notes, IT news, and short field notes from working between Korea and global contexts.",
  alternates: { canonical: "/posts" },
};

export default function PostsPage() {
  return <PostsIndex />;
}
