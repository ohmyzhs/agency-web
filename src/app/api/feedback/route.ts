import { NextResponse } from "next/server";
import {
  buildFeedbackIssueBody,
  buildFeedbackIssueTitle,
  buildRequestId,
  fallbackLabelsForFeedback,
  getFeedbackConfig,
  labelsForFeedback,
  receiptEmailHtml,
  receiptEmailSubject,
  receiptEmailText,
  sanitizeFeedbackInput,
  type FeedbackConfig,
  type FeedbackInput,
} from "@/lib/feedback/feedback";

export const runtime = "nodejs";

type GitHubIssueResponse = {
  number: number;
  html_url: string;
};

type ResendResponse = {
  id?: string;
};

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ["요청 본문을 JSON으로 읽을 수 없습니다."] }, { status: 400 });
  }

  const input = sanitizeFeedbackInput(payload);
  if (!input.ok) {
    return NextResponse.json({ ok: false, errors: input.errors }, { status: 400 });
  }

  const config = getFeedbackConfig(process.env);
  if (!config.ok) {
    console.error("Feedback config missing", config.errors);
    return NextResponse.json({ ok: false, errors: ["요청 접수 설정이 아직 완료되지 않았습니다."] }, { status: 500 });
  }

  const requestId = buildRequestId();

  try {
    const issue = await createGitHubIssue(input.value, requestId, config.value);
    const email = await maybeSendReceiptEmail(input.value, requestId, issue, config.value);

    return NextResponse.json(
      {
        ok: true,
        requestId,
        issue: {
          number: issue.number,
          url: issue.html_url,
        },
        email,
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Feedback submission failed", error);
    return NextResponse.json(
      { ok: false, errors: ["요청을 접수하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."] },
      { status: 502 },
    );
  }
}

async function createGitHubIssue(
  input: FeedbackInput,
  requestId: string,
  config: FeedbackConfig,
): Promise<GitHubIssueResponse> {
  const payload = {
    title: buildFeedbackIssueTitle(input, requestId),
    body: buildFeedbackIssueBody(input, requestId),
    labels: labelsForFeedback(input.type),
  };

  let response = await postGitHubIssue(config, payload);

  if (!response.ok && response.status === 422) {
    response = await postGitHubIssue(config, { ...payload, labels: fallbackLabelsForFeedback(input.type) });
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub issue creation failed: ${response.status} ${body.slice(0, 300)}`);
  }

  return (await response.json()) as GitHubIssueResponse;
}

function postGitHubIssue(
  config: FeedbackConfig,
  payload: { title: string; body: string; labels: string[] },
): Promise<Response> {
  return fetch(`https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/issues`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
      "User-Agent": "oh-my-zhs-feedback-form",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(payload),
  });
}

async function maybeSendReceiptEmail(
  input: FeedbackInput,
  requestId: string,
  issue: GitHubIssueResponse,
  config: FeedbackConfig,
): Promise<{ sent: boolean; id?: string; skippedReason?: string }> {
  if (!input.replyEmail || !input.emailConsent) return { sent: false, skippedReason: "no-email-consent" };
  if (!config.resendApiKey || !config.fromEmail) return { sent: false, skippedReason: "email-not-configured" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [input.replyEmail],
      reply_to: config.replyTo,
      subject: receiptEmailSubject(requestId, issue.number),
      html: receiptEmailHtml(input, requestId, issue.html_url),
      text: receiptEmailText(input, requestId, issue.html_url),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Resend receipt failed: ${response.status} ${body.slice(0, 300)}`);
    return { sent: false, skippedReason: "resend-failed" };
  }

  const data = (await response.json()) as ResendResponse;
  return { sent: true, id: data.id };
}
