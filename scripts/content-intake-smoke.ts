import { __contentIntakeForTests } from "../src/lib/content-intake";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const trendPayload = {
  title: "AI 검색 변화 해설",
  description: "AI 검색 변화가 콘텐츠 운영에 주는 의미를 정리합니다.",
  markdown: "본문입니다.",
  category: "ai-insight",
  kind: "trend-note",
  publishMode: "local-draft",
  sourceLinks: [{ label: "Source", url: "https://example.com/news" }],
  idempotencyKey: "job-123",
};

const parsed = __contentIntakeForTests.parsePayload(JSON.stringify(trendPayload));
assert(parsed.slug === "ai", "slug should keep only supported slug characters from title");
assert(parsed.sourceLinks.length === 1, "source link should be parsed");

const artifact = __contentIntakeForTests.buildMarkdownArtifact(parsed);
assert(artifact.path === "content/posts/auto/ai.md", "post artifact path should be under content/posts/auto");
assert(artifact.markdown.includes("category: ai-insight"), "frontmatter should include category");
assert(artifact.markdown.includes("kind: trend-note"), "frontmatter should include kind");
assert(artifact.markdown.includes("idempotencyKey: job-123"), "frontmatter should include idempotency key");

let failed = false;
try {
  __contentIntakeForTests.parsePayload(JSON.stringify({
    title: "비교 글",
    description: "설명",
    markdown: "본문",
    category: "comparison-recommendation",
    kind: "comparison",
  }));
} catch {
  failed = true;
}
assert(failed, "comparison without sourceLinks should fail");

const update = __contentIntakeForTests.parsePayload(JSON.stringify({
  contentType: "update",
  title: "업데이트",
  description: "업데이트 설명",
  markdown: "변경사항",
  category: "digital-trends",
  publishMode: "local-draft",
}));
const updateArtifact = __contentIntakeForTests.buildMarkdownArtifact(update);
assert(updateArtifact.path === `content/updates/${update.slug}.md`, "update artifact path should be under content/updates");
assert(updateArtifact.markdown.includes("kind: release-note"), "update should default to release-note");

console.log("content-intake tests passed");
