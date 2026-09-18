import React, { useId } from 'react';
import { Img, staticFile } from 'remotion';
import { ASSETS, CARD } from '../assets';
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

/**
 * The object's aspect. A raw card is 2.5:3.5; a PSA slab is taller, and the
 * hero is now a photograph of a slab (380×637), so the whole film's card box
 * follows the slab. Every scene derives its card height from CARD_RATIO, so
 * this is the only place the shape is decided.
 */
export const CARD_W = 500;
export const CARD_H = 838;
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

  /**
   * ── The photograph path ──────────────────────────────────────────────────
   * A real slab, photographed, is the object. Only two things are drawn over
   * it: the moving foil sweep and the static gloss, both screen-blended, so
   * the surface still answers to the film's light as the card turns. Nothing
   * else — no plate, no seal, no chrome — because the thing that makes a
   * photograph read as real is that nobody has drawn on it.
   *
   * During the detonation (`wireframe`) the photo is pushed to a luminance
   * silhouette so it can shatter the same way the drawn card did.
   */
  if (ASSETS.cardFront) {
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: `${(14 / CARD_W) * 100}% / ${(14 / CARD_H) * 100}%`,
          overflow: 'hidden',
          opacity: exposure,
          background: '#0A0A0A',
          ...style,
        }}
      >
        <Img
          src={staticFile(ASSETS.cardFront)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter:
              wireframe > 0.5
                ? `grayscale(1) contrast(1.6) brightness(1.3)`
                : `contrast(1.04) saturate(1.06)`,
          }}
        />
        {/* foil sweep */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent ${(sweepX - 0.22) * 100}%, ${alpha(
              '#FFFFFF',
              0.12,
            )} ${(sweepX - 0.06) * 100}%, ${alpha('#FFF6E2', 0.3)} ${sweepX * 100}%, ${alpha(
              C.goldLift,
              0.16,
            )} ${(sweepX + 0.05) * 100}%, transparent ${(sweepX + 0.2) * 100}%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        {/* gloss */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(160deg, ${alpha('#FFFFFF', 0.11)} 0%, ${alpha(
              '#FFFFFF',
              0.02,
            )} 38%, transparent 100%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
        {wireframe > 0.5 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: alpha(C.gold, 0.22 * wireframe),
              mixBlendMode: 'screen',
            }}
          />
        ) : null}
      </div>
    );
  }

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
          <stop offset="0%" stopColor="#2A0A13" />
          <stop offset="45%" stopColor="#15070B" />
          <stop offset="100%" stopColor="#0C0406" />
        </linearGradient>

        {/* Chromatic burst behind the figure */}
        <radialGradient id={id('burst')} cx="0.53" cy="0.42" r="0.62">
          <stop offset="0%" stopColor={alpha(C.cardRed, 0.42 * burst)} />
          <stop offset="30%" stopColor={alpha(C.cardRedDeep, 0.46 * burst)} />
          <stop offset="62%" stopColor={alpha(C.cardRedDeep, 0.26 * burst)} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Foil frame */}
        <linearGradient id={id('foil')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.goldLift} />
          <stop offset="22%" stopColor={C.cardRed} />
          <stop offset="48%" stopColor={C.gold} />
          <stop offset="70%" stopColor={C.cardRedDeep} />
          <stop offset="100%" stopColor={C.goldLift} />
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
          <stop offset="34%" stopColor={alpha('#FFFFFF', 0.14)} />
          <stop offset="46%" stopColor={alpha(C.brand, 0.3)} />
          <stop offset="52%" stopColor={alpha('#FFF6E2', 0.36)} />
          <stop offset="58%" stopColor={alpha(C.goldLift, 0.26)} />
          <stop offset="70%" stopColor={alpha(C.sage, 0.14)} />
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
          <stop offset="62%" stopColor={alpha(C.panel, 0.78)} />
          <stop offset="100%" stopColor={alpha(C.void, 0.3)} />
        </linearGradient>

        {/* Rim light on the figure */}
        <linearGradient id={id('rim')} x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={C.trustIce} />
          <stop offset="40%" stopColor={C.trust} />
          <stop offset="100%" stopColor={C.brand} />
        </linearGradient>

        {/* The figure itself — near-black, but with enough of a gradient that
            it has a lit side and a shadow side. */}
        <linearGradient id={id('figure')} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#250C13" />
          <stop offset="45%" stopColor="#140709" />
          <stop offset="100%" stopColor="#0A0405" />
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

        {/* ── Court geometry ──────────────────────────────────────────
            The fictional set this card replaced was called MERIDIAN, so it
            carried longitude arcs. This one is a 1990 basketball card, so it
            carries a court: the lane, the free-throw circle, the arc and the
            baseline, drawn from directly overhead and faded by the same mask.

            It is original geometry — a court is a specification, not artwork —
            and it does the job the arcs did, which is to give the background a
            reason to have structure in it. */}
        <g mask={`url(#${id('meridianMask')})`} opacity={0.62}>
          {/* Three-point arc + baseline */}
          <path
            d="M 26 612 L 26 470 A 232 232 0 0 0 474 470 L 474 612"
            fill="none"
            stroke={alpha(C.cardRed, 0.42)}
            strokeWidth={1.6}
          />
          <line x1="26" y1="612" x2="474" y2="612" stroke={alpha(C.cardRed, 0.34)} strokeWidth={1.4} />

          {/* The lane */}
          <rect
            x="164"
            y="404"
            width="172"
            height="208"
            fill="none"
            stroke={alpha(C.paperInk, 0.2)}
            strokeWidth={1.3}
          />
          {/* Free-throw circle — the top half solid, the bottom half dashed,
              exactly as it is painted on a real floor. */}
          <path
            d="M 164 404 A 86 86 0 0 1 336 404"
            fill="none"
            stroke={alpha(C.paperInk, 0.24)}
            strokeWidth={1.3}
          />
          <path
            d="M 336 404 A 86 86 0 0 1 164 404"
            fill="none"
            stroke={alpha(C.paperInk, 0.18)}
            strokeWidth={1.3}
            strokeDasharray="9 11"
          />

          {/* Restricted-area arc and the rim itself */}
          <path
            d="M 218 612 A 40 40 0 0 0 282 612"
            fill="none"
            stroke={alpha(C.trustIce, 0.26)}
            strokeWidth={1.2}
          />
          <circle cx="250" cy="600" r="15" fill="none" stroke={alpha(C.trustIce, 0.3)} strokeWidth={1.5} />

          {/* Lane hash marks */}
          {[440, 476, 512, 548].map((y) => (
            <g key={y}>
              <line x1="152" y1={y} x2="164" y2={y} stroke={alpha(C.paperInk, 0.24)} strokeWidth={1.4} />
              <line x1="336" y1={y} x2="348" y2={y} stroke={alpha(C.paperInk, 0.24)} strokeWidth={1.4} />
            </g>
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
              fill={alpha(i === 1 ? '#FFFFFF' : '#FFE9C4', 0.045)}
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
            fill={alpha(C.paperInk, 0.62)}
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
            {CARD.year} {CARD.set} · {CARD.category}
          </text>
          <text
            x={CARD_W - 40}
            y="666"
            fill={C.goldDeep}
            fontFamily={FONT.mono}
            fontSize="15"
            letterSpacing="1.6"
            textAnchor="end"
          >
            {CARD.number}
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
            fill={alpha(C.paperInk, 0.72)}
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
          fill={alpha(C.paperInk, 0.5)}
          fontFamily={FONT.mono}
          fontSize="20"
          letterSpacing="2"
          textAnchor="end"
        >
          {CARD.year}
        </text>

        {/* ── Grade chip, top-right under the year ─────────────────────── */}
        <g transform={`translate(${CARD_W - 150}, 78)`}>
          <rect x="0" y="0" width="112" height="30" rx="4" fill={alpha(C.trustSoft, 0.9)} />
          <rect
            x="0.6"
            y="0.6"
            width="110.8"
            height="28.8"
            rx="3.6"
            fill="none"
            stroke={alpha(C.trust, 0.5)}
            strokeWidth="1.2"
          />
          <text
            x="56"
            y="20.5"
            fill={C.trust}
            fontFamily={FONT.mono}
            fontSize="14"
            fontWeight={700}
            letterSpacing="2.4"
            textAnchor="middle"
          >
            {CARD.grade}
          </text>
        </g>

        {/* ── The MAZIFIED seal ────────────────────────────────────────────
            The product's own mark for a sale it has verified end to end, in
            gold foil. It is the one piece of MAZI chrome allowed onto the card
            itself, because on a real card page it is the thing a collector is
            looking for. */}
        <g transform="translate(316, 486)" opacity={0.96}>
          <rect x="0" y="0" width="150" height="34" rx="17" fill={alpha('#0A0E0C', 0.72)} />
          <rect
            x="0.8"
            y="0.8"
            width="148.4"
            height="32.4"
            rx="16.2"
            fill="none"
            stroke={`url(#${id('foil')})`}
            strokeWidth="1.6"
          />
          {/* seal glyph — a struck check inside a ring */}
          <circle cx="20" cy="17" r="8.5" fill="none" stroke={C.gold} strokeWidth="1.6" />
          <path
            d="M16 17.2 L19 20.2 L24.5 13.8"
            fill="none"
            stroke={C.goldLift}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="37"
            y="22"
            fill={C.goldLift}
            fontFamily={FONT.mono}
            fontSize="13"
            fontWeight={700}
            letterSpacing="2.8"
          >
            MAZIFIED
          </text>
        </g>

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
          stroke={alpha(C.trustIce, 0.16)}
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
   *
   * What separates this from a stick figure is that nothing is one uniform
   * width. Every limb is drawn as two segments — a thick upper and a thinner
   * lower — so arms and legs taper the way real ones do, and the kit (tank and
   * shorts) is drawn as its own filled shape over the body. At the size this
   * appears on screen you never consciously see either decision; you only see
   * that it reads as a person instead of as a diagram.
   *
   * The figure is MAZI's own drawing. It is not traced from, and does not
   * reproduce, any photograph or any card.
   */
  const body = (
    <>
      {/* trailing arm — upper thick, forearm tapered, thrown back to counter */}
      {limb('M218 252 L168 280', 24)}
      {limb('M168 280 L126 240', 18)}

      {/* trailing leg — thigh, then calf, extended behind the leap */}
      {limb('M248 340 L234 442', 36)}
      {limb('M234 442 L272 536', 26)}

      {/* torso — filled, tapering to the waist, with a neck into the head */}
      <path d="M210 234 L290 226 L294 332 L232 342 Z" strokeWidth="2" strokeLinejoin="round" />
      {limb('M248 222 L250 236', 20)}

      {/* driving leg — thigh up into the tuck, then the shin */}
      {limb('M284 332 L352 366', 36)}
      {limb('M352 366 L338 438', 26)}

      {/* raised arm — upper, then forearm reaching to the ball */}
      {limb('M276 246 L316 210', 27)}
      {limb('M316 210 L350 168', 20)}

      {/* head */}
      <circle cx="246" cy="198" r="25" />

      {/* feet */}
      <ellipse cx="278" cy="544" rx="27" ry="12" transform="rotate(-10 278 544)" />
      <ellipse cx="344" cy="452" rx="25" ry="12" transform="rotate(26 344 452)" />
    </>
  );

  /**
   * The kit, drawn over the body in a slightly lifted tone. A tank with a deep
   * armhole and shorts that break above the knee — the 1990 cut, not the modern
   * one. No number, no team colour, no marks: the card's identity is carried by
   * the data plate, which is factual, rather than by the artwork, which is ours.
   */
  const kit = (
    <>
      {/* tank */}
      <path d="M214 240 L286 232 L290 318 L232 327 Z" />
      {/* armholes bitten out of the shoulders */}
      <path d="M212 236 Q228 258 224 282 L214 284 Z" />
      <path d="M288 230 Q276 254 280 278 L290 276 Z" />
      {/* shorts */}
      <path d="M232 322 L293 314 L299 372 L274 380 L262 348 L248 384 L228 372 Z" />
    </>
  );

  return (
    <g>
      {/* Motion arc behind the figure — implies the leap without drawing it */}
      <path
        d="M112 486 Q 206 300 392 168"
        fill="none"
        stroke={alpha(C.trust, 0.28)}
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
        stroke={wireframe > 0.5 ? C.trust : `url(#${idFn('figure')})`}
        fill={wireframe > 0.5 ? 'none' : `url(#${idFn('figure')})`}
        opacity={0.98}
      >
        {body}
        <g
          strokeWidth={0}
          fill={wireframe > 0.5 ? 'none' : alpha(C.cardRed, 0.88)}
          stroke={wireframe > 0.5 ? C.trust : 'none'}
        >
          {kit}
        </g>

        {/*
          The number.

          One glyph does more identifying work here than any amount of anatomy:
          a red jersey with 23 on it in a 1990 Chicago card is unmistakable, and
          it costs nothing in rights because a squad number is a fact, not
          artwork. Rotated to sit on the chest plane as the body leans back, and
          clipped to the tank so it creases at the armhole rather than floating
          on top of the figure.
        */}
        {wireframe > 0.5 ? null : (
          <g transform="rotate(-7 250 282)" opacity={0.92}>
            <text
              x="250"
              y="296"
              textAnchor="middle"
              fill={alpha('#F6F2F0', 0.93)}
              fontFamily={FONT.display}
              fontSize="62"
              fontWeight={700}
              letterSpacing="-3"
            >
              {CARD.jersey}
            </text>
          </g>
        )}
      </g>

      {/* Ball */}
      <g>
        <circle cx="376" cy="138" r="34" fill="#08101C" stroke={alpha(C.goldDeep, 0.6)} strokeWidth="2" />
        {/* Seams: one equator, one meridian, two curved panel lines. */}
        <g fill="none" stroke={alpha(C.goldDeep, 0.4)} strokeWidth="1.6">
          <line x1="342" y1="138" x2="410" y2="138" />
          <line x1="376" y1="104" x2="376" y2="172" />
          <path d="M352 114 Q376 138 352 162" />
          <path d="M400 114 Q376 138 400 162" />
        </g>
        <circle cx="365" cy="124" r="12" fill={alpha(C.goldDeep, 0.14)} />
      </g>
    </g>
  );
};
