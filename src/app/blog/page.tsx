import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: "Blog alias for Zero Human Studio posts. Canonical content is available at /posts.",
  path: "/posts",
  noindex: true,
});

export default function BlogAliasPage() {
  redirect("/posts");
}
