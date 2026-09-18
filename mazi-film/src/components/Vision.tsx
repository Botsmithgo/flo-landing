import React, { useMemo } from 'react';
import { C, FONT, alpha } from '../utils/colors';
import { E, drift, ramp, sprSnap, stagger } from '../utils/easing';
import { field } from '../utils/random';
import { Mono, Scramble } from './Typography';

/**
 * THE MAZI VISION SYSTEM.
 *
 * The brief's instruction was "avoid cliché giant green bounding boxes", and
 * the way to honour it is to show a machine doing *several different things*
 * in a specific order, the way a real pipeline does:
 *
 *   1. LOCK      four corner brackets converge from off-object. Mechanical.
 *   2. CONTOUR   the edge is traced by a travelling head, not drawn at once.
 *   3. SCAN      a plane sweeps the surface and leaves feature points in its wake.
 *   4. FEATURES  keypoints pop with confidence values, then quietly persist.
 *   5. LABEL     metadata tethers out on leader lines and commits.
 *
 * Every element is cyan. Cyan is the machine. Nothing else in the film is.
 */

type Box = { w: number; h: number };

/** 1 — Corner locks. Four L-brackets that arrive from outside and snap. */
export const CornerLocks: React.FC<
  Box & { frame: number; start?: number; size?: number; weight?: number; inset?: number }
> = ({ w, h, frame, start = 0, size = 46, weight = 3, inset = -10 }) => {
  const corners = [
    { x: inset, y: inset, sx: 1, sy: 1, from: [-1, -1] },
    { x: w - inset, y: inset, sx: -1, sy: 1, from: [1, -1] },
    { x: w - inset, y: h - inset, sx: -1, sy: -1, from: [1, 1] },
    { x: inset, y: h - inset, sx: 1, sy: -1, from: [-1, 1] },
  ];

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      {corners.map((c, i) => {
        const p = sprSnap(frame - start, stagger(i, 1.6));
        const travel = (1 - p) * 120;
        const o = Math.min(1, p * 2.4);
        return (
          <g
            key={i}
            transform={`translate(${c.x + c.from[0] * travel}, ${
              c.y + c.from[1] * travel
            }) scale(${c.sx}, ${c.sy})`}
            opacity={o}
          >
            <path
              d={`M0 ${size} L0 0 L${size} 0`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={weight}
              strokeLinecap="square"
            />
            {/* a brighter nub at the vertex — the actual "lock" */}
            <rect x={-1} y={-1} width={9} height={9} fill={C.ice} opacity={p} />
          </g>
        );
      })}
    </svg>
  );
};

/** 2 — Contour trace with a travelling head. */
export const ContourTrace: React.FC<Box & { frame: number; start?: number; duration?: number }> = ({
  w,
  h,
  frame,
  start = 0,
  duration = 22,
}) => {
  const p = ramp(frame, start, duration, E.snap);
  const perim = 2 * (w + h);
  const r = Math.min(w, h) * 0.04;

  // Head position along the rectangle perimeter.
  const d = p * perim;
  let hx = 0;
  let hy = 0;
  if (d < w) [hx, hy] = [d, 0];
  else if (d < w + h) [hx, hy] = [w, d - w];
  else if (d < 2 * w + h) [hx, hy] = [w - (d - w - h), h];
  else [hx, hy] = [0, h - (d - 2 * w - h)];

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={r}
        fill="none"
        stroke={alpha(C.cyan, 0.9)}
        strokeWidth={2}
        strokeDasharray={perim}
        strokeDashoffset={perim * (1 - p)}
      />
      {p > 0.02 && p < 0.995 ? (
        <>
          <circle cx={hx} cy={hy} r={4.5} fill={C.ice} />
          <circle cx={hx} cy={hy} r={13} fill="none" stroke={alpha(C.ice, 0.4)} strokeWidth={1} />
        </>
      ) : null}
    </svg>
  );
};

/**
 * 3 — The scan plane. A soft band with a hard core line, plus a faint
 * "exposed" wash above it so the surface looks like it's being *read*.
 */
export const ScanPlane: React.FC<
  Box & { frame: number; start?: number; duration?: number; passes?: number }
> = ({ w, h, frame, start = 0, duration = 26, passes = 1 }) => {
  const raw = (frame - start) / duration;
  if (raw < 0 || raw > passes) return null;
  const p = raw % 1;
  const dir = Math.floor(raw) % 2 === 0 ? 1 : -1;
  const y = (dir === 1 ? p : 1 - p) * h;
  const bandH = h * 0.16;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* exposed region behind the plane */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: dir === 1 ? 0 : y,
          height: dir === 1 ? y : h - y,
          background: `linear-gradient(${dir === 1 ? 180 : 0}deg, transparent 0%, ${alpha(
            C.cyan,
            0.06,
          )} 100%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* the band */}
      <div
        style={{
          position: 'absolute',
          left: -w * 0.05,
          width: w * 1.1,
          top: y - bandH / 2,
          height: bandH,
          background: `linear-gradient(180deg, transparent 0%, ${alpha(
            C.cyan,
            0.22,
          )} 46%, ${alpha(C.ice, 0.32)} 50%, ${alpha(C.cyan, 0.22)} 54%, transparent 100%)`,
          mixBlendMode: 'screen',
          filter: 'blur(1px)',
        }}
      />
      {/* the core */}
      <div
        style={{
          position: 'absolute',
          left: -w * 0.06,
          width: w * 1.12,
          top: y - 1,
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${C.ice} 18%, #FFFFFF 50%, ${C.ice} 82%, transparent 100%)`,
          boxShadow: `0 0 ${w * 0.04}px ${alpha(C.cyan, 0.8)}`,
        }}
      />
    </div>
  );
};

/**
 * 4 — Feature points. Distributed with a bias toward the figure (real keypoint
 * detectors cluster on high-contrast structure, not uniformly), and they
 * *appear behind the scan line*, which is the detail that sells the causality.
 */
export const FeaturePoints: React.FC<
  Box & {
    frame: number;
    /** Frame the scan plane started, and how long it takes — must match ScanPlane. */
    scanStart: number;
    scanDuration: number;
    count?: number;
    /** Show confidence micro-labels on a few of them. */
    labelled?: number;
  }
> = ({ w, h, frame, scanStart, scanDuration, count = 34, labelled = 4 }) => {
  const pts = useMemo(
    () =>
      field(count, 'keypoints', (r, i) => {
        // Bias toward the central figure region, with a few edge/corner points.
        const edge = i % 7 === 0;
        return {
          x: edge ? r.between(0.06, 0.94) : r.bell(0.22, 0.82),
          y: edge ? r.between(0.06, 0.94) : r.bell(0.14, 0.72),
          conf: r.between(0.72, 0.999),
          big: r.chance(0.18),
          rot: r.between(0, 90),
        };
      }),
    [count],
  );

  const scanP = (frame - scanStart) / scanDuration;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
    >
      {pts.map((pt, i) => {
        // A point ignites when the plane crosses it, then settles.
        const born = scanStart + pt.y * scanDuration;
        const age = frame - born;
        if (age < 0 || scanP < 0) return null;
        const pop = sprSnap(age);
        const settle = ramp(age, 4, 10, E.out);
        const s = 1 + (1 - settle) * 1.6;
        const size = (pt.big ? 8 : 5) * s;
        const o = Math.min(1, pop * 1.5) * (0.35 + 0.65 * (1 - settle * 0.55));

        return (
          <g key={i} transform={`translate(${pt.x * w}, ${pt.y * h})`} opacity={o}>
            <path
              d={`M${-size} 0 L${size} 0 M0 ${-size} L0 ${size}`}
              stroke={pt.big ? C.ice : C.cyan}
              strokeWidth={1.2}
            />
            {pt.big ? (
              <rect
                x={-size * 1.5}
                y={-size * 1.5}
                width={size * 3}
                height={size * 3}
                fill="none"
                stroke={alpha(C.cyan, 0.45)}
                strokeWidth={1}
                transform={`rotate(${pt.rot * (1 - settle)})`}
              />
            ) : null}
            {i < labelled ? (
              <text
                x={size * 2.2}
                y={3.5}
                fill={alpha(C.cyan, 0.75)}
                fontFamily={FONT.mono}
                fontSize={9.5}
                letterSpacing="0.8"
              >
                {pt.conf.toFixed(3)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

/**
 * 5 — Data label on a leader line. Anchored to a point on the object, tethered
 * out to clear space. The line draws first, the text commits second — the
 * machine points before it speaks.
 */
export const DataLabel: React.FC<{
  /** Anchor, px relative to the parent box. */
  x: number;
  y: number;
  /** Where the label sits relative to the anchor, px. */
  dx: number;
  dy: number;
  label: string;
  value: string;
  frame: number;
  start?: number;
  scale?: number;
  /** Highlight (used for the value that matters most in a scene). */
  accent?: string;
}> = ({ x, y, dx, dy, label, value, frame, start = 0, scale = 1, accent = C.cyan }) => {
  const line = ramp(frame, start, 9, E.snap);
  const textIn = ramp(frame, start + 6, 12, E.out);
  const side = dx >= 0 ? 1 : -1;

  // Elbow: a 45° run out of the anchor, then a horizontal tail.
  const elbowLen = Math.min(Math.abs(dx) * 0.42, Math.abs(dy) * 1.2);
  const ex = x + side * elbowLen;
  const ey = y + Math.sign(dy || 1) * elbowLen;
  const tx = x + dx;
  const ty = y + dy;
  const total = Math.hypot(ex - x, ey - y) + Math.abs(tx - ex);

  return (
    <>
      <svg
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
        width="100%"
        height="100%"
      >
        <polyline
          points={`${x},${y} ${ex},${ey} ${tx},${ty}`}
          fill="none"
          stroke={alpha(accent, 0.8)}
          strokeWidth={1.1 * scale}
          strokeDasharray={total}
          strokeDashoffset={total * (1 - line)}
        />
        <circle cx={x} cy={y} r={3 * scale} fill={accent} opacity={line} />
        <circle
          cx={x}
          cy={y}
          r={9 * scale * (2 - line)}
          fill="none"
          stroke={alpha(accent, 0.5 * (1 - line))}
          strokeWidth={1}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: tx,
          top: ty,
          transform: `translate(${side > 0 ? 8 * scale : '-100%'}${
            side > 0 ? 'px' : ''
          }, -50%) translateX(${side > 0 ? 0 : -8 * scale}px)`,
          opacity: textIn,
          pointerEvents: 'none',
          textAlign: side > 0 ? 'left' : 'right',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ marginBottom: 2 * scale }}>
          <Mono size={9.5 * scale} color={alpha(C.muted, 0.9)} tracking={2.6 * scale}>
            {label}
          </Mono>
        </div>
        <div
          style={{
            fontFamily: FONT.mono,
            fontSize: 15 * scale,
            letterSpacing: 1.4 * scale,
            color: C.bone,
            fontWeight: 500,
          }}
        >
          <Scramble text={value} progress={textIn} frame={frame} seed={label} />
        </div>
      </div>
    </>
  );
};

/**
 * A depth/segmentation mesh that deforms across the object for a few frames.
 * Deliberately brief — it's a glimpse of the machine's internal representation,
 * not a dashboard.
 */
export const DepthMesh: React.FC<Box & { frame: number; start: number; duration: number }> = ({
  w,
  h,
  frame,
  start,
  duration,
}) => {
  const p = ramp(frame, start, duration * 0.3, E.out);
  const out = ramp(frame, start + duration * 0.62, duration * 0.38, E.out);
  const o = Math.max(0, p - out);
  if (o <= 0.01) return null;

  const cols = 9;
  const rows = 13;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: o * 0.5 }}
    >
      {Array.from({ length: rows + 1 }, (_, r) => {
        const pts = Array.from({ length: cols + 1 }, (_, c) => {
          const fx = c / cols;
          const fy = r / rows;
          // Push the mesh outward over the figure — a crude depth field.
          const bulge =
            Math.exp(-(((fx - 0.52) ** 2) / 0.055 + ((fy - 0.4) ** 2) / 0.09)) *
            18 *
            (0.6 + 0.4 * Math.sin(frame * 0.12 + r * 0.4));
          return `${fx * w},${fy * h - bulge + drift(frame + r * 3, 0.06, 1.2, c)}`;
        }).join(' ');
        return (
          <polyline
            key={r}
            points={pts}
            fill="none"
            stroke={alpha(C.cyan, 0.55)}
            strokeWidth={0.8}
          />
        );
      })}
    </svg>
  );
};
