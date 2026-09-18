import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COPY } from '../assets';
import { Atmosphere, Vignette } from '../components/Atmosphere';
import { CARD_RATIO } from '../components/CardFace';
import { Card3D } from '../components/Card3D';
import { Glow, LightStreak } from '../components/Glow';
import { LOGO_VIEW, MaziLogo, sampleLogoPoints } from '../components/MaziLogo';
import { Converge, DustField } from '../components/Particles';
import { Flash, Shockwave } from '../components/Transitions';
import { Mono, Rule } from '../components/Typography';
import { camStyle, composeCam, handheld, impactShake } from '../utils/camera';
import { C, alpha } from '../utils/colors';
import { E, drift, ramp, strike } from '../utils/easing';
import { useLayout, useType } from '../utils/layout';
import { field } from '../utils/random';
import { IMPACTS, SCENES } from '../utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 06 · REVEAL                                                      22:06–26:00
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Everything the film has built collapses into one point, and the point becomes
 * the mark.
 *
 * The logo is never faded in. Three things happen instead, in order:
 *   1. the room implodes — dust, light and the object all travel *inward*
 *   2. the surviving matter converges onto the letterforms' outlines
 *   3. a bar of light crosses the frame and paints the mark solid behind it
 *
 * The MARK impact is placed on the exact frame the paint bar clears the final
 * letter. That's the only frame in the film where picture and sound are locked
 * to the same single event, which is why it reads as the ending.
 *
 * Then: stillness. No button, no stinger, no final zoom. The mark, a hairline,
 * five words, and the room breathing.
 */

const COLLAPSE = IMPACTS.collapse - SCENES.reveal.from; // 5
const LOGO_START = 14;
const MARK = IMPACTS.mark - SCENES.reveal.from; // 37
const ENDLINE = 52;

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, u, cx, cy, by } = useLayout();
  const type = useType();

  // ── Camera ──────────────────────────────────────────────────────────────
  const hh = handheld(frame + 5000, 0.5);
  const shake = impactShake(frame, [{ at: MARK, power: 15 * u, decay: 13 }]);
  const camera = composeCam(
    { x: hh.x + shake.x, y: hh.y + shake.y, roll: hh.roll * 0.3 + shake.roll },
    {
      // A tiny pull-back as the mark lands: the room gets bigger around it.
      zoom: 1.1 - ramp(frame, COLLAPSE, 30, E.expoOut) * 0.09 - ramp(frame, MARK, 40, E.glide) * 0.02,
    },
  );

  // ── Collapse ────────────────────────────────────────────────────────────
  const collapse = ramp(frame, COLLAPSE, 24, E.expoIn);
  const cardW = width * by({ wide: 0.098, square: 0.17, tall: 0.22 });
  const cardH = cardW / CARD_RATIO;

  // ── The mark ────────────────────────────────────────────────────────────
  const logoW = width * by({ wide: 0.34, square: 0.6, portrait: 0.66, tall: 0.72 });
  const logoH = (logoW / LOGO_VIEW.w) * LOGO_VIEW.h;
  const logoX = cx - logoW / 2;
  const logoY = cy - logoH / 2 - height * by({ wide: 0.035, square: 0.04, tall: 0.05 });

  // Convergence targets sampled from the actual letterform outlines, so the
  // particles are assembling the mark rather than gathering near it.
  const logoTargets = useMemo(() => {
    const scale = logoW / LOGO_VIEW.w;
    return sampleLogoPoints(by({ wide: 170, square: 140, tall: 120 })).map((p) => ({
      x: logoX + p.x * scale,
      y: logoY + p.y * scale,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoW, logoX, logoY]);

  // Inbound light streaks for the implosion.
  const streaks = useMemo(
    () =>
      field(by({ wide: 30, tall: 20 }), 'implode', (r) => ({
        a: r.between(0, Math.PI * 2),
        dist: r.between(0.5, 1.5),
        len: r.between(0.4, 1),
        delay: r.between(0, 0.35),
        color: r.pick([C.cyan, C.ice, C.violet] as const),
      })),
    [by],
  );

  const markHit = strike(frame, MARK, 16, 2);
  const endlineIn = ramp(frame, ENDLINE, 20, E.out);

  return (
    <AbsoluteFill>
      <div style={camStyle(camera)}>
        <Atmosphere
          intensity={0.42 + markHit * 0.3 + ramp(frame, MARK, 40, E.out) * 0.18}
          hue={-0.3 + ramp(frame, MARK, 30, E.out) * 0.5}
          floor
        />

        <DustField
          frame={frame + 4800}
          count={by({ wide: 80, tall: 58 })}
          intensity={0.45 + ramp(frame, MARK, 34, E.out) * 0.3}
          focus={800}
        />

        {/* ── 1. The room implodes ─────────────────────────────────────── */}
        {collapse < 0.995 ? (
          <div
            style={{
              position: 'absolute',
              left: cx,
              top: cy - height * 0.03,
              width: cardW,
              height: cardH,
              marginLeft: -cardW / 2,
              marginTop: -cardH / 2,
              transform: `scale(${1 - collapse}) rotate(${collapse * 22}deg)`,
              opacity: 1 - collapse,
              filter: `blur(${collapse * 18 * u}px)`,
            }}
          >
            <Card3D
              width={cardW}
              rotX={drift(frame, 0.0085, 2, 0.5)}
              rotY={-7 + drift(frame, 0.0105, 3.5, 2.2)}
              thickness={5 * u}
              sweep={0.85}
              halo={0.7}
            />
          </div>
        ) : null}

        {/* Inbound streaks — matter falling toward the point */}
        {streaks.map((s, i) => {
          const p = ramp(frame, COLLAPSE + s.delay * 16, 22, E.expoIn);
          if (p <= 0.001 || p >= 0.999) return null;
          const r = (1 - p) * s.dist * Math.min(width, height) * 0.8;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: cx + Math.cos(s.a) * r,
                top: cy + Math.sin(s.a) * r * 0.9,
                transform: `rotate(${(s.a * 180) / Math.PI}deg)`,
              }}
            >
              <LightStreak
                color={s.color}
                width={160 * u * s.len * (1 - p)}
                thickness={1.2 * u}
                intensity={0.55 * (1 - Math.pow(p, 3))}
              />
            </div>
          );
        })}

        {/* The singularity the room collapses into */}
        {frame > COLLAPSE && frame < MARK + 6 ? (
          <Glow
            color={C.ice}
            size={
              Math.max(6, width * 0.05 * collapse) *
              (1 + strike(frame, LOGO_START - 2, 10, 2) * 2.4)
            }
            intensity={collapse * 1.3}
            stretch={1 + ramp(frame, LOGO_START - 4, 12, E.expoOut) * 7}
            style={{ left: cx, top: cy - height * 0.03 }}
          />
        ) : null}

        {/* ── 2. Matter assembles the letterforms ──────────────────────── */}
        <Converge
          frame={frame}
          start={LOGO_START + 2}
          duration={22}
          targets={logoTargets}
          spread={width * 0.42}
          size={2.4 * u}
          color={C.ice}
          seed="mark"
          dissolveAfter={10}
        />

        {/* ── 3. The mark ──────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', left: logoX, top: logoY }}>
          <MaziLogo frame={frame} start={LOGO_START} width={logoW} />
        </div>

        <Shockwave frame={frame} at={MARK} duration={44} maxScale={5} color={C.ice} />
        <Flash frame={frame} at={MARK} decay={14} intensity={0.8} />

        {/* ── Endline ──────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: logoY + logoH + height * by({ wide: 0.075, square: 0.07, tall: 0.065 }),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20 * u,
          }}
        >
          <Rule
            progress={ramp(frame, ENDLINE - 4, 22, E.out)}
            width={logoW * 0.72}
            color={C.smoke}
          />
          <div
            style={{
              opacity: endlineIn,
              transform: `translateY(${(1 - endlineIn) * 12 * u}px)`,
            }}
          >
            <Mono
              size={by({ wide: 16, square: 17, tall: 16 }) * u}
              color={alpha(C.paper, 0.92)}
              tracking={by({ wide: 8.5, square: 7, tall: 5.5 }) * u}
              weight={400}
            >
              {COPY.endline}
            </Mono>
          </div>
        </div>

        <Vignette strength={1.0} />
      </div>
    </AbsoluteFill>
  );
};
