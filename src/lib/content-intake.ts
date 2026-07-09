import * as crypto from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const PUBLIC_CATEGORIES = [
  "ai-insight",
  "practical-guide",
  "comparison-recommendation",
  "work-productivity",
  "digital-trends",
  "daily-issue",
  "news-ai-insight",
  "news-general",
  "news-economy",
] as const;

const POST_KINDS = [
  "guide",
  "news-explainer",
  "comparison",
  "workflow",
  "trend-note",
  "retrospective",
  "experiment",
  "site-note",
  "release-note",
  "it-news",
  "daily",
  "tool-note",
] as const;

const PUBLISH_MODES = ["draft-pr", "direct-main", "local-draft"] as const;

type ContentType = "post" | "update";
type PublicCategory = (typeof PUBLIC_CATEGORIES)[number];
type PostKind = (typeof POST_KINDS)[number];
type PublishMode = (typeof PUBLISH_MODES)[number];
type ContentStatus = "draft" | "published";

type SourceLink = { label: string; url: string };

type IntakePayload = {
  contentType: ContentType;
  channel?: string;
  sourceApp?: string;
  idempotencyKey?: string;
  title: string;
  slug: string;
  description: string;
  markdown: string;
  category: PublicCategory;
  kind: PostKind;
  locale: "ko" | "en" | "both";
  status: ContentStatus;
  publishMode: PublishMode;
  tags: string[];
  sourceLinks: SourceLink[];
  relatedTools: string[];
  deliveryTargets: string[];
  social?: Record<string, unknown>;
};

type Artifact = {
  path: string;
  markdown: string;
  slug: string;
  branchName: string;
  commitMessage: string;
};

type IntakeResult = {
  ok: true;
  mode: PublishMode;
  contentType: ContentType;
  path: string;
  slug: string;
  branch?: string;
  commitUrl?: string;
  pullRequestUrl?: string;
  localPath?: string;
};

type IntakeErrorCode = "unauthorized" | "forbidden" | "bad_request" | "conflict" | "github_error";

export class IntakeError extends Error {
  status: number;
  code: IntakeErrorCode;
  details?: unknown;

  constructor(status: number, code: IntakeErrorCode, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
}

function asSourceLinks(value: unknown): SourceLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      label: asString(item.label) ?? asString(item.title) ?? asString(item.url) ?? "Source",
      url: asString(item.url) ?? "",
    }))
    .filter((item) => item.url.startsWith("http://") || item.url.startsWith("https://"));
}

export function slugify(input: string): string {
  const ascii = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  if (ascii) return ascii.slice(0, 96);
  return `content-${crypto.createHash("sha1").update(input).digest("hex").slice(0, 10)}`;
}

function estimateReadingMinutes(markdown: string): number {
  const chars = markdown.replace(/\s+/g, "").length;
  return Math.max(1, Math.ceil(chars / 900));
}

function yamlScalar(value: string): string {
  if (/^[A-Za-z0-9_.:/@ -]+$/.test(value) && value.trim() === value && value !== "") return value;
  return JSON.stringify(value);
}

function yamlList(values: string[]): string {
  if (values.length === 0) return "[]";
  return values.map((value) => `\n  - ${yamlScalar(value)}`).join("");
}

function yamlSourceLinks(values: SourceLink[]): string {
  if (values.length === 0) return "[]";
  return values.map((value) => `\n  - label: ${yamlScalar(value.label)}\n    url: ${yamlScalar(value.url)}`).join("");
}

function parsePayload(rawBody: string): IntakePayload {
  let data: unknown;
  try {
    data = JSON.parse(rawBody);
  } catch {
    throw new IntakeError(400, "bad_request", "Request body must be valid JSON.");
  }
  if (!isRecord(data)) throw new IntakeError(400, "bad_request", "Request body must be a JSON object.");

  const title = asString(data.title);
  const description = asString(data.description);
  const markdown = asString(data.markdown);
  if (!title) throw new IntakeError(400, "bad_request", "title is required.");
  if (!description) throw new IntakeError(400, "bad_request", "description is required.");
  if (!markdown) throw new IntakeError(400, "bad_request", "markdown is required.");

  const contentType = (asString(data.contentType) ?? "post") as ContentType;
  if (contentType !== "post" && contentType !== "update") {
    throw new IntakeError(400, "bad_request", "contentType must be post or update.");
  }

  const category = asString(data.category) as PublicCategory | undefined;
  if (!category || !PUBLIC_CATEGORIES.includes(category)) {
    throw new IntakeError(400, "bad_request", `category must be one of: ${PUBLIC_CATEGORIES.join(", ")}.`);
  }

  const defaultKind = contentType === "update" ? "release-note" : "guide";
  const kind = (asString(data.kind) ?? defaultKind) as PostKind;
  if (!POST_KINDS.includes(kind)) {
    throw new IntakeError(400, "bad_request", `kind must be one of: ${POST_KINDS.join(", ")}.`);
  }
  if (contentType === "update" && kind !== "release-note" && kind !== "site-note") {
    throw new IntakeError(400, "bad_request", "update contentType only accepts release-note or site-note kind.");
  }

  const status = (asString(data.status) ?? "draft") as ContentStatus;
  if (status !== "draft" && status !== "published") throw new IntakeError(400, "bad_request", "status must be draft or published.");

  const publishMode = (asString(data.publishMode) ?? process.env.POST_PUBLISH_DEFAULT_MODE ?? "draft-pr") as PublishMode;
  if (!PUBLISH_MODES.includes(publishMode)) throw new IntakeError(400, "bad_request", `publishMode must be one of: ${PUBLISH_MODES.join(", ")}.`);

  const locale = (asString(data.locale) ?? "ko") as IntakePayload["locale"];
  if (locale !== "ko" && locale !== "en" && locale !== "both") throw new IntakeError(400, "bad_request", "locale must be ko, en, or both.");

  const sourceLinks = asSourceLinks(data.sourceLinks);
  if ((kind === "news-explainer" || kind === "trend-note" || kind === "comparison") && sourceLinks.length === 0) {
    throw new IntakeError(400, "bad_request", "news-explainer, trend-note, and comparison posts require at least one sourceLinks item.");
  }

  return {
    contentType,
    channel: asString(data.channel),
    sourceApp: asString(data.sourceApp),
    idempotencyKey: asString(data.idempotencyKey),
    title,
    slug: slugify(asString(data.slug) ?? title),
    description,
    markdown,
    category,
    kind,
    locale,
    status,
    publishMode,
    tags: asStringArray(data.tags),
    sourceLinks,
    relatedTools: asStringArray(data.relatedTools ?? data.related_tools),
    deliveryTargets: asStringArray(data.deliveryTargets),
    social: isRecord(data.social) ? data.social : undefined,
  };
}

export function buildMarkdownArtifact(payload: IntakePayload): Artifact {
  const now = new Date().toISOString().slice(0, 10);
  const contentPath = payload.contentType === "update"
    ? `content/updates/${payload.slug}.md`
    : `content/posts/auto/${payload.slug}.md`;
  const marker = payload.idempotencyKey ? slugify(payload.idempotencyKey).slice(0, 48) : crypto.createHash("sha1").update(payload.slug).digest("hex").slice(0, 10);
  const branchName = `content/${payload.contentType}-${payload.slug}-${marker}`.slice(0, 120);
  const type = payload.contentType === "update" ? "update" : "blog-draft";
  const frontmatter = [
    "---",
    `type: ${type}`,
    `status: ${payload.status}`,
    payload.sourceApp ? `authoring_harness: ${yamlScalar(payload.sourceApp)}` : undefined,
    `created: ${now}`,
    `updated: ${now}`,
    `title: ${yamlScalar(payload.title)}`,
    `slug: ${payload.slug}`,
    `kind: ${payload.kind}`,
    `category: ${payload.category}`,
    `locale: ${payload.locale}`,
    `publishedAt: ${now}`,
    `readingMinutes: ${estimateReadingMinutes(payload.markdown)}`,
    `description: ${yamlScalar(payload.description)}`,
    `tags:${yamlList(payload.tags)}`,
    `related_tools:${yamlList(payload.relatedTools)}`,
    `sourceLinks:${yamlSourceLinks(payload.sourceLinks)}`,
    payload.idempotencyKey ? `idempotencyKey: ${yamlScalar(payload.idempotencyKey)}` : undefined,
    "---",
  ].filter(Boolean).join("\n");

  const body = payload.markdown.trim().startsWith("# ") ? payload.markdown.trim() : `# ${payload.title}\n\n${payload.markdown.trim()}`;
  return {
    path: contentPath,
    markdown: `${frontmatter}\n${body}\n`,
    slug: payload.slug,
    branchName,
    commitMessage: `${payload.status === "published" ? "publish" : "draft"}: add ${payload.contentType} ${payload.slug}`,
  };
}

function timingSafeEqualString(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function verifyAuth(headers: Headers, rawBody: string) {
  const expectedToken = process.env.CONTENT_WEBHOOK_BEARER_TOKEN || process.env.POST_PUBLISH_BEARER_TOKEN;
  if (!expectedToken) throw new IntakeError(401, "unauthorized", "Content intake bearer token is not configured.");

  const auth = headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token || !timingSafeEqualString(token, expectedToken)) {
    throw new IntakeError(401, "unauthorized", "Invalid bearer token.");
  }

  const hmacSecret = process.env.CONTENT_WEBHOOK_HMAC_SECRET;
  if (!hmacSecret) return;

  const signature = headers.get("x-zhs-signature") ?? "";
  const expected = `sha256=${crypto.createHmac("sha256", hmacSecret).update(rawBody).digest("hex")}`;
  if (!signature || !timingSafeEqualString(signature, expected)) {
    throw new IntakeError(403, "forbidden", "Invalid HMAC signature.");
  }
}

async function githubRequest<T>(url: string, init: RequestInit): Promise<T> {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) throw new IntakeError(502, "github_error", "GITHUB_CONTENT_TOKEN is not configured.");
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    throw new IntakeError(response.status === 409 ? 409 : 502, response.status === 409 ? "conflict" : "github_error", `GitHub API failed: ${response.status}`, json);
  }
  return json as T;
}

async function githubPublish(payload: IntakePayload, artifact: Artifact): Promise<IntakeResult> {
  const repo = process.env.POST_PUBLISH_REPO ?? "ohmyzhs/agency-web";
  const baseBranch = process.env.POST_PUBLISH_BASE_BRANCH ?? "main";
  const encodedPath = artifact.path.split("/").map(encodeURIComponent).join("/");
  const apiBase = `https://api.github.com/repos/${repo}`;
  let targetBranch = baseBranch;

  if (payload.publishMode === "draft-pr") {
    const baseRef = await githubRequest<{ object: { sha: string } }>(`${apiBase}/git/ref/heads/${encodeURIComponent(baseBranch)}`, { method: "GET" });
    targetBranch = artifact.branchName;
    try {
      await githubRequest(`${apiBase}/git/ref/heads/${encodeURIComponent(targetBranch)}`, { method: "GET" });
      throw new IntakeError(409, "conflict", "A content branch for this idempotency key already exists.", { branch: targetBranch });
    } catch (error) {
      if (error instanceof IntakeError && error.status !== 502) throw error;
    }
    await githubRequest(`${apiBase}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${targetBranch}`, sha: baseRef.object.sha }),
    });
  }

  let existingSha: string | undefined;
  try {
    const existing = await githubRequest<{ sha: string }>(`${apiBase}/contents/${encodedPath}?ref=${encodeURIComponent(targetBranch)}`, { method: "GET" });
    existingSha = existing.sha;
  } catch (error) {
    if (!(error instanceof IntakeError) || error.status !== 502) throw error;
  }

  const contentResult = await githubRequest<{ content?: { html_url?: string }; commit?: { html_url?: string } }>(`${apiBase}/contents/${encodedPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: artifact.commitMessage,
      content: Buffer.from(artifact.markdown, "utf8").toString("base64"),
      branch: targetBranch,
      sha: existingSha,
    }),
  });

  if (payload.publishMode === "direct-main") {
    return { ok: true, mode: payload.publishMode, contentType: payload.contentType, path: artifact.path, slug: artifact.slug, branch: targetBranch, commitUrl: contentResult.commit?.html_url };
  }

  const pr = await githubRequest<{ html_url: string }>(`${apiBase}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: artifact.commitMessage,
      head: targetBranch,
      base: baseBranch,
      body: [
        "Automated content intake request.",
        "",
        `- Source app: ${payload.sourceApp ?? "unknown"}`,
        `- Content type: ${payload.contentType}`,
        `- Path: \`${artifact.path}\``,
        payload.idempotencyKey ? `- Idempotency key: \`${payload.idempotencyKey}\`` : undefined,
      ].filter(Boolean).join("\n"),
      draft: true,
    }),
  });

  return { ok: true, mode: payload.publishMode, contentType: payload.contentType, path: artifact.path, slug: artifact.slug, branch: targetBranch, commitUrl: contentResult.commit?.html_url, pullRequestUrl: pr.html_url };
}

async function localDraftPublish(payload: IntakePayload, artifact: Artifact): Promise<IntakeResult> {
  if (process.env.NODE_ENV === "production" && process.env.POST_PUBLISH_ALLOW_LOCAL_DRAFTS !== "true") {
    throw new IntakeError(403, "forbidden", "local-draft mode is disabled in production.");
  }
  const localPath = path.join(process.cwd(), artifact.path);
  try {
    await fs.access(localPath);
    throw new IntakeError(409, "conflict", "Local content artifact already exists.", { path: artifact.path });
  } catch (error) {
    if (error instanceof IntakeError) throw error;
  }
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, artifact.markdown, "utf8");
  return { ok: true, mode: payload.publishMode, contentType: payload.contentType, path: artifact.path, slug: artifact.slug, branch: artifact.branchName, localPath };
}

export async function handleContentIntakeRequest(request: Request): Promise<Response> {
  try {
    const rawBody = await request.text();
    verifyAuth(request.headers, rawBody);
    const payload = parsePayload(rawBody);
    const artifact = buildMarkdownArtifact(payload);
    const result = payload.publishMode === "local-draft"
      ? await localDraftPublish(payload, artifact)
      : await githubPublish(payload, artifact);
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof IntakeError) {
      return Response.json({ ok: false, code: error.code, message: error.message, details: error.details }, { status: error.status });
    }
    return Response.json({ ok: false, code: "github_error", message: "Unexpected content intake failure." }, { status: 502 });
  }
}

export const __contentIntakeForTests = {
  parsePayload,
  buildMarkdownArtifact,
  slugify,
};
