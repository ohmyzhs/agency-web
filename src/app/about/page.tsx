import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AboutClient } from "@/components/pages/AboutClient";

export const metadata: Metadata = createPageMetadata({
  title: "About Zero Human Studio",
  description: "Zero Human Studio가 운영하는 한국 생활 도구, 개발자 유틸리티, 글과 실험의 방향과 운영 기준을 소개합니다.",
  path: "/about",
});

export default AboutClient;
