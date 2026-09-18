import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CARD, MARKET } from '../assets';
import { Atmosphere, Vignette } from '../components/Atmosphere';
import { CARD_RATIO } from '../components/CardFace';
import { Card3D } from '../components/Card3D';
import { Chrome } from '../components/Chrome';
import { CompLedger, MarketGraph, Valuation } from '../components/Market';
import { Converge, DustField } from '../components/Particles';
import { Mono, Rule } from '../components/Typography';
import { camStyle, composeCam, handheld, impactShake } from '../utils/camera';
import { C, alpha } from '../utils/colors';
import { E, drift, ramp, strike } from '../utils/easing';
import { useLayout, useType } from '../utils/layout';
import { IMPACTS, SCENES } from '../utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 04 · MARKET                                                      13:18–18:18
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The object becomes a number.
 *
 * Tension has to *release* here — four seconds of acceleration and impact
 * cannot be followed by more of the same. So the camera stops moving, the
 * palette warms for the first and only significant time, and the beat is
 * carried almost entirely by things arriving on a stagger rather than by
 * anything being thrown at the viewer.
 *
 * The one rule that keeps this from becoming a SaaS dashboard: no containers.
 * No panels, no cards, no rounded rectangles, no borders. Type and a line,
 * floating in the same dark room as everything else, held together by
 * alignment alone.
 *
 * BEATS (local frames)
 *   000–020  the card arrives from the match and drifts to its column
 *   012–030  particles peel off the object and fly to where the graph will be
 *   018–056  the price history draws itself
 *   015–042  the comparable-sales ledger streams in
 *   060      VALUE. the number lands, and amber enters the film
 *   060–118  hold. almost nothing moves.
 *   118–150  dim down into the manifesto
 */

const VALUE = IMPACTS.value - SCENES.market.from; // 60

export const Market: React.FC = () => {
  const frame = useCurrentFrame();
  const g = frame + SCENES.market.from;
  const { width, height, u, cx, cy, by, pad, isWide } = useLayout();
  const type = useType();

  const arrive = ramp(frame, 0, 26, E.out);
  const outro = ramp(frame, 122, 28, E.glide);

  // ── Camera: deliberately almost static. The release. ───────────────────
  const hh = handheld(frame + 1500, 0.7);
  const shake = impactShake(frame, [{ at: VALUE, power: 7 * u, decay: 8 }]);
  const camera = composeCam(
    { x: hh.x + shake.x, y: hh.y + shake.y, roll: hh.roll * 0.5 },
    { zoom: 1.05 - arrive * 0.05 + ramp(frame, 20, 120, E.linear) * 0.03 },
    { blur: outro * 6 * u },
  );

  // ── Layout ──────────────────────────────────────────────────────────────
  const cardW = width * by({ wide: 0.155, square: 0.26, portrait: 0.28, tall: 0.32 });
  const cardH = cardW / CARD_RATIO;
  const cardX = by({ wide: width * 0.235, square: cx, portrait: cx, tall: cx });
  const cardY = by({ wide: cy, square: height * 0.27, portrait: height * 0.26, tall: height * 0.24 });

  const colX = by({ wide: width * 0.42, square: pad, portrait: pad, tall: pad });
  const colW = by({
    wide: width * 0.42,
    square: width - pad * 2,
    portrait: width - pad * 2,
    tall: width - pad * 2,
  });
  const colY = by({ wide: cy - height * 0.24, square: height * 0.48, portrait: height * 0.46, tall: height * 0.45 });

  const graphW = by({ wide: colW * 0.62, square: colW, portrait: colW, tall: colW });
  const graphH = by({ wide: height * 0.2, square: height * 0.15, tall: height * 0.13 });

  // Particles that peel off the object and land where the graph will draw.
  const graphTargets = useMemo(() => {
    const originY = colY + by({ wide: height * 0.27, square: height * 0.2, tall: height * 0.18 });
    return MARKET.series.map((v, i) => ({
      x: colX + (i / (MARKET.series.length - 1)) * graphW,
      y: originY + (1 - v) * graphH * 0.8 + graphH * 0.1,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colX, colY, graphW, graphH, height]);

  const graphTop = colY + by({ wide: height * 0.27, square: height * 0.2, tall: height * 0.18 });

  return (
    <AbsoluteFill style={{ opacity: 1 - outro * 0.96 }}>
      <div style={camStyle(camera)}>
        {/* Warmer than anywhere else in the film — this is the money beat. */}
        <Atmosphere intensity={0.68} hue={-0.15} />
        <DustField frame={frame + 2400} count={by({ wide: 54, tall: 40 })} intensity={0.42} />

        {/* A single amber wash, very low, behind the number. Money has a colour
            and the viewer should feel it before they read it. */}
        <div
          style={{
            position: 'absolute',
            left: colX - width * 0.06,
            top: graphTop - height * 0.3,
            width: colW * 1.1,
            height: height * 0.62,
            background: `radial-gradient(ellipse at 22% 34%, ${alpha(
              C.amber,
              0.1 * ramp(frame, VALUE - 8, 26, E.out),
            )} 0%, transparent 66%)`,
            filter: `blur(${60 * u}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        {/* ── The object ──────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: cardX,
            top: cardY + drift(frame, 0.013, 7 * u, 0.6),
            width: cardW,
            height: cardH,
            marginLeft: -cardW / 2,
            marginTop: -cardH / 2,
            opacity: arrive,
            transform: `translateX(${(1 - arrive) * width * 0.12}px)`,
          }}
        >
          <Card3D
            width={cardW}
            rotX={drift(frame, 0.012, 1.6, 0.2)}
            rotY={-9 + drift(frame, 0.015, 2.4, 1.6)}
            thickness={5 * u}
            sweep={0.2 + ramp(frame, 10, 110, E.glide) * 0.7}
            halo={0.5}
          />

          {/* Identification strip under the object — the film's only caption */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: cardH + 22 * u,
              width: cardW,
              opacity: ramp(frame, 22, 16, E.out),
            }}
          >
            <Rule progress={ramp(frame, 22, 18, E.out)} width={cardW} origin="left" />
            <div style={{ marginTop: 10 * u }}>
              <Mono size={11 * u} color={C.paper} tracking={2.6 * u} weight={500}>
                {CARD.player}
              </Mono>
            </div>
            <div style={{ marginTop: 5 * u }}>
              <Mono size={9.5 * u} color={alpha(C.faint, 1)} tracking={2.2 * u}>
                {CARD.year} {CARD.set} · {CARD.serial} · {CARD.grade}
              </Mono>
            </div>
          </div>
        </div>

        {/* Matter leaving the object and becoming the chart. */}
        <Converge
          frame={frame}
          start={12}
          duration={26}
          targets={graphTargets}
          spread={width * 0.22}
          size={3 * u}
          color={C.cyan}
          seed="tomarket"
          dissolveAfter={10}
        />

        {/* ── The readout column ──────────────────────────────────────── */}
        <div style={{ position: 'absolute', left: colX, top: colY, width: colW }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12 * u,
              opacity: ramp(frame, 8, 14, E.out),
              marginBottom: 22 * u,
            }}
          >
            <Mono size={10.5 * u} color={alpha(C.cyan, 0.9)} tracking={4.6 * u}>
              MARKET INTELLIGENCE
            </Mono>
            <div style={{ flex: 1 }}>
              <Rule progress={ramp(frame, 10, 22, E.out)} width={colW * 0.5} origin="left" />
            </div>
          </div>

          <Valuation frame={frame} start={VALUE} size={type.display * 0.86} scale={u} />
        </div>

        {/* ── Price history ───────────────────────────────────────────── */}
        <div style={{ position: 'absolute', left: colX, top: graphTop }}>
          <MarketGraph frame={frame} start={18} width={graphW} height={graphH} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: graphW,
              marginTop: 10 * u,
              opacity: ramp(frame, 30, 16, E.out),
            }}
          >
            <Mono size={9 * u} color={alpha(C.faint, 1)} tracking={2.4 * u}>
              24 MONTHS
            </Mono>
            <Mono size={9 * u} color={alpha(C.faint, 1)} tracking={2.4 * u}>
              LAST {MARKET.lastSaleDate}
            </Mono>
          </div>
        </div>

        {/* ── Comparable sales ────────────────────────────────────────── */}
        {isWide ? (
          <div
            style={{
              position: 'absolute',
              left: colX + graphW + width * 0.035,
              top: graphTop - height * 0.012,
            }}
          >
            <CompLedger
              frame={frame}
              start={15}
              width={colW - graphW - width * 0.035}
              scale={u}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: colX,
              top: graphTop + graphH + height * 0.055,
              width: colW,
            }}
          >
            <CompLedger
              frame={frame}
              start={15}
              width={colW}
              scale={u * 1.05}
              rows={MARKET.comps.slice(-3)}
            />
          </div>
        )}

        {/* The value landing throws one soft amber pulse across the frame. */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(60% 50% at ${(colX / width) * 100}% ${
              (colY / height) * 100
            }%, ${alpha(C.amber, 0.14 * strike(frame, VALUE, 14, 2))} 0%, transparent 70%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        <Vignette strength={0.8} />
      </div>

      <Chrome frame={frame} globalFrame={g} stage="VALUE" stageIndex={4} opacity={1 - outro} />
    </AbsoluteFill>
  );
};
