# MAZI brand film — music + sound brief

**Landing cold:** prompts to paste into a music generator to score the 26-second
MAZI brand film, plus the exact frame map to cut the result against. The picture
is locked at 26.0s. The narration is already built and sits in the gaps below.

---

## 1 · The prompt

Paste this as-is. It is written for ElevenLabs Music / Suno / Udio, which all
take a plain-English style brief.

> Cinematic tech trailer score, 26 seconds, no vocals. Dark, expensive,
> restrained — Jóhann Jóhannsson scoring a Swiss watch advert, not a superhero
> trailer. Opens in near-silence: a low sub-bass drone around 40Hz and a single
> high metallic shimmer, almost nothing for three seconds. A filtered riser
> builds and resolves into one deep impact, then a beat of total silence. From
> there a cold mechanical pulse enters — dry muted ticks and soft servo
> textures at 90 BPM, precise and machine-like, no drums yet. It tightens into
> driving sixteenth-note percussion, filter opening, tension rising for four
> seconds, then cuts dead for a fraction of a second before the loudest hit in
> the piece. After that impact everything releases into a warm, slow analogue
> pad in a minor key — money, calm, certainty. The pad thins to almost nothing
> for the final stretch, leaving a single sustained low string. One last deep,
> clean hit at the end, with a long reverb tail that decays to silence. No
> melody, no chord progression, no build-drop EDM structure, no cymbal crashes,
> no orchestral brass, no vocal chops. Texture and dynamics only.

**Negative prompt**, if the tool takes one:

> vocals, singing, melody, EDM drop, dubstep, cymbal crash, orchestral brass,
> epic trailer horns, cheerful, major key, lo-fi hip hop, arpeggiated synth lead

**Reference coordinates** if the tool accepts artists: Jóhann Jóhannsson
(*Sicario*), Ben Salisbury & Geoff Barrow (*Ex Machina*), Mica Levi
(*Under the Skin*), Trent Reznor & Atticus Ross (*The Social Network*). The
target is the tension of *Sicario* at a tenth of the volume.

### If you get 26 seconds in one take

Ask for exactly 26 seconds. ElevenLabs Music takes a duration; Suno and Udio do
not, so generate 60–90 seconds and cut. The map in §2 is what to cut against.

### If the result is too busy

It will be. These tools default to "more". Re-prompt with *"sparser, quieter,
more space, fewer elements, let it breathe, almost ambient"* and generate again
before trying to fix it in the edit.

---

## 2 · The frame map

Every impact the picture is already playing. Cut the music so these land.

| Time | Frame (60fps) | What the picture does | What the music does |
|---|---|---|---|
| 0:00.0 | 0 | black, one mote of dust | room tone only, near silence |
| 0:02.75 | 165 | **IGNITE** — the card turns to face us | the riser resolves; deep impact |
| 0:02.95 | 177 | — | **duck everything ~180ms.** The silence is the point |
| 0:03.55 | 213 | camera slams forward | doppler whoosh, downward pitch bend |
| 0:04.3 | 258 | the scan begins | mechanical bed in: servo hum + 90 BPM ticks |
| 0:04.9 | 294 | corner locks snap | four dry clicks, 40ms apart, panned to corners |
| 0:08.85 | 531 | **DETONATE** — card becomes field | big transient + granular shatter |
| 0:09.3 | 558 | the flight through the index | driving sixteenths, dry |
| 0:12.45 | 747 | — | **cut ALL audio for 4 frames.** Absolute silence |
| 0:12.6 | 756 | **MATCH** | loudest moment in the film. Sub + metallic lock |
| 0:13.7 | 822 | the price history draws | warm pad enters, tension releases |
| 0:15.6 | 936 | **$85 lands** | round warm sub thud, not aggressive |
| 0:18.3 | 1098 | everything stops | drop to room tone + one sustained low string |
| 0:22.35 | 1341 | the room collapses to a point | reverse suck, pitch-rising |
| 0:23.43 | 1406 | **THE MARK** — MAZI is struck | deep, clean, single hit. Long tail |
| 0:24.4 | 1464 | endline | let the tail breathe to black. No button |

The machine-readable version of this table is `AUDIO_CUES` in
`src/utils/timing.ts` — it is the same data and the two must not drift.

---

## 3 · Three silences that are structural

The film was animated to these. A mix that fills them in takes the dynamics out
of the picture, and the cut stops working.

1. **0:02.95, ~180ms** after the ignition.
2. **0:12.45, 4 frames** before the match. Absolute digital silence.
3. **0:18.3 onward** — the manifesto beat is the quietest passage in the film by
   design. One line of narration, then nothing.

If the loudness meter is flat across 26 seconds, the mix has failed regardless
of how good the sounds are.

---

## 4 · Where the voice sits

Michael (ElevenLabs), six lines, already built into `public/audio/`:

| Line | In | Out |
|---|---|---|
| A card sells. Live. Then it's gone. | 0:00.6 | 0:03.4 |
| MAZI is watching. Player. Set. Grade. | 0:04.6 | 0:07.7 |
| Nine million cards. It finds the one. | 0:09.4 | 0:11.7 |
| Same grade. Fifty-eight dollars. Then one eighty-six. | 0:13.8 | 0:17.2 |
| Without a record, it's just a rumour. | 0:19.0 | 0:20.8 |
| MAZI. See what you hold. | 0:22.4 | 0:24.4 |

The music does not need to avoid these — `postmix.sh` sidechains the bed under
the voice automatically (§5). It *does* need to leave 0:11.7–0:13.8 loud, since
that stretch carries the match with no narration over it.

---

## 5 · Dropping the music in

```bash
cp your-track.mp3 public/audio/score.mp3
# set ASSETS.score = 'audio/score.mp3' in src/assets.ts
npm run build          # renders picture + voice + music
./postmix.sh           # sidechain duck, loudness master
```

`postmix.sh` ducks the bed ~7dB under the narration with a 20ms attack and
260ms release, then masters to −14 LUFS. Run `./postmix.sh --help` for the knobs.
