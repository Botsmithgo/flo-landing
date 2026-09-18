import React, { useId } from 'react';
import { CARD } from '../assets';
import { C, FONT, alpha } from '../utils/colors';

/**
 * The card.
 *
 * Drawn entirely in SVG — no photography, no licensed marks, nothing that
 * can't be shipped. The athlete is an abstract silhouette: limbs as stroked
 * paths with round caps, head as a circle, torso as a tapered quad. Silhouettes
 * are forgiving and, against a chromatic burst, read instantly as "sports card"
 * without pretending to be a photograph.
 *
 * The set is called MERIDIAN, so the background carries longitude arcs. Small
 * decisions like that are what stop placeholder art looking like placeholder
 * art.
 */

export const CARD_W = 500;
export const CARD_H = 700;
export const CARD_RATIO = CARD_W / CARD_H;

type Props = {
  /** 0–1 position of the foil sweep across the surface. >1 parks it off-card. */
  sweep?: number;
  /** Master brightness — used to fade the card into and out of darkness. */
  exposure?: number;
  /** Strength of the chromatic burst behind the figure. */
  burst?: number;
  /** Renders as a flat luminance silhouette (used during the detonation). */
  wireframe?: number;
  style?: React.CSSProperties;
};

export const CardFace: React.FC<Props> = ({
  sweep = 0.5,
  exposure = 1,
  burst = 1,
  wireframe = 0,
  style,
}) => {
  const raw = useId().replace(/[:]/g, '');
  const id = (n: string) => `${n}-${raw}`;

  const sweepX = -0.45 + sweep * 1.9; // in fractional card widths

  return (
    <svg
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      width="100%"
      height="100%"
      style={{ display: 'block', overflow: 'visible', ...style }}
    >
      <defs>
        {/* Card stock */}
        <linearGradient id={id('stock')} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#101A2E" />
          <stop offset="45%" stopColor="#0A1120" />
          <stop offset="100%" stopColor="#060A14" />
        </linearGradient>

        {/* Chromatic burst behind the figure */}
        <radialGradient id={id('burst')} cx="0.53" cy="0.42" r="0.62">
          <stop offset="0%" stopColor={alpha(C.cyan, 0.5 * burst)} />
          <stop offset="26%" stopColor={alpha(C.violet, 0.42 * burst)} />
          <stop offset="58%" stopColor={alpha(C.violetDeep, 0.22 * burst)} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Foil frame */}
        <linearGradient id={id('foil')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.ice} />
          <stop offset="22%" stopColor={C.violet} />
          <stop offset="48%" stopColor={C.cyan} />
          <stop offset="70%" stopColor={C.magenta} />
          <stop offset="100%" stopColor={C.ice} />
        </linearGradient>

        {/* Moving holo sweep */}
        <linearGradient
          id={id('sweep')}
          x1={sweepX - 0.35}
          y1={-0.2}
          x2={sweepX + 0.35}
          y2={1.2}
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="34%" stopColor={alpha(C.ice, 0.16)} />
          <stop offset="46%" stopColor={alpha(C.violet, 0.3)} />
          <stop offset="52%" stopColor={alpha(C.ice, 0.4)} />
          <stop offset="58%" stopColor={alpha(C.cyan, 0.3)} />
          <stop offset="70%" stopColor={alpha(C.magenta, 0.14)} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Top-light gloss on the card surface */}
        <linearGradient id={id('gloss')} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={alpha('#FFFFFF', 0.13)} />
          <stop offset="38%" stopColor={alpha('#FFFFFF', 0.02)} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Nameplate */}
        <linearGradient id={id('plate')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={alpha(C.void, 0.92)} />
          <stop offset="62%" stopColor={alpha(C.navy, 0.78)} />
          <stop offset="100%" stopColor={alpha(C.void, 0.3)} />
        </linearGradient>

        {/* Rim light on the figure */}
        <linearGradient id={id('rim')} x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={C.ice} />
          <stop offset="40%" stopColor={C.cyan} />
          <stop offset="100%" stopColor={C.violet} />
        </linearGradient>

        {/* The figure itself — near-black, but with enough of a gradient that
            it has a lit side and a shadow side. */}
        <linearGradient id={id('figure')} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#0A1424" />
          <stop offset="45%" stopColor="#05080F" />
          <stop offset="100%" stopColor="#020407" />
        </linearGradient>

        <clipPath id={id('clip')}>
          <rect x="0" y="0" width={CARD_W} height={CARD_H} rx="20" ry="20" />
        </clipPath>

        {/* Meridian arcs pattern mask so they fade toward the edges */}
        <radialGradient id={id('meridianFade')} cx="0.5" cy="0.42" r="0.55">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#FFF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
        </radialGradient>
        <mask id={id('meridianMask')}>
          <rect width={CARD_W} height={CARD_H} fill={`url(#${id('meridianFade')})`} />
        </mask>
      </defs>

      <g clipPath={`url(#${id('clip')})`} opacity={exposure}>
        {/* ── Stock ────────────────────────────────────────────────────── */}
        <rect width={CARD_W} height={CARD_H} fill={`url(#${id('stock')})`} />

        {/* ── Burst ────────────────────────────────────────────────────── */}
        <rect width={CARD_W} height={CARD_H} fill={`url(#${id('burst')})`} />

        {/* ── MERIDIAN longitude arcs ──────────────────────────────────── */}
        <g mask={`url(#${id('meridianMask')})`} opacity={0.5}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const t = (i - 3) / 3; // -1 .. 1
            const rx = Math.abs(t) * 168 + 4;
            return (
              <ellipse
                key={i}
                cx={258}
                cy={300}
                rx={rx}
                ry={252}
                fill="none"
                stroke={alpha(i % 2 === 0 ? C.cyan : C.violet, 0.3)}
                strokeWidth={1.1}
              />
            );
          })}
          <ellipse
            cx={258}
            cy={300}
            rx={178}
            ry={252}
            fill="none"
            stroke={alpha(C.ice, 0.22)}
            strokeWidth={1.6}
          />
          {/* Latitudes */}
          {[-1, -0.5, 0, 0.5, 1].map((t, i) => (
            <ellipse
              key={i}
              cx={258}
              cy={300 + t * 180}
              rx={178 * Math.sqrt(Math.max(0.04, 1 - t * t * 0.86))}
              ry={13}
              fill="none"
              stroke={alpha(C.cyan, 0.16)}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* ── Light shafts from upper right ────────────────────────────── */}
        <g opacity={0.5 * burst}>
          {[0, 1, 2].map((i) => (
            <polygon
              key={i}
              points={`${520 - i * 26},-40 ${560 - i * 26},-40 ${
                240 - i * 78
              },760 ${186 - i * 78},760`}
              fill={alpha(i === 1 ? C.ice : C.cyan, 0.05)}
            />
          ))}
        </g>

        {/* ── Athlete ──────────────────────────────────────────────────── */}
        <Athlete idFn={id} wireframe={wireframe} />

        {/* ── Foil sweep across the surface ────────────────────────────── */}
        <rect
          width={CARD_W}
          height={CARD_H}
          fill={`url(#${id('sweep')})`}
          style={{ mixBlendMode: 'screen' }}
        />

        {/* ── Nameplate ────────────────────────────────────────────────── */}
        <g>
          <rect x="0" y="548" width={CARD_W} height="152" fill={`url(#${id('plate')})`} />
          <rect x="34" y="566" width="4" height="52" fill={`url(#${id('foil')})`} />
          <text
            x="52"
            y="600"
            fill={C.bone}
            fontFamily={FONT.display}
            fontSize="42"
            fontWeight={700}
            letterSpacing="-1.4"
          >
            {CARD.player}
          </text>
          <text
            x="53"
            y="626"
            fill={alpha(C.paper, 0.62)}
            fontFamily={FONT.mono}
            fontSize="15"
            letterSpacing="3.4"
          >
            {CARD.position} · {CARD.club}
          </text>
          <text
            x="52"
            y="666"
            fill={alpha(C.muted, 0.85)}
            fontFamily={FONT.mono}
            fontSize="13"
            letterSpacing="2.6"
          >
            {CARD.year} {CARD.set} · {CARD.variant}
          </text>
          <text
            x={CARD_W - 40}
            y="666"
            fill={C.amber}
            fontFamily={FONT.mono}
            fontSize="15"
            letterSpacing="1.6"
            textAnchor="end"
          >
            {CARD.serial}
          </text>
        </g>

        {/* ── Set mark, top-left ───────────────────────────────────────── */}
        <g transform="translate(38, 38)">
          {/* Abstract set mark: a peak over a base. Deliberately not a letter —
              the first version read as a stray "F". */}
          <path
            d="M0 22 L15 0 L30 22 L23 22 L15 11 L7 22 Z M0 28 L30 28 L30 34 L0 34 Z"
            fill={`url(#${id('foil')})`}
            opacity={0.95}
          />
          <text
            x="36"
            y="24"
            fill={alpha(C.paper, 0.72)}
            fontFamily={FONT.mono}
            fontSize="14"
            letterSpacing="4"
          >
            {CARD.set}
          </text>
        </g>

        {/* ── Year, top-right ──────────────────────────────────────────── */}
        <text
          x={CARD_W - 38}
          y="62"
          fill={alpha(C.paper, 0.5)}
          fontFamily={FONT.mono}
          fontSize="20"
          letterSpacing="2"
          textAnchor="end"
        >
          {CARD.year}
        </text>

        {/* ── Surface gloss ────────────────────────────────────────────── */}
        <rect
          width={CARD_W}
          height={CARD_H}
          fill={`url(#${id('gloss')})`}
          style={{ mixBlendMode: 'screen' }}
        />

        {/* ── Inner hairline + foil frame ──────────────────────────────── */}
        <rect
          x="14"
          y="14"
          width={CARD_W - 28}
          height={CARD_H - 28}
          rx="10"
          fill="none"
          stroke={alpha(C.ice, 0.16)}
          strokeWidth="1"
        />
        <rect
          x="4"
          y="4"
          width={CARD_W - 8}
          height={CARD_H - 8}
          rx="17"
          fill="none"
          stroke={`url(#${id('foil')})`}
          strokeWidth="3"
          opacity="0.85"
        />
      </g>
    </svg>
  );
};

/**
 * The figure. One rim-lit copy offset up-left, one solid copy on top — which
 * is how a real key light behind a subject behaves, and costs two draw calls.
 */
const Athlete: React.FC<{ idFn: (n: string) => string; wireframe: number }> = ({
  idFn,
  wireframe,
}) => {
  const limb = (d: string, w: number) => (
    <path d={d} fill="none" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );

  /**
   * Proportions matter more than detail at silhouette scale: ~7.5 heads tall,
   * shoulders 1.5 heads wide, legs longer than the torso. Get those three
   * ratios right and a stick figure becomes an athlete.
   */
  const body = (
    <>
      {/* trailing arm, thrown back for counterbalance */}
      {limb('M220 250 L160 282 L122 238', 23)}
      {/* trailing leg, extended */}
      {limb('M246 336 L232 452 L274 540', 33)}
      {/* torso — filled, tapering to the waist */}
      <path d="M212 236 L288 228 L292 330 L234 340 Z" strokeWidth="2" strokeLinejoin="round" />
      {/* driving leg, tucked up into the leap */}
      {limb('M282 330 L350 364 L336 442', 33)}
      {/* raised arm to the ball */}
      {limb('M274 244 L314 208 L348 166', 26)}
      {/* head */}
      <circle cx="246" cy="200" r="25" />
      {/* feet */}
      <ellipse cx="280" cy="548" rx="27" ry="12" transform="rotate(-10 280 548)" />
      <ellipse cx="342" cy="456" rx="25" ry="12" transform="rotate(26 342 456)" />
    </>
  );

  return (
    <g>
      {/* Motion arc behind the figure — implies the leap without drawing it */}
      <path
        d="M112 486 Q 206 300 392 168"
        fill="none"
        stroke={alpha(C.cyan, 0.28)}
        strokeWidth="2"
        strokeDasharray="1 9"
        strokeLinecap="round"
      />

      {/* Rim light pass — offset toward the key, kept subtle so the figure
          reads as lit from behind rather than outlined in marker pen. */}
      <g
        transform="translate(-4,-5)"
        stroke={`url(#${idFn('rim')})`}
        fill={`url(#${idFn('rim')})`}
        opacity={0.62}
      >
        {body}
      </g>

      {/* Solid pass — not flat black: a slight gradient keeps volume in it */}
      <g
        stroke={wireframe > 0.5 ? C.cyan : `url(#${idFn('figure')})`}
        fill={wireframe > 0.5 ? 'none' : `url(#${idFn('figure')})`}
        opacity={0.98}
      >
        {body}
      </g>

      {/* Ball */}
      <g>
        <circle cx="376" cy="138" r="34" fill="#08101C" stroke={alpha(C.amber, 0.6)} strokeWidth="2" />
        {/* Seams: one equator, one meridian, two curved panel lines. */}
        <g fill="none" stroke={alpha(C.amber, 0.4)} strokeWidth="1.6">
          <line x1="342" y1="138" x2="410" y2="138" />
          <line x1="376" y1="104" x2="376" y2="172" />
          <path d="M352 114 Q376 138 352 162" />
          <path d="M400 114 Q376 138 400 162" />
        </g>
        <circle cx="365" cy="124" r="12" fill={alpha(C.amber, 0.14)} />
      </g>
    </g>
  );
};
