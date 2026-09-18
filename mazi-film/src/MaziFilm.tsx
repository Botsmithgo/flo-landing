import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { ASSETS, VO_GAIN, VO_LINES } from './assets';
import { FilmGrade } from './components/Grain';
import { Manifesto } from './scenes/Manifesto';
import { Market } from './scenes/Market';
import { Origin } from './scenes/Origin';
import { Reveal } from './scenes/Reveal';
import { Scan } from './scenes/Scan';
import { Search } from './scenes/Search';
import { C } from './utils/colors';
import { FontsGate } from './utils/fonts';
import { SCENES, real } from './utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  M A Z I  —  brand film
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  01 ORIGIN     0:00–4:00   a line in the dark becomes an object
 *  02 SCAN       3:24–9:06   the machine reads it
 *  03 SEARCH     9:00–13:24  nine million records collapse to one
 *  04 MARKET    13:18–18:18  the object becomes a number
 *  05 MANIFESTO 18:12–22:12  stop. one card. one line.
 *  06 REVEAL    22:06–26:00  everything collapses into the mark
 *
 * Scenes overlap by ~6 story frames so the outgoing image is still alive
 * underneath each transition.
 *
 * ── Two clocks ───────────────────────────────────────────────────────────────
 * The edit is authored at 30fps and rendered at 60. `SCENES` is in story
 * frames; `real()` converts at the <Sequence> boundary, which is the only place
 * in the film that needs to know the render fps. See utils/timing.ts.
 *
 * FilmGrade is applied once, at film level — grain and vignette are properties
 * of the *lens*, not of any scene. It is the house grade shared with the other
 * films in this workspace: frame-seeded grain over a deep vignette that closes
 * toward the brand surface rather than toward black.
 */
export const MaziFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.void, overflow: 'hidden' }}>
    <FontsGate />

    <Sequence
      from={real(SCENES.origin.from)}
      durationInFrames={real(SCENES.origin.duration)}
      name="01 ORIGIN"
    >
      <Origin />
    </Sequence>

    <Sequence
      from={real(SCENES.scan.from)}
      durationInFrames={real(SCENES.scan.duration)}
      name="02 SCAN"
    >
      <Scan />
    </Sequence>

    <Sequence
      from={real(SCENES.search.from)}
      durationInFrames={real(SCENES.search.duration)}
      name="03 SEARCH"
    >
      <Search />
    </Sequence>

    <Sequence
      from={real(SCENES.market.from)}
      durationInFrames={real(SCENES.market.duration)}
      name="04 MARKET"
    >
      <Market />
    </Sequence>

    <Sequence
      from={real(SCENES.manifesto.from)}
      durationInFrames={real(SCENES.manifesto.duration)}
      name="05 MANIFESTO"
    >
      <Manifesto />
    </Sequence>

    <Sequence
      from={real(SCENES.reveal.from)}
      durationInFrames={real(SCENES.reveal.duration)}
      name="06 REVEAL"
    >
      <Reveal />
    </Sequence>

    {/* The lens. Applied once, over everything. */}
    <FilmGrade grain={0.045} vignette={0.5} />

    {/*
      Narration — one <Audio> per line, each dropped at its own story frame.

      The alternative is one long take at a single offset, which is what the
      other films here do because there the picture is cut to the voice. This
      one was cut silent and works silent, so the voice fits the picture
      instead: six short files, six numbers, and no line can drag a beat.
    */}
    {ASSETS.narration
      ? VO_LINES.map((line) => (
          <Sequence key={line.file} from={real(line.at)} name={`VO · ${line.text.slice(0, 28)}…`}>
            <Audio src={staticFile(line.file)} volume={VO_GAIN} />
          </Sequence>
        ))
      : null}

    {ASSETS.score ? (
      <Sequence name="SCORE">
        <Audio src={staticFile(ASSETS.score)} volume={0.55} />
      </Sequence>
    ) : null}
  </AbsoluteFill>
);
