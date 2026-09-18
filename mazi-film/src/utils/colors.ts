/**
 * MAZI — colour system.
 *
 * These are not invented film colours. Every token below is lifted from the
 * live MAZIDEX product (`mazi-hq/mazi-status`, dark theme), so the film and the
 * app are the same brand rather than cousins:
 *
 *   --paper #101613 · --panel #171F1B · --ink #E8EEE9 · --muted #93A29A
 *   --line  #27312B · --trust #46C878 · --warn  #D9B24A · --brand #7DA2FF
 *
 * ── The chroma doctrine ──────────────────────────────────────────────────────
 * The world is a dark, slightly green-shifted graphite. Chroma is a *tool*:
 *
 *   TRUST GREEN   the machine. Detection, scanning, verification, MAZIFIED.
 *                 Nothing else in the film is this green.
 *   GOLD          money, and only money. Value, price, the market beat.
 *   BRAND BLUE    the field — depth, the archive, the space between records.
 *
 * A viewer should be able to tell what is happening from the colour alone with
 * the sound off.
 */

export const C = {
  // ── Environment ──────────────────────────────────────────────────────────
  /** True floor of the frame. Below the UI's --paper, never pure #000. */
  void: '#080B09',
  abyss: '#0B100D',
  /** --paper — the product's base surface. */
  paper: '#101613',
  /** --panel — the product's raised surface. */
  panel: '#171F1B',
  graphite: '#1D2620',
  slate: '#27312B', // --line
  smoke: '#3A473F',

  // ── Ink ──────────────────────────────────────────────────────────────────
  bone: '#E8EEE9', // --ink
  paperInk: '#C6D0C9',
  muted: '#93A29A', // --muted
  faint: '#5D6B64',

  // ── Accent: the machine (verification) ───────────────────────────────────
  trust: '#46C878', // --trust
  trustDeep: '#2E9A5E', // --seg-a
  trustSoft: '#173626', // --trust-soft
  /** Highlight tip of the trust ramp — scan heads, lock flashes. */
  trustIce: '#B6F0CC',

  // ── Accent: the field (brand) ────────────────────────────────────────────
  brand: '#7DA2FF', // --brand
  brandDeep: '#1B4FD8',
  sage: '#7BAA93', // --seg-b
  mist: '#C9D6CE', // --seg-c

  // ── Accent: value (money — sparingly) ────────────────────────────────────
  gold: '#D9B24A', // --warn
  goldSoft: '#2E2712', // --warn-soft
  /** Trim and hairlines that must read as gold without competing with a value. */
  goldDeep: '#A8863A',
  goldLift: '#F0D089',

  // ── Semantic ─────────────────────────────────────────────────────────────
  positive: '#46C878',
  negative: '#E5624F',
} as const;

/** rgba() from a hex token without hand-writing channels at call sites. */
export const alpha = (hex: string, a: number): string => {
  const h = hex.replace('#', '');
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  );
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** Linear blend between two hex tokens. t=0 → a, t=1 → b. */
export const mix = (a: string, b: string, t: number): string => {
  const parse = (hex: string) => {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const k = Math.max(0, Math.min(1, t));
  return `rgb(${Math.round(r1 + (r2 - r1) * k)}, ${Math.round(g1 + (g2 - g1) * k)}, ${Math.round(
    b1 + (b2 - b1) * k,
  )})`;
};

/** The one gradient the whole film sits on. Scene-local washes build on it. */
export const GRAD = {
  /** The base environment wash — never flat black, always a graded light. */
  world: `radial-gradient(120% 90% at 50% 38%, ${C.panel} 0%, ${C.abyss} 48%, ${C.void} 100%)`,
} as const;

/**
 * Typography stack.
 *
 * The product speaks in three voices and the film inherits all three verbatim:
 *   Teko          — the display voice. Condensed, tall, uppercase. Headlines.
 *   Barlow        — the human voice. Sentences a person would say.
 *   JetBrains Mono— the system voice. Every number, label, ID and readout.
 *
 * Loaded in src/utils/fonts.ts; mirrored here for inline style objects.
 */
export const FONT = {
  display: '"Teko", "Oswald", Impact, sans-serif',
  body: '"Barlow", "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
} as const;
