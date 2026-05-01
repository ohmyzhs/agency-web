import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { DisclaimerClient } from "@/components/pages/DisclaimerClient";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description: "환율, 시간대, 단위, 자동화, 개발자 도구 결과가 참고용이라는 점과 공식 판단 전 확인해야 할 한계를 설명합니다.",
  path: "/disclaimer",
});

export default DisclaimerClient;
