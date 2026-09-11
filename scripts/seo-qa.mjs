#!/usr/bin/env node
/**
 * seo-qa — a gate for the whole SEO / AI-SEO surface.
 *
 *   node scripts/seo-qa.mjs [baseUrl]      # default http://localhost:3000
 *   npm run seo:qa
 *
 * Run it against a local `next start`, a Vercel preview, or production. It
 * exits non-zero on any FAIL, so it works as a pre-deploy gate.
 *
 * This exists because every defect it checks for is one that ships silently:
 * the build passes, the page renders, lint is clean, and the damage only shows
 * up weeks later in Search Console. A missing canonical, a description
 * inherited by four pages, a footer link to a route that was never deployed —
 * none of those break anything a human would notice by looking at the site.
 *
 * SCOPE NOTE (important): the claims check below compares llms.txt against
 * lib/checkout.ts. That catches drift between our own files. It CANNOT confirm
 * either one matches the live Stripe payment links — Stripe is the real source
 * of truth for what a customer is actually charged, and verifying it needs a
 * human or an API call against Stripe. Do not read a green run here as "pricing
 * is correct".
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/+$/, "");

let pass = 0;
const failures = [];
const warnings = [];

const ok = (m) => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${m}`); };
const fail = (m) => { failures.push(m); console.log(`  \x1b[31m✗ ${m}\x1b[0m`); };
const warn = (m) => { warnings.push(m); console.log(`  \x1b[33m! ${m}\x1b[0m`); };
const head = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);

const get = async (p) => {
  const r = await fetch(`${BASE}${p}`, { redirect: "follow" });
  return { status: r.status, headers: r.headers, body: await r.text() };
};

const tag = (html, re) => (html.match(re)?.[1] ?? null);
const decode = (s) =>
  s?.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
   .replace(/&lt;/g, "<").replace(/&gt;/g, ">") ?? s;

// ---------------------------------------------------------------------------
// 1. Discover routes from the sitemap — the sitemap IS the contract.
// ---------------------------------------------------------------------------
head("Sitemap");
const sitemapRes = await get("/sitemap.xml");
if (sitemapRes.status !== 200) {
  fail(`/sitemap.xml returned ${sitemapRes.status}`);
  process.exit(1);
}
const locs = [...sitemapRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const lastmods = [...sitemapRes.body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)];
if (locs.length) ok(`${locs.length} URLs listed`);
else fail("sitemap is empty");
if (lastmods.length === locs.length) ok("every URL has <lastmod>");
else fail(`only ${lastmods.length}/${locs.length} URLs have <lastmod> — Google uses it for recrawl scheduling`);

const origin = new URL(locs[0]).origin;
const routes = locs.map((u) => new URL(u).pathname.replace(/\/$/, "") || "/");

// ---------------------------------------------------------------------------
// 2. Per-route: reachability, canonical, title, description, H1
// ---------------------------------------------------------------------------
head("Pages");
const seenTitles = new Map();
const seenDescs = new Map();
const pages = {};

for (const route of routes) {
  const res = await get(route);
  pages[route] = res;

  if (res.status !== 200) { fail(`${route} → HTTP ${res.status}`); continue; }

  const title = decode(tag(res.body, /<title>([^<]*)<\/title>/));
  const desc = decode(tag(res.body, /<meta name="description" content="([^"]*)"/));
  const canonical = tag(res.body, /<link rel="canonical" href="([^"]*)"/);
  const h1s = (res.body.match(/<h1[\s>]/g) ?? []).length;

  // Canonical must exist and must point at THIS route. A canonical pointing
  // somewhere else tells Google "don't index me, index that instead".
  if (!canonical) {
    fail(`${route} has no canonical`);
  } else {
    const cPath = new URL(canonical, origin).pathname.replace(/\/$/, "") || "/";
    if (cPath === route) ok(`${route} self-canonical`);
    else fail(`${route} canonicals to ${cPath} — it will be dropped in favour of that page`);
  }

  if (!title) fail(`${route} has no <title>`);
  else {
    if (seenTitles.has(title)) fail(`${route} duplicates the title of ${seenTitles.get(title)}`);
    else seenTitles.set(title, route);
    if (title.length > 65) warn(`${route} title is ${title.length} chars — Google truncates around 60`);
    if (title.length < 15) warn(`${route} title is only ${title.length} chars`);
  }

  if (!desc) fail(`${route} has no meta description`);
  else {
    if (seenDescs.has(desc)) {
      fail(`${route} duplicates the description of ${seenDescs.get(desc)} — usually means it silently inherited the layout default`);
    } else seenDescs.set(desc, route);
    if (desc.length > 165) warn(`${route} description is ${desc.length} chars — truncated around 160`);
    if (desc.length < 70) warn(`${route} description is only ${desc.length} chars`);
  }

  if (h1s === 0) fail(`${route} has no <h1>`);
  else if (h1s > 1) warn(`${route} has ${h1s} <h1> elements`);
}

// ---------------------------------------------------------------------------
// 3. Internal links must not 404. This is the check that would have caught the
//    global footer pointing at two routes that were never deployed.
// ---------------------------------------------------------------------------
head("Internal links");
const internal = new Set();
for (const res of Object.values(pages)) {
  if (res.status !== 200) continue;
  for (const m of res.body.matchAll(/href="(\/[^"#?]*)/g)) internal.add(m[1].replace(/\/$/, "") || "/");
  // absolute links back to our own origin count as internal too
  for (const m of res.body.matchAll(new RegExp(`href="${origin}(/[^"#?]*)`, "g")))
    internal.add(m[1].replace(/\/$/, "") || "/");
}
const skip = /^\/(_next|api)\b|\.(png|jpe?g|webp|avif|svg|ico|css|js|xml|txt)$/;
let broken = 0;
for (const link of [...internal].filter((l) => !skip.test(l))) {
  const r = await fetch(`${BASE}${link}`, { method: "HEAD", redirect: "follow" });
  if (r.status >= 400) { fail(`internal link ${link} → HTTP ${r.status}`); broken++; }
}
if (!broken) ok(`${internal.size} internal links, none broken`);

// ---------------------------------------------------------------------------
// 4. Structured data
// ---------------------------------------------------------------------------
head("Structured data");
const typesByRoute = {};
for (const [route, res] of Object.entries(pages)) {
  if (res.status !== 200) continue;
  const blocks = [...res.body.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
  const types = [];
  for (const [, raw] of blocks) {
    try {
      const d = JSON.parse(decode(raw));
      types.push(d["@type"]);
      if (d["@type"] === "Product") {
        const o = d.offers ?? {};
        if (!o.price) fail(`${route} Product offer has no price`);
        if (!o.availability) fail(`${route} Product offer has no availability`);
        if (!d.image?.length) fail(`${route} Product has no image`);
      }
    } catch (e) {
      fail(`${route} has JSON-LD that does not parse: ${e.message}`);
    }
  }
  typesByRoute[route] = types;
  if (!types.includes("Organization")) fail(`${route} missing Organization schema`);
  if (!types.includes("WebSite")) fail(`${route} missing WebSite schema`);
}
if (!failures.length) ok("all JSON-LD parses");

// Entity consolidation: one @id shared by every page, not N anonymous nodes.
const orgIds = new Set();
for (const res of Object.values(pages)) {
  for (const [, raw] of res.body?.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs) ?? []) {
    try {
      const d = JSON.parse(decode(raw));
      if (d["@type"] === "Organization") orgIds.add(d["@id"] ?? "MISSING");
    } catch { /* already reported above */ }
  }
}
if (orgIds.has("MISSING")) fail("Organization schema has no @id — each page reads as a separate unnamed company");
else if (orgIds.size === 1) ok(`Organization resolves to one entity (${[...orgIds][0]})`);
else if (orgIds.size > 1) fail(`Organization has ${orgIds.size} different @ids across pages`);

// FAQ schema must match what a human can see on the page.
for (const [route, res] of Object.entries(pages)) {
  for (const [, raw] of res.body?.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs) ?? []) {
    try {
      const d = JSON.parse(decode(raw));
      if (d["@type"] !== "FAQPage") continue;
      const text = decode(res.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
      const missing = d.mainEntity.filter((q) => !text.includes(q.name.slice(0, 40)));
      if (missing.length) fail(`${route} FAQPage declares ${missing.length} question(s) not visible on the page — Google treats that as invalid`);
      else ok(`${route} FAQPage matches visible content (${d.mainEntity.length} questions)`);
    } catch { /* already reported */ }
  }
}

// ---------------------------------------------------------------------------
// 5. Social / OG
// ---------------------------------------------------------------------------
head("Open Graph");
for (const [route, res] of Object.entries(pages)) {
  if (res.status !== 200) continue;
  const img = tag(res.body, /<meta property="og:image" content="([^"]*)"/);
  if (!img) { fail(`${route} has no og:image`); continue; }
  const w = +tag(res.body, /<meta property="og:image:width" content="([^"]*)"/) || 0;
  const h = +tag(res.body, /<meta property="og:image:height" content="([^"]*)"/) || 0;
  const card = tag(res.body, /<meta name="twitter:card" content="([^"]*)"/);
  if (!w || !h) { warn(`${route} og:image has no declared dimensions`); continue; }
  const ratio = w / h;
  // summary_large_image crops to ~1.91:1. A square image becomes a sliver.
  if (card === "summary_large_image" && (ratio < 1.5 || ratio > 2.2))
    fail(`${route} og:image is ${w}x${h} (ratio ${ratio.toFixed(2)}) but twitter:card is summary_large_image — it will be centre-cropped`);
}
if (!failures.length) ok("og:image present and correctly proportioned on every page");

// ---------------------------------------------------------------------------
// 6. Crawler access
// ---------------------------------------------------------------------------
head("robots.txt");
const robots = await get("/robots.txt");
if (robots.status !== 200) fail(`/robots.txt returned ${robots.status}`);
else {
  // Blocking any of these means that platform literally cannot cite the site.
  for (const bot of ["GPTBot", "OAI-SearchBot", "PerplexityBot", "ClaudeBot", "Google-Extended", "Googlebot", "Bingbot"]) {
    const block = robots.body.split(/\n\s*\n/).find((b) => new RegExp(`User-Agent:\\s*${bot}\\b`, "i").test(b));
    if (block && /Disallow:\s*\/\s*$/m.test(block)) fail(`robots.txt blocks ${bot} — that platform cannot cite the site`);
  }
  if (/Disallow:\s*\/\s*$/m.test(robots.body.split(/\n\s*\n/).find((b) => /User-Agent:\s*\*/i.test(b)) ?? "")) fail("robots.txt disallows all bots at the wildcard");
  else ok("no crawler blocks");
  if (robots.body.includes("Sitemap:")) ok("sitemap declared");
  else fail("robots.txt does not declare a Sitemap");
}

// ---------------------------------------------------------------------------
// 7. Security headers (SEO-neutral, so there is no reason to be missing them)
// ---------------------------------------------------------------------------
head("Security headers");
const hRes = await fetch(`${BASE}/`, { redirect: "follow" });
for (const h of ["x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
  if (hRes.headers.get(h)) ok(`${h}: ${hRes.headers.get(h)}`);
  else fail(`missing ${h}`);
}

// ---------------------------------------------------------------------------
// 8. llms.txt — the AI-context file
// ---------------------------------------------------------------------------
head("llms.txt (AI context)");
const llms = await get("/llms.txt");
if (llms.status !== 200) fail(`/llms.txt returned ${llms.status}`);
else {
  ok(`served (${llms.body.length} bytes)`);
  // Every indexable route should be discoverable from it.
  const missing = routes.filter((r) => !llms.body.includes(r === "/" ? `${origin}/` : r));
  if (missing.length) fail(`llms.txt does not link: ${missing.join(", ")}`);
  else ok("links every route in the sitemap");
  for (const section of ["#", "##"]) {
    if (!llms.body.includes(section)) fail(`llms.txt has no ${section} headings — it is not structured`);
  }
  if (!/what it (won'?t|does not|cannot)|limitations/i.test(llms.body))
    warn("llms.txt has no explicit limitations section — honest scope statements are disproportionately quoted by AI answers");
}

// ---------------------------------------------------------------------------
// 9. Claims drift: llms.txt vs the code that actually prices the checkout.
//    See the SCOPE NOTE at the top — this does not validate against Stripe.
// ---------------------------------------------------------------------------
head("Claims consistency (llms.txt ↔ lib/checkout.ts)");
try {
  const checkout = readFileSync(join(ROOT, "lib/checkout.ts"), "utf8");
  const shower = checkout.slice(checkout.indexOf("shower: {"));
  const num = (k) => {
    const m = shower.match(new RegExp(`${k}:\\s*([\\d.]+)`));
    return m ? m[1] : null;
  };
  for (const key of ["price", "subscribePrice"]) {
    const v = num(key);
    if (!v) { warn(`could not read ${key} from lib/checkout.ts`); continue; }
    if (llms.body.includes(`$${v}`)) ok(`${key} $${v} appears in llms.txt`);
    else fail(`lib/checkout.ts ${key} is $${v}, but llms.txt never mentions $${v} — AI engines are quoting a price the checkout does not charge`);
  }
} catch (e) {
  warn(`claims check skipped: ${e.message}`);
}

// ---------------------------------------------------------------------------
head("Result");
console.log(`  ${pass} passed · ${warnings.length} warnings · ${failures.length} failures`);
if (failures.length) {
  console.log("\n\x1b[31mFAILURES\x1b[0m");
  failures.forEach((f) => console.log(`  · ${f}`));
}
if (warnings.length) {
  console.log("\n\x1b[33mWARNINGS\x1b[0m");
  warnings.forEach((w) => console.log(`  · ${w}`));
}
console.log("");
process.exit(failures.length ? 1 : 0);
