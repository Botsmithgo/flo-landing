import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, GRAD, alpha } from '../utils/colors';
import { drift } from '../utils/easing';
import { useLayout } from '../utils/layout';
import { useStoryFrame } from '../utils/timing';

/**
 * The room the whole film happens inside.
 *
 * Three stacked ideas:
 *   1. A graded wash — never flat black, always a gradient with a light source.
 *   2. Two slow chromatic pools (violet + cyan) that drift independently. They
 *      are what stop the darkness from looking like an empty div.
 *   3. Volumetric haze bands — very low contrast, very large, very slow. They
 *      give the void a sense of *volume* rather than emptiness.
 */

type Props = {
  /** 0 = barely lit void, 1 = fully present environment. */
  intensity?: number;
  /** Bias the chroma toward violet (-1) or cyan (+1). */
  hue?: number;
  /** Adds a faint reflective floor. Used in the manifesto + reveal beats. */
  floor?: boolean;
  children?: React.ReactNode;
};

export const Atmosphere: React.FC<Props> = ({
  intensity = 1,
  hue = 0,
  floor = false,
  children,
}) => {
  const frame = useStoryFrame();
  const { width, height, u } = useLayout();

  const violetT = Math.max(0, 0.5 - hue * 0.5);
  const cyanT = Math.max(0, 0.5 + hue * 0.5);

  // Independent slow drifts so the two pools never lock into a visible rhythm.
  const px1 = 50 + drift(frame, 0.0062, 11, 0.4);
  const py1 = 42 + drift(frame, 0.0048, 8, 1.9);
  const px2 = 50 + drift(frame, 0.0039, 14, 3.2);
  const py2 = 58 + drift(frame, 0.0055, 9, 5.1);

  return (
    <AbsoluteFill style={{ background: C.void, overflow: 'hidden' }}>
      {/* Base grade */}
      <AbsoluteFill style={{ background: GRAD.world, opacity: 0.4 + 0.6 * intensity }} />

      {/* Chromatic pool — the field */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(${62 * (1 + intensity * 0.2)}% ${
            52 * (1 + intensity * 0.2)
          }% at ${px1}% ${py1}%, ${alpha(C.brand, 0.3 * intensity * violetT * 2)} 0%, ${alpha(
            C.brandDeep,
            0.14 * intensity * violetT * 2,
          )} 38%, transparent 70%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Chromatic pool — the machine */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(54% 44% at ${px2}% ${py2}%, ${alpha(
            C.trustDeep,
            0.22 * intensity * cyanT * 2,
          )} 0%, transparent 66%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Volumetric haze — three very large, very slow bands */}
      {[0, 1, 2].map((i) => {
        const y = 28 + i * 24 + drift(frame, 0.0031 + i * 0.0007, 6, i * 2.3);
        const rot = -8 + i * 7 + drift(frame, 0.0021, 2.5, i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -width * 0.3,
              top: `${y}%`,
              width: width * 1.6,
              height: height * (0.2 + i * 0.05),
              transform: `rotate(${rot}deg)`,
              background: `linear-gradient(180deg, transparent 0%, ${alpha(
                i === 1 ? C.trust : C.brand,
                0.05 * intensity,
              )} 50%, transparent 100%)`,
              filter: `blur(${70 * u}px)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {floor ? (
        <>
          {/* Horizon: a single hairline of light where floor meets void */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '68%',
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${alpha(
                C.trustIce,
                0.22 * intensity,
              )} 35%, ${alpha(C.trustIce, 0.3 * intensity)} 50%, ${alpha(
                C.trustIce,
                0.22 * intensity,
              )} 65%, transparent 100%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '68%',
              bottom: 0,
              background: `linear-gradient(180deg, ${alpha(C.panel, 0.55 * intensity)} 0%, ${alpha(
                C.void,
                0.9,
              )} 60%, ${C.void} 100%)`,
            }}
          />
        </>
      ) : null}

      {children}
    </AbsoluteFill>
  );
};

/**
 * Vignette. Two stops: a wide soft falloff that shapes the light, and a tight
 * dark corner that keeps the eye centred. Sits above content, below grain.
 */
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <>
    <AbsoluteFill
      style={{
        background: `radial-gradient(118% 88% at 50% 46%, transparent 38%, ${alpha(
          C.void,
          0.55 * strength,
        )} 82%, ${alpha(C.void, 0.88 * strength)} 100%)`,
        pointerEvents: 'none',
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(150% 120% at 50% 50%, transparent 55%, ${alpha(
          '#000000',
          0.4 * strength,
        )} 100%)`,
        pointerEvents: 'none',
      }}
    />
  </>
);
