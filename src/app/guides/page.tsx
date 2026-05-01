import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { GuidesPage } from "@/components/guides-page";
import { getPostsByKind } from "@/lib/posts";

export const metadata: Metadata = createPageMetadata({
  title: "Guides & Resources",
  description: "Evergreen guides explaining how Zero Human Studio tools work, what assumptions they use, and which Korean conventions matter.",
  path: "/guides",
});

export default function Guides() {
  return <GuidesPage guidePosts={getPostsByKind("guide")} />;
}
