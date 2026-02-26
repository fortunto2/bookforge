import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";

const BASE_URL = "https://books.superduperai.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/c/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...categoryPages,
  ];
}
