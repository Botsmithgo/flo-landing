import React, { useMemo } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ASSETS, LATTICE_CARDS, LatticeCard } from '../assets';
import { C, FONT, alpha } from '../utils/colors';
import { FOCAL } from '../utils/depth';
import { useLayout } from '../utils/layout';
import { field } from '../utils/random';
import { CARD_RATIO } from './CardFace';

/**
 * THE INTELLIGENCE FIELD.
 *
 * The database, rendered as a volume you fly through. Records are arranged in
 * a loose cylindrical cloud around the camera axis — dense enough to feel like
 * scale, open enough down the centre that the eye always has somewhere to go.
 *
 * Perspective is real: each record is projected with the same pinhole model as
 * everything else in the film (utils/depth.ts), so a record's size, blur,
 * opacity, parallax and motion smear all derive from one z. Records that pass
 * close to camera smear vertically, because at that apparent velocity they
 * would.
 *
 * Records recycle by modulo rather than being destroyed, so the flight can run
 * for any length at any speed and never runs out of database.
 */

const DEPTH_RANGE = 9000;
const NEAR = 220;

type Props = {
  /** Camera position along the flight axis. Increase to fly forward. */
  camZ: number;
  /** How many records to draw. 130–180 reads as "thousands". */
  count?: number;
  /** Cloud radius multiplier. */
  spread?: number;
  /** 0–1 — how many records are flagged as candidates (cyan frames + names). */
  candidateRate?: number;
  /** Fades the whole field. */
  opacity?: number;
  /** Squeezes the cloud toward the axis — used as the search narrows. */
  converge?: number;
  seed?: string;
};

export const CardLattice: React.FC<Props> = ({
  camZ,
  count = 150,
  spread = 1,
  candidateRate = 0.12,
  opacity = 1,
  converge = 0,
  seed = 'lattice',
}) => {
  const { width, height, u } = useLayout();

  const records = useMemo(
    () =>
      field(count, seed, (r, i) => ({
        angle: r.between(0, Math.PI * 2),
        // Bias radius outward so the centre of frame stays readable.
        radius: Math.sqrt(r.between(0.06, 1)) * 1.0,
        z0: (i / count) * DEPTH_RANGE + r.between(-40, 40),
        rot: r.between(-16, 16),
        tilt: r.between(-22, 22),
        size: r.between(0.82, 1.3),
        tint: r.pick([C.brand, C.trust, C.slate, C.slate, C.brandDeep] as const),
        candidate: r.next() < candidateRate,
        /** A real row from the MAZI catalog — name, set, grade and last price. */
        card: r.pick(LATTICE_CARDS as readonly LatticeCard[]),
        /**
         * Roughly one record in five is a photograph rather than a drawn
         * abstraction. Four real cards, all public domain, cycled through the
         * cloud — enough that the field stops reading as generated wallpaper
         * and starts reading as an archive with actual things in it.
         */
        photo: r.next() < 0.2 ? r.pick(ASSETS.vintage as readonly string[]) : null,
        bright: r.between(0.45, 1),
      })),
    [count, seed, candidateRate],
  );

  const baseR = Math.min(width, height) * 0.82 * spread;
  const cardW = 150 * u;

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none' }}>
      {records.map((rec, i) => {
        // Recycle through the corridor.
        const z = ((rec.z0 - camZ) % DEPTH_RANGE + DEPTH_RANGE) % DEPTH_RANGE + NEAR;
        const persp = FOCAL / z;
        const r = baseR * rec.radius * (1 - converge * 0.88);
        const x = width / 2 + Math.cos(rec.angle) * r * persp;
        const y = height / 2 + Math.sin(rec.angle) * r * persp * 0.9;

        const scale = persp * rec.size;
        const w = cardW * scale;
        const h = w / CARD_RATIO;
        // Cull records before they fill the frame: at that size the abstraction
        // stops reading as "a card" and starts reading as a grey rectangle.
        if (w < 1.2 || w > width * 0.52) return null;

        // Atmospheric falloff + near-plane fade so nothing pops in at the lens.
        const fog = Math.max(0, Math.min(1, 1 - (z - 900) / (DEPTH_RANGE * 0.72)));
        const nearFade = Math.min(1, (z - NEAR) / 900);
        const o = fog * nearFade * rec.bright;
        if (o < 0.015) return null;

        // Apparent velocity → vertical smear. Closer records move faster.
        const smear = Math.min(46, (persp * persp) * 900);
        const blur = z > 5200 ? Math.min(9, (z - 5200) / 420) : 0;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              marginLeft: -w / 2,
              marginTop: -h / 2,
              transform: `rotate(${rec.rot}deg) perspective(${900 * u}px) rotateY(${
                rec.tilt
              }deg) scaleY(${1 + smear / 52})`,
              opacity: o,
              filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined,
              // Composite as a texture; re-rasterising hairlines per frame is
              // both slower and the thing that makes them crawl.
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            <MiniCard
              w={w}
              h={h}
              tint={rec.tint}
              candidate={rec.candidate}
              card={rec.card}
              photo={rec.photo}
              name={rec.candidate && w > 46 ? rec.card.name : undefined}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * A record at a distance. Deliberately abstracted: a frame, a bright block
 * where the figure would be, and a nameplate bar. At the sizes these are drawn,
 * that is exactly as much information as the eye can take — anything more is
 * detail nobody sees and the renderer pays for.
 */
export const MiniCard: React.FC<{
  w: number;
  h: number;
  tint: string;
  candidate?: boolean;
  name?: string;
  card?: LatticeCard;
  photo?: string | null;
}> = ({ w, h, tint, candidate, name, card, photo }) => {
  const r = Math.max(1, w * 0.045);
  /**
   * Three levels of detail, chosen by how many pixels the record actually
   * occupies. Distant records get a frame and a bright block, because that is
   * all the eye can resolve; only records past ~64px wide pay for type. The
   * flight draws ~150 records a frame, so this is the difference between a
   * scene that renders and one that doesn't.
   */
  const readable = w > 64;

  /**
   * Sub-pixel guard for the fast small records.
   *
   * A 0.5px border on a card that is 18px wide and crossing the frame in a few
   * frames cannot land on a pixel boundary, so it flickers on and off as it
   * moves — which is most of what reads as "sparkly" or "glitchy" in a fast
   * flight. Below ~34px the border fades out and the drop shadow is dropped
   * entirely: at that size neither is carrying information, and both are
   * carrying aliasing. The card keeps its fill, which is what the eye is
   * actually using to read the field.
   */
  const edge = Math.min(1, Math.max(0, (w - 14) / 20));

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: r,
        background: `linear-gradient(155deg, ${alpha(tint, 0.34)} 0%, ${alpha(
          C.void,
          0.94,
        )} 46%, ${alpha(C.graphite, 0.96)} 100%)`,
        border: `${Math.max(0.6, w * 0.008)}px solid ${alpha(
          candidate ? C.trust : tint,
          (candidate ? 0.95 : 0.34) * edge,
        )}`,
        boxShadow: candidate
          ? `0 0 ${w * 0.32}px ${alpha(C.trust, 0.45 * edge)}, inset 0 0 ${w * 0.16}px ${alpha(
              C.trust,
              0.2 * edge,
            )}`
          : edge > 0.35
            ? `0 ${h * 0.04}px ${h * 0.1}px ${alpha('#000', 0.5)}`
            : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {photo ? (
        <>
          {/*
            A real card, in the archive, going past.

            It is graded down hard rather than dropped in clean: desaturated,
            darkened, and sitting under a wash of the record's own tint. A
            full-colour photograph at full strength would punch a hole in a
            frame built out of one dark palette — the point is that the field is
            made of real things, not that any one of them is legible.
          */}
          <Img
            src={staticFile(photo)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(0.55) contrast(1.05) brightness(0.62)',
              opacity: 0.9,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(160deg, ${alpha(tint, 0.3)} 0%, ${alpha(
                C.void,
                0.55,
              )} 70%, ${alpha(C.void, 0.85)} 100%)`,
              mixBlendMode: 'multiply',
            }}
          />
        </>
      ) : (
        <>
          {/* figure block */}
          <div
            style={{
              position: 'absolute',
              left: '22%',
              top: '14%',
              width: '56%',
              height: '48%',
              background: `radial-gradient(ellipse at 50% 40%, ${alpha(
                tint,
                0.55,
              )} 0%, transparent 70%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '38%',
              top: '22%',
              width: '24%',
              height: '40%',
              background: alpha(C.void, 0.85),
              borderRadius: w * 0.04,
            }}
          />
        </>
      )}

      {/* Nameplate. Real type once the record is big enough to resolve it,
          abstract bars when it isn't. */}
      {readable && card ? (
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            bottom: '7%',
            display: 'flex',
            flexDirection: 'column',
            gap: h * 0.012,
          }}
        >
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: w * 0.125,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: w * 0.002,
              color: alpha(C.bone, 0.92),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {card.name}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: FONT.mono,
              fontSize: w * 0.062,
              letterSpacing: w * 0.004,
              color: alpha(C.muted, 0.8),
              whiteSpace: 'nowrap',
            }}
          >
            <span>{card.grade}</span>
            <span style={{ color: alpha(C.gold, 0.85) }}>
              ${card.price.toLocaleString('en-US')}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              bottom: '14%',
              height: Math.max(1, h * 0.045),
              background: alpha(C.paperInk, 0.35),
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '10%',
              width: '34%',
              bottom: '8%',
              height: Math.max(1, h * 0.028),
              background: alpha(C.paperInk, 0.18),
            }}
          />
        </>
      )}

      {name ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -h * 0.16,
            textAlign: 'center',
            fontFamily: FONT.mono,
            fontSize: Math.max(5, w * 0.11),
            letterSpacing: w * 0.012,
            color: alpha(C.trust, 0.9),
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
      ) : null}
    </div>
  );
};
