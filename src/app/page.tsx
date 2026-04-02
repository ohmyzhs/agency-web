import Link from "next/link";

const services = [
  {
    icon: "🌐",
    title: "Web Development",
    description:
      "High-performance web applications built with Next.js, React, and modern frameworks. SEO-optimized and blazing fast.",
  },
  {
    icon: "📱",
    title: "Mobile Apps",
    description:
      "Cross-platform mobile applications with React Native. One codebase, native performance on iOS and Android.",
  },
  {
    icon: "🤖",
    title: "AI Integration",
    description:
      "Integrate cutting-edge AI capabilities into your products. LLMs, computer vision, and custom ML pipelines.",
  },
  {
    icon: "⚡",
    title: "Technical Consulting",
    description:
      "Architecture reviews, tech stack guidance, and hands-on support to help your team ship faster.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            We build products
            <br />
            <span className="text-primary">that ship fast.</span>
          </h1>
          <p className="mt-6 text-lg text-muted md:text-xl">
            Professional IT agency specializing in web & app development, AI
            integration, and technical consulting. From idea to production in
            weeks, not months.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Start a Project
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="border-t border-border bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold tracking-tight">What We Do</h2>
          <p className="mt-2 text-muted">
            End-to-end development services for modern businesses.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-border bg-background p-8 transition-shadow hover:shadow-lg"
              >
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-muted">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to build something great?
        </h2>
        <p className="mt-4 text-lg text-muted">
          Let&apos;s talk about your project and how we can help.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Get in Touch
        </Link>
      </section>
    </>
  );
}
