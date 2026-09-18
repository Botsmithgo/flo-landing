import { useEffect, useRef, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

/**
 * Typefaces, self-hosted.
 *
 * Deliberately NOT @remotion/google-fonts. A render that reaches out to a CDN
 * is a render that can fail — on a locked-down CI box, behind a proxy with its
 * own CA, or on a plane. The files live in public/fonts and are loaded through
 * the CSS Font Loading API, so renders are offline and reproducible.
 *
 * Two voices, and the rule is absolute:
 *   Inter Tight   — the brand speaking. Display, uppercase, tight tracking.
 *   IBM Plex Mono — the system speaking. Every readout, label and number.
 *
 * Inter Tight ships as a single variable file covering 100–900, so one
 * download serves all five weights the film uses.
 *
 * NOTE ON delayRender: the hold MUST be taken inside the component tree, not at
 * module scope. Remotion evaluates the bundle once to read compositions and
 * then navigates the page; a handle opened during module evaluation is orphaned
 * by that navigation and the render dies on a delayRender timeout. Asking for
 * the hold inside <FontsGate> ties its lifetime to the tree that needs it.
 */

type Face = {
  family: string;
  file: string;
  weight: string;
};

const FACES: Face[] = [
  { family: 'Inter Tight', file: 'fonts/InterTight-latin.woff2', weight: '100 900' },
  { family: 'IBM Plex Mono', file: 'fonts/IBMPlexMono-400-latin.woff2', weight: '400' },
  { family: 'IBM Plex Mono', file: 'fonts/IBMPlexMono-500-latin.woff2', weight: '500' },
  { family: 'IBM Plex Mono', file: 'fonts/IBMPlexMono-600-latin.woff2', weight: '600' },
];

let loading: Promise<void> | null = null;

/** Idempotent — every frame's tree can call this; the work happens once. */
export const loadFaces = (): Promise<void> => {
  if (loading) return loading;
  if (typeof document === 'undefined' || typeof FontFace === 'undefined') {
    loading = Promise.resolve();
    return loading;
  }

  loading = Promise.all(
    FACES.map(async (face) => {
      const ff = new FontFace(face.family, `url(${staticFile(face.file)}) format('woff2')`, {
        weight: face.weight,
        style: 'normal',
        display: 'block',
      });
      document.fonts.add(await ff.load());
    }),
  ).then(() => undefined);

  return loading;
};

/**
 * Holds the frame until the glyphs exist. A failed load releases the hold
 * anyway — the film falls back to the system stack declared in FONT
 * (utils/colors.ts) rather than taking the whole render down.
 */
export const FontsGate: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading MAZI typefaces'));
  const released = useRef(false);

  useEffect(() => {
    const release = () => {
      if (released.current) return;
      released.current = true;
      continueRender(handle);
    };
    loadFaces().then(release).catch(release);
    return release;
  }, [handle]);

  return null;
};
