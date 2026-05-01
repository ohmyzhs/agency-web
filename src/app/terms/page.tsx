import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { TermsClient } from "@/components/pages/TermsClient";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Use",
  description: "Zero Human Studio 도구와 콘텐츠 사용 조건, 책임 범위, 금지 행위, 변경 기준을 안내합니다.",
  path: "/terms",
});

export default TermsClient;
