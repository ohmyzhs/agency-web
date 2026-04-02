import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.SITE_URL ?? "https://ait.agency";

export const metadata: Metadata = {
  title: {
    default: "AIT Agency | Web & App Development",
    template: "%s | AIT Agency",
  },
  description:
    "Professional IT agency specializing in web development, mobile apps, AI integration, and technical consulting. We build fast, ship faster.",
  keywords: [
    "web development",
    "app development",
    "AI integration",
    "technical consulting",
    "IT agency",
    "Next.js",
    "React",
    "웹 개발",
    "앱 개발",
    "AI 통합",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: "AIT Agency",
    url: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "AIT Agency",
  description:
    "Professional IT agency specializing in web development, mobile apps, AI integration, and technical consulting.",
  url: SITE_URL,
  email: "contact@ait.agency",
  serviceType: [
    "Web Development",
    "Mobile App Development",
    "AI Integration",
    "Technical Consulting",
  ],
  areaServed: "Worldwide",
  knowsLanguage: ["ko", "en"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
