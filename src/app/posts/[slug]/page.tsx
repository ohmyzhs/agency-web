import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPageShell } from "@/components/posts/post-page-shell";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { createPageMetadata } from "@/lib/seo";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const fallback = post.ko ?? post.en;
  return createPageMetadata({
    title: fallback.title,
    description: fallback.description,
    path: `/posts/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return <PostPageShell post={post} relatedPosts={getRelatedPosts(post)} />;
}
