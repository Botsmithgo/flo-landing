import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Grain, LensFringe } from './components/Grain';
import { Origin } from './scenes/Origin';
import { Scan } from './scenes/Scan';
import { Search } from './scenes/Search';
import { Market } from './scenes/Market';
import { Manifesto } from './scenes/Manifesto';
import { Reveal } from './scenes/Reveal';
import { C } from './utils/colors';
import { FontsGate } from './utils/fonts';
import { SCENES } from './utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  M A Z I  —  brand film
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  01 ORIGIN     0:00–4:00   a line in the dark becomes an object
 *  02 SCAN       3:24–9:06   the machine reads it
 *  03 SEARCH     9:00–13:24  12,847 possibilities collapse to one
 *  04 MARKET    13:18–18:18  the object becomes a number
 *  05 MANIFESTO 18:12–22:12  stop. one card. one line.
 *  06 REVEAL    22:06–26:00  everything collapses into the mark
 *
 * Scenes overlap by ~6 frames so the outgoing image is still alive underneath
 * each transition. Grain and lens fringe are applied once, at film level —
 * they are properties of the *lens*, not of any scene.
 *
 * This component is format-agnostic. Every scene sizes itself through
 * useLayout()/useType(), so the same tree renders 16:9, 9:16, 1:1 and 4:5.
 */
export const MaziFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.void, overflow: 'hidden' }}>
    <FontsGate />

    <Sequence from={SCENES.origin.from} durationInFrames={SCENES.origin.duration} name="01 ORIGIN">
      <Origin />
    </Sequence>

    <Sequence from={SCENES.scan.from} durationInFrames={SCENES.scan.duration} name="02 SCAN">
      <Scan />
    </Sequence>

    <Sequence from={SCENES.search.from} durationInFrames={SCENES.search.duration} name="03 SEARCH">
      <Search />
    </Sequence>

    <Sequence from={SCENES.market.from} durationInFrames={SCENES.market.duration} name="04 MARKET">
      <Market />
    </Sequence>

    <Sequence
      from={SCENES.manifesto.from}
      durationInFrames={SCENES.manifesto.duration}
      name="05 MANIFESTO"
    >
      <Manifesto />
    </Sequence>

    <Sequence from={SCENES.reveal.from} durationInFrames={SCENES.reveal.duration} name="06 REVEAL">
      <Reveal />
    </Sequence>

    {/* The lens. Applied once, over everything. */}
    <LensFringe strength={0.85} />
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
