import React from 'react';
import { Composition, Folder } from 'remotion';
import { MaziFilm } from './MaziFilm';
import { FPS, TOTAL_REAL } from './utils/timing';

/**
 * Compositions.
 *
 * One film, four frames. Nothing is re-implemented per format — every scene
 * derives its sizes from useLayout()/useType(), so adding a format is adding
 * a <Composition>, not a rewrite.
 *
 *   16:9  master / YouTube / site hero
 *   9:16  TikTok, Reels, Shorts
 *   1:1   feed
 *   4:5   feed (taller, higher engagement on IG)
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="MAZI">
      <Composition
        id="MaziFilm16x9"
        component={MaziFilm}
        durationInFrames={TOTAL_REAL}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="MaziFilm9x16"
        component={MaziFilm}
        durationInFrames={TOTAL_REAL}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="MaziFilm1x1"
        component={MaziFilm}
        durationInFrames={TOTAL_REAL}
        fps={FPS}
        width={1080}
        height={1080}
      />
      <Composition
        id="MaziFilm4x5"
        component={MaziFilm}
        durationInFrames={TOTAL_REAL}
        fps={FPS}
        width={1080}
        height={1350}
      />
    </Folder>
  </>
);
