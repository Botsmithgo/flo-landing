import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CARD, COPY } from '../assets';
import { Atmosphere, Vignette } from '../components/Atmosphere';
import { CARD_RATIO } from '../components/CardFace';
import { Card3D } from '../components/Card3D';
import { Chrome } from '../components/Chrome';
import { DirectionalBlur } from '../components/MotionBlur';
import { DustField, Sparks } from '../components/Particles';
import { Flash, Shockwave } from '../components/Transitions';
import { Mono, Scramble } from '../components/Typography';
import {
  ContourTrace,
  CornerLocks,
  DataLabel,
  DepthMesh,
  FeaturePoints,
  ScanPlane,
} from '../components/Vision';
import { camStyle, composeCam, handheld, impactShake } from '../utils/camera';
import { C, FONT, alpha } from '../utils/colors';
import { E, drift, fall, ramp, strike } from '../utils/easing';
import { useLayout } from '../utils/layout';
import { IMPACTS, SCENES, useStoryFrame } from '../utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 02 · SCAN                                                          3:24–9:06
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The recognition sequence. The design problem is that "AI looks at a thing" is
 * the single most clichéd shot in technology advertising, so this beat is built
 * as a *pipeline with stages* rather than an effect:
 *
 *   LOCK → CONTOUR → SCAN → FEATURES → SEGMENT → LABEL → COMMIT
 *
 * Each stage has its own motion signature (mechanical snap, travelling head,
 * descending plane, popping keypoints, deforming mesh, tethered type), so the
 * viewer reads a *process*, not a filter. The graphics ride the card in 3D —
 * they're children of the card's transform, so when it rotates they rotate with
 * it. That single decision is what makes the overlay feel attached to the
 * object rather than stuck on the lens.
 *
 * BEATS (local frames)
 *   000–014  carry-over: the launch blur decelerates, the card settles
 *   028–040  corner locks snap  (global impact: LOCK)
 *   034–056  contour trace
 *   042–076  scan plane descends; feature points ignite in its wake
 *   060–090  depth mesh flickers over the figure
 *   070–104  four labels tether out and commit
 *   104–130  confidence resolves — OPTICAL MATCH stamps
 *   138–162  the card fractures. DETONATION at local 151.
 */

const LOCK = IMPACTS.lock - SCENES.scan.from; // 33
const DETONATE = IMPACTS.detonate - SCENES.scan.from; // 151
const SCAN_START = 42;
const SCAN_DUR = 34;

export const Scan: React.FC = () => {
  const frame = useStoryFrame();
  const g = frame + SCENES.scan.from;
  const { width, height, u, cx, cy, by, pad } = useLayout();

  // ── Framing ─────────────────────────────────────────────────────────────
  // In 16:9 the card sits left of centre so the labels have a column to live
  // in. In vertical formats it centres and the labels wrap around it.
  const cardW = width * by({ wide: 0.235, square: 0.4, portrait: 0.44, tall: 0.5 });
  const cardH = cardW / CARD_RATIO;
  const originX = cx - by({ wide: width * 0.1, square: 0, portrait: 0, tall: 0 });
  const originY = cy + by({ wide: 0, square: -height * 0.03, tall: -height * 0.04 });

  // ── Camera ──────────────────────────────────────────────────────────────
  // Enters still decelerating from the previous scene's launch, then breathes.
  const decel = fall(frame, 0, 16, E.expoOut);
  const creep = ramp(frame, 16, 120, E.linear);
  const hh = handheld(frame + 200, 0.9);
  const shake = impactShake(frame, [
    { at: LOCK, power: 9 * u, decay: 7 },
    { at: DETONATE, power: 40 * u, decay: 15 },
  ]);
  const camera = composeCam(
    { x: hh.x + shake.x, y: hh.y + shake.y, roll: hh.roll * 0.6 + shake.roll },
    // Enters pushed in (carrying the launch), falls back, then creeps in again.
    { zoom: 1.0 + decel * 0.24 + creep * 0.055 + ramp(frame, DETONATE, 16, E.expoOut) * 0.22 },
    { blur: decel * 13 * u },
  );

  // ── The object ──────────────────────────────────────────────────────────
  // A slow orbit. Just enough that the specular moves and the object is
  // unmistakably dimensional; not enough to be a "spinning 3D logo".
  const rotY = -18 + decel * 26 + ramp(frame, 10, 140, E.breath) * 26 + drift(frame, 0.016, 1.6, 2);
  const rotX = 6 - ramp(frame, 10, 120, E.breath) * 9 + drift(frame, 0.013, 1.4, 0.7);
  const rotZ = drift(frame, 0.011, 0.9, 1.4);

  // Fracture: at the detonation the card scales up a touch and blows apart.
  const fracture = ramp(frame, DETONATE, 14, E.expoOut);
  const preload = ramp(frame, DETONATE - 12, 12, E.expoIn);

  const labelScale = u * by({ wide: 1, square: 0.92, portrait: 0.9, tall: 0.86 });
  const confidence = ramp(frame, 104, 24, E.out) * CARD.confidence;

  // Label geometry — anchors on the object, tails out into clear space.
  const labels = by({
    wide: [
      { x: 0.76, y: 0.14, dx: cardW * 0.72, dy: -cardH * 0.1, label: 'PLAYER', value: CARD.player },
      { x: 0.2, y: 0.3, dx: -cardW * 0.56, dy: -cardH * 0.14, label: 'YEAR', value: CARD.year },
      { x: 0.86, y: 0.52, dx: cardW * 0.56, dy: cardH * 0.1, label: 'SET', value: CARD.set },
      {
        x: 0.3,
        y: 0.84,
        dx: -cardW * 0.5,
        dy: cardH * 0.14,
        label: 'VARIANT',
        value: CARD.variant,
      },
    ],
    tall: [
      { x: 0.78, y: 0.12, dx: cardW * 0.3, dy: -cardH * 0.16, label: 'PLAYER', value: CARD.player },
      { x: 0.18, y: 0.34, dx: -cardW * 0.34, dy: -cardH * 0.1, label: 'YEAR', value: CARD.year },
      { x: 0.84, y: 0.58, dx: cardW * 0.26, dy: cardH * 0.12, label: 'SET', value: CARD.set },
      { x: 0.26, y: 0.86, dx: -cardW * 0.3, dy: cardH * 0.14, label: 'VARIANT', value: CARD.variant },
    ],
  });

  return (
    <AbsoluteFill>
      <div style={camStyle(camera)}>
        <Atmosphere intensity={0.82 - fracture * 0.3} hue={0.35} />
        <DustField
          frame={frame + 300}
          count={by({ wide: 66, tall: 50 })}
          intensity={0.5}
          focus={900}
        />

        {/* ── The object + everything attached to it ─────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: originX,
            top: originY,
            width: cardW,
            height: cardH,
            marginLeft: -cardW / 2,
            marginTop: -cardH / 2,
            opacity: 1 - ramp(frame, DETONATE, 9, E.expoOut),
            transform: `scale(${1 + preload * 0.02 + fracture * 0.5})`,
            filter: fracture > 0.01 ? `blur(${fracture * 30 * u}px)` : undefined,
          }}
        >
          <DirectionalBlur amount={decel * 26 * u} angle={90}>
            <Card3D
              width={cardW}
              rotX={rotX}
              rotY={rotY}
              rotZ={rotZ}
              thickness={5.5 * u}
              sweep={0.1 + ramp(frame, 20, 90, E.glide) * 0.85}
              burst={1}
              halo={0.55 + strike(frame, LOCK, 12, 2) * 0.5}
            >
              {/* Vision graphics live in card space — they rotate with it. */}
              <CornerLocks
                w={cardW}
                h={cardH}
                frame={frame}
                start={LOCK - 5}
                size={cardW * 0.17}
                weight={2.6 * u}
                inset={-cardW * 0.035}
              />
              <ContourTrace w={cardW} h={cardH} frame={frame} start={LOCK + 2} duration={22} />
              <ScanPlane
                w={cardW}
                h={cardH}
                frame={frame}
                start={SCAN_START}
                duration={SCAN_DUR}
                passes={2}
              />
              <FeaturePoints
                w={cardW}
                h={cardH}
                frame={frame}
                scanStart={SCAN_START}
                scanDuration={SCAN_DUR}
                count={by({ wide: 36, tall: 26 })}
                labelled={3}
              />
              <DepthMesh w={cardW} h={cardH} frame={frame} start={60} duration={30} />
            </Card3D>
          </DirectionalBlur>

          {/* ── Tethered metadata (screen space — these don't rotate) ── */}
          {labels.map((l, i) => (
            <DataLabel
              key={l.label}
              x={l.x * cardW}
              y={l.y * cardH}
              dx={l.dx}
              dy={l.dy}
              label={l.label}
              value={l.value}
              frame={frame}
              start={70 + i * 7}
              scale={labelScale}
            />
          ))}
        </div>

        {/* ── Detonation ─────────────────────────────────────────────── */}
        <Sparks
          frame={frame}
          at={DETONATE}
          x={originX}
          y={originY}
          count={by({ wide: 180, tall: 130 })}
          reach={width * 0.95}
          life={40}
          flatten={0.18}
          seed="detonate"
          colors={[C.trustIce, C.trust, C.brand, C.sage, C.bone]}
        />
        <Shockwave
          frame={frame}
          at={DETONATE}
          duration={34}
          maxScale={4}
          x={`${(originX / width) * 100}%`}
          y={`${(originY / height) * 100}%`}
        />
        <Flash frame={frame} at={DETONATE} decay={11} intensity={1} />

        <Vignette strength={0.9} />
      </div>

      {/* ── Confidence readout — the machine's certainty, stated plainly ── */}
      <div
        style={{
          position: 'absolute',
          left: by({ wide: cx + width * 0.24, square: pad, portrait: pad, tall: pad }),
          top: by({ wide: cy + height * 0.26, square: height * 0.84, tall: height * 0.845 }),
          opacity: ramp(frame, 100, 14, E.out) * (1 - ramp(frame, DETONATE - 10, 10, E.out)),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 * u }}>
          <Mono size={11 * u} color={alpha(C.muted, 0.9)} tracking={3.6 * u}>
            CONFIDENCE
          </Mono>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 30 * u,
              color: C.trust,
              letterSpacing: 1 * u,
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 ${20 * u}px ${alpha(C.trust, 0.6)}`,
            }}
          >
            {confidence.toFixed(1)}%
          </span>
        </div>

        {/* A confidence bar, because a number alone is a statistic and a bar
            filling is an *event*. */}
        <div
          style={{
            marginTop: 10 * u,
            width: 250 * u,
            height: 2,
            background: alpha(C.smoke, 0.6),
          }}
        >
          <div
            style={{
              width: `${(confidence / 100) * 100}%`,
              height: '100%',
              background: C.trust,
              boxShadow: `0 0 ${10 * u}px ${C.trust}`,
            }}
          />
        </div>

        <div style={{ marginTop: 14 * u, opacity: ramp(frame, 126, 10, E.out) }}>
          <Mono size={13 * u} color={C.trustIce} tracking={5 * u} weight={500}>
            <Scramble
              text={COPY.scanning}
              progress={ramp(frame, 126, 14, E.out)}
              frame={frame}
              seed="optical"
            />
          </Mono>
        </div>
      </div>

      <Chrome
        frame={frame}
        globalFrame={g}
        stage="IDENTIFY"
        stageIndex={2}
        reticle={frame < LOCK}
        opacity={1 - ramp(frame, DETONATE - 8, 8, E.out)}
      />
    </AbsoluteFill>
  );
};
