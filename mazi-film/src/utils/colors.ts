/**
 * MAZI — colour system.
 *
 * Rule of the film: the world is graphite and midnight. Chroma is a *tool*, not
 * a wallpaper. Cyan is the machine (detection, scanning, certainty). Violet is
 * the field (intelligence, depth, the space between things). Amber is money —
 * it appears exactly twice in 26 seconds, and both times it means value.
 */

export const C = {
  // ── Environment ──────────────────────────────────────────────────────────
  void: '#04060A', // true floor of the frame — never pure #000
  abyss: '#070B12',
  midnight: '#0A1020',
  navy: '#0E1930',
  graphite: '#151A22',
  slate: '#222B38',
  smoke: '#3A4655',

  // ── Ink ──────────────────────────────────────────────────────────────────
  bone: '#EEF2F6',
  paper: '#C8D2DC',
  muted: '#7C8A99',
  faint: '#4A5765',

  // ── Accent: the machine ──────────────────────────────────────────────────
  cyan: '#4FE5FF',
  cyanDeep: '#12A8D6',
  ice: '#B8F4FF',

  // ── Accent: the field ────────────────────────────────────────────────────
  violet: '#7B5CFF',
  violetDeep: '#3D2A9E',
  magenta: '#E44FD0',

  // ── Accent: value (use sparingly — twice in the whole film) ──────────────
  amber: '#FFC46B',
  gold: '#C9A05A',

  // ── Semantic ─────────────────────────────────────────────────────────────
  positive: '#5BE8A8',
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

/** The one gradient the whole film sits on. Scene-local washes build on it. */
export const GRAD = {
  /** The base environment wash — never flat black, always a graded light. */
  world: `radial-gradient(120% 90% at 50% 38%, ${C.navy} 0%, ${C.abyss} 46%, ${C.void} 100%)`,
} as const;

/** Typography stack. Loaded in src/utils/fonts.ts, mirrored here for style objects. */
export const FONT = {
  display: '"Inter Tight", "Inter", "Helvetica Neue", Arial, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace',
} as const;
