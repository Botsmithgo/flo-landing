import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, alpha } from '../utils/colors';
import { E, ramp, strike } from '../utils/easing';
import { useLayout } from '../utils/layout';

/**
 * TRANSITIONS.
 *
 * No dissolves. Every cut in this film is *caused* by something in the image —
 * an ignition, a detonation, a lock, a collapse — so these are impact devices,
 * not wipes: a chromatic bloom, a pressure ring, and a channel split reserved
 * for the two hardest hits.
 */

/**
 * Impact flash. Not a white rectangle at 100% — a fast chromatic bloom that
 * blows out from the centre and leaves a violet afterimage, the way a real
 * sensor clips.
 */
export const Flash: React.FC<{
  frame: number;
  at: number;
  decay?: number;
  intensity?: number;
  color?: string;
  /** Flash from a point rather than the whole frame. */
  origin?: { x: string; y: string };
}> = ({ frame, at, decay = 9, intensity = 1, color = C.ice, origin }) => {
  const e = strike(frame, at, decay, 1.5) * intensity;
  if (e <= 0.004) return null;
  const ox = origin?.x ?? '50%';
  const oy = origin?.y ?? '50%';

  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 70% at ${ox} ${oy}, ${alpha(
            '#FFFFFF',
            0.9 * e,
          )} 0%, ${alpha(color, 0.55 * e)} 22%, ${alpha(C.violet, 0.2 * e)} 48%, transparent 76%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* Afterimage — hangs a few frames longer than the core. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 100% at ${ox} ${oy}, ${alpha(
            C.violet,
            0.22 * Math.sqrt(e),
          )} 0%, transparent 70%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

/**
 * Shockwave. A ring that expands and thins. Used once per detonation — it is
 * what makes an impact read as *pressure* rather than a brightness change.
 */
export const Shockwave: React.FC<{
  frame: number;
  at: number;
  duration?: number;
  x?: string;
  y?: string;
  color?: string;
  maxScale?: number;
}> = ({ frame, at, duration = 26, x = '50%', y = '50%', color = C.ice, maxScale = 2.6 }) => {
  const p = ramp(frame, at, duration, E.expoOut);
  if (p <= 0 || p >= 1) return null;
  const { width } = useLayout();
  const size = width * 0.36 * (0.15 + p * maxScale);
  const o = Math.pow(1 - p, 2.1);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size * 0.82,
        marginLeft: -size / 2,
        marginTop: -(size * 0.82) / 2,
        borderRadius: '50%',
        border: `${Math.max(0.6, 5 * (1 - p))}px solid ${alpha(color, 0.65 * o)}`,
        boxShadow: `0 0 ${60 * (1 - p)}px ${alpha(color, 0.4 * o)}, inset 0 0 ${
          40 * (1 - p)
        }px ${alpha(color, 0.25 * o)}`,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        filter: `blur(${p * 3}px)`,
      }}
    />
  );
};

/**
 * Chromatic aberration pulse. Splits the frame's channels for a few frames.
 * Used *only* on the two hardest impacts — used more, it becomes a glitch
 * effect, which this film is deliberately not.
 */
export const ChromaSplit: React.FC<{
  frame: number;
  at: number;
  decay?: number;
  amount?: number;
  children: React.ReactNode;
}> = ({ frame, at, decay = 7, amount = 14, children }) => {
  const e = strike(frame, at, decay, 1);
  if (e <= 0.01) return <>{children}</>;
  const d = e * amount;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${-d}px)`,
          opacity: 0.5 * e,
          mixBlendMode: 'screen',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, filter: 'sepia(1) hue-rotate(150deg) saturate(6)' }}>
          {children}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${d}px)`,
          opacity: 0.5 * e,
          mixBlendMode: 'screen',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, filter: 'sepia(1) hue-rotate(280deg) saturate(6)' }}>
          {children}
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
};
