#!/usr/bin/env bash
#
# MAZI brand film — final mix.
#
#   ./postmix.sh [--score public/audio/score.mp3] [--in out/mazi-16x9.mp4]
#                [--out out/MAZI-BRAND-FILM.mp4] [--duck 7] [--lufs -14]
#
# Takes the rendered picture, rebuilds the narration stem from its parts, ducks
# the music under the voice with a real sidechain compressor, masters the result
# and muxes it back onto the video.
#
# ── Why the audio is rebuilt rather than reused ──────────────────────────────
# The render already carries the voice, but baked together with nothing to key
# off. Ducking needs the narration as its OWN signal — the sidechain key — so
# the mix is assembled from the stems and REPLACES the render's audio track
# wholesale. The video stream is copied, never re-encoded, so running this costs
# seconds and loses no quality.
#
# Placements are read from src/assets.ts, so the mix cannot drift from the film.

set -euo pipefail
cd "$(dirname "$0")"

SCORE="public/audio/score.wav"
IN="out/mazi-16x9.mp4"
OUT="out/MAZI-BRAND-FILM.mp4"
DUCK=9          # dB the bed drops under the voice
LUFS=-14        # integrated target for the master
DUR=26
# The ignition strike is OFF by default. It is a filtered noise burst — a
# whoosh — and Youssef cut it on review (2026-09-18): the card arriving should
# be carried by the bed fading in, not announced. The file is still built and
# `--ignite 0.6` brings it back. The match and mark hits stay.
IGNITE_GAIN=0

# ── Fitting a generated track to a locked picture ────────────────────────────
# Generators do not know the cut, so two knobs put the bed where the film needs
# it without re-editing the music:
#
#   SCORE_OFFSET  slides the whole bed later. The supplied track runs hot from
#                 its first sample and decays to silence around 0:22, while the
#                 film opens in near-darkness and lands its final hit at 0:23.4.
#                 Sliding the bed 1.4s later puts its natural decay under THE
#                 MARK instead of a second and a half before it.
#   SCORE_FADE    fades the bed in, so the opening is genuinely quiet and the
#                 music arrives with the ignition at 0:02.75 rather than being
#                 already there. The first three seconds being near-silent is
#                 structural — see MUSIC-BRIEF.md §3.
SCORE_OFFSET=2.2
SCORE_FADE=4.5
# A LINEAR fade could not tame this track. "Certainty" goes from −22 dB to
# −6.7 dB inside its first half-second, and a 2.2s linear ramp over an onset
# that steep still lands as a whoosh right where the card comes forward — which
# is exactly what it sounded like. A cubic curve holds the gain near zero for
# the first half of the fade and does the rise late, so the bed blooms instead
# of swooping: inaudible at 0:02.5, a whisper at 0:03.5, present by 0:05, full
# by the search. Measured, not guessed.
SCORE_CURVE=cub

while [[ $# -gt 0 ]]; do
  case "$1" in
    --score) SCORE="$2"; shift 2 ;;
    --in)    IN="$2";    shift 2 ;;
    --out)   OUT="$2";   shift 2 ;;
    --duck)  DUCK="$2";  shift 2 ;;
    --lufs)  LUFS="$2";  shift 2 ;;
    --score-offset) SCORE_OFFSET="$2"; shift 2 ;;
    --score-fade)   SCORE_FADE="$2";   shift 2 ;;
    --score-curve)  SCORE_CURVE="$2";  shift 2 ;;
    --ignite)       IGNITE_GAIN="$2";  shift 2 ;;
    -h|--help)
      sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -f "$IN" ]] || { echo "no render at $IN — run 'npm run build' first" >&2; exit 1; }

# ── 0 · The impacts, from timing.ts ──────────────────────────────────────────
# IMPACTS in src/utils/timing.ts is where the picture keys its shake, flash
# and chroma split. The sound keys off the same numbers, read here rather than
# retyped, so the two cannot drift.
cue() { grep -o "$1: s([0-9.]*)" src/utils/timing.ts | grep -o '[0-9.]\{1,\}' | head -1; }
T_IGNITE=$(cue ignite); T_MATCH=$(cue match); T_MARK=$(cue mark)
ms() { awk -v a="$1" -v off="${2:-0}" 'BEGIN{printf "%d", (a + off) * 1000}'; }
# sfx-match.wav carries a 120ms reverse swell before its hit, so it starts early.
D_IGNITE=$(ms "$T_IGNITE"); D_MATCH=$(ms "$T_MATCH" -0.12); D_MARK=$(ms "$T_MARK")
# The four frames of absolute silence before the match: bed and voice both.
CUT_A=$(awk -v m="$T_MATCH" 'BEGIN{printf "%.4f", m - 0.12 - 4/60}')
CUT_B=$(awk -v m="$T_MATCH" 'BEGIN{printf "%.4f", m}')

# ── 1 · The narration stem ───────────────────────────────────────────────────
# One source of truth for placement: the same VO_LINES the film renders from.
# Read with a while-loop rather than `mapfile`: macOS ships bash 3.2, where
# mapfile does not exist, and this script has to run on the machine that renders.
ATS=()
while IFS= read -r line; do
  ATS+=("$line")
done < <(grep -o 'at: s([0-9.]*)' src/assets.ts | grep -o '[0-9.]\{1,\}')
N=${#ATS[@]}
(( N > 0 )) || { echo "could not read VO_LINES from src/assets.ts" >&2; exit 1; }

VO_IN=(); VO_FILTER=""; VO_MIX=""
for ((i = 0; i < N; i++)); do
  f="public/audio/vo-$((i + 1)).mp3"
  [[ -f "$f" ]] || { echo "missing $f — run 'npm run vo'" >&2; exit 1; }
  ms=$(awk -v a="${ATS[$i]}" 'BEGIN{printf "%d", a * 1000}')
  VO_IN+=(-i "$f")
  VO_FILTER+="[${i}:a]adelay=${ms}|${ms}[d${i}];"
  VO_MIX+="[d${i}]"
done

echo "▸ narration stem — $N lines"
ffmpeg -y -loglevel error "${VO_IN[@]}" \
  -filter_complex "${VO_FILTER}${VO_MIX}amix=inputs=${N}:normalize=0:dropout_transition=0[m];[m]apad=whole_dur=${DUR}[o]" \
  -map "[o]" -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-vo-stem.wav

# ── 1b · The sound-design stem ───────────────────────────────────────────────
SFX_OK=1
for f in ignite match mark; do [[ -f "public/audio/sfx-$f.wav" ]] || SFX_OK=0; done
if (( SFX_OK )); then
  echo "▸ sound design — ignite @${T_IGNITE}s (gain ${IGNITE_GAIN}) · match @${T_MATCH}s · mark @${T_MARK}s"
  ffmpeg -y -loglevel error \
    -i public/audio/sfx-ignite.wav -i public/audio/sfx-match.wav -i public/audio/sfx-mark.wav \
    -filter_complex "\
      [0:a]volume=${IGNITE_GAIN},adelay=${D_IGNITE}|${D_IGNITE}[a]; \
      [1:a]volume=1.0,adelay=${D_MATCH}|${D_MATCH}[b]; \
      [2:a]volume=0.9,adelay=${D_MARK}|${D_MARK}[c]; \
      [a][b][c]amix=inputs=3:normalize=0:dropout_transition=0,apad=whole_dur=${DUR},atrim=0:${DUR}[o]" \
    -map "[o]" -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-sfx-stem.wav
else
  echo "▸ no sound-design hits (run scripts/make-sfx.sh) — mixing without them"
  ffmpeg -y -loglevel error -f lavfi -i "anullsrc=r=48000:cl=stereo" -t "$DUR" -c:a pcm_s16le /tmp/mazi-sfx-stem.wav
fi

# ── 2 · The bed, ducked under the voice ──────────────────────────────────────
if [[ -f "$SCORE" ]]; then
  # threshold 0.03 ≈ −30dBFS: the compressor reacts to speech, not to the noise
  # floor between lines. attack 20ms puts the duck in place before the first
  # syllable is intelligible; release 260ms lets the bed come back up between
  # sentences rather than pumping on every word gap.
  #
  # The ratio is derived from the requested duck, but the DELIVERED duck also
  # depends on how far the voice sits above the threshold, so the script
  # measures what it actually got rather than claiming the number back at you.
  RATIO=$(awk -v d="$DUCK" 'BEGIN{printf "%.1f", 1 + d}')
  OFF_MS=$(awk -v o="$SCORE_OFFSET" 'BEGIN{printf "%d", o * 1000}')
  echo "▸ bed — offset +${SCORE_OFFSET}s, ${SCORE_CURVE} fade in ${SCORE_FADE}s"
  echo "▸ sidechain — targeting ${DUCK}dB duck (ratio ${RATIO})"

  # Ducked bed kept as its own intermediate so it can be measured below.
  ffmpeg -y -loglevel error -i "$SCORE" -i /tmp/mazi-vo-stem.wav \
    -filter_complex "\
      [0:a]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:st=0:d=${SCORE_FADE}:curve=${SCORE_CURVE},adelay=${OFF_MS}|${OFF_MS},atrim=0:${DUR},asetpts=PTS-STARTPTS,apad=whole_dur=${DUR}[bed]; \
      [1:a]aformat=sample_rates=48000:channel_layouts=stereo[key]; \
      [bed][key]sidechaincompress=threshold=0.022:ratio=${RATIO}:attack=20:release=260:makeup=1[out]" \
    -map "[out]" -t "$DUR" -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-bed-ducked.wav

  # Measure the duck — but NOT against line 1.
  #
  # The bed fades in over the opening, so at line 1 it is still near silence
  # and the comparison reports a meaningless 47dB "duck" that is really just
  # the fade. Pick instead the last line that starts inside the first 60% of
  # the film: by then the bed is established, and there is a real gap in front
  # of it to compare against. Mean, not peak — a duck is a level change, and
  # peak would report whatever the loudest transient in each window happened
  # to be.
  PROBE=0
  for ((i = 0; i < N; i++)); do
    if awk -v a="${ATS[$i]}" -v d="$DUR" 'BEGIN{exit !(a <= d * 0.6)}'; then PROBE=$i; fi
  done
  lvl() { ffmpeg -hide_banner -nostats -i /tmp/mazi-bed-ducked.wav -af "atrim=$1:$2,asetpts=PTS-STARTPTS,volumedetect" -f null - 2>&1 | grep mean_volume | sed 's/.*mean_volume: //;s/ dB//'; }
  g_a=$(awk -v a="${ATS[$PROBE]}" 'BEGIN{printf "%.2f", a - 1.0}')
  g_b=$(awk -v a="${ATS[$PROBE]}" 'BEGIN{printf "%.2f", a - 0.1}')
  v_a=$(awk -v a="${ATS[$PROBE]}" 'BEGIN{printf "%.2f", a + 1.2}')
  v_b=$(awk -v a="${ATS[$PROBE]}" 'BEGIN{printf "%.2f", a + 2.2}')
  under=$(lvl "$v_a" "$v_b"); clear=$(lvl "$g_a" "$g_b")
  if [[ -n "$under" && -n "$clear" ]]; then
    awk -v u="$under" -v c="$clear" -v n="$((PROBE + 1))" 'BEGIN{printf "  measured at line %d: bed %.1f dB under voice vs %.1f dB in the gap before it = %.1f dB duck\n", n, u, c, c - u}'
  fi

  ffmpeg -y -loglevel error -i /tmp/mazi-bed-ducked.wav -i /tmp/mazi-vo-stem.wav -i /tmp/mazi-sfx-stem.wav \
    -filter_complex "\
      [0:a]asplit=3[p][q][r]; \
      [p]atrim=0:${CUT_A},asetpts=PTS-STARTPTS[pre]; \
      [q]atrim=${CUT_A}:${CUT_B},asetpts=PTS-STARTPTS,volume=0[gap]; \
      [r]atrim=${CUT_B},asetpts=PTS-STARTPTS[post]; \
      [pre][gap][post]concat=n=3:v=0:a=1[bedcut]; \
      [bedcut][1:a][2:a]amix=inputs=3:normalize=0:weights='1 1.25 1.1':dropout_transition=0[mix]; \
      [mix]alimiter=limit=0.95,loudnorm=I=${LUFS}:TP=-1.0:LRA=11[out]" \
    -map "[out]" -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-mix.wav
else
  echo "▸ no score at $SCORE — voice only (see MUSIC-BRIEF.md)"
  ffmpeg -y -loglevel error -i /tmp/mazi-vo-stem.wav -i /tmp/mazi-sfx-stem.wav \
    -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0:weights='1.25 1.1':dropout_transition=0[mix]; \
      [mix]alimiter=limit=0.95,loudnorm=I=${LUFS}:TP=-1.0:LRA=11[out]" \
    -map "[out]" -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-mix.wav
fi

# ── 3 · Mux ──────────────────────────────────────────────────────────────────
echo "▸ mux"
ffmpeg -y -loglevel error -i "$IN" -i /tmp/mazi-mix.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart "$OUT"

echo ""
echo "  $OUT"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128 -f null - 2>&1 \
  | grep -E "^\s+I:|^\s+LRA:" | tail -2
