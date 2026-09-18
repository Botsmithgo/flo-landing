/**
 * Deterministic randomness.
 *
 * Nothing in this film may use Math.random(). Remotion renders frames in
 * parallel across processes — a non-deterministic value means particles
 * teleport between frames. Every "random" value is a pure function of a seed.
 */

/** mulberry32 — small, fast, good enough distribution for visuals. */
export const rng = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** String → 32-bit seed, so components can seed from a stable name. */
export const seedFrom = (str: string): number => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

export type Rand = {
  next: () => number;
  /** Uniform in [min, max). */
  between: (min: number, max: number) => number;
  /** Integer in [min, max]. */
  int: (min: number, max: number) => number;
  /** Pick one. */
  pick: <T>(arr: readonly T[]) => T;
  /** Roughly gaussian via three-sample average — clusters toward the middle. */
  bell: (min: number, max: number) => number;
  /** True with probability p. */
  chance: (p: number) => boolean;
};

export const makeRand = (seed: number | string): Rand => {
  const next = rng(typeof seed === 'string' ? seedFrom(seed) : seed);
  const between = (min: number, max: number) => min + next() * (max - min);
  return {
    next,
    between,
    int: (min, max) => Math.floor(between(min, max + 1)),
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(next() * arr.length) % arr.length],
    bell: (min, max) => {
      const t = (next() + next() + next()) / 3;
      return min + t * (max - min);
    },
    chance: (p) => next() < p,
  };
};

/**
 * Build a stable array of N items once, from a seed. Call inside useMemo.
 * The factory receives a per-item Rand so items never share stream position
 * in a way that couples them — reordering one doesn't reshuffle the rest.
 */
export const field = <T,>(count: number, seed: string, factory: (r: Rand, i: number) => T): T[] =>
  Array.from({ length: count }, (_, i) => factory(makeRand(`${seed}:${i}`), i));
