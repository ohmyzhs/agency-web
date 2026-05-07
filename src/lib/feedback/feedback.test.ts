import assert from "node:assert/strict";
import test from "node:test";
import {
  buildFeedbackIssueBody,
  getFeedbackConfig,
  sanitizeFeedbackInput,
} from "./feedback";

test("sanitizes feedback and keeps reply email private", () => {
  const input = sanitizeFeedbackInput({
    type: "wrong-result",
    title: "  내 IP 결과가 달라요  ",
    relatedUrl: "https://oh-my-zhs.com/tools/network/my-ip",
    summary: "네이버는 61.82.99.181인데 사이트는 54.180.255.183을 보여줍니다.",
    expected: "61.82.99.181",
    actual: "54.180.255.183",
    reproduction: "여러 번 새로고침",
    severity: "high",
    replyEmail: "gabriel@example.com",
    emailConsent: true,
    locale: "ko",
    userAgent: "Mozilla/5.0",
    viewport: "390x844",
  });

  assert.equal(input.ok, true);
  if (!input.ok) return;
  assert.equal(input.value.title, "내 IP 결과가 달라요");
  assert.equal(input.value.replyEmail, "gabriel@example.com");

  const body = buildFeedbackIssueBody(input.value, "REQ-123");
  assert.match(body, /Request ID: `REQ-123`/);
  assert.match(body, /wrong-result/);
  assert.match(body, /61\.82\.99\.181/);
  assert.doesNotMatch(body, /gabriel@example\.com/);
});

test("rejects invalid or missing required feedback fields", () => {
  const input = sanitizeFeedbackInput({ type: "bug", title: "hi", summary: "short" });
  assert.equal(input.ok, false);
});

test("loads sender config from environment", () => {
  const config = getFeedbackConfig({
    GITHUB_TOKEN: "token",
    GITHUB_OWNER: "ohmyzhs",
    GITHUB_REPO: "agency-web",
    RESEND_API_KEY: "resend",
    FEEDBACK_FROM_EMAIL: "Zero Human Studio <no-reply@oh-my-zhs.com>",
    FEEDBACK_REPLY_TO: "no-reply@oh-my-zhs.com",
  });
  assert.equal(config.ok, true);
  if (!config.ok) return;
  assert.equal(config.value.fromEmail, "Zero Human Studio <no-reply@oh-my-zhs.com>");
});
