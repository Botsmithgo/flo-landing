#!/usr/bin/env bash
#
# MAZI brand film — the three sound-design hits, synthesised.
#
#   scripts/make-sfx.sh        → public/audio/sfx-ignite.wav
#                                 public/audio/sfx-match.wav
#                                 public/audio/sfx-mark.wav
#
# The music is a bed; it has no transients where the picture has events. These
# three are the events. They are built from first principles in ffmpeg — a sub
# sine, a shaped noise burst, a metallic ping — because they are simple sounds
# and a generator would only give back a noisier version of the same recipe.
# Each is a single hit at 48k stereo, peak-normalised, with its own tail.
#
# Where they land is decided in postmix.sh, from AUDIO_CUES.

set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/audio
mkdir -p "$OUT"

# ── IGNITE (0:02.75) ─────────────────────────────────────────────────────────
# A filtered white-noise strike that resolves the riser, plus a sub that DROPS
# in pitch — 90Hz falling to 32Hz over 400ms — which is what makes it feel like
# something landed rather than something switched on. Short: the film ducks to
# near-silence 180ms after it, and the hit must be out of the way by then.
ffmpeg -y -loglevel error \
  -f lavfi -i "anoisesrc=d=1.2:c=white:r=48000:a=0.9" \
  -f lavfi -i "sine=f=90:d=1.2:r=48000" \
  -filter_complex "\
    [0:a]highpass=f=180,lowpass=f=6500,afade=t=in:st=0:d=0.004,afade=t=out:st=0.05:d=0.32,volume=1.0[noise]; \
    [1:a]asetrate=48000*0.36,aresample=48000,atempo=1.0,afade=t=in:st=0:d=0.003,afade=t=out:st=0.08:d=0.45,volume=1.6[sub]; \
    [noise][sub]amix=inputs=2:normalize=0:dropout_transition=0,alimiter=limit=0.98,aformat=channel_layouts=stereo[o]" \
  -map "[o]" -t 1.2 -c:a pcm_s16le "$OUT/sfx-ignite.wav"

# ── MATCH (0:12.6) ───────────────────────────────────────────────────────────
# The loudest frame in the film. A 55Hz sub thud with a hard 2ms attack, a
# metallic lock — narrowband noise ringing at ~2.4kHz, the sound of a latch —
# and a short reverse swell in the 120ms before the hit so the silence that
# precedes it is *inhaled* rather than merely empty.
ffmpeg -y -loglevel error \
  -f lavfi -i "sine=f=55:d=1.6:r=48000" \
  -f lavfi -i "anoisesrc=d=1.6:c=white:r=48000:a=0.8" \
  -f lavfi -i "anoisesrc=d=1.6:c=pink:r=48000:a=0.6" \
  -filter_complex "\
    [0:a]adelay=120|120,afade=t=in:st=0.12:d=0.002,afade=t=out:st=0.2:d=0.9,volume=1.8[sub]; \
    [1:a]bandpass=f=2400:w=380,adelay=120|120,afade=t=in:st=0.12:d=0.002,afade=t=out:st=0.15:d=0.5,volume=0.7[metal]; \
    [2:a]lowpass=f=900,atrim=0:0.12,afade=t=in:st=0:d=0.11,afade=t=out:st=0.115:d=0.005,volume=0.5[swell]; \
    [sub][metal][swell]amix=inputs=3:normalize=0:dropout_transition=0,alimiter=limit=0.98,aformat=channel_layouts=stereo[o]" \
  -map "[o]" -t 1.6 -c:a pcm_s16le "$OUT/sfx-match.wav"

# ── THE MARK (0:23.43) ───────────────────────────────────────────────────────
# One deep, clean hit and nothing after it. 42Hz, a soft 6ms attack so it is
# felt before it is heard, a long exponential decay, and a second octave-up
# partial at low level so it has a pitch on small speakers that cannot
# reproduce 42Hz. Three seconds of tail. No transient click — the picture
# supplies the strike.
ffmpeg -y -loglevel error \
  -f lavfi -i "sine=f=42:d=3.2:r=48000" \
  -f lavfi -i "sine=f=84:d=3.2:r=48000" \
  -f lavfi -i "anoisesrc=d=3.2:c=brown:r=48000:a=0.5" \
  -filter_complex "\
    [0:a]afade=t=in:st=0:d=0.006,afade=t=out:st=0.25:d=2.9,volume=1.9[f]; \
    [1:a]afade=t=in:st=0:d=0.006,afade=t=out:st=0.15:d=1.6,volume=0.45[h]; \
    [2:a]lowpass=f=160,afade=t=in:st=0:d=0.004,afade=t=out:st=0.03:d=0.5,volume=0.35[thud]; \
    [f][h][thud]amix=inputs=3:normalize=0:dropout_transition=0,alimiter=limit=0.98,aformat=channel_layouts=stereo[o]" \
  -map "[o]" -t 3.2 -c:a pcm_s16le "$OUT/sfx-mark.wav"

# Peak-normalise every hit to −1 dBFS so their RELATIVE levels are set in one
# place (postmix.sh's mix weights) rather than falling out of the synthesis.
# Without this the sub-heavy hits measured 12 dB under the noise-led one.
for f in ignite match mark; do
  peak=$(ffmpeg -hide_banner -nostats -i "$OUT/sfx-$f.wav" -af volumedetect -f null - 2>&1 | grep max_volume | sed 's/.*max_volume: //;s/ dB//')
  gain=$(awk -v p="$peak" 'BEGIN{printf "%.2f", -1.0 - p}')
  ffmpeg -y -loglevel error -i "$OUT/sfx-$f.wav" -af "volume=${gain}dB" -c:a pcm_s16le "$OUT/.n.wav" && mv "$OUT/.n.wav" "$OUT/sfx-$f.wav"
done

for f in ignite match mark; do
  printf "  sfx-%-7s %5.2fs  peak %s\n" "$f" \
    "$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT/sfx-$f.wav")" \
    "$(ffmpeg -hide_banner -nostats -i "$OUT/sfx-$f.wav" -af volumedetect -f null - 2>&1 | grep max_volume | sed 's/.*max_volume: //')"
done
