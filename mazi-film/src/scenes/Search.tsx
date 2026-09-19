import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CARD } from '../assets';
import { Atmosphere, Vignette } from '../components/Atmosphere';
import { CARD_RATIO } from '../components/CardFace';
import { Card3D } from '../components/Card3D';
import { CardLattice } from '../components/CardLattice';
import { Chrome } from '../components/Chrome';
import { Glow, LightStreak } from '../components/Glow';
import { DirectionalBlur } from '../components/MotionBlur';
import { Sparks } from '../components/Particles';
import { ChromaSplit, Flash, Shockwave } from '../components/Transitions';
import { Kinetic, Mono, Odometer } from '../components/Typography';
import { CornerLocks } from '../components/Vision';
import { camStyle, composeCam, handheld, impactShake } from '../utils/camera';
import { C, alpha } from '../utils/colors';
import { E, drift, fall, ramp, strike } from '../utils/easing';
import { useLayout, useType } from '../utils/layout';
import { CANDIDATE_STEPS, IMPACTS, SCENES, useStoryFrame } from '../utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 03 · SEARCH                                                       9:00–13:24
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Scale, then compression, then one hard lock.
 *
 * The count (12,847 → 3,106 → 412 → 27 → 3 → 1) is the spine of the beat, but
 * the count is not the *drama* — the drama is that the space physically
 * narrows as the number falls. `converge` squeezes the record cloud toward the
 * camera axis on exactly the same curve the counter steps on, so the viewer
 * feels the search closing in before they've finished reading the number.
 *
 * Then, four frames of nothing. No motion, no audio (see audio-cues.md). The
 * silence before the match is the most valuable quarter-second in the film.
 *
 * BEATS (local frames)
 *   000–014  the field rushes in out of the detonation
 *   009–100  flight; the counter steps down five times
 *   078–102  the cloud collapses toward the axis; camera decelerates hard
 *   082–108  the one record is spotted, locked, and closed on
 *   104–108  freeze. silence.
 *   108      MATCH — the card slams into place
 *   108–144  lock, hold, and begin the hand-off to MARKET
 */

const MATCH = IMPACTS.match - SCENES.search.from; // 108

export const Search: React.FC = () => {
  const frame = useStoryFrame();
  const g = frame + SCENES.search.from;
  const { width, height, u, cx, cy, by, pad } = useLayout();
  const type = useType();

  // ── Flight ──────────────────────────────────────────────────────────────
  // Two overlapping ramps: an explosive launch, then a long decelerating glide
  // that arrives at a standstill exactly on the match.
  const camZ =
    ramp(frame, 0, 34, E.expoOut) * 7600 + ramp(frame, 24, 80, E.glide) * 19000;

  // ── Compression ─────────────────────────────────────────────────────────
  const converge = ramp(frame, 74, 32, E.snap) * 0.82;
  const fieldOut = ramp(frame, MATCH - 18, 16, E.expoIn);

  // ── Camera ──────────────────────────────────────────────────────────────
  const hh = handheld(frame + 900, 1.3);
  const shake = impactShake(frame, [
    { at: 4, power: 30 * u, decay: 12 },
    { at: MATCH, power: 52 * u, decay: 16 },
  ]);
  const camera = composeCam(
    { x: hh.x + shake.x, y: hh.y + shake.y, roll: hh.roll + shake.roll },
    {
      zoom:
        1.14 -
        ramp(frame, 0, 26, E.expoOut) * 0.14 +
        ramp(frame, 60, 44, E.glide) * 0.1 -
        ramp(frame, MATCH, 20, E.expoOut) * 0.08,
    },
    { blur: fall(frame, 0, 12, E.expoOut) * 10 * u },
  );

  // ── Counter ─────────────────────────────────────────────────────────────
  const step = [...CANDIDATE_STEPS].reverse().find((s) => g >= s.frame);
  const candidates = step?.value ?? CANDIDATE_STEPS[0].value;
  const stepIndex = CANDIDATE_STEPS.findIndex((s) => s.value === candidates);
  const stepLocal = (step?.frame ?? CANDIDATE_STEPS[0].frame) - SCENES.search.from;
  const counterKick = strike(frame, stepLocal, 7, 1);
  const counterOut = ramp(frame, MATCH - 6, 7, E.expoIn);

  // ── The approach ────────────────────────────────────────────────────────
  // Spotted at 82, closed on from 88, arrives on the match at 108. expoIn so
  // the last third of the travel is most of the distance — the camera does not
  // drift toward it, it drops on it.
  const spot = ramp(frame, 82, 12, E.out);
  const approach = ramp(frame, 88, 20, E.expoIn);

  // ── The match ───────────────────────────────────────────────────────────
  const matchIn = ramp(frame, MATCH, 12, E.expoOut);
  const heroW = width * by({ wide: 0.2, square: 0.34, portrait: 0.38, tall: 0.44 });
  const heroH = heroW / CARD_RATIO;
  // 0.16 → 1.0 of hero size: far enough to read as "in the field", and it
  // lands at exactly hero size so the match has nothing left to travel.
  const approachW = heroW * (0.16 + approach * 0.84);
  const approachH = approachW / CARD_RATIO;
  const settle = ramp(frame, MATCH + 10, 30, E.out);

  return (
    <AbsoluteFill>
      <div style={camStyle(camera)}>
        <Atmosphere intensity={0.55 + converge * 0.25} hue={-0.35 + converge * 0.2} />

        {/* ── The database ────────────────────────────────────────────── */}
        <div style={{ opacity: (1 - fieldOut) * ramp(frame, 0, 8, E.out) }}>
          <CardLattice
            camZ={camZ}
            count={by({ wide: 160, square: 130, tall: 110 })}
            candidateRate={0.08 + converge * 0.06}
            converge={converge}
            spread={1 - converge * 0.1}
            opacity={0.95}
          />
        </div>

        {/* Speed streaks — the corridor's own velocity, not the records' */}
        {frame < MATCH - 4
          ? Array.from({ length: by({ wide: 16, tall: 10 }) }, (_, i) => {
              const a = (i / 16) * Math.PI * 2 + drift(frame, 0.02, 0.4, i);
              const r = (0.18 + ((i * 37) % 60) / 100) * Math.min(width, height);
              const speed = 1 - converge * 0.7;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: cx + Math.cos(a) * r,
                    top: cy + Math.sin(a) * r * 0.86,
                    width: 2,
                    height: 2,
                    transform: `rotate(${(a * 180) / Math.PI}deg)`,
                  }}
                >
                  <LightStreak
                    color={i % 3 === 0 ? C.brand : C.goldDeep}
                    width={(90 + (i % 5) * 70) * u * speed}
                    thickness={1.1 * u}
                    intensity={0.32 * speed}
                  />
                </div>
              );
            })
          : null}

        {/*
          ── The approach: it finds the one, and we close on it ──────────

          This replaces a row of three "finalist" cards that were eliminated
          left and right. Two reasons they are gone. The narration says *it
          finds the one* — so the picture should find one, not audition three.
          And the row was broken: each MiniCard asked for `height: 100%` inside
          a Smear wrapper that had no height of its own, so every card
          collapsed to zero and rendered as nothing but its own top border —
          the three yellow hairlines that were sitting across the frame at 0:12.

          What happens instead: the record is spotted deep in the field, small
          and far, the locks snap onto it, and the camera accelerates toward it
          until it fills the frame. The match then lands on an object we have
          already been looking at, which is what makes it read as recognition
          rather than as a cut.
        */}
        {spot > 0.01 && matchIn < 0.02 ? (
          <div
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: approachW,
              height: approachH,
              marginLeft: -approachW / 2,
              marginTop: -approachH / 2,
              opacity: spot,
            }}
          >
            <DirectionalBlur amount={approach * 9 * u} angle={90}>
              <Card3D
                width={approachW}
                rotX={4 - approach * 3 + drift(frame, 0.02, 1.2, 0.6)}
                rotY={-22 + approach * 9 + drift(frame, 0.017, 1.6, 1.4)}
                thickness={4 * u}
                sweep={0.18 + approach * 0.5}
                halo={0.25 + approach * 0.7}
              >
                <CornerLocks
                  w={approachW}
                  h={approachH}
                  frame={frame}
                  start={86}
                  size={approachW * 0.2}
                  weight={2 * u}
                  inset={-approachW * 0.05}
                />
              </Card3D>
            </DirectionalBlur>
          </div>
        ) : null}

        {/* ── THE MATCH ───────────────────────────────────────────────── */}
        {matchIn > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: heroW,
              height: heroH,
              marginLeft: -heroW / 2,
              marginTop: -heroH / 2,
              // Barely an overshoot. The approach has already brought the card
              // to hero size, so the match is an impact on something present,
              // not an arrival — a 2x pop here would undo the whole push.
              transform: `scale(${1 + (1 - matchIn) * 0.1})`,
              opacity: Math.min(1, matchIn * 2.4),
            }}
          >
            {/* The only place in the film the channels split. It lasts seven
                frames and it is the difference between "a card appeared" and
                "something just happened". */}
            <ChromaSplit frame={frame} at={MATCH} decay={7} amount={18 * u}>
              <DirectionalBlur amount={(1 - matchIn) * 9 * u} angle={90}>
                  <Card3D
                  width={heroW}
                  rotX={2 - settle * 2 + drift(frame, 0.014, 1.1, 0.3)}
                  rotY={-14 + settle * 12 + drift(frame, 0.017, 1.4, 1.1)}
                  thickness={5.5 * u}
                  sweep={0.15 + settle * 0.6}
                  halo={0.9}
                >
                  <CornerLocks
                    w={heroW}
                    h={heroH}
                    frame={frame}
                    start={MATCH + 2}
                    size={heroW * 0.16}
                    weight={2.4 * u}
                    inset={-heroW * 0.04}
                  />
                </Card3D>
              </DirectionalBlur>
            </ChromaSplit>
          </div>
        ) : null}

        <Sparks
          frame={frame}
          at={MATCH}
          x={cx}
          y={cy}
          count={by({ wide: 170, tall: 120 })}
          reach={width * 0.85}
          life={38}
          flatten={0.28}
          seed="match"
          colors={[C.goldLift, C.gold, C.bone, C.brand]}
        />
        <Shockwave frame={frame} at={MATCH} duration={36} maxScale={4.4} />
        <Shockwave frame={frame} at={MATCH + 4} duration={30} maxScale={3} color={C.goldDeep} />
        <Flash frame={frame} at={MATCH} decay={12} intensity={1.15} />
        <Glow
          color={C.goldLift}
          size={width * 0.2 * strike(frame, MATCH, 14, 2)}
          intensity={strike(frame, MATCH, 14, 2) * 1.2}
          style={{ left: cx, top: cy }}
        />

        <Vignette strength={0.95 + converge * 0.25} />
      </div>

      {/* ── The count ───────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          left: by({ wide: pad + 30 * u, square: pad, tall: pad }),
          top: by({ wide: cy + height * 0.14, square: height * 0.7, tall: height * 0.72 }),
          opacity: (1 - counterOut) * ramp(frame, 6, 10, E.out),
          transform: `scale(${1 + counterKick * 0.045})`,
          transformOrigin: 'left center',
        }}
      >
        <div style={{ marginBottom: 10 * u, display: 'flex', alignItems: 'center', gap: 10 * u }}>
          <span
            style={{
              width: 6 * u,
              height: 6 * u,
              background: C.gold,
              opacity: 0.4 + counterKick * 0.6,
              boxShadow: `0 0 ${10 * u}px ${C.gold}`,
            }}
          />
          <Mono size={11 * u} color={alpha(C.muted, 0.95)} tracking={4.2 * u}>
            SEARCHING THE INDEX
          </Mono>
        </div>

        {/*
          Size the counter to the WIDEST value it will ever hold, not to the
          one on screen. The ladder now opens on 9,076,034 — the real catalog
          spine — which is nine cells against the six the old placeholder had,
          and at a fixed size that ran off the edge and wrapped.
        */}
        <Odometer
          frame={frame}
          start={stepLocal}
          value={candidates}
          size={Math.min(
            type.display * 0.62,
            (width * 0.44) /
              (Math.max(
                ...CANDIDATE_STEPS.map((c) => c.value.toLocaleString('en-US').length),
              ) *
                0.62),
          )}
          color={candidates === 1 ? C.goldLift : C.bone}
          mono
          weight={500}
        />

        <div style={{ marginTop: 12 * u, display: 'flex', gap: 6 * u, alignItems: 'center' }}>
          {CANDIDATE_STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i <= stepIndex ? 22 * u : 10 * u,
                height: 2,
                background: i <= stepIndex ? C.gold : alpha(C.smoke, 0.7),
                boxShadow: i === stepIndex ? `0 0 ${8 * u}px ${C.gold}` : undefined,
              }}
            />
          ))}
          <span style={{ marginLeft: 8 * u }}>
            <Mono size={10 * u} color={alpha(C.faint, 1)} tracking={2.4 * u}>
              CANDIDATES
            </Mono>
          </span>
        </div>
      </div>

      {/* ── MATCH stamp ─────────────────────────────────────────────────── */}
      {frame >= MATCH ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            // Below the object, not above it: at the top of frame the shattered
            // letters collided with the viewfinder chrome.
            top: cy + heroH * by({ wide: 0.58, square: 0.56, tall: 0.54 }),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: type.title * 1.4,
            opacity: 1 - ramp(frame, MATCH + 28, 14, E.out),
          }}
        >
          <Kinetic
            frame={frame}
            start={MATCH + 1}
            step={1.4}
            size={type.title}
            mode="shatter"
            weight={700}
            tracking={0.16}
            color={C.goldLift}
          >
            MATCH
          </Kinetic>
        </div>
      ) : null}

      <Chrome
        frame={frame}
        globalFrame={g}
        stage={frame >= MATCH ? 'MATCHED' : 'SEARCH'}
        stageIndex={3}
        opacity={0.9}
      />
    </AbsoluteFill>
  );
};
