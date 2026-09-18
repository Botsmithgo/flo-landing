import { useCurrentFrame } from 'remotion';

/**
 * MAZI — the timeline.
 *
 * One file owns every number that decides *when*. Scenes never hardcode a
 * global frame; they read from here. Re-cutting the film is editing this file.
 *
 * ── Two clocks, and why ──────────────────────────────────────────────────────
 * The film is AUTHORED at 30fps and RENDERED at 60fps.
 *
 * Everything creative — scene bounds, impacts, counter steps, and every beat
 * constant inside a scene — is expressed in **story frames** at STORY_FPS. The
 * only place real frames exist is the `<Sequence>` props in MaziFilm.tsx and
 * the grain seed, both of which go through `real()`.
 *
 * Scenes call `useStoryFrame()` instead of `useCurrentFrame()`. At 60fps that
 * returns halves — 40.5, 41.0, 41.5 — and every interpolation in the film is
 * float-safe, so the same authored curve is simply sampled twice as densely.
 *
 * That is the whole 60fps story: no beat moved, no constant was retuned, and
 * fast motion now has twice the temporal resolution. Raising RENDER_FPS again
 * (to 120, say) needs no other edit in the repo.
 *
 * Rhythm intent:
 *   ORIGIN     hold ....... ignite ... IMPACT ... accelerate
 *   SCAN       fast, mechanical, clipped — the machine working
 *   SEARCH     violent compression, then a single hard lock
 *   MARKET     exhale, then a number lands
 *   MANIFESTO  slow. almost nothing moves. this is the emotional beat
 *   REVEAL     collapse → light draws the mark → still
 */

/** The clock the film is written in. Every constant below is in these frames. */
export const STORY_FPS = 30;

/** The clock it is rendered on. 60 buys smooth whips and clean fast motion. */
export const RENDER_FPS = 60;

/** Story frames → render frames. */
export const RATE = RENDER_FPS / STORY_FPS;

/** The composition fps. Named FPS because Remotion helpers expect that name. */
export const FPS = RENDER_FPS;

/** Seconds → story frames. Storyboards are written in seconds. */
export const s = (sec: number): number => Math.round(sec * STORY_FPS);

/** Story frames → real frames. Only <Sequence> and the grain seed need this. */
export const real = (storyFrames: number): number => Math.round(storyFrames * RATE);

type Scene = {
  readonly id: string;
  readonly from: number;
  readonly duration: number;
};

const scene = (id: string, fromSec: number, toSec: number): Scene => ({
  id,
  from: s(fromSec),
  duration: s(toSec) - s(fromSec),
});

/**
 * Scenes overlap by ~6 story frames so transitions cross-cut rather than
 * cut-to-black. The outgoing scene is still alive underneath the incoming whip.
 */
export const SCENES = {
  origin: scene('origin', 0.0, 4.0),
  scan: scene('scan', 3.8, 9.2),
  search: scene('search', 9.0, 13.8),
  market: scene('market', 13.6, 18.6),
  manifesto: scene('manifesto', 18.4, 22.4),
  reveal: scene('reveal', 22.2, 26.0),
} as const;

/** Story frames. */
export const TOTAL = s(26);

/** Real frames — what the <Composition> is given. */
export const TOTAL_REAL = real(TOTAL);

/**
 * Hard impacts — frames where the whole frame is allowed to be violent.
 * Shake, flash, chroma split and sub-bass all key off these.
 */
export const IMPACTS = {
  /** First strike. Darkness breaks. */
  ignite: s(2.75),
  /** Camera slams toward the card. */
  launch: s(3.55),
  /** Recognition locks — corners snap. */
  lock: s(4.9),
  /** The card detonates into the search field. Sits at the end of SCAN so the
   *  shatter happens in the outgoing scene and SEARCH resolves out of it. */
  detonate: s(8.85),
  /** MATCH. The loudest frame in the film. */
  match: s(12.6),
  /** Value resolves. */
  value: s(15.6),
  /** Collapse to a point before the mark. */
  collapse: s(22.35),
  /** The mark is struck — the frame the light finishes painting the wordmark. */
  mark: s(23.43),
} as const;

/**
 * Where the counter steps down during SEARCH (frame → candidates remaining).
 *
 * These are not invented numbers. 9,076,034 is the size of the MAZI catalog
 * spine — every card with a permanent global ID — and the ladder below is that
 * population narrowing by the attributes the vision pass actually reads:
 * sport, era, set, card number, grade. It ends at 1.
 */
export const CANDIDATE_STEPS: readonly { frame: number; value: number }[] = [
  { frame: s(9.3), value: 9076034 },
  { frame: s(10.25), value: 118402 },
  { frame: s(10.95), value: 3106 },
  { frame: s(11.6), value: 412 },
  { frame: s(12.1), value: 27 },
  // Lands ~9 frames before the match so "1" is readable as its own beat rather
  // than being stepped on by the impact.
  { frame: s(12.35), value: 1 },
];

/**
 * Sound-design map. Every entry is a frame the picture is *asking* for audio.
 * Mirrored in audio-cues.md — keep the two in sync.
 */
export type AudioCue = {
  readonly frame: number;
  readonly id: string;
  readonly kind: 'sub' | 'impact' | 'texture' | 'ui' | 'riser' | 'silence' | 'music' | 'vo';
  readonly note: string;
};

export const AUDIO_CUES: readonly AudioCue[] = [
  { frame: s(0.0), id: 'room-tone', kind: 'texture', note: 'Sub-40Hz room tone. Almost inaudible. Establishes physical space.' },
  { frame: s(1.2), id: 'first-mote', kind: 'texture', note: 'Single high granular tick as the first dust mote crosses the light.' },
  { frame: s(2.0), id: 'riser-in', kind: 'riser', note: 'Tonal riser begins, 0.75s, rising a minor 6th. Quiet — it should sneak up.' },
  { frame: s(2.75), id: 'ignite', kind: 'impact', note: 'IGNITE. Filtered white-noise strike + sub drop. The riser resolves here.' },
  { frame: s(2.95), id: 'post-ignite-silence', kind: 'silence', note: 'Duck everything ~180ms. The silence is the point.' },
  { frame: s(3.55), id: 'launch', kind: 'sub', note: 'Camera launch. Doppler whoosh with a downward pitch bend.' },
  { frame: s(4.3), id: 'scan-bed', kind: 'texture', note: 'Scanning bed starts: soft servo hum + 90bpm ticking pulse. Runs to 9.0s.' },
  { frame: s(4.9), id: 'corner-lock', kind: 'ui', note: 'Four dry mechanical clicks, 40ms apart, panned to the four corners.' },
  { frame: s(5.6), id: 'scan-sweep', kind: 'texture', note: 'Scan plane descends: filtered sine sweep 2kHz → 400Hz over 0.6s.' },
  { frame: s(6.4), id: 'labels', kind: 'ui', note: 'Four data labels commit: short typed clicks, staggered 4 frames apart.' },
  { frame: s(8.6), id: 'pre-detonate', kind: 'riser', note: 'Fast 0.25s reverse-cymbal riser into the detonation.' },
  { frame: s(8.85), id: 'detonate', kind: 'impact', note: 'DETONATE. Big transient + granular shatter. Card becomes field.' },
  { frame: s(9.3), id: 'search-bed', kind: 'music', note: 'Percussive search bed enters — 16ths, dry, driving. Runs to the match.' },
  { frame: s(10.25), id: 'step-1', kind: 'ui', note: 'Counter step. Pitched blip, +2 semitones each subsequent step.' },
  { frame: s(10.95), id: 'step-2', kind: 'ui', note: 'Counter step.' },
  { frame: s(11.6), id: 'step-3', kind: 'ui', note: 'Counter step. Bed starts filtering upward.' },
  { frame: s(12.1), id: 'step-4', kind: 'ui', note: 'Counter step → 27. Everything begins to compress.' },
  { frame: s(12.35), id: 'step-5', kind: 'ui', note: 'Counter step → 1. Highest pitch. The search is over.' },
  { frame: s(12.45), id: 'pre-match-silence', kind: 'silence', note: 'Cut ALL audio for 4 frames. Absolute silence before the match.' },
  { frame: s(12.6), id: 'match', kind: 'impact', note: 'MATCH. The loudest moment. Sub + metallic lock + short reverse tail.' },
  { frame: s(13.7), id: 'market-bed', kind: 'music', note: 'Warm low pad enters. Tension releases. Money feels calm.' },
  { frame: s(14.1), id: 'ledger', kind: 'ui', note: 'Comp rows stream in: soft data ticks, 3 frames apart, low velocity.' },
  { frame: s(15.6), id: 'value', kind: 'impact', note: 'Valuation lands. Warm sub thud — round, not aggressive. Gold = money.' },
  { frame: s(18.3), id: 'manifesto-void', kind: 'silence', note: 'Everything drops to the room tone + one sustained low string.' },
  { frame: s(19.4), id: 'signal-line', kind: 'texture', note: 'Headline crosses frame: one long airy swell, no transient.' },
  { frame: s(22.35), id: 'collapse', kind: 'sub', note: 'Reverse suck — pitch-rising whoosh collapsing to a point.' },
  { frame: s(23.43), id: 'mark', kind: 'impact', note: 'THE MARK. Deep, clean, single hit. Long tail. Nothing after it.' },
  { frame: s(23.9), id: 'endline', kind: 'texture', note: 'Endline rule draws: one hairline shimmer. Barely there.' },
  { frame: s(24.4), id: 'tail', kind: 'music', note: 'Let the reverb tail breathe to black. No button, no stinger.' },
];

/** Frames since a scene started. Scenes receive global frames from Sequence-local time. */
export const local = (frame: number, from: number): number => frame - from;

/**
 * The clock every scene should read.
 *
 * Returns the current frame expressed in STORY frames, so a scene authored
 * against "local frames @30fps" keeps working verbatim at any render fps. At
 * 60fps this yields halves (40, 40.5, 41 …) and that is the point: identical
 * curve, twice the samples.
 *
 * Use `useCurrentFrame()` directly ONLY for things that are properties of the
 * render rather than the story — the grain seed is the one real example.
 */
export const useStoryFrame = (): number => useCurrentFrame() / RATE;
