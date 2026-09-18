import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { alpha } from '../utils/colors';
import { useLayout } from '../utils/layout';

/**
 * Cinematic grain + a whisper of chromatic aberration at the edges.
 *
 * This is the last layer in the stack and it does more work than it looks
 * like it should: browser-rendered gradients are *too* clean, and the eye
 * reads perfect smoothness as "computer". A little noise reads as "lens".
 *
 * The turbulence seed steps every 2 frames rather than every frame — real
 * film grain doesn't strobe at 30fps, it swims.
 */

export const Grain: React.FC<{ opacity?: number; scale?: number }> = ({
  opacity = 0.052,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useLayout();
  const seed = Math.floor(frame / 2) % 97;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <filter id={`grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.82 / scale}
            numOctaves={3}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Lens imperfection: a faint chromatic fringe that only exists in the outer
 * 25% of the frame, where a real wide lens would show it.
 */
export const LensFringe: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.5 * strength }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 95% at 50% 50%, transparent 62%, ${alpha(
          '#4FE5FF',
          0.07,
        )} 88%, transparent 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(118% 93% at 50% 50%, transparent 66%, ${alpha(
          '#E44FD0',
          0.055,
        )} 92%, transparent 100%)`,
      }}
    />
  </AbsoluteFill>
);
