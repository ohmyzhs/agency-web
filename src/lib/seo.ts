import type { Metadata } from "next";

export const SITE_URL = process.env.SITE_URL ?? "https://ohmyzhs.com";
export const SITE_NAME = "Zero Human Studio";
export const DEFAULT_DESCRIPTION =
  "Zero Human Studio는 한국 생활 도구, 자동화 유틸리티, 개발자 도구, 실용 가이드를 제공하는 oh-my-zhs.com의 tools and posts hub입니다.";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
}: PageSeo): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
    openGraph: {
      title,
      description,
      type,
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
      alternateLocale: "en_US",
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
