import React, { useId, useMemo } from 'react';
import { C, alpha } from '../utils/colors';
import { E, ramp, sprHeavy } from '../utils/easing';

/**
 * THE MARK.
 *
 * Drawn as geometry, not set in a typeface — because the reveal needs the
 * letters to be *objects*: something light can trace, particles can assemble
 * into, and a wipe can paint.
 *
 * The letterforms take their logic from the card itself: flat terminals, hard
 * 90° and 45° cuts, uniform stroke weight, a single optical cap height. No
 * curves anywhere in the mark. A card is a rectangle; so is this.
 *
 * Reveal choreography, in order:
 *   1. TRACE   outlines draw themselves, staggered per letter
 *   2. PAINT   a vertical light bar crosses the mark; solid fill exists only
 *              behind the bar — the light is literally painting the logo
 *   3. SETTLE  chromatic split decays, bloom blooms once, everything stills
 */

// ── Geometry ────────────────────────────────────────────────────────────────
// Cap height 200 (y 30 → 230). Uniform stroke ~34. Letters laid out with a
// 40-unit sidebearing. Total advance 694.

type Poly = readonly (readonly [number, number])[];

const M: Poly = [
  [0, 230], [0, 30], [34, 30], [95, 140], [156, 30], [190, 30],
  [190, 230], [156, 230], [156, 95], [108, 180], [82, 180], [34, 95], [34, 230],
];

const A_CHEVRON: Poly = [[0, 230], [90, 30], [180, 230], [142, 230], [90, 122], [38, 230]];
// Crossbar sits at ~71% of cap height. Any higher and the A reads as a lambda
// with a tab welded on — which is exactly what it did at 60%.
const A_BAR: Poly = [[44, 172], [136, 172], [136, 204], [44, 204]];

const Z: Poly = [
  [0, 30], [170, 30], [170, 64], [56, 196], [170, 196],
  [170, 230], [0, 230], [0, 196], [114, 64], [0, 64],
];

const I: Poly = [[0, 30], [34, 30], [34, 230], [0, 230]];

type Letter = { key: string; x: number; polys: Poly[] };

export const LETTERS: readonly Letter[] = [
  { key: 'M', x: 0, polys: [M] },
  { key: 'A', x: 230, polys: [A_CHEVRON, A_BAR] },
  { key: 'Z', x: 450, polys: [Z] },
  { key: 'I', x: 660, polys: [I] },
];

export const LOGO_VIEW = { w: 694, h: 260 };

const toPath = (poly: Poly, offsetX: number): string =>
  poly.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x + offsetX} ${y}`).join(' ') + ' Z';

/**
 * Evenly spaced points along the mark's outlines, in logo-space units.
 * Used as convergence targets so particles assemble *into* the letterforms.
 */
export const sampleLogoPoints = (count: number): { x: number; y: number }[] => {
  const segs: { ax: number; ay: number; bx: number; by: number; len: number }[] = [];
  for (const L of LETTERS) {
    for (const poly of L.polys) {
      for (let i = 0; i < poly.length; i++) {
        const [ax, ay] = poly[i];
        const [bx, by] = poly[(i + 1) % poly.length];
        segs.push({
          ax: ax + L.x,
          ay,
          bx: bx + L.x,
          by,
          len: Math.hypot(bx - ax, by - ay),
        });
      }
    }
  }
  const total = segs.reduce((a, s) => a + s.len, 0);
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    let d = (i / count) * total;
    for (const s of segs) {
      if (d <= s.len) {
        const t = s.len === 0 ? 0 : d / s.len;
        out.push({ x: s.ax + (s.bx - s.ax) * t, y: s.ay + (s.by - s.ay) * t });
        break;
      }
      d -= s.len;
    }
  }
  return out;
};

type Props = {
  frame: number;
  /** Frame the trace begins. */
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
  const trace = (i: number) => (force ?? 1) * ramp(t, i * 1.8, 11, E.snap);
  // 2 — paint: the light bar crosses, -0.12 → 1.14 in logo x-fraction.
  //     Completes at t = 23, which is the frame the film's MARK impact lands on.
  const paintRaw = force ?? ramp(t, 8, 15, E.glide);
  const paintX = -0.12 + paintRaw * 1.26;
  // 3 — settle: chroma decays, bloom falls off, the mark goes still
  const settle = force ?? ramp(t, 22, 14, E.out);
  const chroma = (1 - settle) * 4.2;
  const bloom = force ?? Math.max(0, 1 - ramp(t, 11, 22, E.out)) * 0.8 + 0.22;
  const lift = force !== undefined ? 1 : sprHeavy(t, 8);

  const fillPaths = LETTERS.flatMap((L) => L.polys.map((p) => toPath(p, L.x)));

  const Marks: React.FC<{ fill: string; opacity?: number; dx?: number }> = ({
    fill,
    opacity = 1,
    dx = 0,
  }) => (
    <g transform={`translate(${dx},0)`} opacity={opacity}>
      {fillPaths.map((d, i) => (
        <path key={i} d={d} fill={fill} />
      ))}
    </g>
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

          <linearGradient id={id('markFill')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="46%" stopColor={C.bone} />
            <stop offset="100%" stopColor={C.paperInk} />
          </linearGradient>

          <linearGradient id={id('bar')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="42%" stopColor={alpha(C.trust, 0.5)} />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="58%" stopColor={alpha(C.brand, 0.5)} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* ── 1. TRACE ─────────────────────────────────────────────────── */}
        <g>
          {LETTERS.map((L, li) =>
            L.polys.map((poly, pi) => (
              <path
                key={`${li}-${pi}`}
                d={toPath(poly, L.x)}
                fill="none"
                stroke={alpha(C.trust, 0.9 * (1 - settle * 0.72))}
                strokeWidth={1.6}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - trace(li)}
              />
            )),
          )}
        </g>

        {/* ── 2. PAINT — chromatic ghosts, then the solid mark ─────────── */}
        <g clipPath={`url(#${id('paint')})`}>
          {chroma > 0.15 ? (
            <g style={{ mixBlendMode: 'screen' }}>
              <Marks fill={C.trust} opacity={0.55} dx={-chroma} />
              <Marks fill={C.sage} opacity={0.5} dx={chroma} />
            </g>
          ) : null}
          <Marks fill={`url(#${id('markFill')})`} />
        </g>

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
          inset: 0,
          filter: `blur(${width * 0.035}px)`,
          opacity: bloom * 0.75,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      >
        <svg viewBox={`0 0 ${LOGO_VIEW.w} ${LOGO_VIEW.h}`} width={width} height={height}>
          <g clipPath={`url(#${id('paint')})`}>
            <Marks fill={C.trustIce} opacity={0.9} />
          </g>
        </svg>
      </div>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: width * 1.9,
          height: height * 3.2,
          marginLeft: -width * 0.95,
          marginTop: -height * 1.6,
          background: `radial-gradient(ellipse at center, ${alpha(
            C.trust,
            0.16 * bloom,
          )} 0%, ${alpha(C.brand, 0.08 * bloom)} 40%, transparent 70%)`,
          filter: `blur(${width * 0.06}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
