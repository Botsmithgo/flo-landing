import { useVideoConfig } from 'remotion';

/**
 * Composition-aware layout.
 *
 * The whole point: a scene is authored once and re-frames itself for 16:9,
 * 9:16, 1:1 and 4:5 without a second implementation. Scenes ask questions
 * ("how wide is this format?", "what's my type scale?") instead of hardcoding
 * pixels.
 */

export type Format = 'wide' | 'square' | 'portrait' | 'tall';

export type Layout = {
  width: number;
  height: number;
  aspect: number;
  format: Format;
  /**
   * Universal scale unit. 1.0 on every canonical composition, so `24 * u` is
   * the same optical size in all four formats. Multiply *every* px value by it.
   */
  u: number;
  /** Safe inset from each edge, in px. */
  pad: number;
  /** Centre point. */
  cx: number;
  cy: number;
  /** Pick a value per format, falling back sensibly. */
  by: <T>(opts: { wide: T; square?: T; portrait?: T; tall?: T }) => T;
  /** Shorthand: landscape vs everything taller. */
  isWide: boolean;
  isTall: boolean;
};

const classify = (aspect: number): Format => {
  if (aspect >= 1.5) return 'wide';
  if (aspect >= 0.95) return 'square';
  if (aspect >= 0.7) return 'portrait'; // 4:5
  return 'tall'; // 9:16
};

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  const aspect = width / height;
  const format = classify(aspect);
  // min-dimension based: 1920x1080, 1080x1920, 1080x1080 and 1080x1350 all → 1.
  const u = Math.min(width, height) / 1080;

  const by = <T,>(opts: { wide: T; square?: T; portrait?: T; tall?: T }): T => {
    switch (format) {
      case 'wide':
        return opts.wide;
      case 'square':
        return opts.square ?? opts.wide;
      case 'portrait':
        return opts.portrait ?? opts.square ?? opts.wide;
      case 'tall':
        return opts.tall ?? opts.portrait ?? opts.square ?? opts.wide;
    }
  };

  return {
    width,
    height,
    aspect,
    format,
    u,
    pad: by({ wide: 84, square: 64, portrait: 60, tall: 56 }) * u,
    cx: width / 2,
    cy: height / 2,
    by,
    isWide: format === 'wide',
    isTall: format === 'tall' || format === 'portrait',
  };
};

/**
 * Type scale. Display sizes are expressed as a fraction of the *long* edge in
 * landscape and the *short* edge in portrait, so hero type stays hero type.
 */
export const useType = () => {
  const l = useLayout();
  const hero = l.isWide ? l.width : l.height * 0.62;
  return {
    /** Frame-dominating display type. */
    mega: hero * l.by({ wide: 0.155, square: 0.2, portrait: 0.215, tall: 0.24 }),
    display: hero * l.by({ wide: 0.085, square: 0.11, portrait: 0.12, tall: 0.13 }),
    title: 54 * l.u,
    body: 26 * l.u,
    label: 17 * l.u,
    micro: 12.5 * l.u,
  };
};
