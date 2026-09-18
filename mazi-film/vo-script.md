# MAZI brand film — narration

**Voice:** ElevenLabs `Silas — Deep & Cinematic` (`5MzdXfNI3TSWsCPwZFrB`), model `eleven_v3`.
The house alternative is `Michael` (`9zciqiv4AGFwYrkFwPIl`), the voice on the MAZI investor
film — swap the id in `scripts/make-vo.mjs` if the two films should sound like one another.

**Pronunciation:** MAZI is spoken *MAH-zee*. ElevenLabs reads the spelling `Mahzee` correctly and
reads `MAZI` as "mazzy", so the spoken layer below is deliberately not the written layer.

## The rule this script follows

**The picture is locked; the voice fits it.** The edit was cut silent and works silent. So each
line is generated as its own file and placed at an exact story frame, rather than recording one
long take and hoping the beats land. Nothing in the film moves to accommodate a syllable.

The second rule: **never narrate what is on screen.** The manifesto card already says NOTHING
WORTH KEEPING / SHOULD GO UNRECORDED. The voice says something adjacent instead, and then stops
talking so the line can land on its own.

## The lines

| # | Beat | In at | Spoken |
|---|---|---|---|
| 1 | ORIGIN | 0:00.6 | A card sells live, on camera. Seconds later, it's gone. |
| 2 | SCAN | 0:04.3 | Mahzee reads it as it happens. The player. The set. The grade. |
| 3 | SEARCH | 0:09.2 | Nine million cards in the index. One match. |
| 4 | MARKET | 0:13.7 | Four verified sales. Same card, same grade. Fifty-eight dollars. Then a hundred and eighty-six. |
| 5 | MANIFESTO | 0:18.7 | Without the record, you're guessing. |
| 6 | REVEAL | 0:22.7 | Mahzee. See what you hold. |

≈ 55 words over 26 seconds — about 127 words per minute, which is under conversational pace on
purpose. A brand film that talks at reading speed sounds like an explainer.

## Every claim, and where it comes from

Checked against the MAZIDEX product database on 2026-09-18. None of these are illustrative.

| Line | Claim | Source |
|---|---|---|
| 2 | reads player / set / grade live | the capture and identification pipeline's actual output fields |
| 3 | "nine million cards in the index" | `catalog_card` — the catalog spine, 9,076,034 permanent global IDs. Cards, not sales: the on-screen counter starts at the same number. |
| 4 | "four verified sales" | `card_rungs` for `mazi:bk:1990-fleer:michael-jordan:26`, rung PSA 9 → 4 sales |
| 4 | "$58 … then $186" | two of that rung's real verified sales — 02 JUL `blz_cards` $58, 13 JUL `dashlive` $186 |

Line 1 carries no number, and line 5 carries no claim — both deliberate. The only numbers spoken
in the film are ones that resolve to a row.

## Regenerating

```bash
node scripts/make-vo.mjs          # needs ELEVENLABS_API_KEY in the environment
```

Writes `public/audio/vo-1.mp3` … `vo-6.mp3` and prints each measured duration. If a line's
duration changes enough to collide with the next beat, the script says so — adjust `VO_LINES[].at`
in `src/assets.ts`, which is the only place the placements live.
