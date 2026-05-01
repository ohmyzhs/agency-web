import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { ToolsCatalog } from "@/components/tools-catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Practical Tools",
  description: "Practical calculators, converters, validators, and automation utilities. Korea-friendly everyday tools and developer utilities from Zero Human Studio.",
  path: "/tools",
});

export default function ToolsPage() {
  return <ToolsCatalog />;
}
