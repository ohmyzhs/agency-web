import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ContactClient } from "@/components/pages/ContactClient";

export const metadata: Metadata = createPageMetadata({
  title: "도구 요청 / 오류 제보 — Zero Human Studio",
  description: "oh-my-zhs.com의 도구 오류 제보와 기능 요청을 공개 GitHub Issue 기반으로 접수하는 페이지입니다.",
  path: "/contact",
});

export default ContactClient;
