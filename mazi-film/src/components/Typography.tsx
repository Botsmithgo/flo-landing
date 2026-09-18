import React, { useMemo } from 'react';
import { C, FONT, alpha } from '../utils/colors';
import { E, ramp, spr, sprHeavy, stagger } from '../utils/easing';
import { makeRand } from '../utils/random';

/**
 * TYPE.
 *
 * Two voices, never mixed inside one line:
 *   Inter Tight  — the brand speaking. Uppercase, tight tracking, huge.
 *   IBM Plex Mono — the system speaking. Small, wide tracking, always a readout.
 *
 * And one hard rule about motion: type never simply fades. It is revealed by
 * something — a mask edge, a scan line, a light — because in this world type is
 * a physical surface, not an opacity value.
 */

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/#%<>*+=';

/**
 * Character scramble that resolves left-to-right. The unresolved glyphs are
 * re-rolled every frame from a seeded RNG, so it's deterministic across
 * Remotion's parallel renderers but still reads as chaotic.
 */
export const Scramble: React.FC<{
  text: string;
  /** 0–1. At 1, everything is resolved. */
  progress: number;
  frame: number;
  seed?: string;
  /** How many characters are actively scrambling at the leading edge. */
  window?: number;
  style?: React.CSSProperties;
}> = ({ text, progress, frame, seed = 'scramble', window = 4, style }) => {
  const chars = text.split('');
  const head = progress * (chars.length + window);

  return (
    <span style={style}>
      {chars.map((ch, i) => {
        if (ch === ' ') return <span key={i}>&nbsp;</span>;
        if (i < head - window) return <span key={i}>{ch}</span>;
        if (i > head) return <span key={i} style={{ opacity: 0 }}>{ch}</span>;
        const r = makeRand(`${seed}:${i}:${Math.floor(frame / 2)}`);
        return (
          <span key={i} style={{ opacity: 0.55, color: C.cyan }}>
            {GLYPHS[Math.floor(r.next() * GLYPHS.length)]}
          </span>
        );
      })}
    </span>
  );
};

/** The system's voice. Every readout in the film goes through this. */
export const Mono: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  tracking?: number;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 14, color = C.muted, tracking = 3.2, weight = 400, style }) => (
  <span
    style={{
      fontFamily: FONT.mono,
      fontSize: size,
      letterSpacing: tracking,
      color,
      fontWeight: weight,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </span>
);

type KineticProps = {
  children: string;
  frame: number;
  start?: number;
  /** Per-unit stagger in frames. */
  step?: number;
  /** What gets animated independently. */
  by?: 'chars' | 'words';
  size: number;
  color?: string;
  weight?: number;
  tracking?: number;
  /** How the units arrive. */
  mode?: 'mask' | 'perspective' | 'shatter';
  /** Reveal direction for 'mask'. */
  from?: 'bottom' | 'top';
  /** Exit: 0 = no exit. Frames at which the line leaves. */
  exitAt?: number;
  exitMode?: 'up' | 'blur' | 'scale';
  style?: React.CSSProperties;
};

/**
 * Kinetic display type.
 *
 * 'mask'        units slide up from behind a hard edge. Editorial, expensive.
 * 'perspective' units rotate in on X with depth — the type has a physical back.
 * 'shatter'     units arrive from scattered 3D positions with blur. Violent.
 */
export const Kinetic: React.FC<KineticProps> = ({
  children,
  frame,
  start = 0,
  step = 2.2,
  by = 'chars',
  size,
  color = C.bone,
  weight = 800,
  tracking = -0.045,
  mode = 'mask',
  from = 'bottom',
  exitAt,
  exitMode = 'up',
  style,
}) => {
  const units = useMemo(
    () => (by === 'chars' ? children.split('') : children.split(' ')),
    [children, by],
  );

  const t = frame - start;
  const exitT = exitAt === undefined ? 0 : ramp(frame, exitAt, 14, E.expoIn);
  const exitStyle: React.CSSProperties =
    exitAt === undefined
      ? {}
      : exitMode === 'up'
        ? { transform: `translateY(${-exitT * size * 1.3}px)`, opacity: 1 - exitT }
        : exitMode === 'scale'
          ? { transform: `scale(${1 + exitT * 0.35})`, opacity: 1 - exitT }
          : { filter: `blur(${exitT * 22}px)`, opacity: 1 - exitT };

  return (
    <span
      style={{
        display: 'inline-flex',
        flexWrap: 'nowrap',
        fontFamily: FONT.display,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        color,
        lineHeight: 0.92,
        textTransform: 'uppercase',
        perspective: size * 8,
        ...exitStyle,
        ...style,
      }}
    >
      {units.map((unit, i) => {
        const delay = stagger(i, step, 0.92);
        const p = sprHeavy(t, delay);

        if (unit === ' ') {
          return (
            <span key={i} style={{ width: size * 0.3, display: 'inline-block' }}>
              &nbsp;
            </span>
          );
        }

        let inner: React.CSSProperties = {};
        let wrapper: React.CSSProperties = {};

        if (mode === 'mask') {
          wrapper = { overflow: 'hidden', display: 'inline-block', paddingBottom: size * 0.06 };
          inner = {
            display: 'inline-block',
            transform: `translateY(${(1 - p) * size * 1.05 * (from === 'bottom' ? 1 : -1)}px)`,
          };
        } else if (mode === 'perspective') {
          wrapper = { display: 'inline-block', transformStyle: 'preserve-3d' };
          inner = {
            display: 'inline-block',
            transform: `rotateX(${(1 - p) * -78}deg) translateZ(${(1 - p) * -size * 0.5}px)`,
            opacity: Math.min(1, p * 1.6),
            transformOrigin: 'center bottom',
          };
        } else {
          const r = makeRand(`shatter:${children}:${i}`);
          const dx = r.between(-1, 1) * size * 1.6;
          const dy = r.between(-1, 1) * size * 0.9;
          const dz = r.between(0.4, 1.6) * size * 4;
          wrapper = { display: 'inline-block', transformStyle: 'preserve-3d' };
          inner = {
            display: 'inline-block',
            transform: `translate3d(${(1 - p) * dx}px, ${(1 - p) * dy}px, ${(1 - p) * -dz}px) rotate(${
              (1 - p) * r.between(-14, 14)
            }deg)`,
            opacity: Math.min(1, p * 2),
            filter: p < 0.96 ? `blur(${(1 - p) * 9}px)` : undefined,
          };
        }

        return (
          <span key={i} style={wrapper}>
            <span style={inner}>{unit}</span>
            {by === 'words' && i < units.length - 1 ? ' ' : null}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Odometer. Digits roll on a vertical strip, staggered right-to-left so the
 * value *settles* the way a real counter does rather than snapping.
 */
export const Odometer: React.FC<{
  value: number;
  frame: number;
  start?: number;
  size: number;
  color?: string;
  prefix?: string;
  /** Pad to N digits with leading blanks. */
  minDigits?: number;
  weight?: number;
  mono?: boolean;
  style?: React.CSSProperties;
}> = ({
  value,
  frame,
  start = 0,
  size,
  color = C.bone,
  prefix,
  minDigits = 0,
  weight = 700,
  mono = false,
  style,
}) => {
  const str = Math.round(value).toLocaleString('en-US');
  const padded = str.padStart(Math.max(minDigits, str.length), ' ');
  const cells = padded.split('');
  const digitH = size * 1.06;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        fontFamily: mono ? FONT.mono : FONT.display,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: mono ? '0.02em' : '-0.04em',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {prefix ? <span style={{ opacity: 0.72, marginRight: size * 0.06 }}>{prefix}</span> : null}
      {cells.map((ch, i) => {
        if (!/[0-9]/.test(ch)) {
          // Separators get the same box as a digit cell so they sit on the
          // same baseline as the rolling columns rather than floating.
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                height: digitH,
                lineHeight: `${digitH}px`,
                opacity: ch === ' ' ? 0 : 0.55,
              }}
            >
              {ch === ' ' ? '0' : ch}
            </span>
          );
        }
        const target = Number(ch);
        // Left-to-right settle: money reads left-to-right, so the most
        // significant digit should be the first thing that stops moving.
        const delay = i * 1.1;
        const p = spr(frame - start, { delay, damping: 23, mass: 0.7, stiffness: 210 });
        // A little over one revolution. Two revolutions looked like a slot
        // machine and left the number illegible for half a second.
        const pos = target + (1 - p) * 13;
        // Roll velocity → vertical smear, so mid-roll reads as speed rather
        // than as two digits stuck in the same box.
        const blur = Math.max(0, (1 - p) * 9 - 0.6);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              height: digitH,
              overflow: 'hidden',
              width: size * (mono ? 0.6 : 0.58),
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(${-(((pos % 10) + 10) % 10) * digitH}px)`,
                filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => (
                <span key={k} style={{ height: digitH, lineHeight: `${digitH}px` }}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
};

/** A hairline rule that draws itself from a point. Used under the endline. */
export const Rule: React.FC<{
  progress: number;
  width: number;
  color?: string;
  thickness?: number;
  origin?: 'center' | 'left';
  style?: React.CSSProperties;
}> = ({ progress, width, color = C.smoke, thickness = 1, origin = 'center', style }) => (
  <div
    style={{
      width: width * progress,
      height: thickness,
      background: `linear-gradient(90deg, ${alpha(color, origin === 'center' ? 0 : 0.9)} 0%, ${alpha(
        color,
        0.9,
      )} 50%, ${alpha(color, 0)} 100%)`,
      marginLeft: origin === 'center' ? (width * (1 - progress)) / 2 : 0,
      ...style,
    }}
  />
);
