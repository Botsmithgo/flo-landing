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
DUCK=7          # dB the bed drops under the voice
LUFS=-14        # integrated target for the master
DUR=26

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
SCORE_OFFSET=1.4
SCORE_FADE=2.2

while [[ $# -gt 0 ]]; do
  case "$1" in
    --score) SCORE="$2"; shift 2 ;;
    --in)    IN="$2";    shift 2 ;;
    --out)   OUT="$2";   shift 2 ;;
    --duck)  DUCK="$2";  shift 2 ;;
    --lufs)  LUFS="$2";  shift 2 ;;
    --score-offset) SCORE_OFFSET="$2"; shift 2 ;;
    --score-fade)   SCORE_FADE="$2";   shift 2 ;;
    -h|--help)
      sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done

[[ -f "$IN" ]] || { echo "no render at $IN — run 'npm run build' first" >&2; exit 1; }

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
  RATIO=$(awk -v d="$DUCK" 'BEGIN{printf "%.1f", 1 + d / 2}')
  OFF_MS=$(awk -v o="$SCORE_OFFSET" 'BEGIN{printf "%d", o * 1000}')
  echo "▸ bed — offset +${SCORE_OFFSET}s, fade in ${SCORE_FADE}s"
  echo "▸ sidechain — targeting ${DUCK}dB duck (ratio ${RATIO})"

  # Ducked bed kept as its own intermediate so it can be measured below.
  ffmpeg -y -loglevel error -i "$SCORE" -i /tmp/mazi-vo-stem.wav \
    -filter_complex "\
      [0:a]aformat=sample_rates=48000:channel_layouts=stereo,afade=t=in:st=0:d=${SCORE_FADE},adelay=${OFF_MS}|${OFF_MS},atrim=0:${DUR},asetpts=PTS-STARTPTS,apad=whole_dur=${DUR}[bed]; \
      [1:a]aformat=sample_rates=48000:channel_layouts=stereo[key]; \
      [bed][key]sidechaincompress=threshold=0.03:ratio=${RATIO}:attack=20:release=260:makeup=1[out]" \
    -map "[out]" -t "$DUR" -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-bed-ducked.wav

  # Measure: bed level 1.2s into the first line, versus 0.5s after it ends.
  vo1_end=$(awk -v a="${ATS[0]}" -v d="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 public/audio/vo-1.mp3)" 'BEGIN{printf "%.2f", a + d + 0.5}')
  under=$(ffmpeg -hide_banner -nostats -ss "$(awk -v a="${ATS[0]}" 'BEGIN{printf "%.2f", a + 1.2}')" -t 0.7 -i /tmp/mazi-bed-ducked.wav -af volumedetect -f null - 2>&1 | grep mean_volume | grep -o '\-[0-9.]*' | head -1)
  clear=$(ffmpeg -hide_banner -nostats -ss "$vo1_end" -t 0.7 -i /tmp/mazi-bed-ducked.wav -af volumedetect -f null - 2>&1 | grep mean_volume | grep -o '\-[0-9.]*' | head -1)
  if [[ -n "$under" && -n "$clear" ]]; then
    awk -v u="$under" -v c="$clear" 'BEGIN{printf "  measured: bed %.1f dB under voice vs %.1f dB in the gap = %.1f dB duck\n", u, c, c - u}'
  fi

  ffmpeg -y -loglevel error -i /tmp/mazi-bed-ducked.wav -i /tmp/mazi-vo-stem.wav \
    -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0:weights='1 1.25':dropout_transition=0[mix]; \
      [mix]alimiter=limit=0.95,loudnorm=I=${LUFS}:TP=-1.0:LRA=9[out]" \
    -map "[out]" -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-mix.wav
else
  echo "▸ no score at $SCORE — voice only (see MUSIC-BRIEF.md)"
  ffmpeg -y -loglevel error -i /tmp/mazi-vo-stem.wav \
    -af "alimiter=limit=0.95,loudnorm=I=${LUFS}:TP=-1.0:LRA=9" \
    -ar 48000 -ac 2 -c:a pcm_s16le /tmp/mazi-mix.wav
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
