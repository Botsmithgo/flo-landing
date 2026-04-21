import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Explicit allows for the main AI crawlers + traditional search bots.
 *
 * Why explicit? Wildcard `*` technically covers all bots, but:
 *  1. Self-documenting — anyone reviewing the file sees exactly which bots we welcome
 *  2. Safer future edits — a future `* disallow: /` won't accidentally kill AI traffic
 *  3. Some crawlers honor their specific rule over the wildcard
 *
 * Also disallows /checkout for all bots (transactional page, no value in indexing).
 */
const AI_CRAWLERS = [
  "GPTBot",            // OpenAI training
  "OAI-SearchBot",     // ChatGPT Search
  "ChatGPT-User",      // ChatGPT live web browsing
  "PerplexityBot",     // Perplexity crawler
  "Perplexity-User",   // Perplexity live web fetch
  "Claude-Web",        // Anthropic (legacy)
  "anthropic-ai",      // Anthropic crawler
  "ClaudeBot",         // Anthropic search
  "Google-Extended",   // Google Gemini / Bard opt-in
  "CCBot",             // Common Crawl (feeds many LLMs)
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot",         // Amazon Alexa / Rufus
  "Bytespider",        // ByteDance / TikTok search
  "Meta-ExternalAgent",// Meta AI
];

const TRADITIONAL_BOTS = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
];

export default function robots(): MetadataRoute.Robots {
  const allowRules = [...AI_CRAWLERS, ...TRADITIONAL_BOTS].map((userAgent) => ({
    userAgent,
    allow: "/",
    disallow: "/checkout",
  }));

  return {
    rules: [
      // Wildcard — catches every unlisted bot
      { userAgent: "*", allow: "/", disallow: "/checkout" },
      // Explicit allows (same rule, self-documenting + future-proof)
      ...allowRules,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
