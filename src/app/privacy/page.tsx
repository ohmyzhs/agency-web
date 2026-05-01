import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { PrivacyClient } from "@/components/pages/PrivacyClient";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "oh-my-zhs.com의 브라우저 로컬 도구, 연락 폼, 로그, 쿠키, 광고 관련 개인정보 처리 기준입니다.",
  path: "/privacy",
});

export default PrivacyClient;
