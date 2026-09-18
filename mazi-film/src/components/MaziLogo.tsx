import React, { useId } from 'react';
import { C, FONT, alpha } from '../utils/colors';
import { E, ramp, sprHeavy, sprSnap } from '../utils/easing';

/**
 * THE MARK — the website's lockup, revealed the way the film reveals things.
 *
 * mazidex.com sets its brand as `MAZI<span>DEX</span>` followed by a small red
 * dot: Teko 600, MAZI in the site's ink, DEX in the site's gold. That exact
 * lockup is what the film ends on, so the last frame of the film and the first
 * frame of the site are the same object.
 *
 * It is set in the real typeface rather than drawn as geometry (which is what
 * the previous mark was), because the site's letters are what the viewer will
 * see next and a near-miss is worse than a different design. The reveal
 * choreography is kept intact — it is the part worth keeping:
 *
 *   1. TRACE   outlines draw themselves, letter by letter, in gold
 *   2. PAINT   a vertical light bar crosses the mark; solid fill exists only
 *              behind the bar — the light is literally painting the logo.
 *              MAZI lands in ink, then DEX in gold, then the dot pops.
 *   3. SETTLE  chromatic split decays, bloom blooms once, everything stills
 *
 * SVG <text> takes a stroke, and a stroke on text can be dashed and offset, so
 * the outline trace works on real glyphs. Each letter is its own <tspan>, which
 * means the browser lays the word out with the font's true advances while every
 * letter still carries its own dash offset for the stagger.
 */

// ── Metrics ─────────────────────────────────────────────────────────────────
// Logo-space: cap height 200 with the cap top at y=30 and the baseline at
// y=230, which is the box the previous geometric mark used, so Reveal's
// layout maths is unchanged. Teko's cap height is ~0.68em, so 200 units of cap
// is a 294-unit font size. "MAZIDEX" at that size is ~830 units wide plus the
// dot; the view is 880 so the dot has room.
const FONT_SIZE = 294;
const BASELINE = 230;
export const LOGO_VIEW = { w: 880, h: 260 };
/** Approximate advance of "MAZI" at FONT_SIZE — where the convergence targets live. */
const MAZI_W = 462;

const WORD = 'MAZI';
const SUFFIX = 'DEX';

// ── Convergence targets ─────────────────────────────────────────────────────
// The particle assembly wants points along the letter outlines. Text has no
// sampleable outline in React without measuring, so the targets come from a
// stroke-friendly polygon approximation of M A Z I laid over the same box —
// the earlier geometric mark, scaled in x to sit under the Teko word. At
// particle scale the difference between a polygon M and a Teko M is invisible;
// what matters is that the dust gathers *where the letters will be*.

type Poly = readonly (readonly [number, number])[];
const M: Poly = [
  [0, 230], [0, 30], [34, 30], [95, 140], [156, 30], [190, 30],
  [190, 230], [156, 230], [156, 95], [108, 180], [82, 180], [34, 95], [34, 230],
];
const A_CHEVRON: Poly = [[0, 230], [90, 30], [180, 230], [142, 230], [90, 122], [38, 230]];
const A_BAR: Poly = [[44, 172], [136, 172], [136, 204], [44, 204]];
const Z: Poly = [
  [0, 30], [170, 30], [170, 64], [56, 196], [170, 196],
  [170, 230], [0, 230], [0, 196], [114, 64], [0, 64],
];
const I: Poly = [[0, 30], [34, 30], [34, 230], [0, 230]];
const LETTERS: readonly { x: number; polys: Poly[] }[] = [
  { x: 0, polys: [M] },
  { x: 230, polys: [A_CHEVRON, A_BAR] },
  { x: 450, polys: [Z] },
  { x: 660, polys: [I] },
];
const POLY_W = 694;

export const sampleLogoPoints = (count: number): { x: number; y: number }[] => {
  const segs: { ax: number; ay: number; bx: number; by: number; len: number }[] = [];
  for (const L of LETTERS) {
    for (const poly of L.polys) {
      for (let i = 0; i < poly.length; i++) {
        const [ax, ay] = poly[i];
        const [bx, by] = poly[(i + 1) % poly.length];
        segs.push({ ax: ax + L.x, ay, bx: bx + L.x, by, len: Math.hypot(bx - ax, by - ay) });
      }
    }
  }
  const total = segs.reduce((a, s) => a + s.len, 0);
  const pts: { x: number; y: number }[] = [];
  const sx = MAZI_W / POLY_W;
  for (let k = 0; k < count; k++) {
    let d = ((k + 0.5) / count) * total;
    for (const s of segs) {
      if (d <= s.len) {
        const t = d / s.len;
        pts.push({ x: (s.ax + (s.bx - s.ax) * t) * sx, y: s.ay + (s.by - s.ay) * t });
        break;
      }
      d -= s.len;
    }
  }
  return pts;
};

type Props = {
  frame: number;
  start: number;
  /** On-screen width in px. */
  width: number;
  /** Overrides the internal choreography with a raw 0–1 (for held states). */
  force?: number;
  style?: React.CSSProperties;
};

export const MaziLogo: React.FC<Props> = ({ frame, start, width, force, style }) => {
  const raw = useId().replace(/[:]/g, '');
  const id = (n: string) => `${n}-${raw}`;
  const scale = width / LOGO_VIEW.w;
  const height = LOGO_VIEW.h * scale;

  const t = frame - start;

  // 1 — trace: outlines draw, letter by letter
  const trace = (i: number) => (force ?? 1) * ramp(t, i * 1.6, 12, E.snap);
  // 2 — paint: the light bar crosses, -0.12 → 1.14 in logo x-fraction.
  //     Completes at t = 23, which is the frame the film's MARK impact lands on.
  const paintRaw = force ?? ramp(t, 8, 15, E.glide);
  const paintX = -0.12 + paintRaw * 1.26;
  // 3 — settle: chroma decays, bloom falls off, the mark goes still
  const settle = force ?? ramp(t, 22, 14, E.out);
  const chroma = (1 - settle) * 4.2;
  const bloom = force ?? Math.max(0, 1 - ramp(t, 11, 22, E.out)) * 0.8 + 0.22;
  const lift = force !== undefined ? 1 : sprHeavy(t, 8);
  // The dot pops once the bar has cleared the X.
  const dot = force ?? sprSnap(t, 21);

  // A dash long enough to cover any Teko cap outline at this size. The offset
  // animates from the full length (invisible) to zero (fully drawn).
  const DASH = 1500;

  const Word: React.FC<{
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    dashed?: boolean;
    opacity?: number;
    dx?: number;
    suffixFill?: string;
  }> = ({ fill = 'none', stroke = 'none', strokeWidth = 0, dashed = false, opacity = 1, dx = 0, suffixFill }) => (
    <text
      x={dx}
      y={BASELINE}
      fontFamily={FONT.display}
      fontSize={FONT_SIZE}
      fontWeight={600}
      letterSpacing={0.6}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      opacity={opacity}
      style={{ fontVariantLigatures: 'none' }}
    >
      {WORD.split('').map((ch, i) => (
        <tspan
          key={`w${i}`}
          style={
            dashed
              ? { strokeDasharray: DASH, strokeDashoffset: DASH * (1 - trace(i)) }
              : undefined
          }
        >
          {ch}
        </tspan>
      ))}
      {SUFFIX.split('').map((ch, i) => (
        <tspan
          key={`s${i}`}
          fill={suffixFill ?? fill}
          style={
            dashed
              ? { strokeDasharray: DASH, strokeDashoffset: DASH * (1 - trace(WORD.length + i)) }
              : undefined
          }
        >
          {ch}
        </tspan>
      ))}
    </text>
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        transform: `scale(${0.97 + lift * 0.03})`,
        ...style,
      }}
    >
      <svg
        viewBox={`0 0 ${LOGO_VIEW.w} ${LOGO_VIEW.h}`}
        width={width}
        height={height}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Everything solid is revealed only to the left of the paint bar. */}
          <clipPath id={id('paint')}>
            <rect
              x={-40}
              y={-40}
              width={Math.max(0, (paintX + 0.02) * LOGO_VIEW.w + 40)}
              height={LOGO_VIEW.h + 80}
            />
          </clipPath>

          {/* MAZI: the site's ink, with a whisper of light across it. */}
          <linearGradient id={id('inkFill')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor={C.siteInk} />
            <stop offset="100%" stopColor={alpha(C.siteInk, 0.86)} />
          </linearGradient>
          {/* DEX: the site's gold, foil-lit. */}
          <linearGradient id={id('goldFill')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.goldLift} />
            <stop offset="45%" stopColor={C.gold} />
            <stop offset="100%" stopColor={C.goldDeep} />
          </linearGradient>

          <linearGradient id={id('bar')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="42%" stopColor={alpha(C.gold, 0.55)} />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="58%" stopColor={alpha(C.goldLift, 0.5)} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* ── 1. TRACE ─────────────────────────────────────────────────── */}
        <Word dashed stroke={alpha(C.gold, 0.9 * (1 - settle * 0.72))} strokeWidth={1.7} />

        {/* ── 2. PAINT — chromatic ghosts, then the solid mark ─────────── */}
        <g clipPath={`url(#${id('paint')})`}>
          {chroma > 0.15 ? (
            <g style={{ mixBlendMode: 'screen' }}>
              <Word fill={C.gold} opacity={0.5} dx={-chroma} />
              <Word fill={C.brand} opacity={0.4} dx={chroma} />
            </g>
          ) : null}
          <Word fill={`url(#${id('inkFill')})`} suffixFill={`url(#${id('goldFill')})`} />
        </g>

        {/* the dot — the site's, after the X */}
        <circle
          cx={LOGO_VIEW.w - 14}
          cy={BASELINE - 100}
          r={11 * dot}
          fill={C.siteRed}
          opacity={Math.min(1, dot * 1.4)}
        />

        {/* the painting light itself */}
        {paintRaw > 0.001 && paintRaw < 0.999 ? (
          <rect
            x={paintX * LOGO_VIEW.w - 9}
            y={-46}
            width={18}
            height={LOGO_VIEW.h + 92}
            fill={`url(#${id('bar')})`}
            style={{ mixBlendMode: 'screen' }}
          />
        ) : null}
      </svg>

      {/* ── 3. BLOOM — the mark lights the room ──────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-20%',
          top: '-70%',
          width: '140%',
          height: '240%',
          background: `radial-gradient(50% 42% at 50% 50%, ${alpha(C.goldLift, 0.16 * bloom)} 0%, ${alpha(
            C.gold,
            0.06 * bloom,
          )} 45%, transparent 72%)`,
          filter: `blur(${width * 0.03}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
