import { Easing, interpolate, spring } from 'remotion';
import { FPS, RATE } from './timing';

/**
 * A curve library, because "everything eases the same way" is the single
 * fastest way to make motion look cheap. Each curve here has a job.
 */
export const E = {
  /** Default for anything arriving. Fast out of the gate, long settle. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Violent. Use for camera launches and detonations. */
  expoOut: Easing.bezier(0.05, 0.9, 0.1, 1),
  /** Anticipation — things that gather before they move. */
  expoIn: Easing.bezier(0.85, 0, 0.99, 0.35),
  /** Mechanical. UI that snaps because a machine decided something. */
  snap: Easing.bezier(0.6, 0, 0.1, 1),
  /** Smooth both ends — camera drifts, slow pushes. */
  glide: Easing.bezier(0.45, 0, 0.15, 1),
  /** Slight overshoot without a bounce. Used on type. */
  over: Easing.bezier(0.2, 1.3, 0.35, 1),
  /** Cinematic ease for the manifesto beat — barely accelerates at all. */
  breath: Easing.bezier(0.33, 0.02, 0.2, 1),
  linear: Easing.linear,
} as const;

type RangeOpts = {
  easing?: (t: number) => number;
  clamp?: boolean;
};

/**
 * interpolate() with clamping on by default, because 99% of the time an
 * un-clamped extrapolation is a bug you find three scenes later.
 */
export const range = (
  frame: number,
  [inStart, inEnd]: [number, number],
  [outStart, outEnd]: [number, number],
  opts: RangeOpts = {},
): number =>
  interpolate(frame, [inStart, inEnd], [outStart, outEnd], {
    easing: opts.easing ?? E.out,
    extrapolateLeft: opts.clamp === false ? 'extend' : 'clamp',
    extrapolateRight: opts.clamp === false ? 'extend' : 'clamp',
  });

/** 0→1 over [start, start+len]. The workhorse. */
export const ramp = (
  frame: number,
  start: number,
  len: number,
  easing: (t: number) => number = E.out,
): number => range(frame, [start, start + len], [0, 1], { easing });

/** 1→0 over [start, start+len]. */
export const fall = (
  frame: number,
  start: number,
  len: number,
  easing: (t: number) => number = E.out,
): number => range(frame, [start, start + len], [1, 0], { easing });

/** Sharp attack, exponential decay — impacts, flashes, shockwaves. */
export const strike = (frame: number, at: number, decay: number, attack = 2): number => {
  if (frame < at - attack) return 0;
  if (frame < at) return range(frame, [at - attack, at], [0, 1], { easing: E.linear });
  return Math.max(0, Math.exp(-(frame - at) / (decay / 3)));
};

type SpringOpts = {
  damping?: number;
  mass?: number;
  stiffness?: number;
  delay?: number;
};

/**
 * spring() with the boilerplate removed and physics presets that feel right.
 *
 * Takes a STORY frame (see utils/timing.ts) like every other helper here, and
 * converts to real frames internally. Springs are the one curve family that is
 * defined against wall-clock time rather than against a normalised range, so
 * they must see the real fps or a 60fps render would play them at half speed.
 */
export const spr = (storyFrame: number, opts: SpringOpts = {}): number =>
  spring({
    frame: (storyFrame - (opts.delay ?? 0)) * RATE,
    fps: FPS,
    config: {
      damping: opts.damping ?? 16,
      mass: opts.mass ?? 0.7,
      stiffness: opts.stiffness ?? 130,
    },
  });

/** Heavy, authoritative arrival — logo, hero type. */
export const sprHeavy = (frame: number, delay = 0): number =>
  spr(frame, { delay, damping: 20, mass: 1.4, stiffness: 110 });

/** Mechanical click — UI brackets, markers. Tiny overshoot, instant settle. */
export const sprSnap = (frame: number, delay = 0): number =>
  spr(frame, { delay, damping: 13, mass: 0.35, stiffness: 320 });

/** Stagger helper: index → delay in frames, with optional non-linear spacing. */
export const stagger = (index: number, step: number, falloff = 1): number =>
  step * (falloff === 1 ? index : (Math.pow(index + 1, falloff) - 1) / falloff);

/** Deterministic, seamless drift. Sum of two primes-ish sines = no visible loop. */
export const drift = (frame: number, speed: number, amplitude: number, phase = 0): number =>
  (Math.sin(frame * speed + phase) * 0.62 + Math.sin(frame * speed * 0.37 + phase * 1.7) * 0.38) *
  amplitude;
