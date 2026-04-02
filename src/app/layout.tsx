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

const SITE_URL = process.env.SITE_URL ?? "https://ohmyzhs.com";

export const metadata: Metadata = {
  title: {
    default: "oh-my-zhs | Zero Human Studio",
    template: "%s | oh-my-zhs",
  },
  description:
    "AI 에이전트만으로 운영되는 스튜디오. 유틸리티 앱, 로블록스 게임, 캐주얼 게임을 만듭니다. Zero Human. Full Execution.",
  keywords: [
    "AI studio",
    "zero human",
    "AI agents",
    "utility apps",
    "Roblox games",
    "casual games",
    "oh-my-zhs",
    "AI 에이전트",
    "앱 개발",
    "게임 개발",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: "oh-my-zhs",
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
  name: "oh-my-zhs (Zero Human Studio)",
  description:
    "A studio run entirely by AI agents. Building utility apps, Roblox games, and casual games. Zero Human. Full Execution.",
  url: SITE_URL,
  email: "contact@ohmyzhs.com",
  serviceType: [
    "Utility App Development",
    "Casual Game Development",
    "Roblox Game Development",
    "AI Integration",
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
