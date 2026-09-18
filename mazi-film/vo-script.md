# MAZI brand film — narration

**Voice:** ElevenLabs `Michael — Deep, Resonant` (`9zciqiv4AGFwYrkFwPIl`), British, model
`eleven_v3`. This is the same voice as the MAZI investor film, so the two pieces sound like one
company.

Silas (`5MzdXfNI3TSWsCPwZFrB`) was tried first and rejected: thinner, and the accent read wrong
for the film. Michael also reads ~35% faster at the same setting, which is why the lines below
sit comfortably where the first pass overran.

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
| 1 | ORIGIN | 0:00.6 | A card sells. Live. Then it's gone. |
| 2 | SCAN | 0:04.4 | Mahzee keeps the record. The player. The set. The grade. The price. |
| 3 | SEARCH | 0:09.9 | Millions of cards. It finds the one. |
| 4 | MARKET | 0:13.8 | Same card. Two hundred dollars, or two thousand. The grade decides. |
| 5 | MANIFESTO | 0:19.9 | Without a record, it's just a rumour. |
| 6 | REVEAL | 0:22.4 | Mahzee. See what you hold. |

50 words of speech across 26 seconds of film — 20.3 seconds of voice and 5.7 seconds of
deliberate silence. The silence is the point: the picture is doing the work, and every line is
short enough that the viewer finishes it in their head before the next one starts.

The arc is problem → capability → scale → proof → thesis → mark. Line 5 is the only line that
states MAZI's argument outright, and it is placed where the picture has stopped moving.

## Every claim, and where it comes from

Checked against the MAZIDEX product database on 2026-09-18. None of these are illustrative.

| Line | Claim | Source |
|---|---|---|
| 2 | reads player / set / grade live | the capture and identification pipeline's actual output fields |
| 2 | "keeps the record … player, set, grade, price" | the fields every trusted ledger row carries (`mirror_sales`: player, set_name, grade, sold_price) |
| 3 | "millions of cards" | `catalog_card` — 9,076,034 permanent global IDs. Spoken unpinned on purpose; the on-screen counter keeps the exact figure. |
| 4 | "two hundred dollars, or two thousand" | trusted sales of the 1996 Topps Kobe Bryant #138: PSA 8 at $200 (10 JUN, 29 JUL, `dashlive`) against $2,069 (30 JUL, `debutsports_`), $2,550 (14 JUN, grade 9.5) and $2,603 (12 AUG, PSA 10) |
| 4 | "the grade decides" | the same rows — the $200 sales are PSA 8, the $2,000+ sales are 9.5 and above |
| 5 | no claim | deliberate. The thesis line carries no number |

Line 1 carries no number, and line 5 carries no claim — both deliberate. The only numbers spoken
in the film are ones that resolve to a row.

## Regenerating

```bash
node scripts/make-vo.mjs          # needs ELEVENLABS_API_KEY in the environment
```

Writes `public/audio/vo-1.mp3` … `vo-6.mp3` and prints each measured duration. If a line's
duration changes enough to collide with the next beat, the script says so — adjust `VO_LINES[].at`
in `src/assets.ts`, which is the only place the placements live.
