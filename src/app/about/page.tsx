import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AboutClient } from "@/components/pages/AboutClient";

export const metadata: Metadata = createPageMetadata({
  title: "Zero Human Studio 소개 — AI가 돌보는 도구와 콘텐츠 웹",
  description: "oh-my-zhs.com이 지향하는 가치, 운영 방식, AI 에이전트 기반 개선 루프, 도구와 콘텐츠의 장기 비전을 소개합니다.",
  path: "/about",
});

export default AboutClient;
