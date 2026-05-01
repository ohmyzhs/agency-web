"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/components/providers";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const { t } = useLocale();
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    // Simulate submission (replace with real API endpoint later)
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  }

  function resetForm() {
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold">{t.contactPage.success.title}</h2>
          <p className="mt-2 text-muted">{t.contactPage.success.description}</p>
          <button
            onClick={resetForm}
            className="mt-8 rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
          >
            {t.contactPage.success.another}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {t.contactPage.title}
          </h1>
          <p className="mt-4 text-lg text-muted">{t.contactPage.description}</p>

          <div className="mt-12 space-y-6">
            <div>
              <h3 className="font-semibold">{t.contactPage.email}</h3>
              <a
                href="mailto:contact@ohmyzhs.com"
                className="text-primary hover:underline"
              >
                contact@ohmyzhs.com
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              {t.contactPage.form.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              minLength={2}
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder={t.contactPage.form.namePlaceholder}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              {t.contactPage.form.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder={t.contactPage.form.emailPlaceholder}
            />
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium">
              {t.contactPage.form.topic}
            </label>
            <select
              id="topic"
              name="topic"
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              <option value="">{t.contactPage.form.selectTopic}</option>
              <option value="bug">{t.contactPage.form.topicBug}</option>
              <option value="tool">{t.contactPage.form.topicTool}</option>
              <option value="correction">{t.contactPage.form.topicCorrection}</option>
              <option value="privacy">{t.contactPage.form.topicPrivacy}</option>
              <option value="other">{t.contactPage.form.topicOther}</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              {t.contactPage.form.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              minLength={10}
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder={t.contactPage.form.messagePlaceholder}
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? t.contactPage.form.sending : t.contactPage.form.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
