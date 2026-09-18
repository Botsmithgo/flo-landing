import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COPY } from '../assets';
import { Atmosphere, Vignette } from '../components/Atmosphere';
import { Card3D } from '../components/Card3D';
import { Chrome } from '../components/Chrome';
import { Glow, LightStreak } from '../components/Glow';
import { DirectionalBlur, MotionTrail } from '../components/MotionBlur';
import { DustField, Sparks } from '../components/Particles';
import { Flash, Shockwave } from '../components/Transitions';
import { Kinetic, Mono, Scramble } from '../components/Typography';
import { camStyle, composeCam, handheld, impactShake } from '../utils/camera';
import { C, alpha } from '../utils/colors';
import { E, drift, fall, ramp, strike } from '../utils/easing';
import { useLayout, useType } from '../utils/layout';
import { SCENES, useStoryFrame } from '../utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 01 · ORIGIN                                                        0:00–4:00
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The problem with opening a brand film in darkness is that darkness is boring
 * for exactly as long as the viewer doesn't know what they're looking at. So
 * the first thing on screen is a hairline of light — and it is *not* a graphic
 * element. It's the card, seen exactly edge-on, very far away. Every frame of
 * the first two seconds is that line slowly becoming an object.
 *
 * The payoff is structural: when the ignition hits at 2:22 and the card snaps
 * to face camera, the viewer retroactively understands the whole opening. That
 * is the "whoa, what is this" moment — not an effect, a reveal of meaning.
 *
 * BEATS (local frames @30fps)
 *   000–012  void. one mote. a violet pool breathing.
 *   012–070  the line exists. it rotates. it is 40px tall and 700 units away.
 *   052–072  a scan wave crosses the void; the edge FLARES as it passes
 *   072–082  compression — dust streams to camera, vignette closes, riser
 *   082      IGNITE. flash, shockwave, the card turns to face us
 *   084–104  "LOOK CLOSER" crosses the frame in front of everything
 *   106–120  LAUNCH. camera slams forward. blur carries into the next scene.
 */

const IGNITE = 82;
const LAUNCH = 106;
const SCAN_WAVE = 52;
const FLARE = 64;

export const Origin: React.FC = () => {
  const frame = useStoryFrame();
  const g = frame + SCENES.origin.from;
  const { width, height, u, cx, cy, by } = useLayout();
  const type = useType();

  // ── Camera ──────────────────────────────────────────────────────────────
  // Two moves only: an almost-imperceptible drift, then a violent push.
  const drift1 = ramp(frame, 0, 82, E.linear) * 14 * u;
  const push = ramp(frame, LAUNCH, 24, E.glide);
  const zoom = 1 + ramp(frame, 60, 22, E.glide) * 0.04 + push * 1.55;

  const shake = impactShake(frame, [
    { at: IGNITE, power: 13 * u, decay: 11 },
    { at: LAUNCH, power: 16 * u, decay: 8 },
  ]);
  const hh = handheld(frame, 1.1);
  const camera = composeCam(
    { x: -drift1 * 0.4 + hh.x + shake.x, y: hh.y * 0.6 + shake.y, roll: hh.roll + shake.roll },
    { zoom },
    { blur: push * 16 * u },
  );

  // ── The card ────────────────────────────────────────────────────────────
  // Edge-on (90°) → a sliver → snapped to face at ignition.
  const rotY =
    90 -
    ramp(frame, 12, 58, E.breath) * 13 - // 90 → 77, imperceptible thickening
    ramp(frame, 74, 8, E.expoIn) * 6 - // anticipation: a little more turn
    ramp(frame, IGNITE, 30, E.out) * 52; // 71 → 19, the reveal — eased, not snapped
  const rotX = drift(frame, 0.012, 2.2, 1.3) - ramp(frame, IGNITE, 30, E.out) * 5;
  const rotZ = drift(frame, 0.009, 1.1, 0.4);

  // Scale: tiny and far, then thrown at the lens.
  const cardW =
    width *
    by({ wide: 0.13, square: 0.2, portrait: 0.22, tall: 0.26 }) *
    (0.24 +
      ramp(frame, 12, 66, E.breath) * 0.16 +
      ramp(frame, IGNITE, 30, E.out) * 1.05 +
      ramp(frame, LAUNCH, 22, E.glide) * 2.4);

  // Off-centre until the ignition, then it claims the frame.
  const cardX = cx + by({ wide: 0.11, tall: 0.06 }) * width * (1 - ramp(frame, IGNITE, 34, E.out));
  const cardY = cy - height * 0.03 * (1 - ramp(frame, IGNITE, 34, E.out));

  const exposure =
    ramp(frame, 8, 26, E.out) * (0.4 + ramp(frame, IGNITE, 9, E.expoOut) * 0.6) +
    strike(frame, FLARE, 7, 2) * 0.3;

  // ── Scan wave that crosses the void and flares the edge ────────────────
  const waveP = ramp(frame, SCAN_WAVE, 26, E.glide);
  const waveX = -0.15 + waveP * 1.3;
  const flare = strike(frame, FLARE, 9, 2);

  // ── Compression before the strike ──────────────────────────────────────
  const compress = ramp(frame, 70, 12, E.expoIn);

  const headlineVisible = frame >= HEADLINE_IN;
  const headline = headlineTrack(frame, width);

  return (
    <AbsoluteFill>
      <div style={camStyle(camera)}>
        <Atmosphere
          intensity={0.3 + ramp(frame, 0, 60, E.out) * 0.25 + ramp(frame, IGNITE, 18, E.out) * 0.5}
          hue={-0.5 + ramp(frame, IGNITE, 20, E.out) * 0.9}
        />

        {/* Deep dust. Streams toward camera as the pressure builds. */}
        <DustField
          frame={frame + compress * 42}
          count={by({ wide: 78, tall: 58 })}
          intensity={0.32 + ramp(frame, 6, 40, E.out) * 0.5 + compress * 0.35}
          camX={drift1}
          focus={900}
        />

        {/* ── The subject ───────────────────────────────────────────────── */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              position: 'absolute',
              left: cardX,
              top: cardY,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <DirectionalBlur amount={push * 34 * u} angle={90}>
              <Card3D
                width={cardW}
                rotX={rotX}
                rotY={rotY}
                rotZ={rotZ}
                thickness={5 * u}
                sweep={0.18 + waveP * 0.7}
                exposure={Math.min(1, exposure)}
                burst={ramp(frame, IGNITE, 22, E.out)}
                halo={ramp(frame, IGNITE - 6, 26, E.out) * 0.8}
              />
            </DirectionalBlur>

            {/* Edge flare — the specular the scan wave knocks off the card.
                Anchored to the card's centre, not its corner. */}
            {flare > 0.01 ? (
              <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
                <LightStreak
                  color={C.trustIce}
                  width={width * 0.62 * flare}
                  thickness={2.2 * u}
                  intensity={flare}
                />
                <Glow color={C.trust} size={90 * u * flare} intensity={flare * 1.3} />
              </div>
            ) : null}
          </div>
        </AbsoluteFill>

        {/* ── The scan wave itself ──────────────────────────────────────── */}
        {waveP > 0.001 && waveP < 0.999 ? (
          <div
            style={{
              position: 'absolute',
              left: waveX * width,
              top: 0,
              bottom: 0,
              width: 2,
              background: `linear-gradient(180deg, transparent 0%, ${alpha(
                C.trust,
                0.5,
              )} 30%, ${alpha(C.trustIce, 0.75)} 50%, ${alpha(C.trust, 0.5)} 70%, transparent 100%)`,
              boxShadow: `0 0 ${40 * u}px ${alpha(C.trust, 0.5)}`,
              mixBlendMode: 'screen',
            }}
          />
        ) : null}

        {/* ── IGNITION ──────────────────────────────────────────────────── */}
        <Sparks
          frame={frame}
          at={IGNITE}
          x={cardX}
          y={cardY}
          count={by({ wide: 130, tall: 96 })}
          reach={width * 0.55}
          life={38}
          flatten={0.42}
          colors={[C.trustIce, C.trust, C.brand, C.bone]}
        />
        <Shockwave frame={frame} at={IGNITE} duration={30} x={`${(cardX / width) * 100}%`} y={`${(cardY / height) * 100}%`} />
        <Flash frame={frame} at={IGNITE} decay={10} intensity={0.95} />
        <Flash frame={frame} at={FLARE} decay={5} intensity={0.3} color={C.trust} />

        {/* ── "LOOK CLOSER" — crosses in FRONT of the card ─────────────── */}
        {headlineVisible ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              // Explicit top rather than a percentage translate: the type block
              // is an inline-flex of clipped glyph boxes and its intrinsic
              // height is not what you'd expect, so we place it by hand.
              top: cy - type.mega * 0.56,
              height: type.mega * 1.12,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
              opacity: headline.opacity,
              mixBlendMode: 'screen',
            }}
          >
            {/* True sub-frame accumulation rather than a blur filter. This is
                the fastest move in the film and the one the eye lands on, so
                it gets the expensive, correct treatment: the type is re-laid
                out at six fractional past frames and the samples are stacked,
                which reproduces a real 180° shutter instead of approximating
                one. Each sample carries its own x, so the smear follows the
                actual travel curve including the deceleration. */}
            <MotionTrail
              samples={6}
              shutter={headline.shutter}
              blend="screen"
              style={{ display: 'flex', justifyContent: 'center' }}
              render={(off) => (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    transform: `translateX(${headlineTrack(frame + off, width).x}px)`,
                  }}
                >
                  <div style={{ whiteSpace: 'nowrap' }}>
                    <Kinetic
                      frame={frame + off}
                      start={68}
                      step={1.1}
                      size={type.mega}
                      mode="mask"
                      weight={800}
                      tracking={-0.05}
                      color={C.bone}
                    >
                      {COPY.open}
                    </Kinetic>
                  </div>
                </div>
              )}
            />
          </div>
        ) : null}

        <Vignette strength={0.85 + compress * 0.4 - ramp(frame, IGNITE, 20, E.out) * 0.3} />
      </div>

      {/* ── System chrome (outside the camera rig — it's the lens, not the world) */}
      <AbsoluteFill style={{ opacity: fall(frame, IGNITE - 4, 8) * 0.9 }}>
        <div
          style={{
            position: 'absolute',
            left: cx + width * 0.14,
            top: cy + height * 0.06,
            opacity: ramp(frame, 20, 18, E.out),
          }}
        >
          <Mono size={10 * u} color={alpha(C.trust, 0.8)} tracking={3.4 * u}>
            <Scramble
              text="SUBJECT ACQUIRED"
              progress={ramp(frame, 22, 26, E.out)}
              frame={frame}
              seed="acq"
            />
          </Mono>
          <div style={{ marginTop: 6 * u, opacity: ramp(frame, 40, 16, E.out) }}>
            <Mono size={9 * u} color={alpha(C.faint, 1)} tracking={2.6 * u}>
              RANGE 0.74M · EDGE-ON · 1 OBJECT
            </Mono>
          </div>
        </div>
      </AbsoluteFill>

      <Chrome
        frame={frame - IGNITE - 6}
        globalFrame={g}
        stage="CAPTURE"
        stageIndex={1}
        opacity={ramp(frame, IGNITE + 6, 16, E.out)}
      />
    </AbsoluteFill>
  );
};

/**
 * The headline's own motion curve, kept out of the render body because it has
 * three phases and reads badly inline: it enters from the right at speed,
 * decelerates hard into a brief legible hold, then is dragged off left by the
 * camera launch.
 */
const HEADLINE_IN = 84;
const HEADLINE_OUT = 106;

const headlineOffset = (frame: number, width: number): number =>
  (1 - ramp(frame, HEADLINE_IN, 14, E.expoOut)) * width * 1.0 -
  ramp(frame, HEADLINE_OUT, 12, E.expoIn) * width * 1.6;

const headlineTrack = (frame: number, width: number) => {
  const x = headlineOffset(frame, width);
  // Per-frame travel, used to drive the shutter: the trail only exists while
  // the type is actually moving, so the held frames stay perfectly crisp.
  const speed = Math.abs(headlineOffset(frame + 1, width) - x);
  return {
    x,
    speed,
    shutter: Math.min(1.3, (speed / width) * 7),
    opacity:
      Math.min(1, ramp(frame, HEADLINE_IN, 4, E.out) * 3) *
      (1 - ramp(frame, HEADLINE_OUT + 6, 8, E.out)),
  };
};
