/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ASSET + DATA REGISTRY
 * ─────────────────────────────────────────────────────────────────────────────
 * Everything replaceable lives here. Swapping the placeholder card for a real
 * MAZI hero asset, or the fictional player for a licensed one, should not
 * require touching a single scene.
 *
 * The card in this film is ORIGINAL AND FICTIONAL. No real player, team,
 * league, manufacturer or photograph is referenced. The athlete is drawn as an
 * abstract silhouette in code (see components/CardFace.tsx) precisely so that
 * nothing copyrighted is involved. If you swap in real photography, clear the
 * rights first — this film is built to be shown publicly.
 */

/** Drop real files in `public/` and point these at them. Empty = draw in code. */
export const ASSETS = {
  /** e.g. 'card-hero.png' — a front-facing card render, transparent background. */
  cardFront: '' as string,
  /** e.g. 'card-back.png' */
  cardBack: '' as string,
  /** e.g. 'mazi-wordmark.svg'. Empty = use the drawn wordmark in MaziLogo.tsx. */
  wordmark: '' as string,
  /** Optional audio bed, e.g. 'mazi-score.wav'. See audio-cues.md. */
  score: '' as string,
} as const;

/** The subject of the film. Fictional. */
export const CARD = {
  player: 'K. ANSARI',
  firstName: 'KAI',
  position: 'GUARD',
  club: 'NORTHSIDE',
  year: '2019',
  set: 'MERIDIAN',
  variant: 'ULTRAVIOLET PARALLEL',
  serial: '07/25',
  printRun: 25,
  grade: 'PSA 10',
  /** Detection confidence the vision system reports. */
  confidence: 99.4,
  /** MAZI's internal record id — appears as micro-type throughout. */
  recordId: 'MZ-4417-K9',
} as const;

/** Market intelligence shown in the MARKET beat. Placeholder figures. */
export const MARKET = {
  value: 4850,
  currency: '$',
  changePct: 12.4,
  windowLabel: '90D',
  populationTotal: 25,
  populationGraded: 6,
  lastSale: 4850,
  lastSaleDate: '23 AUG',
  /** Comparable sales, newest last. Streams in as a ledger. */
  comps: [
    { date: '14 MAR', grade: 'PSA 10', price: 4120, venue: 'AUCTION' },
    { date: '02 APR', grade: 'PSA 10', price: 4480, venue: 'PRIVATE' },
    { date: '19 MAY', grade: 'PSA 9', price: 2960, venue: 'AUCTION' },
    { date: '08 JUL', grade: 'PSA 10', price: 4910, venue: 'AUCTION' },
    { date: '23 AUG', grade: 'PSA 10', price: 4850, venue: 'MARKETPLACE' },
  ],
  /**
   * Normalised price history, 0–1. Shape matters more than accuracy: a long
   * base, a shakeout, then a decisive run. Reads as a real asset, not a line
   * that goes up because lines in ads go up.
   */
  series: [
    0.18, 0.22, 0.19, 0.26, 0.24, 0.31, 0.29, 0.38, 0.34, 0.33, 0.45, 0.52, 0.48, 0.61, 0.58,
    0.72, 0.79, 0.74, 0.88, 1.0,
  ],
} as const;

/** Copy. Six words carry this entire film — they are chosen, not written. */
export const COPY = {
  /** Opens the film, hard-cut over the ignition. */
  open: 'LOOK CLOSER',
  /** The recognition beat's system voice. */
  scanning: 'OPTICAL MATCH',
  /** The emotional line. The one sentence the viewer should remember. */
  manifesto: ['EVERY CARD', 'HAS A SIGNAL'],
  /** Under the mark. */
  endline: 'SEE WHAT YOU HOLD',
  /** Micro-type / system chrome. */
  system: 'MAZI · OPTICAL INTELLIGENCE',
} as const;

/** Candidate names that flicker through the search field. All fictional. */
export const CANDIDATE_NAMES = [
  'R. OYELARAN',
  'K. ANSARI',
  'T. VOSS',
  'M. DELACROIX',
  'J. HARGROVE',
  'S. NAKAMURA',
  'D. ABIOLA',
  'L. PETROV',
  'C. MWANGI',
  'A. FONTAINE',
  'B. OKONKWO',
  'N. SOLBERG',
] as const;
