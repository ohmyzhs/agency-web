import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.SITE_URL ?? "https://ohmyzhs.com";

export const metadata: Metadata = {
  title: {
    default: "Zero Human Studio — practical tools",
    template: "%s | Zero Human Studio",
  },
  description:
    "Zero Human Studio (ZHS)는 한국 생활 도구와 자동화 유틸리티를 조용히 쌓아가는 AI-built tools studio입니다. 평 변환, KST 시간, 원화 계산, JSON 검증, LLM 비용 계산.",
  keywords: [
    "Zero Human Studio",
    "ZHS",
    "ohmyzhs",
    "Korean tools",
    "pyeong converter",
    "KST timezone",
    "KRW calculator",
    "JSON validator",
    "LLM cost calculator",
    "한국 생활 도구",
    "평수 변환",
    "단위 변환",
    "automation utilities",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: "Zero Human Studio",
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
  "@type": "WebSite",
  name: "Zero Human Studio",
  alternateName: ["ZHS", "oh-my-zhs"],
  description:
    "AI-built tools studio for Korea-aware utilities, automation helpers, and small tools that quietly work.",
  url: SITE_URL,
  inLanguage: ["ko", "en"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
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
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
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
