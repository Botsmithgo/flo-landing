import React, { useId } from 'react';

/**
 * Global shutter gain.
 *
 * Two reasons this exists rather than editing forty call sites:
 *
 * 1. THE 60FPS CORRECTION. A frame at 60fps integrates half as much time as a
 *    frame at 30, so the same authored blur length reads as half the smear.
 *    Doubling the render rate without this makes fast motion *crisper* per
 *    frame and, perversely, more strobe-like — the eye gets a clean sharp copy
 *    of an object in a new place every frame, which is exactly the staccato
 *    look we were trying to remove.
 *
 * 2. Taste. Slightly over-blurred fast motion reads as film. Under-blurred
 *    fast motion reads as a slideshow.
 *
 * Amounts at call sites stay authored in 30fps terms; this scales them.
 */
export const BLUR_GAIN = 1.85;

/**
 * Motion blur, three ways.
 *
 * Fast movement without blur is the single most common reason motion graphics
 * look cheap: the eye expects a moving object to smear, and when it doesn't,
 * the brain reads "sprite", not "object travelling through space".
 *
 * Remotion has no temporal accumulation, so we build it:
 *
 *   <MotionTrail>       true sub-frame accumulation. Re-renders content at
 *                       fractional past frames and stacks the samples. The
 *                       expensive, correct option — used on hero elements.
 *   <DirectionalBlur>   a real anisotropic blur (SVG feGaussianBlur with an
 *                       asymmetric stdDeviation, rotated). Cheap, and correct
 *                       for a layer moving in one direction.
 *   <Smear>             offset ghosts. Cheapest. Used on many small objects
 *                       where per-object accuracy doesn't matter.
 */

type TrailProps = {
  /** How many sub-frame samples. 4–8 is the sweet spot. */
  samples?: number;
  /** Shutter angle expressed in frames of lag. 0.5 ≈ 180° shutter. */
  shutter?: number;
  /** Receives a *negative* frame offset — render your content at `frame + off`. */
  render: (frameOffset: number, weight: number, index: number) => React.ReactNode;
  /** 'screen' for emissive content (default), 'normal' for solid objects. */
  blend?: 'screen' | 'normal';
  style?: React.CSSProperties;
};

export const MotionTrail: React.FC<TrailProps> = ({
  samples = 9,
  shutter = 0.5 * BLUR_GAIN,
  render,
  blend = 'screen',
  style,
}) => {
  if (samples <= 1 || shutter <= 0.02) {
    return <div style={style}>{render(0, 1, 0)}</div>;
  }

  // The current frame is drawn at full strength; the past samples are ghosts
  // stacked behind it. Modelling it this way (rather than dividing opacity
  // across all samples) means a *stationary* subject stays fully exposed —
  // the earlier approach dimmed everything to ~70% whenever the trail was on,
  // which is wrong: shutter angle doesn't change exposure of a still object.
  return (
    <div style={{ position: 'relative', ...style }}>
      {Array.from({ length: samples - 1 }, (_, k) => {
        const i = k + 1;
        const off = -(i / (samples - 1)) * shutter;
        const w = (1 - i / samples) * 0.52;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: w,
              mixBlendMode: blend,
              pointerEvents: 'none',
            }}
          >
            {render(off, w, i)}
          </div>
        );
      })}
      <div style={{ position: 'relative' }}>{render(0, 1, 0)}</div>
    </div>
  );
};

/**
 * Anisotropic blur along an arbitrary angle. The trick is to rotate the
 * content into blur-space, apply a stdDeviation that is large on X and ~0 on
 * Y, then rotate back — which is exactly what a real directional blur is.
 */
export const DirectionalBlur: React.FC<{
  /** Blur length in px. 0 disables the filter entirely (free). */
  amount: number;
  /** Direction of travel, degrees. 0 = horizontal. */
  angle?: number;
  /** A little perpendicular blur keeps edges from looking sliced. */
  spread?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ amount: rawAmount, angle = 0, spread = 0.4, children, style }) => {
  const id = useId().replace(/[:]/g, '');
  const amount = rawAmount * BLUR_GAIN;
  if (amount < 0.3) return <div style={style}>{children}</div>;

  // CSS applies `filter` in the element's own coordinate space and `transform`
  // after it. So: blur the inner element on X only, rotate that element by the
  // travel angle (which takes the blur with it), and counter-rotate the wrapper
  // so the content ends up upright with a blur along `angle`.
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id={`dir-${id}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={`${amount} ${amount * spread}`} />
          </filter>
        </defs>
      </svg>
      <div style={{ transform: `rotate(${-angle}deg)`, transformOrigin: 'center' }}>
        <div
          style={{
            filter: `url(#dir-${id})`,
            transform: `rotate(${angle}deg) translateZ(0)`,
            transformOrigin: 'center',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Ghost smear. N offset copies along a vector with falling opacity. Cheap,
 * and surprisingly convincing on small bright objects against darkness.
 */
export const Smear: React.FC<{
  /** Total smear length in px. */
  length: number;
  angle?: number;
  copies?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ length: rawLength, angle = 0, copies = 7, children, style }) => {
  const length = rawLength * BLUR_GAIN;
  if (length < 1) return <div style={style}>{children}</div>;
  const rad = (angle * Math.PI) / 180;

  return (
    <div style={{ position: 'relative', ...style }}>
      {Array.from({ length: copies }, (_, i) => {
        const t = (i + 1) / copies;
        return (
          <div
            key={i}
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${-Math.cos(rad) * length * t}px, ${
                -Math.sin(rad) * length * t
              }px)`,
              opacity: (1 - t) * 0.55,
              filter: `blur(${t * length * 0.09}px)`,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          >
            {children}
          </div>
        );
      })}
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
};
