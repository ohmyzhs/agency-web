import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import TypingLandingContent from "@/components/typing/TypingLandingContent";

export const metadata: Metadata = createPageMetadata({
  title: "Typing Practice — key zones, words, sentences, long-form copy and typing games | oh-my-zhs",
  description:
    "oh-my-zhs typing practice combines key-zone drills, word and sentence practice, long-form copy, Word Defense, and local progress tracking in one free browser-based practice flow.",
  path: "/typing",
});

export default function TypingPage() {
  return <TypingLandingContent />;
}
