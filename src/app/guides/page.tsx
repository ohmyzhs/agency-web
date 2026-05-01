import type { Metadata } from "next";
import { GuidesPage } from "@/components/guides-page";
import { getPostsByKind } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Guides & Resources",
  description:
    "How the Zero Human Studio tools work, what assumptions they use, and which Korean conventions matter when reading the results.",
  alternates: { canonical: "/guides" },
};

export default function Guides() {
  return <GuidesPage guidePosts={getPostsByKind("guide")} />;
}
