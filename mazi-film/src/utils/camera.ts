import { drift, strike } from './easing';
import { makeRand } from './random';

/**
 * The virtual camera.
 *
 * Scenes describe camera state as plain numbers; <CameraRig> turns them into a
 * transform. Keeping the maths here (rather than inline in scenes) means the
 * *language* of the film's camera is consistent — a push is always a push.
 */

export type Cam = {
  /** Horizontal truck, px at the subject plane. */
  x: number;
  /** Vertical pedestal, px. */
  y: number;
  /** Dolly. 1 = neutral, >1 = pushed in. */
  zoom: number;
  /** Dutch, degrees. Use sparingly — more than 2° reads as a mistake. */
  roll: number;
  /** Simulated lens blur applied to the whole frame, px. */
  blur: number;
};

export const NEUTRAL: Cam = { x: 0, y: 0, zoom: 1, roll: 0, blur: 0 };

export const cam = (partial: Partial<Cam>): Cam => ({ ...NEUTRAL, ...partial });

/**
 * Handheld: an almost-imperceptible float so no frame is ever mechanically
 * still. This is the difference between "rendered in a browser" and "shot".
 */
export const handheld = (frame: number, amount = 1, seedPhase = 0) => ({
  x: drift(frame, 0.021, 7 * amount, seedPhase),
  y: drift(frame, 0.017, 5 * amount, seedPhase + 2.1),
  roll: drift(frame, 0.013, 0.16 * amount, seedPhase + 4.3),
});

/**
 * Impact shake. Decays fast, is deterministic, and — importantly — is
 * *directional* per impact rather than random jitter in every axis, so it
 * reads as a physical hit instead of a vibrating phone.
 */
export const impactShake = (
  frame: number,
  impacts: readonly { at: number; power: number; decay?: number }[],
): { x: number; y: number; roll: number } => {
  let x = 0;
  let y = 0;
  let roll = 0;
  for (const im of impacts) {
    const e = strike(frame, im.at, im.decay ?? 9, 1);
    if (e <= 0.001) continue;
    const r = makeRand(`impact:${im.at}`);
    const dir = r.between(0, Math.PI * 2);
    // High-frequency oscillation inside a fast-decaying envelope.
    const osc = Math.sin((frame - im.at) * 1.35);
    x += Math.cos(dir) * osc * e * im.power;
    y += Math.sin(dir) * osc * e * im.power * 0.7;
    roll += osc * e * im.power * 0.035;
  }
  return { x, y, roll };
};

/** Compose any number of partial camera contributions into one Cam. */
export const composeCam = (...parts: Partial<Cam>[]): Cam =>
  parts.reduce<Cam>(
    (acc, p) => ({
      x: acc.x + (p.x ?? 0),
      y: acc.y + (p.y ?? 0),
      zoom: acc.zoom * (p.zoom ?? 1),
      roll: acc.roll + (p.roll ?? 0),
      blur: acc.blur + (p.blur ?? 0),
    }),
    { ...NEUTRAL },
  );

export const camStyle = (c: Cam): React.CSSProperties => ({
  transform: `translate3d(${c.x.toFixed(3)}px, ${c.y.toFixed(3)}px, 0) scale(${c.zoom.toFixed(
    4,
  )}) rotate(${c.roll.toFixed(3)}deg)`,
  filter: c.blur > 0.2 ? `blur(${c.blur.toFixed(2)}px)` : undefined,
  transformOrigin: 'center center',
  willChange: 'transform, filter',
});
