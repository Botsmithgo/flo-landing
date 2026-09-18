import { s } from './utils/timing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ASSET + DATA REGISTRY
 * ─────────────────────────────────────────────────────────────────────────────
 * Everything replaceable lives here. Scenes never hardcode a name, a price or
 * a path.
 *
 * ── Every number in this file is real ────────────────────────────────────────
 * The subject of the film is an actual record in the MAZIDEX product database
 * (Supabase project `mazidex`), pulled 2026-09-18:
 *
 *   public_card_id   mazi:bk:1990-fleer:michael-jordan:26
 *   rung             PSA 9 — 4 verified sales
 *   last sale        $85.00 · 2026-07-20 · seller dashlive · venue Whatnot
 *   market range     $71.50 – $135.50 (IQR, verified only, 90-day window, n=3)
 *
 * The six sales listed in MARKET.comps are that card's real verified ledger,
 * sellers and all. The catalog figure in CANDIDATE_STEPS is the real size of
 * the MAZI catalog spine. Nothing here is illustrative.
 *
 * ── On artwork ───────────────────────────────────────────────────────────────
 * The hero is drawn as a MAZI *record* — the product's own presentation of a
 * catalog entry — not as a reproduction of the 1990 Fleer card. Naming a card
 * and printing its verified sale history is what the product does on every card
 * page; reproducing the printed artwork is a different thing and is not done
 * here. The only photographs in the film are the four pre-1929 cards in
 * `ASSETS.vintage`, which are public domain in the US.
 */

/** Drop real files in `public/` and point these at them. Empty = draw in code. */
export const ASSETS = {
  /** e.g. 'card-hero.png' — a front-facing card render, transparent background. */
  cardFront: '' as string,
  /** e.g. 'card-back.png' */
  cardBack: '' as string,
  /** e.g. 'mazi-wordmark.svg'. Empty = use the drawn wordmark in MaziLogo.tsx. */
  wordmark: '' as string,
  /**
   * Narration is per-line (see VO_LINES) rather than one take. Set this to
   * false to render the film silent without deleting the audio files.
   */
  narration: true,
  /**
   * The music bed. Left OUT of the Remotion render on purpose.
   *
   * Remotion can mix it, but it cannot sidechain — and the bed has to duck
   * under the narration, which needs the voice as a separate key signal. So the
   * render carries picture + voice, and postmix.sh adds the music with real
   * ducking and masters the result. See MUSIC-BRIEF.md §5.
   */
  score: '' as string,
  /** What postmix.sh picks up. Not read by the renderer. */
  scoreFile: 'public/audio/score.wav',
  /**
   * Real card photographs used in the SEARCH lattice.
   *
   * All four are pre-1929 tobacco-era and press material and are public domain
   * in the US — chosen deliberately so the one beat that uses photography can
   * ship anywhere without a rights conversation. They also earn their place:
   * a 1909 Ty Cobb tumbling through a machine-readable archive is the whole
   * idea of the company in one image.
   */
  vintage: [
    'cards/vint-ty-cobb.jpg',
    'cards/vint-christy-mathewson.jpg',
    'cards/vint-cy-young.jpg',
    'cards/vint-walter-johnson.jpg',
  ] as readonly string[],
} as const;

/**
 * Narration placement.
 *
 * The picture is locked and works silent; the voice fits it. So each line is
 * its own file dropped at an exact story frame, rather than one long take that
 * the edit would have to accommodate. Moving a line is changing one number
 * here — nothing in any scene knows the narration exists.
 *
 * Generate with `node scripts/make-vo.mjs`; the script reads these placements
 * back and warns if a re-recorded line has grown long enough to collide with
 * the next beat. Copy is in vo-script.md.
 */
export const VO_LINES: readonly { at: number; file: string; text: string }[] = [
  { at: s(0.6), file: 'audio/vo-1.mp3', text: "A card sells. Live. Then it's gone." },
  { at: s(4.6), file: 'audio/vo-2.mp3', text: "MAZI is watching. Player. Set. Grade." },
  { at: s(9.4), file: 'audio/vo-3.mp3', text: "Nine million cards. It finds the one." },
  { at: s(13.8), file: 'audio/vo-4.mp3', text: "Same grade. Fifty-eight dollars. Then one eighty-six." },
  { at: s(19.0), file: 'audio/vo-5.mp3', text: "Without a record, it's just a rumour." },
  { at: s(22.4), file: 'audio/vo-6.mp3', text: "MAZI. See what you hold." },
];

/** Narration level. One number for the whole read — the lines are pre-matched. */
export const VO_GAIN = 1;

/** The subject of the film. A real MAZIDEX record. */
export const CARD = {
  player: 'MICHAEL JORDAN',
  firstName: 'MICHAEL',
  position: 'GUARD',
  club: 'CHICAGO',
  /** Worn number. Real, and the fastest single cue that this is who it is. */
  jersey: '23',
  year: '1990',
  set: 'FLEER',
  variant: 'BASE',
  number: '#26',
  serial: '',
  printRun: 0,
  grade: 'PSA 9',
  category: 'BASKETBALL',
  /** Detection confidence the vision system reports. */
  confidence: 99.4,
  /** The permanent MAZI global ID. Appears as micro-type throughout. */
  recordId: 'mazi:bk:1990-fleer:michael-jordan:26',
  /** Short form, for chrome where the full ID won't fit. */
  recordShort: 'MAZI · BK · 1990-FLEER · 26',
} as const;

/** Market intelligence shown in the MARKET beat. Real ledger figures. */
export const MARKET = {
  /** Last verified sale on the PSA 9 rung. */
  value: 85,
  currency: '$',
  windowLabel: '90D',
  /** Estimated Market Range — the product never publishes a single "worth". */
  rangeLow: 71.5,
  rangeHigh: 135.5,
  rangeSample: 3,
  lastSale: 85,
  lastSaleDate: '20 JUL',
  lastSaleSeller: 'dashlive',
  rungSales: 4,
  /**
   * The card's real verified ledger, oldest first. Streams in as rows.
   *
   * Note what this actually shows: four PSA 9 sales inside six weeks at $63,
   * $58, $186 and $85. That spread is not noise to be smoothed away — it is the
   * argument for the whole product, and the film says so out loud rather than
   * drawing a tidy line that goes up.
   */
  comps: [
    { date: '03 JUN', grade: 'RAW', price: 38, venue: 'WHATNOT', seller: 'boss_sports' },
    { date: '11 JUN', grade: 'PSA 9', price: 63, venue: 'WHATNOT', seller: 'boss_sports' },
    { date: '18 JUN', grade: 'PSA 8', price: 340, venue: 'WHATNOT', seller: 'sacramentocards' },
    { date: '02 JUL', grade: 'PSA 9', price: 58, venue: 'WHATNOT', seller: 'blz_cards' },
    { date: '13 JUL', grade: 'PSA 9', price: 186, venue: 'WHATNOT', seller: 'dashlive' },
    { date: '20 JUL', grade: 'PSA 9', price: 85, venue: 'WHATNOT', seller: 'dashlive' },
  ],
  /** The PSA 9 rung only — what the range is actually computed from. */
  rungPrices: [63, 58, 186, 85],
  /** Top of the value axis. Everything normalised below divides by this. */
  axisMax: 200,
  /**
   * Where each plotted sale sits on the time axis, 0–1.
   *
   * The four PSA 9 sales are 11 Jun, 02 Jul, 13 Jul and 20 Jul — a long quiet
   * stretch, then three trades in eighteen days. Spacing them evenly threw that
   * away and made the line look like a four-step diagram; spacing them by the
   * dates they actually happened on is both truer and reads far more like a
   * price chart, because real ones are unevenly sampled.
   */
  seriesX: [0, 0.538, 0.821, 1],
  /** What the plotted rung actually covers — 11 Jun to 20 Jul 2026. */
  seriesSpan: '11 JUN – 20 JUL',
  /**
   * Normalised 0–1 plot of the PSA 9 rung against a $0–$200 axis. Real points,
   * in sale order. Deliberately not a smooth curve.
   */
  series: [0.315, 0.29, 0.93, 0.425],
} as const;

/** Copy. Six lines carry this entire film — they are chosen, not written. */
export const COPY = {
  /** Opens the film, hard-cut over the ignition. */
  open: 'LOOK CLOSER',
  /** The recognition beat's system voice. */
  scanning: 'OPTICAL MATCH',
  /** The emotional line. The one sentence the viewer should remember. */
  manifesto: ['NOTHING WORTH KEEPING', 'SHOULD GO UNRECORDED'],
  /** Under the mark. */
  endline: 'SEE WHAT YOU HOLD',
  /** Micro-type / system chrome. */
  system: 'MAZI · THE LIVE MARKET RECORD',
} as const;

/**
 * The SEARCH lattice population — real cards, real grades, real last-sale
 * prices, taken from the same database as the hero. Flying through a field of
 * genuine records rather than invented ones costs nothing and means the one
 * frame a viewer freezes on holds up.
 */
export type LatticeCard = {
  readonly name: string;
  readonly line: string;
  readonly grade: string;
  readonly price: number;
  readonly cat: 'BK' | 'FB' | 'BB' | 'SC';
};

export const LATTICE_CARDS: readonly LatticeCard[] = [
  { name: 'MICHAEL JORDAN', line: '1986 FLEER · 57', grade: 'BGS 9', price: 21100, cat: 'BK' },
  { name: 'TOM BRADY', line: '2015 FLAWLESS · 23', grade: 'BGS 9', price: 41161, cat: 'FB' },
  { name: 'SHOHEI OHTANI', line: '2018 TOPPS · 700', grade: 'BGS 10', price: 29251, cat: 'BB' },
  { name: 'VICTOR WEMBANYAMA', line: '2023 ONE AND ONE · 22', grade: 'PSA 10', price: 27955, cat: 'BK' },
  { name: 'TUA TAGOVAILOA', line: '2021 OBSIDIAN · CB-11', grade: 'PSA 9', price: 33000, cat: 'FB' },
  { name: 'LEBRON JAMES', line: '2003 TOPPS CHROME · 111', grade: 'PSA 9', price: 4901, cat: 'BK' },
  { name: 'MICKEY MANTLE', line: '1959 TOPPS · 10', grade: 'PSA 7', price: 3301, cat: 'BB' },
  { name: 'KOBE BRYANT', line: '2005 TOPPS CHROME · 40', grade: 'PSA 9', price: 1220, cat: 'BK' },
  { name: 'PATRICK MAHOMES II', line: '2017 OPTIC · 177', grade: 'PSA 10', price: 1330, cat: 'FB' },
  { name: 'LUKA DONCIC', line: '2023 ONE AND ONE · 25', grade: 'PSA 10', price: 2540, cat: 'BK' },
  { name: 'STEPHEN CURRY', line: '2020 OBSIDIAN · 29', grade: 'BGS 9', price: 2900, cat: 'BK' },
  { name: 'KEN GRIFFEY JR.', line: '1992 TOPPS · 50', grade: 'PSA 10', price: 1550, cat: 'BB' },
  { name: 'CRISTIANO RONALDO', line: '2018 DONRUSS · 9', grade: 'PSA 10', price: 1332, cat: 'SC' },
  { name: 'NEYMAR JR', line: '2025 PRIZM FIFA · 16', grade: 'PSA 10', price: 3953, cat: 'SC' },
  { name: 'AARON JUDGE', line: '2017 TOPPS · 287', grade: 'PSA 9', price: 1850, cat: 'BB' },
  { name: 'ANTHONY EDWARDS', line: '2020 PRIZM · 258', grade: 'PSA 9', price: 5000, cat: 'BK' },
  { name: 'JOSH ALLEN', line: '2021 KABOOM · K34', grade: 'PSA 10', price: 3700, cat: 'FB' },
  { name: 'BOB CLEMENTE', line: '1960 TOPPS · 326', grade: 'PSA 8', price: 1820, cat: 'BB' },
  { name: 'NIKOLA JOKIC', line: '2025 FINEST · H-5', grade: 'PSA 9', price: 1660, cat: 'BK' },
  { name: 'MIKE TROUT', line: '2019 MYTHICAL · M-1', grade: 'PSA 8', price: 1201, cat: 'BB' },
  { name: 'RYNE SANDBERG', line: '1983 TOPPS · 83', grade: 'PSA 10', price: 1990, cat: 'BB' },
  { name: 'MICHAEL JORDAN', line: '1994 FINEST · 331', grade: 'PSA 9', price: 3611, cat: 'BK' },
  { name: 'CAM SKATTEBO', line: '2025 DOWNTOWN · 19', grade: 'PSA 10', price: 8100, cat: 'FB' },
  { name: 'DREW BREES', line: '2025 PRIZM BLACK · 3', grade: 'PSA 10', price: 1330, cat: 'FB' },
];

/** Candidate names that flicker through the search field — all real records. */
export const CANDIDATE_NAMES = LATTICE_CARDS.map((c) => c.name).filter(
  (n, i, a) => a.indexOf(n) === i,
);
