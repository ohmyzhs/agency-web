"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useLocale } from "@/components/providers";
import { FEEDBACK_TYPES, type FeedbackType } from "@/lib/feedback/feedback";

const GITHUB_REPO_URL = "https://github.com/ohmyzhs/agency-web";
const GITHUB_NEW_ISSUE_URL = "https://github.com/ohmyzhs/agency-web/issues/new";
const GITHUB_ISSUES_URL = "https://github.com/ohmyzhs/agency-web/issues";

type FormState = {
  type: FeedbackType;
  title: string;
  relatedUrl: string;
  summary: string;
  expected: string;
  actual: string;
  reproduction: string;
  severity: "" | "low" | "medium" | "high";
  replyEmail: string;
  emailConsent: boolean;
};

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; requestId: string; issueNumber: number; issueUrl: string; emailSent: boolean }
  | { status: "error"; errors: string[] };

const initialForm: FormState = {
  type: "bug",
  title: "",
  relatedUrl: "",
  summary: "",
  expected: "",
  actual: "",
  reproduction: "",
  severity: "",
  replyEmail: "",
  emailConsent: false,
};

const copy = {
  ko: {
    eyebrow: "request / feedback",
    title: "도구 요청과 오류 제보는 공개 이슈로 남깁니다.",
    description:
      "사이트 요청폼으로 내용을 보내면 GitHub Issue가 자동 생성됩니다. 이메일을 남기고 동의하면 no-reply@oh-my-zhs.com에서 접수 메일도 발송합니다.",
    statusLabel: "현재 상태",
    statusTitle: "구조화된 요청폼이 연결되었습니다.",
    statusBody:
      "요청은 공개 GitHub Issue로 기록되고, 이메일 주소는 공개 이슈 본문에 넣지 않습니다. AI Agent와 관리자는 이슈 댓글을 기준으로 검토·진행 상황을 남깁니다.",
    primaryCta: "GitHub Issue 직접 작성",
    secondaryCta: "공개 저장소 보기",
    issuesCta: "진행 중인 이슈 보기",
    githubTitle: "GitHub로 직접 요청하는 경우",
    githubBody:
      "형식에 얽매이지 않고 자유롭게 작성할 수 있습니다. 개발자나 파워유저에게 적합하며, 모든 논의와 처리 로그는 이슈 댓글에 남습니다.",
    siteTitle: "사이트 요청폼으로 보내는 경우",
    siteBody:
      "정해진 항목으로 입력되어 자동 분류와 재현 검증이 쉬워집니다. 이메일을 남기면 접수·진행·완료 메일에 같은 GitHub Issue 링크가 계속 포함됩니다.",
    formTitle: "사이트 요청폼",
    formLead:
      "오류 제보, 결과값 이상, 도구 요청, 콘텐츠 정정 등을 보낼 수 있습니다. 개인정보나 긴급 보안 내용은 공개 이슈에 남기지 마세요.",
    typeLabel: "요청 유형",
    typeOptions: {
      bug: "오류 제보",
      "wrong-result": "결과값 이상",
      "tool-request": "도구 요청",
      "content-correction": "콘텐츠 정정",
      "privacy-question": "개인정보 문의",
      other: "기타",
    },
    severityLabel: "우선도 / 영향도",
    severityOptions: {
      "": "선택 안 함",
      low: "낮음",
      medium: "보통",
      high: "높음",
    },
    titleLabel: "제목",
    relatedUrlLabel: "관련 페이지 URL",
    summaryLabel: "요약 / 설명",
    expectedLabel: "기대한 결과",
    actualLabel: "실제 결과",
    reproductionLabel: "재현 방법 / 입력값",
    emailLabel: "진행 메일을 받을 이메일(선택)",
    consentLabel: "이메일로 접수·진행 알림을 받겠습니다. 이메일은 공개 GitHub Issue 본문에 포함되지 않습니다.",
    submit: "요청 접수하기",
    submitting: "접수 중...",
    policyTitle: "처리 기준",
    policies: [
      "모든 요청이 반영되지는 않습니다. 실제 오류와 반복되는 개선 요청을 우선 검토합니다.",
      "이메일 주소 같은 개인정보는 공개 GitHub Issue 본문에 노출하지 않습니다.",
      "외부 API, 사용자 데이터 저장, 보안·개인정보, 큰 UI 변경은 사람 확인 후 진행합니다.",
      "낮은 위험도의 명확한 수정은 테스트와 배포 검증을 거쳐 자동 처리할 수 있습니다.",
    ],
    successTitle: "요청이 접수되었습니다.",
    emailSent: "접수 메일도 발송했습니다.",
    emailSkipped: "이메일 알림 없이 GitHub Issue만 생성했습니다.",
    viewIssue: "생성된 Issue 보기",
    resetForm: "다른 요청 보내기",
    errorTitle: "접수하지 못했습니다.",
  },
  en: {
    eyebrow: "request / feedback",
    title: "Tool requests and bug reports belong in public issues.",
    description:
      "Submit the structured form and ZHS will create a GitHub Issue automatically. If you leave an email and consent, a receipt is sent from no-reply@oh-my-zhs.com.",
    statusLabel: "Current status",
    statusTitle: "The structured request form is connected.",
    statusBody:
      "Requests are recorded as public GitHub Issues, while email addresses are kept out of the public issue body. The AI Agent and maintainer use issue comments as the progress log.",
    primaryCta: "Create GitHub Issue",
    secondaryCta: "View public repo",
    issuesCta: "Browse open issues",
    githubTitle: "When you use GitHub directly",
    githubBody:
      "You can write freely without the site template. This is better for developers and power users; discussion and handling history stay in issue comments.",
    siteTitle: "When you use the site form",
    siteBody:
      "The report is structured for automatic triage and reproduction checks. If you leave an email, receipt, progress, and completion messages keep linking to the same GitHub Issue.",
    formTitle: "Site request form",
    formLead:
      "Send bug reports, wrong results, tool requests, and content corrections. Do not place private data or urgent security details into public issues.",
    typeLabel: "Request type",
    typeOptions: {
      bug: "Bug report",
      "wrong-result": "Wrong result",
      "tool-request": "Tool request",
      "content-correction": "Content correction",
      "privacy-question": "Privacy question",
      other: "Other",
    },
    severityLabel: "Priority / impact",
    severityOptions: {
      "": "Not specified",
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    titleLabel: "Title",
    relatedUrlLabel: "Related page URL",
    summaryLabel: "Summary / description",
    expectedLabel: "Expected result",
    actualLabel: "Actual result",
    reproductionLabel: "Reproduction steps / input data",
    emailLabel: "Email for progress updates (optional)",
    consentLabel: "I agree to receive receipt/progress email. My email will not be included in the public GitHub Issue body.",
    submit: "Submit request",
    submitting: "Submitting...",
    policyTitle: "Handling standards",
    policies: [
      "Not every request will be implemented. Real bugs and repeated improvement requests are reviewed first.",
      "Personal data such as email addresses will not be placed in public GitHub Issue bodies.",
      "External APIs, user-data storage, security/privacy work, and large UI changes require human confirmation.",
      "Clear low-risk fixes may be handled automatically after tests and deployment verification.",
    ],
    successTitle: "Request received.",
    emailSent: "A receipt email was sent too.",
    emailSkipped: "Only the GitHub Issue was created; no email notification was sent.",
    viewIssue: "View created Issue",
    resetForm: "Send another request",
    errorTitle: "Could not submit the request.",
  },
} as const;

export function ContactClient() {
  const { locale } = useLocale();
  const t = copy[locale];
  const [form, setForm] = useState<FormState>(initialForm);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "submitting" });

    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        severity: form.severity || undefined,
        locale,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { ok: true; requestId: string; issue: { number: number; url: string }; email?: { sent: boolean } }
      | { ok: false; errors?: string[] }
      | null;

    if (!response.ok || !data || !data.ok) {
      setSubmission({ status: "error", errors: data && !data.ok && data.errors ? data.errors : ["Unknown error"] });
      return;
    }

    setSubmission({
      status: "success",
      requestId: data.requestId,
      issueNumber: data.issue.number,
      issueUrl: data.issue.url,
      emailSent: data.email?.sent === true,
    });
    setForm(initialForm);
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="zhs-eyebrow">{t.eyebrow}</p>
            <h1 className="mt-4 font-mono text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
              {t.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={GITHUB_NEW_ISSUE_URL} target="_blank" rel="noreferrer" className="rounded-sm border border-foreground bg-foreground px-5 py-2.5 font-mono text-sm text-background transition-colors hover:border-primary hover:bg-primary">
                {t.primaryCta}
              </a>
              <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="rounded-sm border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground">
                {t.secondaryCta}
              </a>
              <a href={GITHUB_ISSUES_URL} target="_blank" rel="noreferrer" className="rounded-sm border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground">
                {t.issuesCta}
              </a>
            </div>
          </div>

          <aside className="rounded-md border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">{t.statusLabel}</p>
            <h2 className="mt-3 font-mono text-xl font-semibold tracking-tight">{t.statusTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.statusBody}</p>
          </aside>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-2">
          <article className="rounded-md border border-border bg-background p-6">
            <h2 className="font-mono text-lg font-semibold tracking-tight">{t.githubTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.githubBody}</p>
          </article>
          <article className="rounded-md border border-border bg-background p-6">
            <h2 className="font-mono text-lg font-semibold tracking-tight">{t.siteTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t.siteBody}</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="zhs-eyebrow">structured intake</p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight md:text-3xl">{t.formTitle}</h2>
            <p className="mt-4 text-muted">{t.formLead}</p>
          </div>

          <form onSubmit={submitFeedback} className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium">
                {t.typeLabel}
                <select value={form.type} onChange={(event) => update("type", event.target.value as FeedbackType)} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary">
                  {FEEDBACK_TYPES.map((type) => (
                    <option key={type} value={type}>{t.typeOptions[type]}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                {t.severityLabel}
                <select value={form.severity} onChange={(event) => update("severity", event.target.value as FormState["severity"])} className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary">
                  {Object.entries(t.severityOptions).map(([value, label]) => (
                    <option key={value || "none"} value={value}>{label}</option>
                  ))}
                </select>
              </label>
            </div>

            <TextInput label={t.titleLabel} value={form.title} onChange={(value) => update("title", value)} required />
            <TextInput label={t.relatedUrlLabel} value={form.relatedUrl} onChange={(value) => update("relatedUrl", value)} placeholder="https://oh-my-zhs.com/..." />
            <TextArea label={t.summaryLabel} value={form.summary} onChange={(value) => update("summary", value)} required rows={5} />
            <div className="grid gap-5 md:grid-cols-2">
              <TextArea label={t.expectedLabel} value={form.expected} onChange={(value) => update("expected", value)} rows={4} />
              <TextArea label={t.actualLabel} value={form.actual} onChange={(value) => update("actual", value)} rows={4} />
            </div>
            <TextArea label={t.reproductionLabel} value={form.reproduction} onChange={(value) => update("reproduction", value)} rows={4} />
            <TextInput label={t.emailLabel} value={form.replyEmail} onChange={(value) => update("replyEmail", value)} type="email" placeholder="name@example.com" />

            <label className="mt-4 flex gap-3 rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-muted">
              <input type="checkbox" checked={form.emailConsent} onChange={(event) => update("emailConsent", event.target.checked)} className="mt-1" />
              <span>{t.consentLabel}</span>
            </label>

            {submission.status === "error" ? (
              <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
                <p className="font-semibold">{t.errorTitle}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {submission.errors.map((error) => <li key={error}>{error}</li>)}
                </ul>
              </div>
            ) : null}

            {submission.status === "success" ? (
              <div className="mt-5 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
                <p className="font-semibold text-foreground">{t.successTitle}</p>
                <p className="mt-2 text-muted">Request ID: <span className="font-mono text-foreground">{submission.requestId}</span></p>
                <p className="mt-1 text-muted">GitHub Issue: <span className="font-mono text-foreground">#{submission.issueNumber}</span></p>
                <p className="mt-1 text-muted">{submission.emailSent ? t.emailSent : t.emailSkipped}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={submission.issueUrl} target="_blank" rel="noreferrer" className="rounded-sm border border-foreground bg-foreground px-4 py-2 font-mono text-xs text-background transition-colors hover:border-primary hover:bg-primary">{t.viewIssue}</a>
                  <button type="button" onClick={() => setSubmission({ status: "idle" })} className="rounded-sm border border-border px-4 py-2 font-mono text-xs transition-colors hover:border-foreground">{t.resetForm}</button>
                </div>
              </div>
            ) : null}

            <button type="submit" disabled={submission.status === "submitting"} className="mt-6 w-full rounded-lg border border-foreground bg-foreground px-6 py-3 font-mono text-sm text-background transition-colors hover:border-primary hover:bg-primary disabled:cursor-wait disabled:opacity-60">
              {submission.status === "submitting" ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-md border border-border bg-card p-8 md:p-10">
          <h2 className="font-mono text-2xl font-bold tracking-tight">{t.policyTitle}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {t.policies.map((policy) => (
              <li key={policy} className="rounded-md border border-border bg-background p-4 text-sm leading-relaxed text-muted">
                {policy}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center text-sm text-muted">
          <span>
            {locale === "ko"
              ? "개인정보나 긴급한 보안 내용은 공개 이슈에 직접 적지 말고, 필요한 범위의 정보만 사이트 요청폼으로 보내주세요."
              : "Do not put private data or urgent security details directly into public issues; send only the necessary details through the site request form."}
          </span>{" "}
          <Link href="/privacy" className="font-mono text-primary hover:text-primary-dark">
            {locale === "ko" ? "개인정보 처리방침" : "Privacy policy"}
          </Link>
        </div>
      </section>
    </>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="mt-5 block text-sm font-medium">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required = false,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows: number;
}) {
  return (
    <label className="mt-5 block text-sm font-medium">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary"
      />
    </label>
  );
}
