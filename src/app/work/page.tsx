import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ExperimentsClient } from "@/components/pages/ExperimentsClient";

export const metadata: Metadata = createPageMetadata({
  title: "Experiments",
  description: "Zero Human Studio의 공개 실험과 향후 제품 레이어를 소개합니다. 검증된 기능은 도구와 글로 연결됩니다.",
  path: "/work",
});

export default ExperimentsClient;
