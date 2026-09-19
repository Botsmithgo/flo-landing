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
  /**
   * The hero is a PHOTOGRAPH of a real graded card — the same 1996 Topps Kobe
   * Bryant slab the MAZI investor film used. When this is set, CardFace draws
   * the photo instead of its SVG artwork and keeps only the foil sweep and
   * gloss over it, so the object still responds to the room's light.
   *
   * The grade and cert on the label are blurred in the source image on
   * purpose; see the note on CARD.grade.
   */
  cardFront: 'cards/kobe-slab-psa.png' as string,
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
   * See CARD_PHOTOS below — this list is kept only as the set of images that
   * are unambiguously public domain, for anywhere the film needs to be certain.
   */
  vintage: [
    'cards/vint-ty-cobb.jpg',
    'cards/vint-christy-mathewson.jpg',
    'cards/vint-cy-young.jpg',
    'cards/vint-walter-johnson.jpg',
  ] as readonly string[],
} as const;

/**
 * The card photographs that fly past in SEARCH.
 *
 * "Millions of cards" should look like cards people recognise, so this is
 * everything real the project actually has: modern Pokémon, the VeeFriends
 * card, the film's own Kobe slab raw and graded, and the pre-1929 tobacco-era
 * cards that give the field some age.
 *
 * `aspect` is each image's true width/height, measured, not assumed. A slab is
 * 0.596 and a raw card is ~0.71–0.73, and forcing them all into one box is the
 * difference between a field of cards and a field of cropped rectangles.
 *
 * `weight` biases the draw. Modern cards are weighted up because the beat is
 * about the market as it is now; the vintage ones are texture, not subject.
 *
 * ── Rights ───────────────────────────────────────────────────────────────────
 * The four `vint-` images are pre-1929 and public domain in the US. The Pokémon
 * renders and the VeeFriends card are third-party card artwork, used here at
 * lattice scale — small, fast and graded down — the same way the MAZI investor
 * film's watch page already uses this exact set. The slab photographs are of
 * the card the film is about. NOT used, and deliberately: the modern athlete
 * images in the prototype's asset folder, which are uncleared press photos of
 * players rather than photographs of cards.
 */
export type CardPhoto = { file: string; aspect: number; weight: number };

export const CARD_PHOTOS: readonly CardPhoto[] = [
  { file: 'cards/poke-charizard-151.png', aspect: 0.7164, weight: 3 },
  { file: 'cards/poke-umbreon-vmax.png', aspect: 0.7164, weight: 3 },
  { file: 'cards/poke-rayquaza-vmax.png', aspect: 0.7164, weight: 2 },
  { file: 'cards/poke-gengar-vmax.png', aspect: 0.7164, weight: 2 },
  { file: 'cards/poke-blastoise-base.png', aspect: 0.7273, weight: 2 },
  { file: 'cards/poke-pikachu-base.png', aspect: 0.7273, weight: 2 },
  { file: 'cards/garyvee-card.png', aspect: 0.6947, weight: 3 },
  { file: 'cards/kobe-slab-psa.png', aspect: 0.5965, weight: 2 },
  { file: 'cards/kobe-slab-raw.png', aspect: 0.5965, weight: 2 },
  { file: 'cards/vint-ty-cobb.jpg', aspect: 0.5577, weight: 1 },
  { file: 'cards/vint-christy-mathewson.jpg', aspect: 0.7425, weight: 1 },
  { file: 'cards/vint-cy-young.jpg', aspect: 0.5766, weight: 1 },
  { file: 'cards/vint-walter-johnson.jpg', aspect: 0.5656, weight: 1 },
];

/** Expanded by weight, so `pick` lands on modern cards more often. */
export const CARD_PHOTO_POOL: readonly CardPhoto[] = CARD_PHOTOS.flatMap((p) =>
  Array.from({ length: p.weight }, () => p),
);

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
  { at: s(4.4), file: 'audio/vo-2.mp3', text: 'MAZI keeps the record. The player. The set. The grade. The price.' },
  { at: s(9.9), file: 'audio/vo-3.mp3', text: 'Millions of cards. It finds the one.' },
  { at: s(13.8), file: 'audio/vo-4.mp3', text: 'Same card. Two hundred dollars, or two thousand. The grade decides.' },
  { at: s(19.9), file: 'audio/vo-5.mp3', text: "Without a record, it's just a rumour." },
  { at: s(22.4), file: 'audio/vo-6.mp3', text: 'MAZI. See what you hold.' },
];

/** Narration level. One number for the whole read — the lines are pre-matched. */
export const VO_GAIN = 1;

/**
 * The subject of the film. A real row in the MAZI trusted ledger.
 *
 *   source_key   identified_sweep::MC-20260730132954-p94312-0019-a30
 *   title        1996 TOPPS KOBE BRYANT · #138 · graded slab
 *   sale         $2,069.00 · 30 Jul 2026 · seller debutsports_ · Whatnot
 *   trust        TRUSTED (trust_bucket), confidence high
 *
 * This is the sale the MAZI investor film is built around, and the photograph
 * in `ASSETS.cardFront` is of this slab.
 *
 * ON THE GRADE. The ledger row reads PSA 10. The investor film's production
 * notes say the real sale was a 9, and blurred the label for that reason. The
 * two have not been reconciled, so this film does what the last one did: it
 * shows the card as GRADED and never prints the number. The market beat's
 * argument does not depend on it — see MARKET.
 */
export const CARD = {
  player: 'KOBE BRYANT',
  firstName: 'KOBE',
  position: 'GUARD',
  club: 'LOS ANGELES',
  jersey: '8',
  year: '1996',
  set: 'TOPPS',
  variant: 'ROOKIE',
  number: '#138',
  serial: '',
  printRun: 0,
  /** Deliberately not a number. See the note above. */
  grade: 'PSA · GRADED',
  category: 'BASKETBALL',
  /** Detection confidence the vision system reports. */
  confidence: 99.4,
  /** The ledger key. Appears as micro-type throughout. */
  recordId: 'identified_sweep::MC-20260730132954-p94312-0019-a30',
  /** Short form, for chrome where the full ID won't fit. */
  recordShort: 'MAZI · BK · 1996-TOPPS · 138',
} as const;

/**
 * Market intelligence shown in the MARKET beat. Real ledger figures.
 *
 * Five trusted sales of the 1996 Topps Kobe Bryant #138 inside ten weeks,
 * from the same ledger the hero row lives in (mirror_sales, trusted = true,
 * base set only — the Chrome and the Youthquake insert are different cards
 * and are left out):
 *
 *   10 JUN  PSA 8      $200    dashlive
 *   14 JUN  9.5        $2,550  boss_sports
 *   29 JUL  PSA 8      $200    dashlive
 *   30 JUL  graded     $2,069  debutsports_   ← the hero sale
 *   12 AUG  PSA 10     $2,603  dashlive
 *
 * That is the argument of the beat: the same card trades at $200 or at two
 * thousand, and the grade is the whole difference. It holds whether the hero
 * slab is a 9 or a 10 — a 9 at $2,069 between a 9.5 at $2,550 and a 10 at
 * $2,603 is exactly where a 9 should sit.
 */
export const MARKET = {
  /** The hero sale. */
  value: 2069,
  currency: '$',
  windowLabel: '90D',
  /**
   * No Estimated Market Range: this card has not resolved into the product
   * catalog yet (it is in the review lane), so there is no rung to compute one
   * on. The readout shows the observed spread instead, and says so.
   */
  rangeLow: 200,
  rangeHigh: 2603,
  rangeLabel: 'SPREAD',
  rangeSample: 5,
  lastSale: 2069,
  lastSaleDate: '30 JUL',
  lastSaleSeller: 'debutsports_',
  rungSales: 5,
  comps: [
    { date: '10 JUN', grade: 'PSA 8', price: 200, venue: 'WHATNOT', seller: 'dashlive' },
    { date: '14 JUN', grade: '9.5', price: 2550, venue: 'WHATNOT', seller: 'boss_sports' },
    { date: '29 JUL', grade: 'PSA 8', price: 200, venue: 'WHATNOT', seller: 'dashlive' },
    { date: '30 JUL', grade: 'GRADED', price: 2069, venue: 'WHATNOT', seller: 'debutsports_' },
    { date: '12 AUG', grade: 'PSA 10', price: 2603, venue: 'WHATNOT', seller: 'dashlive' },
  ],
  /** The top-grade sales — what the line plots. Three points, all real. */
  rungPrices: [2550, 2069, 2603],
  axisMax: 3000,
  /** 14 Jun → 30 Jul → 12 Aug over a 59-day window. */
  seriesX: [0, 0.78, 1],
  seriesSpan: '14 JUN – 12 AUG',
  /** rungPrices / axisMax. */
  series: [0.85, 0.69, 0.868],
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
  /** Under the endline. The site, and nothing else. */
  url: 'mazidex.com',
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
