import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { COPY } from '../assets';
import { Atmosphere, Vignette } from '../components/Atmosphere';
import { CARD_RATIO } from '../components/CardFace';
import { Card3D } from '../components/Card3D';
import { Chrome } from '../components/Chrome';
import { DustField } from '../components/Particles';
import { Kinetic } from '../components/Typography';
import { camStyle, composeCam, handheld } from '../utils/camera';
import { C, alpha } from '../utils/colors';
import { E, drift, ramp } from '../utils/easing';
import { useLayout, useType } from '../utils/layout';
import { field } from '../utils/random';
import { SCENES, useStoryFrame } from '../utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 05 · MANIFESTO                                                   18:12–22:12
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Four seconds where almost nothing happens.
 *
 * Everything before this has been acceleration; a film that never stops has no
 * dynamics, and a brand line delivered at speed is a line nobody remembers. So:
 * one object, very small, in a very large room. A shaft of light. A floor. The
 * camera moves maybe forty pixels in four seconds.
 *
 * The two halves of the line cross the frame in opposite directions and pass
 * BEHIND the card. That's the whole idea of the beat rendered as geometry —
 * the words are in the room, the object is in front of them, and the system is
 * the space they're both inside.
 *
 * The "intelligence field" around the card is drawn as a sparse constellation
 * of nodes whose connecting lines breathe on a very slow cycle. It is barely
 * visible, and it is doing the most important job in the shot: it makes the
 * darkness around the object feel *occupied*.
 */

export const Manifesto: React.FC = () => {
  const frame = useStoryFrame();
  const g = frame + SCENES.manifesto.from;
  const { width, height, u, cx, cy, by } = useLayout();
  const type = useType();

  const arrive = ramp(frame, 0, 30, E.breath);
  const leave = ramp(frame, 100, 20, E.expoIn);

  // Almost-static camera. A 4-second creep of ~1.5%.
  const hh = handheld(frame + 3000, 0.55);
  const camera = composeCam(
    { x: hh.x, y: hh.y, roll: hh.roll * 0.4 },
    { zoom: 1.0 + ramp(frame, 0, 120, E.linear) * 0.035 + leave * 0.06 },
  );

  const cardW = width * by({ wide: 0.125, square: 0.2, portrait: 0.22, tall: 0.25 });
  const cardH = cardW / CARD_RATIO;
  const cardY = cy - height * by({ wide: 0.055, square: 0.06, tall: 0.07 });

  // The intelligence field: nodes around the object, lines between near pairs.
  const nodes = useMemo(
    () =>
      field(by({ wide: 26, square: 22, tall: 18 }), 'field', (r) => ({
        a: r.between(0, Math.PI * 2),
        rad: r.between(0.5, 1.9),
        y: r.between(-0.75, 0.6),
        phase: r.between(0, Math.PI * 2),
        size: r.between(1.4, 3.2),
      })),
    [by],
  );

  const nodePts = nodes.map((n) => ({
    x: cx + Math.cos(n.a) * n.rad * cardW * 2.1,
    y: cardY + n.y * cardH * 1.15 + drift(frame, 0.008, 9 * u, n.phase),
    o: 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(frame * 0.035 + n.phase)),
    size: n.size * u,
  }));

  // Deliberately smaller than the opening's mega type. This beat belongs to
  // the object, not the words — the words are the room it's sitting in.
  const baseSize = by({
    wide: type.mega * 0.62,
    square: type.display * 0.92,
    portrait: type.display * 0.88,
    tall: type.display * 0.82,
  });

  /**
   * Fit the line to the frame instead of trusting the copy to be short.
   *
   * The headline is the one string in the film most likely to be rewritten, and
   * a rewrite that is three characters longer used to run straight off the
   * right edge. Teko caps average ~0.46em wide; the two halves also drift
   * ±7% of frame width past each other, so the usable box is ~70%.
   */
  const longest = Math.max(...COPY.manifesto.map((l) => l.length));
  const fitSize = (width * 0.7) / (longest * 0.46);
  const typeSize = Math.min(baseSize, fitSize);

  // The two halves drift across each other, slowly, in opposite directions.
  const l1 = ramp(frame, 18, 60, E.breath);
  const l2 = ramp(frame, 30, 60, E.breath);
  const l1x = (-0.06 + l1 * 0.05) * width - leave * width * 0.14;
  const l2x = (0.07 - l2 * 0.06) * width + leave * width * 0.14;

  return (
    <AbsoluteFill style={{ opacity: arrive }}>
      <div style={camStyle(camera)}>
        <Atmosphere intensity={0.5} hue={-0.55} floor />

        {/* Volumetric shaft from a single high key. The only light in the room. */}
        <div
          style={{
            position: 'absolute',
            left: cx - width * 0.24,
            top: -height * 0.14,
            width: width * 0.48,
            height: height * 0.92,
            background: `linear-gradient(180deg, ${alpha(C.trustIce, 0.075)} 0%, ${alpha(
              C.trust,
              0.035,
            )} 42%, transparent 88%)`,
            clipPath: 'polygon(38% 0%, 62% 0%, 88% 100%, 12% 100%)',
            filter: `blur(${34 * u}px)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        <DustField
          frame={frame + 3600}
          count={by({ wide: 92, tall: 64 })}
          intensity={0.6}
          focus={700}
        />

        {/* ── The line. Behind the object. ─────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: cy - typeSize * by({ wide: 1.5, square: 1.7, tall: 1.85 }),
            height: typeSize * 1.14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${l1x}px)`,
            opacity: 1 - leave * 0.6,
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            <Kinetic
              frame={frame}
              start={18}
              step={1.7}
              size={typeSize}
              mode="mask"
              weight={700}
              tracking={-0.048}
              color={alpha(C.bone, 0.82)}
            >
              {COPY.manifesto[0]}
            </Kinetic>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: cy + typeSize * by({ wide: 0.42, square: 0.62, tall: 0.75 }),
            height: typeSize * 1.14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${l2x}px)`,
            opacity: 1 - leave * 0.6,
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>
            <Kinetic
              frame={frame}
              start={30}
              step={1.7}
              size={typeSize}
              mode="mask"
              weight={700}
              tracking={-0.048}
              color={alpha(C.bone, 0.82)}
            >
              {COPY.manifesto[1]}
            </Kinetic>
          </div>
        </div>

        {/* ── The intelligence field ───────────────────────────────────── */}
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {nodePts.map((p, i) =>
            nodePts.slice(i + 1).map((q, j) => {
              const d = Math.hypot(p.x - q.x, p.y - q.y);
              if (d > cardW * 1.5) return null;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={p.x}
                  y1={p.y}
                  x2={q.x}
                  y2={q.y}
                  stroke={alpha(C.trust, 0.1 * p.o * q.o)}
                  strokeWidth={0.8}
                />
              );
            }),
          )}
          {nodePts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={alpha(C.trustIce, 0.3 * p.o)} />
          ))}
        </svg>

        {/* ── The object. In front of the words — then behind them. ─────
            It used to sit still for four seconds. Now it recedes: over the
            length of the beat it shrinks, lifts and dims, travelling *into*
            the archive the words are describing, so by the time the line has
            landed the card is small and far and the room is what's left.
            The reveal that follows collapses it the rest of the way. */}
        {(() => {
          const recede = ramp(frame, 22, 96, E.breath);
          const sc = 1 - recede * 0.46;
          return (
            <div
              style={{
                position: 'absolute',
                left: cx,
                top: cardY - recede * height * 0.09 + drift(frame, 0.009, 6 * u, 1.2),
                width: cardW,
                marginLeft: -cardW / 2,
                marginTop: -cardH / 2,
                transform: `scale(${sc})`,
                opacity: 1 - recede * 0.28,
                filter: recede > 0.4 ? `blur(${(recede - 0.4) * 2.4 * u}px)` : undefined,
              }}
            >
              <Card3D
                width={cardW}
                rotX={drift(frame, 0.0085, 2.4, 0.5) + recede * 6}
                rotY={-7 + drift(frame, 0.0105, 4.2, 2.2) - recede * 10}
                rotZ={drift(frame, 0.007, 0.8, 3)}
                thickness={5 * u}
                sweep={0.1 + ramp(frame, 0, 120, E.linear) * 0.85}
                halo={0.75 - recede * 0.5}
                reflection={0.85 * (1 - recede)}
              />
            </div>
          );
        })()}

        <Vignette strength={1.05} />
      </div>

      <Chrome
        frame={frame - 10}
        globalFrame={g}
        stage="UNDERSTAND"
        stageIndex={5}
        opacity={(1 - leave) * 0.7}
      />
    </AbsoluteFill>
  );
};
