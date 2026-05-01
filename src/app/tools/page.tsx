import type { Metadata } from "next";
import { ToolsCatalog } from "@/components/tools-catalog";

export const metadata: Metadata = {
  title: "Practical Tools",
  description:
    "Practical calculators, converters, validators, and automation utilities. Korea-friendly everyday tools and developer utilities from Zero Human Studio.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return <ToolsCatalog />;
}
