"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers";

const GITHUB_REPO_URL = "https://github.com/ohmyzhs/agency-web";
const GITHUB_NEW_ISSUE_URL = "https://github.com/ohmyzhs/agency-web/issues/new";
const GITHUB_ISSUES_URL = "https://github.com/ohmyzhs/agency-web/issues";

const copy = {
  ko: {
    eyebrow: "request / feedback",
    title: "도구 요청과 오류 제보는 공개 이슈로 남깁니다.",
    description:
      "ZHS는 존재하지 않는 이메일이나 전송되지 않는 문의폼으로 요청을 받지 않습니다. 지금은 GitHub Issue를 실제 접수 채널로 열어두고, 사이트 안에서 구조화된 요청을 보내면 자동으로 이슈가 생성되는 흐름을 연결하고 있습니다.",
    statusLabel: "현재 상태",
    statusTitle: "구조화된 요청폼을 연결하는 중입니다.",
    statusBody:
      "Resend 메일 발송과 GitHub Issue 자동 등록을 준비 중입니다. 연결이 끝나면 요청 접수 메일에 이슈 링크가 포함되고, AI Agent가 검토한 진행 상황은 이슈 댓글과 진행 메일로 안내됩니다.",
    primaryCta: "GitHub Issue 직접 작성",
    secondaryCta: "공개 저장소 보기",
    issuesCta: "진행 중인 이슈 보기",
    formTitle: "곧 연결될 사이트 요청폼",
    formLead:
      "이 폼은 아직 전송되지 않습니다. 가짜 성공 화면을 보여주지 않기 위해 제출 버튼을 잠시 닫아두었습니다.",
    fields: [
      "요청 유형: 오류 제보, 결과값 이상, 도구 요청, 콘텐츠 정정, 개인정보 문의",
      "관련 페이지 URL과 사용자가 본 실제 결과",
      "기대한 결과와 재현 입력값",
      "선택 이메일: 진행 메일을 원할 때만 수집",
    ],
    githubTitle: "GitHub로 직접 요청하는 경우",
    githubBody:
      "형식에 얽매이지 않고 자유롭게 작성할 수 있습니다. 개발자나 파워유저에게 적합하며, 모든 논의와 처리 로그는 이슈 댓글에 남습니다.",
    siteTitle: "사이트 요청폼으로 보내는 경우",
    siteBody:
      "정해진 항목으로 입력되어 자동 분류와 재현 검증이 쉬워집니다. 이메일을 남기면 접수·진행·완료 메일에 같은 GitHub Issue 링크가 계속 포함됩니다.",
    policyTitle: "처리 기준",
    policies: [
      "모든 요청이 반영되지는 않습니다. 실제 오류와 반복되는 개선 요청을 우선 검토합니다.",
      "이메일 주소 같은 개인정보는 공개 GitHub Issue 본문에 노출하지 않습니다.",
      "외부 API, 사용자 데이터 저장, 보안·개인정보, 큰 UI 변경은 사람 확인 후 진행합니다.",
      "낮은 위험도의 명확한 수정은 테스트와 배포 검증을 거쳐 자동 처리할 수 있습니다.",
    ],
    disabledSubmit: "자동 요청폼 준비 중",
  },
  en: {
    eyebrow: "request / feedback",
    title: "Tool requests and bug reports belong in public issues.",
    description:
      "ZHS does not route feedback to a non-existent inbox or a form that only pretends to submit. GitHub Issues are open today as the real intake channel while the structured site form is being connected to automatic issue creation.",
    statusLabel: "Current status",
    statusTitle: "The structured request form is being wired up.",
    statusBody:
      "Resend email receipts and GitHub Issue creation are next. Once connected, receipt emails will include the issue link, and AI Agent progress will be shared through issue comments and follow-up email.",
    primaryCta: "Create GitHub Issue",
    secondaryCta: "View public repo",
    issuesCta: "Browse open issues",
    formTitle: "Upcoming site request form",
    formLead:
      "This form is not submitting yet. The submit button is disabled for now so the page does not show a fake success state.",
    fields: [
      "Request type: bug, wrong result, tool request, content correction, privacy question",
      "Related page URL and the actual result you saw",
      "Expected result and reproduction input",
      "Optional email: collected only when you want progress updates",
    ],
    githubTitle: "When you use GitHub directly",
    githubBody:
      "You can write freely without the site template. This is better for developers and power users; discussion and handling history stay in issue comments.",
    siteTitle: "When you use the site form",
    siteBody:
      "The report will be structured for automatic triage and reproduction checks. If you leave an email, receipt, progress, and completion messages will keep linking to the same GitHub Issue.",
    policyTitle: "Handling standards",
    policies: [
      "Not every request will be implemented. Real bugs and repeated improvement requests are reviewed first.",
      "Personal data such as email addresses will not be placed in public GitHub Issue bodies.",
      "External APIs, user-data storage, security/privacy work, and large UI changes require human confirmation.",
      "Clear low-risk fixes may be handled automatically after tests and deployment verification.",
    ],
    disabledSubmit: "Automatic request form coming soon",
  },
} as const;

export function ContactClient() {
  const { locale } = useLocale();
  const t = copy[locale];

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
              <a
                href={GITHUB_NEW_ISSUE_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-foreground bg-foreground px-5 py-2.5 font-mono text-sm text-background transition-colors hover:border-primary hover:bg-primary"
              >
                {t.primaryCta}
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground"
              >
                {t.secondaryCta}
              </a>
              <a
                href={GITHUB_ISSUES_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-border px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-foreground"
              >
                {t.issuesCta}
              </a>
            </div>
          </div>

          <aside className="rounded-md border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              {t.statusLabel}
            </p>
            <h2 className="mt-3 font-mono text-xl font-semibold tracking-tight">
              {t.statusTitle}
            </h2>
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
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight md:text-3xl">
              {t.formTitle}
            </h2>
            <p className="mt-4 text-muted">{t.formLead}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="space-y-4">
              {t.fields.map((field) => (
                <div key={field} className="rounded-md border border-border bg-background p-4 text-sm text-muted">
                  {field}
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-lg border border-border bg-background px-6 py-3 font-mono text-sm text-muted opacity-70"
            >
              {t.disabledSubmit}
            </button>
          </div>
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
              ? "개인정보나 긴급한 보안 내용은 공개 이슈에 직접 적지 말고, 사이트 요청폼의 비공개 연락 흐름이 연결된 뒤 보내주세요."
              : "Do not put private data or urgent security details directly into public issues; use the private contact flow once the structured form is connected."}
          </span>{" "}
          <Link href="/privacy" className="font-mono text-primary hover:text-primary-dark">
            {locale === "ko" ? "개인정보 처리방침" : "Privacy policy"}
          </Link>
        </div>
      </section>
    </>
  );
}
