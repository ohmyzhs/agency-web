import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, mobile apps, AI integration, and technical consulting services from AIT Agency.",
};

const services = [
  {
    icon: "🌐",
    title: "Web Development",
    description:
      "Full-stack web applications built with cutting-edge frameworks. We specialize in Next.js, React, and Node.js to deliver fast, scalable, and SEO-friendly websites.",
    features: [
      "Server-side rendering & static generation",
      "Progressive Web Apps (PWA)",
      "E-commerce platforms",
      "SaaS applications",
      "Admin dashboards & internal tools",
    ],
  },
  {
    icon: "📱",
    title: "Mobile App Development",
    description:
      "Cross-platform mobile apps with native performance. Share code across iOS and Android while delivering platform-specific experiences.",
    features: [
      "React Native development",
      "iOS & Android native features",
      "Push notifications & real-time updates",
      "Offline-first architecture",
      "App Store & Play Store deployment",
    ],
  },
  {
    icon: "🤖",
    title: "AI Integration",
    description:
      "Integrate state-of-the-art AI capabilities into your products. From conversational AI to computer vision, we make AI accessible and practical.",
    features: [
      "LLM integration (GPT, Claude, etc.)",
      "Custom chatbots & assistants",
      "Computer vision & image processing",
      "Recommendation engines",
      "Data pipeline & ML infrastructure",
    ],
  },
  {
    icon: "⚡",
    title: "Technical Consulting",
    description:
      "Strategic technical guidance to help your team make better decisions. Architecture reviews, performance audits, and hands-on implementation support.",
    features: [
      "Architecture design & review",
      "Tech stack evaluation",
      "Performance optimization",
      "DevOps & CI/CD setup",
      "Team training & mentoring",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight">Our Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        We offer end-to-end development services to bring your ideas to life.
        Every project is built with performance, scalability, and user
        experience at its core.
      </p>

      <div className="mt-16 space-y-16">
        {services.map((service) => (
          <section
            key={service.title}
            className="rounded-2xl border border-border p-8 md:p-12"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{service.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{service.title}</h2>
                <p className="mt-2 text-muted">{service.description}</p>
              </div>
            </div>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-24 rounded-2xl bg-card p-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Need something custom?
        </h2>
        <p className="mt-4 text-muted">
          Every business is unique. Let&apos;s discuss your specific needs and
          find the right solution.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
