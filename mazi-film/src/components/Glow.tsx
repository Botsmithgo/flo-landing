import React from 'react';
import { alpha } from '../utils/colors';

/**
 * Layered glow.
 *
 * A single big box-shadow is the tell-tale of cheap motion graphics: it has
 * one falloff curve, so it reads as a sticker. Real emissive objects produce
 * three distinct things at once —
 *
 *   core        a tiny, almost-white, very bright centre
 *   bloom       a medium halo carrying the object's hue
 *   atmosphere  a huge, very faint wash that lights the *room*, not the object
 *
 * Every light in this film is built from all three.
 */

type GlowProps = {
  color: string;
  /** Radius of the medium bloom, px. Core and atmosphere derive from it. */
  size: number;
  /** Overall multiplier. */
  intensity?: number;
  /** Squash the light horizontally (anamorphic) — 1 = round, 3 = streak. */
  stretch?: number;
  style?: React.CSSProperties;
};

export const Glow: React.FC<GlowProps> = ({
  color,
  size,
  intensity = 1,
  stretch = 1,
  style,
}) => {
  const i = Math.max(0, intensity);
  const layers: { r: number; a: number; blur: number }[] = [
    { r: size * 0.22, a: 0.95 * i, blur: size * 0.06 },
    { r: size, a: 0.36 * i, blur: size * 0.3 },
    { r: size * 3.2, a: 0.11 * i, blur: size * 0.9 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        ...style,
      }}
    >
      {layers.map((l, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: -l.r * stretch,
            top: -l.r,
            width: l.r * 2 * stretch,
            height: l.r * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(color, l.a)} 0%, ${alpha(
              color,
              l.a * 0.35,
            )} 32%, transparent 68%)`,
            filter: `blur(${l.blur}px)`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Object bloom. Wraps real content and adds blurred, screen-blended copies of
 * it behind itself, so the light appears to *come off* the artwork rather than
 * being painted underneath it.
 */
export const Bloom: React.FC<{
  children: React.ReactNode;
  /** Blur radius of the main bloom pass. */
  radius?: number;
  intensity?: number;
  /** Adds a second, much wider pass. Expensive — use on hero elements only. */
  wide?: boolean;
  style?: React.CSSProperties;
}> = ({ children, radius = 18, intensity = 0.8, wide = true, style }) => (
  <div style={{ position: 'relative', ...style }}>
    {wide ? (
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          filter: `blur(${radius * 3.4}px) saturate(1.5)`,
          opacity: intensity * 0.42,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
    ) : null}
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        filter: `blur(${radius}px) saturate(1.35)`,
        opacity: intensity,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);

/**
 * Anamorphic streak — the horizontal flare a cine lens throws off a hard
 * specular highlight. Used only on genuine specular events (the ignition, the
 * card's rim light, the match lock).
 */
export const LightStreak: React.FC<{
  color: string;
  width: number;
  thickness?: number;
  intensity?: number;
  angle?: number;
  style?: React.CSSProperties;
}> = ({ color, width, thickness = 2, intensity = 1, angle = 0, style }) => (
  <div
    style={{
      position: 'absolute',
      left: -width / 2,
      top: -thickness * 4,
      width,
      height: thickness * 8,
      transform: `rotate(${angle}deg)`,
      mixBlendMode: 'screen',
      pointerEvents: 'none',
      ...style,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(90deg, transparent 0%, ${alpha(
          color,
          0.28 * intensity,
        )} 30%, ${alpha(color, 0.5 * intensity)} 50%, ${alpha(
          color,
          0.28 * intensity,
        )} 70%, transparent 100%)`,
        filter: `blur(${thickness * 2.4}px)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        height: thickness,
        marginTop: -thickness / 2,
        background: `linear-gradient(90deg, transparent 0%, ${alpha(
          '#FFFFFF',
          0.75 * intensity,
        )} 48%, ${alpha('#FFFFFF', 0.9 * intensity)} 50%, ${alpha(
          '#FFFFFF',
          0.75 * intensity,
        )} 52%, transparent 100%)`,
        filter: `blur(${thickness * 0.4}px)`,
      }}
    />
  </div>
);
