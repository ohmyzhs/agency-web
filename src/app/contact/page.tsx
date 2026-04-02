import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AIT Agency. Tell us about your project and we'll get back to you within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Let&apos;s Build Together
          </h1>
          <p className="mt-4 text-lg text-muted">
            Have a project in mind? We&apos;d love to hear about it. Fill out
            the form and we&apos;ll get back to you within 24 hours.
          </p>

          <div className="mt-12 space-y-6">
            <div>
              <h3 className="font-semibold">Email</h3>
              <a
                href="mailto:contact@ait.agency"
                className="text-primary hover:underline"
              >
                contact@ait.agency
              </a>
            </div>
            <div>
              <h3 className="font-semibold">Blog</h3>
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
            <label
              htmlFor="name"
              className="block text-sm font-medium"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="project-type"
              className="block text-sm font-medium"
            >
              Project Type
            </label>
            <select
              id="project-type"
              name="project-type"
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">Select a service</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="ai">AI Integration</option>
              <option value="consulting">Technical Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="Tell us about your project..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
