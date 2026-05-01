import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ContactClient } from "@/components/pages/ContactClient";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Zero Human Studio",
  description: "도구 오류 제보, 기능 제안, 콘텐츠 피드백을 Zero Human Studio에 보낼 수 있는 연락 페이지입니다.",
  path: "/contact",
});

export default ContactClient;
