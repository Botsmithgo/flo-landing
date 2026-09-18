# MAZI — Audio Cue Sheet

Picture is locked to 30fps / 26:00 (780 frames). Every cue below corresponds to
an entry in `src/utils/timing.ts › AUDIO_CUES`, which is the machine-readable
source of truth — if you move a cue here, move it there too.

The film was animated *to* this sheet, not the other way round. Several beats
only work with the sound: the 180ms duck after the ignition, and the four
frames of absolute silence before the match, are structural. If the mix fills
them in, the picture loses its dynamics.

**Format:** `TC (frame) — ID — kind` then the intent.

---

## Overall shape

```
 0:00 ─────────── 2:22 ══════ 3:16 ═══════════════ 9:00 ████████ 12:18 ▓▓▓▓▓ 18:12 ──────── 22:10 ████ 26:00
 room tone        IGNITE      scanning bed         search bed    MATCH       release         collapse  MARK
 (near silence)   impact      mechanical, 90bpm    driving 16ths loudest     warm pad        reverse   single hit
```

Dynamic intent: the film should be genuinely quiet for the first 2.5 seconds
and genuinely quiet again from 18:12. If the loudness meter is flat across 26
seconds, the mix has failed regardless of how good the sounds are.

**Reference LUFS targets** (short-term):
| Section | Target |
|---|---|
| 0:00–2:20 open | −34 to −28 |
| 2:22 ignite | peak transient, −6 TP ceiling |
| 3:16–9:00 scan | −20 |
| 9:00–12:15 search | −16, rising |
| 12:15–12:18 pre-match | digital silence |
| 12:18 match | loudest moment in the film |
| 13:21–18:12 market | −19, warm |
| 18:12–22:10 manifesto | −26 |
| 22:10–23:13 collapse/mark | −14 on the hit |
| 23:13–26:00 tail | decaying to −30 |

---

## 01 · ORIGIN — 0:00–4:00

| TC | Frame | ID | Kind | Direction |
|---|---|---|---|---|
| 0:00 | 0 | `room-tone` | texture | Sub-40Hz room tone, barely audible. It establishes that the darkness is a *place*. Should be felt in the chest, not heard. |
| 0:04 | 36 | `first-mote` | texture | One high granular tick as the first dust mote crosses the key light. Panned slightly left. This is the film's first "event" and it should be tiny. |
| 0:20 | 60 | `riser-in` | riser | Tonal riser begins. ~0.75s, rising a minor 6th, heavily filtered. It must sneak up — if the viewer notices it starting, it's too loud. |
| **2:22** | **82** | **`ignite`** | **impact** | **IGNITE.** Filtered white-noise strike + sub drop. The riser resolves here. This is the first real sound in the film and it should be startling relative to everything before it. |
| 2:25 | 85 | `post-ignite-silence` | silence | Duck everything ~180ms. Reverb tail only. The picture is bright and moving; the silence is what makes it read as an impact rather than a transition. |
| 3:16 | 106 | `launch` | sub | Camera launch. Doppler whoosh with a downward pitch bend, tail continuing across the cut into SCAN. |

## 02 · SCAN — 3:24–9:06

| TC | Frame | ID | Kind | Direction |
|---|---|---|---|---|
| 4:09 | 129 | `scan-bed` | texture | Scanning bed enters: soft servo hum + a dry 90bpm tick. Runs until the detonation. It should feel like a machine that was already running before we arrived. |
| **4:27** | **147** | **`corner-lock`** | **ui** | Four dry mechanical clicks, ~40ms apart, panned hard to the four corners in the order top-left → top-right → bottom-right → bottom-left, matching the bracket stagger. |
| 5:18 | 168 | `scan-sweep` | texture | Scan plane descends. Filtered sine sweep 2kHz → 400Hz over 0.6s. Second (upward) pass at frame 190 reverses the sweep. |
| 6:12 | 192 | `labels` | ui | Four data labels commit. Short typed clicks staggered 7 frames apart (frames 192/199/206/213), each with a tiny pitched confirmation tone. |
| 7:14 | 224 | `confidence` | ui | Confidence bar fills. A rising filtered tone, resolving as it reaches 99.4%. |
| 8:18 | 258 | `pre-detonate` | riser | Fast 0.25s reverse-cymbal riser into the detonation. |
| **8:25** | **265** | **`detonate`** | **impact** | **DETONATE.** Big transient plus a granular shatter — think glass and data, not explosion. The card stops being an object. |

## 03 · SEARCH — 9:00–13:24

| TC | Frame | ID | Kind | Direction |
|---|---|---|---|---|
| 9:09 | 279 | `search-bed` | music | Percussive search bed enters: dry 16ths, driving, no reverb. Runs to the match. |
| 10:07 | 307 | `step-1` | ui | Counter step 12,847 → 3,106. Pitched blip. |
| 10:28 | 328 | `step-2` | ui | Counter step → 412. Same blip, +2 semitones. |
| 11:18 | 348 | `step-3` | ui | Counter step → 27. +4 semitones. Bed begins filtering upward. |
| 12:03 | 363 | `step-4` | ui | Counter step → 3. +6 semitones. Everything starts to compress. |
| **12:13** | **373** | **`pre-match-silence`** | **silence** | **Cut ALL audio for 4 frames.** Not a fade — a hard cut to digital silence. This is the single most important audio decision in the film. |
| **12:18** | **378** | **`match`** | **impact** | **MATCH.** The loudest moment. Sub + metallic lock + a short reverse tail that sucks backwards into the hit. |

## 04 · MARKET — 13:18–18:18

| TC | Frame | ID | Kind | Direction |
|---|---|---|---|---|
| 13:21 | 411 | `market-bed` | music | Warm low pad enters. Tension releases. Money should feel calm and certain, never urgent — urgency here would read as a sales pitch. |
| 14:03 | 423 | `ledger` | ui | Comp rows stream in. Soft data ticks 3 frames apart, low velocity, panned progressively right. |
| **15:18** | **468** | **`value`** | **impact** | **VALUE.** The valuation lands. A warm, round sub thud — not aggressive. Amber is entering the film; the sound should be the same temperature as the colour. |

## 05 · MANIFESTO — 18:12–22:12

| TC | Frame | ID | Kind | Direction |
|---|---|---|---|---|
| 18:09 | 549 | `manifesto-void` | silence | Everything drops away to room tone plus one sustained low string. The floor falls out of the mix. |
| 19:12 | 582 | `signal-line` | texture | The headline crosses frame. One long airy swell with no transient — the words should arrive without being announced. |

## 06 · REVEAL — 22:06–26:00

| TC | Frame | ID | Kind | Direction |
|---|---|---|---|---|
| **22:10** | **671** | **`collapse`** | **sub** | Reverse suck. A pitch-rising whoosh collapsing to a point, plus the room's reverb inverting. |
| **23:13** | **703** | **`mark`** | **impact** | **THE MARK.** Deep, clean, single hit landing on the frame the light finishes painting the wordmark. Long tail. Nothing may play over it. |
| 23:27 | 717 | `endline` | texture | The hairline rule draws. One barely-there shimmer. If it's audible on laptop speakers it's too loud. |
| 24:12 | 732 | `tail` | music | Let the reverb tail breathe out to black. **No button, no stinger, no logo whoosh.** The film ends by stopping. |

---

## Notes for the composer

1. **The palette is narrow on purpose.** Sub-bass, filtered noise, dry mechanical
   clicks, and one sustained tonal element. No drums beyond the search bed's
   16ths, no risers except the two marked, no vocal textures.
2. **Cyan = the machine, so UI sounds are dry and close.** No reverb on clicks,
   locks or data ticks — they happen on the lens, not in the room. Everything
   else (impacts, pads, the mark) sits in a large, dark space.
3. **Three silences carry the film**: 2:25, 12:13, and the space after 23:13.
   Protect all three from bed material and from reverb tails that overrun.
4. **Do not sound-design the dust.** It's texture, not events. One tick at 0:04,
   then nothing.
5. **Impacts are marked in code.** `IMPACTS` in `src/utils/timing.ts` carries the
   same six frames the picture shakes on, so a scored version can be conformed
   programmatically if the edit moves.

## Wiring a score in

Drop the mixed file at `public/` and point `ASSETS.score` in `src/assets.ts` at
it, then add to `src/MaziFilm.tsx`:

```tsx
import { Audio, staticFile } from 'remotion';
import { ASSETS } from './assets';

// inside <MaziFilm>, above the lens layers:
{ASSETS.score ? <Audio src={staticFile(ASSETS.score)} /> : null}
```

Render with `npm run build` — Remotion muxes the audio automatically.
