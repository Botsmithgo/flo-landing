/**
 * Unified event tracking — fires to GA4, Meta Pixel, and TikTok Pixel
 * if their IDs are configured. Safe to call before pixels load (silently no-ops).
 *
 * Event names map to DTC-standard funnel stages. Keep this list tight — pixel
 * event schemas reward consistency.
 */

export type EventName =
  | "shop_now_hero"
  | "plan_switch"
  | "color_switch"
  | "begin_checkout"
  | "add_to_cart"
  | "faq_expand"
  | "scroll_depth"
  | "water_report_lead"
  | "water_report_dismiss"
  | "view_offer"
  | "tiktok_click";

type EventData = Record<string, string | number | boolean | undefined>;

// Meta's standard event vocabulary — map our internal names when applicable
const META_STANDARD: Partial<Record<EventName, string>> = {
  begin_checkout: "InitiateCheckout",
  add_to_cart: "AddToCart",
  water_report_lead: "Lead",
  view_offer: "ViewContent",
};

const TIKTOK_STANDARD: Partial<Record<EventName, string>> = {
  begin_checkout: "InitiateCheckout",
  add_to_cart: "AddToCart",
  water_report_lead: "SubmitForm",
  view_offer: "ViewContent",
};

export function track(event: EventName, data?: EventData): void {
  if (typeof window === "undefined") return;

  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
    ttq?: { track: (e: string, p?: unknown) => void };
    dataLayer?: unknown[];
  };

  // GA4 — pass event name as-is; data as event params
  try {
    w.gtag?.("event", event, data);
  } catch {}

  // Meta Pixel — use Standard when possible, CustomEvent otherwise
  try {
    const metaEvent = META_STANDARD[event];
    if (metaEvent) {
      w.fbq?.("track", metaEvent, data);
    } else {
      w.fbq?.("trackCustom", event, data);
    }
  } catch {}

  // TikTok Pixel — use Standard when possible, else custom
  try {
    const tiktokEvent = TIKTOK_STANDARD[event] ?? event;
    w.ttq?.track(tiktokEvent, data);
  } catch {}
}

/**
 * Scroll-depth reporter. Call from a mounted client component in the root
 * layout. Fires `scroll_depth` at 25, 50, 75, 100% milestones once per session.
 */
export function initScrollDepth(): () => void {
  if (typeof window === "undefined") return () => {};
  const fired = new Set<number>();
  const milestones = [25, 50, 75, 100];

  function onScroll() {
    const doc = document.documentElement;
    const total = doc.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = Math.min(100, Math.round((window.scrollY / total) * 100));
    for (const m of milestones) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track("scroll_depth", { percent: m, path: window.location.pathname });
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
