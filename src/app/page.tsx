import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { HomeClient } from "@/components/pages/HomeClient";

export const metadata: Metadata = createPageMetadata({
  title: "Zero Human Studio — practical tools and posts",
  description: "한국 생활 도구, 개발자 유틸리티, 자동화 노트, 실용 가이드를 함께 제공하는 oh-my-zhs.com의 tools and posts hub입니다.",
  path: "/",
});

export default HomeClient;
