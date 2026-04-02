"use client";

import { useLocale } from "@/components/providers";

export default function ContactPage() {
  const { t } = useLocale();

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
                href="mailto:contact@ait.agency"
                className="text-primary hover:underline"
              >
                contact@ait.agency
              </a>
            </div>
            <div>
              <h3 className="font-semibold">{t.contactPage.blog}</h3>
              <a
                href="https://lotionz.tistory.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                lotionz.tistory.com
              </a>
            </div>
          </div>
        </div>

        <form className="space-y-6 rounded-2xl border border-border p-8">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              {t.contactPage.form.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
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
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder={t.contactPage.form.emailPlaceholder}
            />
          </div>
          <div>
            <label htmlFor="project-type" className="block text-sm font-medium">
              {t.contactPage.form.projectType}
            </label>
            <select
              id="project-type"
              name="project-type"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">{t.contactPage.form.selectService}</option>
              <option value="web">{t.contactPage.form.web}</option>
              <option value="mobile">{t.contactPage.form.mobile}</option>
              <option value="ai">{t.contactPage.form.ai}</option>
              <option value="consulting">{t.contactPage.form.consulting}</option>
              <option value="other">{t.contactPage.form.other}</option>
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
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder={t.contactPage.form.messagePlaceholder}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
          >
            {t.contactPage.form.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
