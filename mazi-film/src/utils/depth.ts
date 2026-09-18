/**
 * A tiny pinhole-camera model for 2D layers.
 *
 * Everything in this film has a conceptual Z. Z drives four things at once —
 * scale, blur, atmospheric opacity and parallax rate — and it is driving all
 * four *from the same number* that makes flat divs read as space.
 *
 * Convention: z = 0 is the lens. Larger z = further away. Nothing may sit at
 * exactly 0 (that's a divide-by-zero and, cinematically, a smear).
 */

export const FOCAL = 900;

export type DepthOpts = {
  /** Distance from lens. */
  z: number;
  /** Plane that is perfectly sharp. Defaults to the subject plane. */
  focus?: number;
  /** Lens aperture — higher = shallower depth of field. */
  aperture?: number;
  /** Atmospheric density. Higher = things vanish into haze sooner. */
  fog?: number;
  /** Max blur in px, so a far layer never becomes an expensive mush. */
  maxBlur?: number;
};

export type DepthValues = {
  scale: number;
  blur: number;
  opacity: number;
  /** How strongly this layer responds to camera translation. */
  parallax: number;
};

export const depth = ({
  z,
  focus = 900,
  aperture = 0.9,
  fog = 0.00042,
  maxBlur = 22,
}: DepthOpts): DepthValues => {
  const safeZ = Math.max(1, z);
  const scale = FOCAL / (FOCAL + safeZ);
  const circleOfConfusion = (Math.abs(safeZ - focus) / FOCAL) * aperture * 10;
  const blur = Math.min(maxBlur, circleOfConfusion);
  // Beer–Lambert-ish falloff. Far layers sit in haze rather than being hidden.
  const opacity = Math.max(0, Math.exp(-Math.max(0, safeZ - 200) * fog));
  return { scale, blur, opacity, parallax: scale };
};

/** Ready-to-spread CSS for a depth layer. */
export const depthStyle = (opts: DepthOpts, cam?: { x?: number; y?: number }): React.CSSProperties => {
  const d = depth(opts);
  const x = (cam?.x ?? 0) * d.parallax;
  const y = (cam?.y ?? 0) * d.parallax;
  return {
    transform: `translate3d(${-x}px, ${-y}px, 0) scale(${d.scale})`,
    filter: d.blur > 0.35 ? `blur(${d.blur.toFixed(2)}px)` : undefined,
    opacity: d.opacity,
    willChange: 'transform, filter, opacity',
  };
};

/** Named planes. Keeps scenes from inventing arbitrary z values. */
export const PLANE = {
  /** Dust and lens dirt, right on the glass. Always blurred, always drifting. */
  lens: 120,
  foreground: 380,
  /** Where the hero card lives. Sharp. */
  subject: 900,
  midground: 1500,
  background: 2600,
  /** The far field — card lattice, haze, the sense of a very large room. */
  deep: 4800,
} as const;
