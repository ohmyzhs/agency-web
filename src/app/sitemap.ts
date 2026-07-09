import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllTools } from "@/lib/tools";

const BASE_URL = process.env.SITE_URL ?? "https://oh-my-zhs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/typing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...toolEntries,
    { url: `${BASE_URL}/posts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...postEntries,
    { url: `${BASE_URL}/updates`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.65 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
