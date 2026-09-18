import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CARD, COPY } from '../assets';
import { C, alpha } from '../utils/colors';
import { E, ramp } from '../utils/easing';
import { useLayout } from '../utils/layout';
import { FPS } from '../utils/timing';
import { Mono } from './Typography';

/**
 * VIEWFINDER CHROME.
 *
 * A continuous, almost-subliminal layer of system micro-type in the corners.
 * It does three jobs:
 *
 *   1. Frames the image, so compositions have edges to sit against.
 *   2. Tells the viewer, without a word of VO, that they are looking *through*
 *      something — they're inside MAZI, not watching an ad about it.
 *   3. Carries the running stage label, which is the only "explanation" the
 *      film gives: CAPTURE → MATCH → VALUE.
 *
 * Kept at ~9–11px and low contrast on purpose. If a viewer consciously reads
 * it, it's too loud.
 */

type Props = {
  frame: number;
  /** Global frame, for the timecode. */
  globalFrame: number;
  stage?: string;
  stageIndex?: number;
  opacity?: number;
  /** Adds a centre reticle. Only during the capture/scan beat. */
  reticle?: boolean;
};

export const Chrome: React.FC<Props> = ({
  frame,
  globalFrame,
  stage,
  stageIndex,
  opacity = 1,
  reticle = false,
}) => {
  const { pad, u, width, height } = useLayout();
  const inP = ramp(frame, 0, 14, E.out) * opacity;
  if (inP <= 0.01) return null;

  const tc = `${String(Math.floor(globalFrame / FPS)).padStart(2, '0')}:${String(
    globalFrame % FPS,
  ).padStart(2, '0')}`;

  const tick = 14 * u;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: inP }}>
      {/* Corner ticks — a frame within the frame */}
      {[
        [pad, pad, 1, 1],
        [width - pad, pad, -1, 1],
        [width - pad, height - pad, -1, -1],
        [pad, height - pad, 1, -1],
      ].map(([x, y, sx, sy], i) => (
        <svg
          key={i}
          style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}
          width={1}
          height={1}
        >
          <path
            d={`M0 ${tick * sy} L0 0 L${tick * sx} 0`}
            fill="none"
            stroke={alpha(C.smoke, 0.75)}
            strokeWidth={1}
          />
        </svg>
      ))}

      <div
        style={{
          position: 'absolute',
          left: pad + 22 * u,
          top: pad - 6 * u,
          display: 'flex',
          alignItems: 'center',
          gap: 9 * u,
        }}
      >
        <span
          style={{
            width: 5 * u,
            height: 5 * u,
            background: C.trust,
            borderRadius: '50%',
            opacity: 0.45 + 0.55 * Math.abs(Math.sin(globalFrame * 0.11)),
            boxShadow: `0 0 ${7 * u}px ${C.trust}`,
          }}
        />
        <Mono size={10 * u} color={alpha(C.muted, 0.95)} tracking={3.4 * u}>
          {COPY.system}
        </Mono>
      </div>

      <div style={{ position: 'absolute', right: pad + 22 * u, top: pad - 6 * u }}>
        <Mono size={10 * u} color={alpha(C.faint, 1)} tracking={3 * u}>
          T {tc}
        </Mono>
      </div>

      <div
        style={{
          position: 'absolute',
          left: pad + 22 * u,
          bottom: pad - 8 * u,
          display: 'flex',
          alignItems: 'center',
          gap: 10 * u,
        }}
      >
        {stageIndex !== undefined ? (
          <Mono size={10 * u} color={alpha(C.trust, 0.85)} tracking={2 * u}>
            {String(stageIndex).padStart(2, '0')}
          </Mono>
        ) : null}
        {stage ? (
          <>
            <span style={{ width: 16 * u, height: 1, background: alpha(C.smoke, 0.8) }} />
            <Mono size={10 * u} color={alpha(C.muted, 0.95)} tracking={3.4 * u}>
              {stage}
            </Mono>
          </>
        ) : null}
      </div>

      <div style={{ position: 'absolute', right: pad + 22 * u, bottom: pad - 8 * u }}>
        <Mono size={10 * u} color={alpha(C.faint, 1)} tracking={2.6 * u}>
          {CARD.recordId}
        </Mono>
      </div>

      {reticle ? (
        <svg
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            overflow: 'visible',
            opacity: 0.5,
          }}
          width={1}
          height={1}
        >
          <g stroke={alpha(C.trust, 0.55)} strokeWidth={1}>
            <path d={`M${-28 * u} 0 L${-9 * u} 0 M${9 * u} 0 L${28 * u} 0`} />
            <path d={`M0 ${-28 * u} L0 ${-9 * u} M0 ${9 * u} L0 ${28 * u}`} />
          </g>
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
