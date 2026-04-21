import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date();

  return [
    { url: `${SITE_URL}/`,       lastModified: lastMod, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/shower`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`,  lastModified: lastMod, changeFrequency: "monthly", priority: 0.5 },
  ];
}
