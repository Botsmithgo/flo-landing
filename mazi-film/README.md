# MAZI — Brand Film

A 26-second futuristic brand film for **MAZI**, the live market record for
sports cards. Built in Remotion, narrated with ElevenLabs, rendered at 60fps to
16:9, 9:16, 1:1 and 4:5 from one source tree.

**The subject is a real record.** The card is `mazi:bk:1990-fleer:michael-jordan:26`
— a 1990 Fleer Michael Jordan, PSA 9 — and every figure on screen is that card's
actual row in the MAZIDEX product database: four verified sales, a last sale of
$85.00 on 20 July, and an Estimated Market Range of $71.50–$135.50. The records
flying past in the SEARCH beat are real catalog rows too. Nothing in the film is
illustrative.

> **Self-contained and portable.** This folder has its own `package.json` and
> depends on nothing outside itself — drop it into any repo, run `npm install`,
> and it works. It was authored inside the `flo-landing` repo only because that
> was the checkout available at the time; there are no imports, paths or config
> pointing at that project.

---

## Voice

```bash
export ELEVENLABS_API_KEY=...
node scripts/make-vo.mjs      # writes public/audio/vo-1..6.mp3
```

Six lines, one file each, placed at exact frames by `VO_LINES` in `src/assets.ts`.
The script measures every take and warns if a rewrite has grown long enough to
collide with the next beat. Copy, voice id and the source of every spoken number
are in [`vo-script.md`](vo-script.md).

## Run it

```bash
cd mazi-film
npm install
npm run studio          # Remotion Studio — scrub, tweak, re-render live
```

## Render it

```bash
npm run build           # 16:9  1920×1080 → out/mazi-16x9.mp4
npm run build:9x16      # 9:16  1080×1920
npm run build:1x1       # 1:1   1080×1080
npm run build:4x5       # 4:5   1080×1350
npm run typecheck
```

Single frame, for grading or a still:

```bash
npx remotion still MaziFilm16x9 out/frame.png --frame=703
```

---

## The film

| # | Scene | TC | What happens |
|---|---|---|---|
| 01 | **ORIGIN** | 0:00–4:00 | A hairline of light in near-darkness is, it turns out, a card seen edge-on from very far away. It rotates for two seconds. A scan wave crosses it and knocks a flare off the edge. Then it ignites and the camera is thrown at it, and **LOOK CLOSER** crosses the frame. |
| 02 | **SCAN** | 3:24–9:06 | The vision pipeline, staged: corner locks snap, the contour is traced by a travelling head, a plane sweeps the surface leaving feature points in its wake, a depth mesh flickers, and four metadata labels tether out and commit. Confidence resolves to 99.4%. The card detonates. |
| 03 | **SEARCH** | 9:00–13:24 | A flight through the record database. 12,847 → 3,106 → 412 → 27 → 3 → 1. The cloud physically compresses toward the camera axis on the same curve the counter steps on. Four frames of absolute silence, then **MATCH**. |
| 04 | **MARKET** | 13:18–18:18 | The object becomes a number. Matter peels off the card and assembles into the price history. Comparable sales stream in. **$4,850** lands, and amber enters the film. |
| 05 | **MANIFESTO** | 18:12–22:12 | Everything stops. One card, small, in a very large dark room, lit by a single shaft. **EVERY CARD HAS A SIGNAL** crosses the frame in two halves, behind the object. |
| 06 | **REVEAL** | 22:06–26:00 | The room implodes to a point. Surviving matter converges onto the letterforms. A bar of light crosses and paints the mark solid behind it. **MAZI** — *see what you hold*. |

Runtime 26:00 at 60fps (1,560 frames), authored at 30.

---

## Architecture

```
src/
├─ Root.tsx              4 compositions, one component
├─ MaziFilm.tsx          the edit: six <Sequence>s + the lens layers
├─ assets.ts             ★ everything replaceable: asset paths, card data, copy
│
├─ scenes/               one file per beat, each self-documenting its timeline
│  ├─ Origin.tsx  Scan.tsx  Search.tsx  Market.tsx  Manifesto.tsx  Reveal.tsx
│
├─ components/
│  ├─ Atmosphere.tsx     the room: graded wash, chromatic pools, haze, floor
│  ├─ CardFace.tsx       the card artwork — original, drawn entirely in SVG
│  ├─ Card3D.tsx         a physical card: thickness, back face, view-dependent specular
│  ├─ CardLattice.tsx    the database as a volume you fly through
│  ├─ Vision.tsx         corner locks, contour trace, scan plane, keypoints, labels, depth mesh
│  ├─ Market.tsx         price graph, comp ledger, valuation
│  ├─ MaziLogo.tsx       the wordmark as geometry + outline point-sampling
│  ├─ Typography.tsx     Kinetic, Scramble, Odometer, Mono, Rule
│  ├─ Particles.tsx      DustField, Sparks, Converge
│  ├─ MotionBlur.tsx     MotionTrail, DirectionalBlur, Smear
│  ├─ Glow.tsx           layered point glow + anamorphic streaks
│  ├─ Transitions.tsx    Flash, Shockwave, ChromaSplit
│  ├─ Chrome.tsx         viewfinder micro-type
│  └─ Grain.tsx          cinematic grain + lens fringe
│
└─ utils/
   ├─ timing.ts          ★ the whole timeline: scenes, impacts, counter steps, audio cues
   ├─ colors.ts          palette, gradients, alpha/mix helpers
   ├─ easing.ts          curve library, ramp/pulse/strike/spring helpers
   ├─ camera.ts          virtual camera, handheld float, impact shake
   ├─ depth.ts           pinhole model: z → scale, blur, opacity, parallax
   ├─ layout.ts          composition-aware sizing (useLayout / useType)
   ├─ random.ts          deterministic RNG — nothing uses Math.random()
   └─ fonts.ts           self-hosted Inter Tight + IBM Plex Mono
```

★ = the two files you'll actually want to edit.

---

## Design decisions worth knowing

**One timeline file.** `utils/timing.ts` owns every number that decides *when*.
Scenes never hardcode a global frame. Re-cutting the film is editing that file.

**One depth model.** Everything with a z — dust, records, layers — runs through
`utils/depth.ts`, so scale, blur, atmospheric opacity and parallax rate all
derive from the same number. That single sharing is what makes flat divs read as
space.

**Determinism is enforced.** Remotion renders frames in parallel across
processes, so `Math.random()` would make particles teleport between frames.
`utils/random.ts` provides seeded RNG and every particle system uses it.

**Motion blur is real.** `MotionTrail` accumulates sub-frame samples;
`DirectionalBlur` is an anisotropic SVG blur rotated into the direction of
travel. Fast movement without smear is the fastest way to look cheap.

**Two clocks.** The film is authored at 30fps and rendered at 60. Everything
creative is in *story frames*; `real()` converts only at the `<Sequence>`
boundary, and scenes read `useStoryFrame()`. So the whole edit was doubled in
temporal resolution without a single beat moving. Raising `RENDER_FPS` again
needs no other edit. Motion blur carries a global `BLUR_GAIN` because a 60fps
frame integrates half the time — without it, doubling the frame rate makes fast
motion *crisper per frame* and more strobe-like, not less.

**Three typographic voices, never mixed in one line.** Teko is the brand
speaking. Barlow is a person speaking. JetBrains Mono is the system speaking.
All three are the product's own faces. (Register weights as *ranges* — a face
declared as exactly `700` does not satisfy a request for `800`, and the family
silently falls out to the system grotesque.)

**Chroma is a tool, not wallpaper.** The palette is lifted verbatim from
`mazi-hq/mazi-status`: trust green `#46C878` is the machine — detection,
scanning, verification — and *nothing else in the film is that green*. Brand blue
`#7DA2FF` is the field. Gold `#D9B24A` is money, and only money. Surfaces are the
product's `--paper` and `--panel`.

**Fonts are self-hosted.** `public/fonts/` holds the woff2 files, loaded through
the CSS Font Loading API with `delayRender()`. No CDN call at render time, so
renders work offline, behind a proxy, and reproducibly in CI.

---

## Adapting to other aspect ratios

Nothing is re-implemented per format. Scenes ask `useLayout()` and `useType()`
for sizes:

```tsx
const { by, u, cx, cy } = useLayout();

const cardW = width * by({ wide: 0.235, square: 0.4, portrait: 0.44, tall: 0.5 });
const gap   = 24 * u;   // u === 1.0 on every canonical composition
```

`u` is a universal scale unit (min-dimension ÷ 1080), so `24 * u` is the same
optical size in all four formats. `by()` picks a value per format and falls back
sensibly, so you only override what actually needs to change.

Adding a format is adding a `<Composition>` in `Root.tsx`.

---

## Replacing the placeholder assets

Everything swappable is in **`src/assets.ts`**.

**What is real, and what is drawn.** The card's *identity and numbers* are real
— they are the product's own catalog and ledger, the same data a MAZI card page
publishes. The card's *artwork* is MAZI's own drawing: a silhouette and a court,
built in code. The 1990 Fleer card is named, not reproduced.

The only photographs in the film are the four in `ASSETS.vintage` — Ty Cobb,
Christy Mathewson, Cy Young, Walter Johnson — all pre-1929 and public domain in
the US, and graded down hard so they read as archive texture rather than as
hero images.

⚠️ There are modern athlete press photographs in the MAZI prototype's asset
folder. They are third-party editorial images, they are **not** cleared, and
they are deliberately not used here. If you want real modern card fronts in the
lattice, the clean source is Andy's per-slice export into the MAZIDEX bucket —
not the prototype placeholders.

| To replace | Do this |
|---|---|
| The card art | Point `ASSETS.cardFront` at a file in `public/`, then render an `<Img>` inside `CardFace` instead of the SVG. The 2.5:3.5 ratio is assumed throughout (`CARD_RATIO`). |
| The wordmark | Either set `ASSETS.wordmark`, or edit the polygon vertex arrays at the top of `MaziLogo.tsx` — they drive the paths *and* the particle convergence targets, so both stay in sync automatically. |
| Player / set / market figures | `CARD` and `MARKET` in `assets.ts`. `MARKET.series` is normalised 0–1; shape matters more than accuracy. |
| Copy | `COPY` in `assets.ts`. Six words carry the film — they're chosen, not written. |
| Score | Drop the mix in `public/`, set `ASSETS.score`, and add an `<Audio>` tag — see the last section of `audio-cues.md`. |

---

## Sound

The film was animated *to* `audio-cues.md`, not the other way round. Three
silences are structural: the 180ms duck after the ignition, the four frames of
digital silence before the match, and the space after the mark lands. If the mix
fills them in, the picture loses its dynamics.

`AUDIO_CUES` in `utils/timing.ts` is the machine-readable version of that sheet,
so a scored version can be conformed programmatically if the edit moves.

---

## Performance

CSS, SVG and DOM only — no WebGL. The heaviest passes are the layered blurs and
the record lattice; `Config.setChromiumOpenGlRenderer('angle')` in
`remotion.config.ts` matters a lot for those. Frame budget is kept sane by
culling records outside a size window and capping particle counts per format
(vertical formats draw ~30% fewer).

For faster iteration, render at half size:

```bash
npx remotion render MaziFilm16x9 out/preview.mp4 --scale=0.5 --concurrency=3
```
