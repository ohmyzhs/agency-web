import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPageShell } from "@/components/posts/post-page-shell";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

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

  const fallback = post.en;
  return {
    title: fallback.title,
    description: fallback.description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      title: fallback.title,
      description: fallback.description,
      type: "article",
      url: `/posts/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return <PostPageShell post={post} />;
}
