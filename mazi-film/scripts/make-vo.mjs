#!/usr/bin/env node
/**
 * Generate the narration.
 *
 *   node scripts/make-vo.mjs
 *
 * Needs ELEVENLABS_API_KEY in the environment. Writes public/audio/vo-N.mp3,
 * normalises each line to a consistent loudness, and prints the measured
 * duration of every line next to the second it has to start on — so a
 * rewrite that runs long is caught here rather than discovered in a render.
 *
 * The lines live in ONE place, `LINES` below, and the placements live in ONE
 * place, `VO_LINES` in src/assets.ts. This file reads the placements so the two
 * can never silently disagree.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = resolve(ROOT, 'public/audio');

/** Silas — Deep & Cinematic. The house alternative is Michael 9zciqiv4AGFwYrkFwPIl. */
const VOICE = '5MzdXfNI3TSWsCPwZFrB';
const MODEL = 'eleven_v3';
const FALLBACK_MODEL = 'eleven_multilingual_v2';

/**
 * The SPOKEN layer. Not the written layer.
 * "Mahzee" is how ElevenLabs pronounces MAZI correctly (MAH-zee); given the
 * real spelling it says "mazzy".
 */
const LINES = [
  "A card sells live. Then it's gone.",
  'Mahzee reads it as it happens.',
  'Nine million cards. One match.',
  'Same grade. Fifty-eight dollars, then one eighty-six.',
  "Without the record, you're guessing.",
  'Mahzee. See what you hold.',
];

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error('ELEVENLABS_API_KEY is not set.');
  process.exit(1);
}

/** Pull the placements out of assets.ts without importing TypeScript. */
const readPlacements = () => {
  const src = readFileSync(resolve(ROOT, 'src/assets.ts'), 'utf8');
  const block = src.slice(src.indexOf('export const VO_LINES'));
  // s(x) takes SECONDS, so these are seconds already — do not divide by fps.
  return [...block.matchAll(/at:\s*s\(([\d.]+)\)/g)].map((m) => Number(m[1]));
};

const speak = async (text, model) => {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: { stability: 0.42, similarity_boost: 0.8, style: 0.28, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  return Buffer.from(await res.arrayBuffer());
};

const seconds = (file) =>
  Number(
    execFileSync('ffprobe', [
      '-v', 'error', '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1', file,
    ]).toString().trim(),
  );

mkdirSync(OUT, { recursive: true });

const at = readPlacements();
let model = MODEL;
const durations = [];

for (let i = 0; i < LINES.length; i++) {
  let audio;
  try {
    audio = await speak(LINES[i], model);
  } catch (err) {
    if (model === MODEL) {
      console.warn(`  ${MODEL} unavailable (${err.message.slice(0, 80)}) — falling back to ${FALLBACK_MODEL}`);
      model = FALLBACK_MODEL;
      audio = await speak(LINES[i], model);
    } else {
      throw err;
    }
  }

  const raw = resolve(OUT, `.raw-${i + 1}.mp3`);
  const out = resolve(OUT, `vo-${i + 1}.mp3`);
  writeFileSync(raw, audio);
  // One loudness target across every line, so no line arrives hotter than the
  // one before it and the mix needs no per-line rides.
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', out]);
  execFileSync('rm', ['-f', raw]);

  const d = seconds(out);
  durations.push(d);
  console.log(`vo-${i + 1}.mp3  ${d.toFixed(2)}s  @${at[i].toFixed(1)}s  "${LINES[i].slice(0, 46)}…"`);
}

// Collision check: does any line still be talking when the next one starts?
console.log('');
for (let i = 0; i < durations.length - 1; i++) {
  const endsAt = at[i] + durations[i];
  const nextAt = at[i + 1];
  if (endsAt > nextAt + 0.02) {
    console.warn(
      `  ⚠ line ${i + 1} ends at ${endsAt.toFixed(2)}s but line ${i + 2} starts at ${nextAt.toFixed(2)}s — ` +
        `overlap ${(endsAt - nextAt).toFixed(2)}s. Adjust VO_LINES[].at in src/assets.ts.`,
    );
  }
}
const last = at[at.length - 1] + durations[durations.length - 1];
if (last > 26) console.warn(`  ⚠ narration ends at ${last.toFixed(2)}s, past the 26.0s cut.`);
else console.log(`  narration ends at ${last.toFixed(2)}s of 26.0s. Model: ${model}.`);
