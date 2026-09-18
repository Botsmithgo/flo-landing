import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, alpha } from '../utils/colors';
import { useLayout } from '../utils/layout';

/**
 * The house grade — grain over a deep vignette, applied once at film level.
 *
 * This is the same two-layer finish used on the other films in this workspace,
 * and the reason is consistency of feel rather than of look: browser-rendered
 * gradients are *too* clean, and the eye reads perfect smoothness as "computer".
 * A little noise reads as "lens". A vignette reads as "camera".
 *
 * Two details matter more than they look like they should:
 *
 * 1. THE SEED STEPS EVERY RENDER FRAME. An earlier version held each seed for
 *    two frames to "stop the grain strobing" — which produced the opposite.
 *    Holding a noise field for two frames and then jumping is a 30Hz pulse, and
 *    a pulse is exactly what the eye catches. Real grain changes every frame;
 *    at 60fps that reads as a surface that swims, not one that flickers.
 *
 * 2. THE VIGNETTE CLOSES TOWARD THE BRAND SURFACE, NOT TOWARD BLACK. Falling
 *    off to #000 puts a hard, slightly blue edge on a warm dark frame. Falling
 *    off to the product's own --paper keeps the whole image inside one colour
 *    world, and it steadies the frame edges during fast camera moves — which is
 *    most of why this layer makes motion feel calmer.
 */
export const FilmGrade: React.FC<{ grain?: number; vignette?: number }> = ({
  grain = 0.045,
  vignette = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  // Real frames, on purpose: grain belongs to the render, not to the story.
  const seed = (frame % 61) + 1;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Vignette — eye-steering, and an anchor for the frame edges. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(115% 88% at 50% 44%, transparent 50%, ${C.paper} 128%)`,
          opacity: vignette,
        }}
      />

      {/* A single warm lift at the centre so the vignette reads as light
          falling off rather than as a dark ring painted on top. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at 50% 42%, ${alpha(C.sage, 0.05)} 0%, transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />

      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: grain }}
      >
        <filter id={`grain${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Kept as a named export because scenes occasionally want grain alone, without
 * the vignette — the manifesto beat, for instance, already has its own falloff.
 */
export const Grain: React.FC<{ opacity?: number; scale?: number }> = ({
  opacity = 0.045,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const seed = (frame % 61) + 1;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <filter id={`g-only-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.9 / scale}
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={width} height={height} filter={`url(#g-only-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
