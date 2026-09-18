import React from 'react';
import { CARD } from '../assets';
import { C, FONT, alpha } from '../utils/colors';
import { CARD_H, CARD_W, CardFace } from './CardFace';

/**
 * A physical card in space.
 *
 * Real CSS 3D — perspective, preserve-3d, backface-visibility — because the
 * card is the one object in this film the viewer must believe in. Three things
 * sell it beyond the rotation:
 *
 *   1. THICKNESS. Stacked translateZ slices so the edge exists. A zero-depth
 *      plane always reads as a picture of a card, never a card.
 *   2. VIEW-DEPENDENT SPECULAR. The gloss sweep is a function of rotY, so the
 *      surface responds to being turned. This is the single highest-value
 *      detail in the whole component.
 *   3. A BACK. It's barely seen, but the two frames where it is, sell everything.
 */

type Props = {
  /** Degrees. */
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  /** On-screen card width in px; height follows the 2.5:3.5 ratio. */
  width: number;
  /** Card stock thickness in px at 1:1 scale. */
  thickness?: number;
  /** Passed through to the face. */
  sweep?: number;
  exposure?: number;
  burst?: number;
  /** Mirrored copy below the card. Only makes sense over the reflective floor. */
  reflection?: number;
  /** Extra emissive halo around the card silhouette. */
  halo?: number;
  style?: React.CSSProperties;
  /** Overlays rendered in card space (scanner graphics ride the card in 3D). */
  children?: React.ReactNode;
};

export const Card3D: React.FC<Props> = ({
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  width,
  thickness = 5,
  sweep = 0.5,
  exposure = 1,
  burst = 1,
  reflection = 0,
  halo = 0,
  style,
  children,
}) => {
  const height = (width / CARD_W) * CARD_H;
  const slices = 6;

  // Specular response: brightest when the surface is angled toward the key
  // light, which sits up and to the right of camera.
  const facing = Math.cos((rotY * Math.PI) / 180) * Math.cos((rotX * Math.PI) / 180);
  const spec = Math.max(0, Math.sin(((rotY + 34) * Math.PI) / 180));

  const card = (
    <div
      style={{
        position: 'relative',
        width,
        height,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
      }}
    >
      {/* Edge — stacked slices behind the face give the stock real depth */}
      {Array.from({ length: slices }, (_, i) => {
        const z = -((i + 1) / slices) * thickness;
        const shade = 1 - (i / slices) * 0.8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: width * 0.04,
              background: `linear-gradient(${105 + rotY * 0.6}deg, ${alpha(
                '#2A3646',
                0.95 * shade,
              )} 0%, ${alpha('#0C1220', 0.95)} 55%, ${alpha('#1A2432', 0.9 * shade)} 100%)`,
              transform: `translateZ(${z}px)`,
            }}
          />
        );
      })}

      {/* Back face */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: width * 0.04,
          overflow: 'hidden',
          transform: `translateZ(${-thickness - 0.4}px) rotateY(180deg)`,
          backfaceVisibility: 'hidden',
        }}
      >
        <CardBack width={width} height={height} />
      </div>

      {/* Front face */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: width * 0.04,
          overflow: 'hidden',
          backfaceVisibility: 'hidden',
          boxShadow: `0 ${height * 0.06}px ${height * 0.12}px ${alpha('#000000', 0.6)}`,
        }}
      >
        <CardFace sweep={sweep} exposure={exposure} burst={burst} />

        {/* View-dependent specular sheet */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(${100 + rotY * 1.4}deg, transparent ${Math.max(
              0,
              22 - spec * 18,
            )}%, ${alpha('#FFFFFF', 0.06 + spec * 0.22)} ${46 + rotY * 0.25}%, transparent ${
              72 + spec * 8
            }%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        {/* Edge-on rim: the lit sliver along whichever edge faces the key */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: width * 0.04,
            boxShadow: `inset ${rotY > 0 ? '-' : ''}${Math.abs(rotY) * 0.04 + 1}px 0 ${
              2 + Math.abs(rotY) * 0.05
            }px ${alpha(C.trustIce, 0.1 + Math.abs(Math.sin((rotY * Math.PI) / 180)) * 0.35)}`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Card-space overlays (scanner graphics) */}
      {children ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateZ(${thickness * 0.6}px)`,
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );

  return (
    <div style={{ position: 'relative', perspective: width * 3.4, ...style }}>
      {halo > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: width * 2.2,
            height: height * 1.9,
            marginLeft: -width * 1.1,
            marginTop: -height * 0.95,
            background: `radial-gradient(ellipse at center, ${alpha(
              C.brand,
              0.3 * halo,
            )} 0%, ${alpha(C.trustDeep, 0.12 * halo)} 42%, transparent 72%)`,
            filter: `blur(${width * 0.08}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      ) : null}

      {card}

      {reflection > 0 ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: height,
            width,
            height,
            transform: 'scaleY(-1)',
            transformOrigin: 'top',
            opacity: 0.26 * reflection * Math.max(0.2, facing),
            filter: `blur(${width * 0.022}px)`,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 58%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 58%)',
            pointerEvents: 'none',
          }}
        >
          <CardFace sweep={sweep} exposure={exposure} burst={burst * 0.6} />
        </div>
      ) : null}
    </div>
  );
};

/** The reverse. Registry chrome — this is MAZI's side of the object. */
const CardBack: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <svg viewBox={`0 0 ${CARD_W} ${CARD_H}`} width={width} height={height} style={{ display: 'block' }}>
    <rect width={CARD_W} height={CARD_H} fill="#080D18" />
    <rect width={CARD_W} height={CARD_H} fill={alpha(C.brandDeep, 0.18)} />
    {Array.from({ length: 26 }, (_, i) => (
      <line
        key={i}
        x1={0}
        y1={i * 28}
        x2={CARD_W}
        y2={i * 28}
        stroke={alpha(C.smoke, 0.22)}
        strokeWidth="1"
      />
    ))}
    <rect
      x="4"
      y="4"
      width={CARD_W - 8}
      height={CARD_H - 8}
      rx="17"
      fill="none"
      stroke={alpha(C.trust, 0.3)}
      strokeWidth="2"
    />
    <text
      x={CARD_W / 2}
      y="330"
      textAnchor="middle"
      fill={alpha(C.paperInk, 0.5)}
      fontFamily={FONT.mono}
      fontSize="18"
      letterSpacing="7"
    >
      {CARD.recordId}
    </text>
    <text
      x={CARD_W / 2}
      y="366"
      textAnchor="middle"
      fill={alpha(C.muted, 0.6)}
      fontFamily={FONT.mono}
      fontSize="13"
      letterSpacing="4"
    >
      VERIFIED BY MAZI
    </text>
  </svg>
);
