import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Every indexable route belongs here. /answers is the category-education page;
 * the two policy routes were linked from the global footer long before they
 * existed, so they were being crawled as 404s.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: lastMod, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/shower`, lastModified: lastMod, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/answers`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: lastMod, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/policies/shipping-policy`, lastModified: lastMod, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/policies/refund-policy`, lastModified: lastMod, changeFrequency: "yearly", priority: 0.3 },
  ];
}
