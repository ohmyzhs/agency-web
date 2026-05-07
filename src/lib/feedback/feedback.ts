export const FEEDBACK_TYPES = [
  "bug",
  "wrong-result",
  "tool-request",
  "content-correction",
  "privacy-question",
  "other",
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export type FeedbackInput = {
  type: FeedbackType;
  title: string;
  relatedUrl?: string;
  summary: string;
  expected?: string;
  actual?: string;
  reproduction?: string;
  severity?: "low" | "medium" | "high";
  replyEmail?: string;
  emailConsent: boolean;
  locale?: "ko" | "en";
  userAgent?: string;
  viewport?: string;
};

export type FeedbackConfig = {
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
  resendApiKey?: string;
  fromEmail?: string;
  replyTo?: string;
};

type Result<T> = { ok: true; value: T } | { ok: false; errors: string[] };

const TYPE_LABELS: Record<FeedbackType, string> = {
  bug: "bug",
  "wrong-result": "bug",
  "tool-request": "enhancement",
  "content-correction": "documentation",
  "privacy-question": "question",
  other: "question",
};

const MAX_LENGTHS = {
  title: 120,
  relatedUrl: 300,
  summary: 4000,
  expected: 1500,
  actual: 1500,
  reproduction: 2500,
  userAgent: 240,
  viewport: 80,
};

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function normalizeType(value: unknown): FeedbackType | null {
  return FEEDBACK_TYPES.includes(value as FeedbackType) ? (value as FeedbackType) : null;
}

function normalizeSeverity(value: unknown): FeedbackInput["severity"] {
  return value === "low" || value === "medium" || value === "high" ? value : undefined;
}

function normalizeLocale(value: unknown): FeedbackInput["locale"] {
  return value === "en" ? "en" : "ko";
}

function normalizeUrl(value: unknown): string | undefined {
  const raw = cleanText(value, MAX_LENGTHS.relatedUrl);
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    if (raw.startsWith("/")) return raw;
    return undefined;
  }
}

function normalizeEmail(value: unknown): string | undefined {
  const raw = cleanText(value, 254).toLowerCase();
  if (!raw) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return undefined;
  return raw;
}

function section(title: string, body?: string): string {
  return `## ${title}\n${body?.trim() || "_Not provided_"}`;
}

export function sanitizeFeedbackInput(payload: unknown): Result<FeedbackInput> {
  const data = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const errors: string[] = [];
  const type = normalizeType(data.type);
  const title = cleanText(data.title, MAX_LENGTHS.title);
  const summary = cleanText(data.summary, MAX_LENGTHS.summary);
  const emailConsent = data.emailConsent === true;
  const replyEmail = emailConsent ? normalizeEmail(data.replyEmail) : undefined;

  if (!type) errors.push("유효한 요청 유형을 선택해주세요.");
  if (title.length < 6) errors.push("제목은 6자 이상 입력해주세요.");
  if (summary.length < 20) errors.push("내용은 20자 이상 입력해주세요.");
  if (emailConsent && !replyEmail) errors.push("진행 메일을 받으려면 유효한 이메일 주소가 필요합니다.");

  if (errors.length > 0 || !type) return { ok: false, errors };

  return {
    ok: true,
    value: {
      type,
      title,
      relatedUrl: normalizeUrl(data.relatedUrl),
      summary,
      expected: cleanText(data.expected, MAX_LENGTHS.expected) || undefined,
      actual: cleanText(data.actual, MAX_LENGTHS.actual) || undefined,
      reproduction: cleanText(data.reproduction, MAX_LENGTHS.reproduction) || undefined,
      severity: normalizeSeverity(data.severity),
      replyEmail,
      emailConsent,
      locale: normalizeLocale(data.locale),
      userAgent: cleanText(data.userAgent, MAX_LENGTHS.userAgent) || undefined,
      viewport: cleanText(data.viewport, MAX_LENGTHS.viewport) || undefined,
    },
  };
}

export function buildRequestId(now = new Date()): string {
  const timestamp = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ZHS-${timestamp}-${suffix}`;
}

export function labelsForFeedback(type: FeedbackType): string[] {
  return ["from-site-request", "needs-triage", TYPE_LABELS[type]];
}

export function fallbackLabelsForFeedback(type: FeedbackType): string[] {
  return [TYPE_LABELS[type]];
}

export function buildFeedbackIssueTitle(input: FeedbackInput, requestId: string): string {
  return `[${TYPE_LABELS[input.type]}] ${input.title} (${requestId})`;
}

export function buildFeedbackIssueBody(input: FeedbackInput, requestId: string): string {
  const lines = [
    `Request ID: \`${requestId}\``,
    `Type: \`${input.type}\``,
    `Severity: \`${input.severity || "not-specified"}\``,
    `Locale: \`${input.locale || "ko"}\``,
    `Related URL: ${input.relatedUrl || "_Not provided_"}`,
    "",
    section("Summary", input.summary),
    section("Expected result", input.expected),
    section("Actual result", input.actual),
    section("Reproduction / input data", input.reproduction),
    section(
      "Environment",
      [`User agent: ${input.userAgent || "_Not provided_"}`, `Viewport: ${input.viewport || "_Not provided_"}`].join("\n"),
    ),
    "---",
    "Submitted from the oh-my-zhs.com structured feedback form.",
    "Private reply email, if provided, is intentionally excluded from this public issue body.",
  ];

  return lines.join("\n\n");
}

export function getFeedbackConfig(env: Record<string, string | undefined>): Result<FeedbackConfig> {
  const githubToken = env.GITHUB_TOKEN?.trim();
  const githubOwner = env.GITHUB_OWNER?.trim() || "ohmyzhs";
  const githubRepo = env.GITHUB_REPO?.trim() || "agency-web";
  const resendApiKey = env.RESEND_API_KEY?.trim();
  const fromEmail = env.FEEDBACK_FROM_EMAIL?.trim();
  const replyTo = env.FEEDBACK_REPLY_TO?.trim();
  const errors: string[] = [];

  if (!githubToken) errors.push("GITHUB_TOKEN is not configured.");
  if (!githubOwner) errors.push("GITHUB_OWNER is not configured.");
  if (!githubRepo) errors.push("GITHUB_REPO is not configured.");
  if (resendApiKey && !fromEmail) errors.push("FEEDBACK_FROM_EMAIL is required when RESEND_API_KEY is configured.");

  if (errors.length > 0 || !githubToken) return { ok: false, errors };

  return {
    ok: true,
    value: {
      githubToken,
      githubOwner,
      githubRepo,
      resendApiKey,
      fromEmail,
      replyTo,
    },
  };
}

export function receiptEmailSubject(requestId: string, issueNumber: number): string {
  return `[ZHS] 요청이 접수되었습니다: #${issueNumber} (${requestId})`;
}

export function receiptEmailHtml(input: FeedbackInput, requestId: string, issueUrl: string): string {
  const escapedTitle = escapeHtml(input.title);
  const escapedRequestId = escapeHtml(requestId);
  const escapedIssueUrl = escapeHtml(issueUrl);

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111827;">
      <h1 style="font-size: 20px;">Zero Human Studio 요청 접수</h1>
      <p>요청이 접수되었습니다.</p>
      <ul>
        <li><strong>Request ID:</strong> ${escapedRequestId}</li>
        <li><strong>Title:</strong> ${escapedTitle}</li>
        <li><strong>GitHub Issue:</strong> <a href="${escapedIssueUrl}">${escapedIssueUrl}</a></li>
      </ul>
      <p>진행 상황은 위 GitHub Issue 댓글을 기준으로 남깁니다. 모든 요청이 반영되지는 않으며, 위험도가 큰 변경은 사람 확인 후 진행합니다.</p>
      <p style="color: #6b7280; font-size: 13px;">이 메일은 oh-my-zhs.com 요청폼에서 발송되었습니다.</p>
    </div>
  `;
}

export function receiptEmailText(input: FeedbackInput, requestId: string, issueUrl: string): string {
  return [
    "Zero Human Studio 요청 접수",
    "",
    "요청이 접수되었습니다.",
    `Request ID: ${requestId}`,
    `Title: ${input.title}`,
    `GitHub Issue: ${issueUrl}`,
    "",
    "진행 상황은 위 GitHub Issue 댓글을 기준으로 남깁니다. 모든 요청이 반영되지는 않으며, 위험도가 큰 변경은 사람 확인 후 진행합니다.",
    "",
    "이 메일은 oh-my-zhs.com 요청폼에서 발송되었습니다.",
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
