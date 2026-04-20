import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://feelslikeom.shop";
  const lastMod = new Date();

  return [
    { url: `${base}/`,       lastModified: lastMod, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/shower`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`,  lastModified: lastMod, changeFrequency: "monthly", priority: 0.5 },
  ];
}
