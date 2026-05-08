"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useLocale } from "@/components/providers";
import { FEEDBACK_TYPES, type FeedbackType } from "@/lib/feedback/feedback";

const GITHUB_NEW_ISSUE_URL = "https://github.com/ohmyzhs/agency-web/issues/new";

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
};

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
};

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
    eyebrow: "REQUEST / FEEDBACK",
    title: "스튜디오의 성장을 위한 여러분의 지능을 빌려주세요.",
    description:
      "ZHS는 사용자의 피드백을 통해 매일 진화합니다. 발견하신 결함이나 필요한 도구가 있다면 공개 이슈 트래커로 남겨주세요.",
    statusLabel: "SYSTEM STATUS",
    statusTitle: "실시간 요청 시스템 가동 중",
    statusBody:
      "모든 요청은 GitHub Issue로 투명하게 기록됩니다. 개인정보(이메일)는 본문에 포함되지 않으며, AI와 관리자가 실시간으로 검토합니다.",
    primaryCta: "GitHub Issue 생성",
    secondaryCta: "라이브러리 현황",
    githubTitle: "Expert Path (GitHub)",
    githubBody:
      "형식에 구애받지 않는 자유로운 기술 제안을 선호하신다면 GitHub 저장소에 직접 이슈를 남겨주세요.",
    siteTitle: "Guided Path (Web Form)",
    siteBody:
      "구조화된 양식을 통해 빠른 분류와 정확한 재현을 지원합니다. 처리 과정이 이메일로 자동 공유됩니다.",
    formTitle: "Intake Form",
    formLead:
      "오류 제보, 도구 제안, 정정 요청을 위한 공식 창구입니다.",
    typeLabel: "REQUEST CATEGORY",
    typeOptions: {
      bug: "결함 보고",
      "wrong-result": "데이터 오차",
      "tool-request": "신규 도구 제안",
      "content-correction": "기록 정정",
      "privacy-question": "보안/프라이버시",
      other: "기타",
    },
    severityLabel: "IMPACT LEVEL",
    severityOptions: {
      "": "선택 안 함",
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    titleLabel: "Subject",
    relatedUrlLabel: "Context URL",
    summaryLabel: "Description",
    expectedLabel: "Expected Result",
    actualLabel: "Observed Result",
    reproductionLabel: "Reproduction Data",
    emailLabel: "Notification Email (Optional)",
    consentLabel: "상태 변화 알림을 이메일로 받겠습니다. (공개 이슈에는 미포함)",
    submit: "전송하기",
    submitting: "시스템 처리 중...",
    policyTitle: "Operations Logic",
    policies: [
      "모든 요청은 내부 품질 기준에 따라 우선순위가 결정됩니다.",
      "보안 취약점이나 민감한 내용은 직접 공개 이슈에 적지 마세요.",
      "실용성이 입증된 도구 요청은 즉시 로드맵에 반영됩니다.",
      "처리 진행 상황은 GitHub Issue 댓글에서 투명하게 확인 가능합니다.",
    ],
    successTitle: "요청이 시스템에 기록되었습니다.",
    emailSent: "확인 메일을 발송했습니다.",
    emailSkipped: "이메일 알림 없이 시스템 기록만 완료했습니다.",
    viewIssue: "이슈 확인하기",
    resetForm: "추가 요청하기",
    errorTitle: "처리에 실패했습니다.",
  },
  en: {
    eyebrow: "REQUEST / FEEDBACK",
    title: "Contribute Your Intelligence to the Studio.",
    description:
      "ZHS evolves daily through user feedback. If you find a flaw or need a specific tool, please leave a record in our public tracker.",
    statusLabel: "SYSTEM STATUS",
    statusTitle: "Active Intake System",
    statusBody:
      "All requests are recorded transparently as GitHub Issues. Email addresses are handled privately. AI and maintainers review submissions in real-time.",
    primaryCta: "Create Issue",
    secondaryCta: "Library Status",
    githubTitle: "Expert Path (GitHub)",
    githubBody:
      "Prefer writing freely? Head directly to our GitHub repository to open an issue and join the discussion.",
    siteTitle: "Guided Path (Web Form)",
    siteBody:
      "Structured inputs for faster triage and precise reproduction. Progress updates will be shared via email.",
    formTitle: "Intake Form",
    formLead:
      "Official channel for bug reports, tool suggestions, and content corrections.",
    typeLabel: "REQUEST CATEGORY",
    typeOptions: {
      bug: "Bug Report",
      "wrong-result": "Data Anomaly",
      "tool-request": "Tool Suggestion",
      "content-correction": "Content Correction",
      "privacy-question": "Security/Privacy",
      other: "Other",
    },
    severityLabel: "IMPACT LEVEL",
    severityOptions: {
      "": "Not Specified",
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    titleLabel: "Subject",
    relatedUrlLabel: "Context URL",
    summaryLabel: "Description",
    expectedLabel: "Expected Result",
    actualLabel: "Observed Result",
    reproductionLabel: "Reproduction Data",
    emailLabel: "Notification Email (Optional)",
    consentLabel: "I agree to receive progress notifications via email (Private).",
    submit: "Deploy Request",
    submitting: "Processing...",
    policyTitle: "Operations Logic",
    policies: [
      "All requests are prioritized based on professional utility standards.",
      "Do not post sensitive security data directly into public issues.",
      "Validated tool requests are added to the roadmap immediately.",
      "All technical discussions and logs reside in issue comments.",
    ],
    successTitle: "Request Deployed Successfully.",
    emailSent: "A receipt has been sent to your inbox.",
    emailSkipped: "System record completed (Email skipped).",
    viewIssue: "View Issue",
    resetForm: "New Request",
    errorTitle: "Deployment Failed.",
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
    <div className="flex flex-col gap-24 pb-32">
      {/* 1. Header */}
      <section className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <span className="zhs-eyebrow text-primary/60">{t.eyebrow}</span>
            <h1 className="mt-8 text-4xl font-black tracking-tight text-foreground md:text-7xl lg:leading-[1.1] animate-fade-in-up">
              {t.title}
            </h1>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-muted/80 animate-fade-in-up animate-delay-100">
              {t.description}
            </p>
          </div>

          <aside className="zhs-card p-8 bg-zinc-950 text-white shadow-2xl animate-fade-in-up animate-delay-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t.statusLabel}</span>
            <h2 className="mt-4 text-xl font-extrabold tracking-tight">{t.statusTitle}</h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{t.statusBody}</p>
          </aside>
        </div>
      </section>

      {/* 2. Paths */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-2">
           <article className="zhs-card p-10 group bg-accent/10 border-transparent hover:border-border">
              <h2 className="text-2xl font-black italic mb-4">{t.githubTitle}</h2>
              <p className="text-muted/80 leading-relaxed mb-8">{t.githubBody}</p>
              <a href={GITHUB_NEW_ISSUE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-4 transition-all">
                {t.primaryCta} <span>→</span>
              </a>
           </article>
           <article className="zhs-card p-10 group bg-card">
              <h2 className="text-2xl font-black italic mb-4">{t.siteTitle}</h2>
              <p className="text-muted/80 leading-relaxed mb-8">{t.siteBody}</p>
              <Link href="#intake-form" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-4 transition-all">
                Jump to Form <span>↓</span>
              </Link>
           </article>
        </div>
      </section>

      {/* 3. Form */}
      <section id="intake-form" className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-[400px_1fr]">
          <div>
            <span className="zhs-eyebrow text-primary/40">{t.formTitle}</span>
            <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl leading-tight">{copy[locale].formTitle}</h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">{t.formLead}</p>

            <div className="mt-12 space-y-8">
               {t.policies.map((p, i) => (
                 <div key={i} className="flex gap-4 items-start">
                   <span className="font-mono text-xs font-bold text-primary/40">0{i+1}</span>
                   <p className="text-sm font-medium text-muted/60">{p}</p>
                 </div>
               ))}
            </div>
          </div>

          <form onSubmit={submitFeedback} className="zhs-card p-8 md:p-12 shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl relative">
            <div className="grid gap-8 md:grid-cols-2 mb-10">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">{t.typeLabel}</span>
                <select value={form.type} onChange={(event) => update("type", event.target.value as FeedbackType)} className="mt-2 w-full bg-accent/30 rounded-2xl px-5 py-4 text-sm font-bold border-2 border-transparent focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
                  {FEEDBACK_TYPES.map((type) => (
                    <option key={type} value={type}>{t.typeOptions[type]}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">{t.severityLabel}</span>
                <select value={form.severity} onChange={(event) => update("severity", event.target.value as FormState["severity"])} className="mt-2 w-full bg-accent/30 rounded-2xl px-5 py-4 text-sm font-bold border-2 border-transparent focus:border-primary/20 outline-none transition-all appearance-none cursor-pointer">
                  {Object.entries(t.severityOptions).map(([value, label]) => (
                    <option key={value || "none"} value={value}>{label}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-8">
              <TextInput label={t.titleLabel} value={form.title} onChange={(value) => update("title", value)} required />
              <TextInput label={t.relatedUrlLabel} value={form.relatedUrl} onChange={(value) => update("relatedUrl", value)} placeholder="https://oh-my-zhs.com/..." />
              <TextArea label={t.summaryLabel} value={form.summary} onChange={(value) => update("summary", value)} required rows={6} />

              <div className="grid gap-8 md:grid-cols-2">
                <TextArea label={t.expectedLabel} value={form.expected} onChange={(value) => update("expected", value)} rows={4} />
                <TextArea label={t.actualLabel} value={form.actual} onChange={(value) => update("actual", value)} rows={4} />
              </div>

              <TextArea label={t.reproductionLabel} value={form.reproduction} onChange={(value) => update("reproduction", value)} rows={4} />
              <TextInput label={t.emailLabel} value={form.replyEmail} onChange={(value) => update("replyEmail", value)} type="email" placeholder="intelligence@studio.com" />

              <label className="flex gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10 cursor-pointer group transition-all hover:bg-primary/10">
                <input type="checkbox" checked={form.emailConsent} onChange={(event) => update("emailConsent", event.target.checked)} className="mt-1 h-4 w-4 rounded-md border-primary text-primary focus:ring-primary accent-primary" />
                <span className="text-xs font-bold text-muted/80 group-hover:text-foreground transition-colors">{t.consentLabel}</span>
              </label>
            </div>

            {submission.status === "error" && (
              <div className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 animate-fade-in-up">
                <p className="font-black uppercase tracking-tighter text-sm mb-2">{t.errorTitle}</p>
                <ul className="space-y-1">
                  {submission.errors.map((error) => <li key={error} className="text-xs font-bold opacity-80">• {error}</li>)}
                </ul>
              </div>
            )}

            {submission.status === "success" && (
              <div className="mt-8 p-8 rounded-[2rem] bg-zinc-950 text-white animate-fade-in-up relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-primary/20 rounded-full blur-[40px]" />
                <p className="text-2xl font-black italic mb-6">{t.successTitle}</p>
                <div className="grid grid-cols-2 gap-4 mb-8 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  <div className="p-4 rounded-xl bg-zinc-900">ID: <span className="text-white block mt-1">{submission.requestId}</span></div>
                  <div className="p-4 rounded-xl bg-zinc-900">Issue: <span className="text-primary block mt-1">#{submission.issueNumber}</span></div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href={submission.issueUrl} target="_blank" rel="noreferrer" className="px-8 py-3 rounded-xl bg-primary text-sm font-black uppercase tracking-widest hover:bg-primary-dark transition-all">{t.viewIssue}</a>
                  <button type="button" onClick={() => setSubmission({ status: "idle" })} className="px-8 py-3 rounded-xl border border-zinc-800 text-sm font-black uppercase tracking-widest hover:bg-zinc-900 transition-all">{t.resetForm}</button>
                </div>
              </div>
            )}

            <button type="submit" disabled={submission.status === "submitting"} className="mt-12 w-full rounded-[2rem] bg-foreground py-6 text-lg font-black uppercase tracking-[0.2em] text-background transition-all hover:bg-primary hover:text-white hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50 disabled:cursor-wait">
              {submission.status === "submitting" ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </section>

      {/* 4. Policy Footer */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
         <p className="text-sm font-bold text-muted/40 uppercase tracking-widest leading-relaxed">
           Security concern? Contact via private channels or encrypted mail.<br/>
           All public submissions follow the <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
         </p>
      </section>
    </div>
  );
}

function TextInput({ label, value, onChange, required = false, type = "text", placeholder }: TextInputProps) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full bg-accent/30 rounded-2xl px-6 py-4 text-sm font-bold border-2 border-transparent focus:border-primary/20 outline-none transition-all placeholder:text-muted/40"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, required = false, rows }: TextAreaProps) {
  return (
    <label className="block">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        className="mt-2 w-full bg-accent/30 rounded-2xl px-6 py-4 text-sm font-bold border-2 border-transparent focus:border-primary/20 outline-none transition-all placeholder:text-muted/40 resize-none"
      />
    </label>
  );
}
