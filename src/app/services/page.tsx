import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Services moved to Guides",
  description: "The previous services page now redirects to Zero Human Studio guides and resources.",
  path: "/guides",
  noindex: true,
});

export default function ServicesPage() {
  redirect("/guides");
}
