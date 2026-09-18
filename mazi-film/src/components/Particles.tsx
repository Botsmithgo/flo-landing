import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { C, alpha } from '../utils/colors';
import { E, drift, ramp } from '../utils/easing';
import { depth } from '../utils/depth';
import { useLayout } from '../utils/layout';
import { field } from '../utils/random';

/**
 * Particles, with rules.
 *
 * The brief's warning — "random particles with no reason" — is the right one.
 * So every particle system here has a *physical* justification:
 *
 *   DustField   airborne matter catching a key light. It exists to prove the
 *               darkness is a volume, not a background colour. Depth-sorted:
 *               near motes are huge, blurred and slow; far motes are pinpricks.
 *   Sparks      matter thrown off an event. Only fires on impacts.
 *   Converge    matter being *organised*. Only used when the system resolves
 *               something — the match, and the mark.
 */

type DustProps = {
  frame: number;
  count?: number;
  /** Master opacity. */
  intensity?: number;
  /** Camera translation for parallax, px. */
  camX?: number;
  camY?: number;
  /** Plane that is in focus — near motes bokeh out when the subject is sharp. */
  focus?: number;
  color?: string;
};

export const DustField: React.FC<DustProps> = ({
  frame,
  count = 74,
  intensity = 1,
  camX = 0,
  camY = 0,
  focus = 900,
  color = C.trustIce,
}) => {
  const { width, height } = useLayout();

  const motes = useMemo(
    () =>
      field(count, 'dust', (r) => ({
        x: r.between(-0.15, 1.15),
        y: r.between(-0.1, 1.1),
        z: r.between(140, 4200),
        size: r.between(1.1, 3.4),
        speed: r.between(0.0035, 0.016),
        amp: r.between(10, 64),
        phase: r.between(0, Math.PI * 2),
        rise: r.between(0.06, 0.42),
        bright: r.between(0.25, 1),
      })),
    [count],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: intensity }}>
      {motes.map((m, i) => {
        const d = depth({ z: m.z, focus, aperture: 1.5, maxBlur: 16 });
        const x = m.x * width + drift(frame, m.speed, m.amp, m.phase) - camX * d.parallax;
        // Slow convective rise — dust doesn't fall in still air, it drifts up.
        const y =
          ((m.y * height - frame * m.rise) % (height * 1.25) + height * 1.25) % (height * 1.25) -
          height * 0.1 -
          camY * d.parallax;
        const s = m.size * d.scale * 3.2;
        const o = d.opacity * m.bright * (d.blur > 6 ? 0.5 : 1);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              borderRadius: '50%',
              background:
                d.blur > 5
                  ? `radial-gradient(circle, ${alpha(color, 0.5)} 0%, ${alpha(
                      color,
                      0.12,
                    )} 55%, transparent 72%)`
                  : color,
              opacity: o * 0.8,
              filter: d.blur > 0.5 ? `blur(${d.blur * 0.55}px)` : undefined,
              boxShadow: d.blur < 2 ? `0 0 ${s * 2.5}px ${alpha(color, 0.5)}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Sparks. Emitted from a point, decelerating (air resistance), smeared along
 * their own velocity vector. Not confetti — these are fragments.
 */
export const Sparks: React.FC<{
  frame: number;
  /** Frame the emission happens. */
  at: number;
  /** Lifetime in frames. */
  life?: number;
  count?: number;
  /** Emission origin in px relative to the frame. */
  x: number;
  y: number;
  /** Max travel distance in px. */
  reach?: number;
  colors?: readonly string[];
  /** Bias emission into a horizontal band (0 = sphere, 1 = flat disc). */
  flatten?: number;
  seed?: string;
}> = ({
  frame,
  at,
  life = 34,
  count = 120,
  x,
  y,
  reach = 700,
  colors = [C.trustIce, C.trust, C.brand],
  flatten = 0.35,
  seed = 'sparks',
}) => {
  const t = (frame - at) / life;
  const parts = useMemo(
    () =>
      field(count, seed, (r) => ({
        angle: r.between(0, Math.PI * 2),
        speed: r.bell(0.25, 1),
        size: r.between(1.2, 4.2),
        color: r.pick(colors),
        delay: r.between(0, 0.14),
        spin: r.between(-1, 1),
        len: r.between(0.4, 1),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, seed],
  );

  if (t < 0 || t > 1.15) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {parts.map((p, i) => {
        const lt = Math.max(0, (t - p.delay) / (1 - p.delay));
        if (lt <= 0) return null;
        // Ease-out travel = deceleration.
        const travel = (1 - Math.pow(1 - Math.min(1, lt), 2.4)) * reach * p.speed;
        const px = x + Math.cos(p.angle) * travel;
        const py = y + Math.sin(p.angle) * travel * (1 - flatten);
        const o = Math.max(0, 1 - Math.pow(lt, 1.6));
        const smear = Math.max(0, (1 - lt) * 46 * p.speed * p.len);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: p.size + smear,
              height: p.size,
              marginLeft: -(p.size + smear) / 2,
              marginTop: -p.size / 2,
              borderRadius: p.size,
              background: p.color,
              opacity: o,
              transform: `rotate(${(p.angle * 180) / Math.PI}deg)`,
              boxShadow: `0 0 ${p.size * 4}px ${alpha(p.color, 0.8)}`,
              mixBlendMode: 'screen',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Convergence. Particles fly *in* from a scattered field toward supplied
 * target points, arriving with a stagger. This is the visual grammar of the
 * system resolving — used for the match lock and the wordmark formation.
 */
export const Converge: React.FC<{
  frame: number;
  start: number;
  duration: number;
  /** Where the particles end up, px relative to the frame. */
  targets: readonly { x: number; y: number }[];
  /** Radius the particles start from. */
  spread?: number;
  size?: number;
  color?: string;
  /** Fade the particles out once they land (they've become the thing). */
  dissolveAfter?: number;
  seed?: string;
}> = ({
  frame,
  start,
  duration,
  targets,
  spread = 900,
  size = 2.6,
  color = C.trustIce,
  dissolveAfter = 8,
  seed = 'converge',
}) => {
  const seeds = useMemo(
    () =>
      field(targets.length, seed, (r) => ({
        angle: r.between(0, Math.PI * 2),
        dist: r.between(0.4, 1.4),
        delay: r.between(0, 0.42),
        size: r.between(0.6, 1.5),
      })),
    [targets.length, seed],
  );

  if (frame < start) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {targets.map((tgt, i) => {
        const s = seeds[i];
        const p = ramp(frame, start + s.delay * duration, duration * (1 - s.delay), E.expoOut);
        const sx = tgt.x + Math.cos(s.angle) * spread * s.dist;
        const sy = tgt.y + Math.sin(s.angle) * spread * s.dist * 0.7;
        const x = sx + (tgt.x - sx) * p;
        const y = sy + (tgt.y - sy) * p;
        const landed = ramp(frame, start + duration, dissolveAfter, E.out);
        const o = Math.min(1, p * 2.2) * (1 - landed);
        if (o <= 0.01) return null;
        const trail = (1 - p) * 60;
        const ang = Math.atan2(tgt.y - sy, tgt.x - sx);
        const sz = size * s.size;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: sz + trail,
              height: sz,
              marginLeft: -(sz + trail) / 2,
              marginTop: -sz / 2,
              borderRadius: sz,
              background: color,
              opacity: o,
              transform: `rotate(${(ang * 180) / Math.PI}deg)`,
              boxShadow: `0 0 ${sz * 5}px ${alpha(color, 0.9)}`,
              mixBlendMode: 'screen',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
