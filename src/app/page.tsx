import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { HomeClient } from "@/components/pages/HomeClient";
import { getAllPosts } from "@/lib/posts";
import { getAllTools } from "@/lib/tools";

export const metadata: Metadata = createPageMetadata({
  title: "Zero Human Studio — practical tools and posts",
  description: "한국 생활 도구, 개발자 유틸리티, 자동화 노트, 실용 가이드를 함께 제공하는 oh-my-zhs.com의 tools and posts hub입니다.",
  path: "/",
});

export default function HomePage() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 6);
  const allTools = getAllTools();

  // Choose featured tools based on specific slugs for high marketing impact
  const featuredSlugs = [
    "pyeong-converter",
    "kst-timezone-converter",
    "image-to-ascii-art",
    "qr-barcode-generator",
    "json-yaml-validator"
  ];
  const featuredTools = allTools.filter(t => featuredSlugs.includes(t.slug));

  return (
    <HomeClient
      latestPosts={latestPosts}
      allPosts={allPosts}
      featuredTools={featuredTools}
      allTools={allTools}
      totalToolCount={allTools.length}
    />
  );
}
