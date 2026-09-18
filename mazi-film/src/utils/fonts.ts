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
 * Three voices, taken straight from the MAZIDEX product so the film and the app
 * read as one brand. The rule is absolute:
 *
 *   Teko           — the brand speaking. Display, uppercase, condensed, tall.
 *   Barlow         — a person speaking. Sentences, endlines, human copy.
 *   JetBrains Mono — the system speaking. Every readout, label, ID and number.
 *
 * Never mix two voices inside one line.
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

/**
 * Weight descriptors are RANGES, not single values, and the top face claims
 * everything above it.
 *
 * This matters more than it looks. Teko tops out at 700; the film asks for 800
 * in places. A face registered as exactly '700' does not match a request for
 * 800, so the browser silently drops to the system grotesque — which is how a
 * film that had already switched to the brand typeface kept rendering in the
 * wrong one. Claiming '700 900' makes the heaviest cut absorb every heavy
 * request instead of falling out of the family.
 */
const FACES: Face[] = [
  { family: 'Teko', file: 'fonts/Teko-500.woff2', weight: '100 500' },
  { family: 'Teko', file: 'fonts/Teko-600.woff2', weight: '600' },
  { family: 'Teko', file: 'fonts/Teko-700.woff2', weight: '700 900' },
  { family: 'Barlow', file: 'fonts/Barlow-400.woff2', weight: '100 400' },
  { family: 'Barlow', file: 'fonts/Barlow-500.woff2', weight: '500' },
  { family: 'Barlow', file: 'fonts/Barlow-600.woff2', weight: '600 900' },
  { family: 'JetBrains Mono', file: 'fonts/JetBrainsMono-400.woff2', weight: '100 400' },
  { family: 'JetBrains Mono', file: 'fonts/JetBrainsMono-500.woff2', weight: '500 600' },
  { family: 'JetBrains Mono', file: 'fonts/JetBrainsMono-700.woff2', weight: '700 900' },
];

let loading: Promise<void> | null = null;

/** Idempotent — every frame's tree can call this; the work happens once. */
export const loadFaces = (): Promise<void> => {
  if (loading) return loading;
  if (typeof document === 'undefined' || typeof FontFace === 'undefined') {
    loading = Promise.resolve();
    return loading;
  }

  /**
   * Every face is loaded independently and failures are isolated.
   *
   * This used to be a Promise.all, which meant a single unloadable face
   * rejected the whole batch — and because the gate below releases the frame on
   * error, the film would then render in the system grotesque with every brand
   * typeface silently missing. One bad file should cost one typeface, not all
   * of them, and it should say so in the render log rather than looking like a
   * design choice.
   */
  loading = Promise.allSettled(
    FACES.map(async (face) => {
      const ff = new FontFace(face.family, `url(${staticFile(face.file)}) format('woff2')`, {
        weight: face.weight,
        style: 'normal',
        display: 'block',
      });
      document.fonts.add(await ff.load());
      return face;
    }),
  ).then((results) => {
    results.forEach((res, i) => {
      if (res.status === 'rejected') {
        // eslint-disable-next-line no-console
        console.warn(
          `[MAZI fonts] ${FACES[i].family} ${FACES[i].weight} failed to load from ${FACES[i].file} — falling back. ${res.reason}`,
        );
      }
    });
  });

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
