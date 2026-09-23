import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.resolve(__dirname, '../videos/vernier-showcase/audio');

function getDuration(file) {
  const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`, { encoding: 'utf8' });
  return parseFloat(out.trim());
}

// 7 beats aligned to story arc
const beats = [
  { file: 'beat_01.mp3', padAfter: 2.0 }, // Scene 1: Hook & Front Door
  { file: 'beat_02.mp3', padAfter: 1.5 }, // Scene 2: Benchmark Contrast
  { file: 'beat_03.mp3', padAfter: 2.0 }, // Scene 3: Connect Wallet & Cockpit
  { file: 'beat_04.mp3', padAfter: 2.0 }, // Scene 4: Live EVM Caliper
  { file: 'beat_05.mp3', padAfter: 2.0 }, // Scene 5: Real EIP-712 Signing
  { file: 'beat_06.mp3', padAfter: 2.0 }, // Scene 6: Cryptographic Proof Rail
  { file: 'beat_07.mp3', padAfter: 4.0 }, // Scene 7: Pitch Deck & Close
];

let currentTimeMs = 500; // 0.5s initial lead
const timeline = [];

for (let i = 0; i < beats.length; i++) {
  const b = beats[i];
  const filePath = path.join(AUDIO_DIR, b.file);
  const durSec = getDuration(filePath);
  timeline.push({
    index: i,
    file: b.file,
    startMs: Math.round(currentTimeMs),
    startSec: (currentTimeMs / 1000).toFixed(2),
    durSec: durSec.toFixed(2),
  });
  currentTimeMs += (durSec + b.padAfter) * 1000;
}

const totalDurationSec = Math.ceil(currentTimeMs / 1000);
console.log(`\nTimeline assembled: ${timeline.length} beats, total duration: ${totalDurationSec}s`);
timeline.forEach(t => {
  console.log(`Beat ${t.index + 1}: ${t.file} @ ${t.startSec}s (dur: ${t.durSec}s)`);
});

// Step 1: Build FFmpeg adelay filter for vo-full.wav
const inputs = timeline.map(t => `-i "${path.join(AUDIO_DIR, t.file)}"`).join(' ');
const delayFilters = timeline.map((t, idx) => `[${idx}:a]adelay=${t.startMs}|${t.startMs}[a${idx}]`).join(';');
const mixInputs = timeline.map((_, idx) => `[a${idx}]`).join('');
const filterComplex = `${delayFilters};${mixInputs}amix=inputs=${timeline.length}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=10[vo]`;

const voFullWav = path.join(AUDIO_DIR, 'vo-full.wav');
console.log('\nAssembling vo-full.wav...');
execSync(`ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map "[vo]" -t ${totalDurationSec} "${voFullWav}"`, { stdio: 'inherit' });

// Step 2: Duck background music under vo-full.wav
const bgmPath = path.join(AUDIO_DIR, 'bgm.mp3');
const masterAudioPath = path.join(AUDIO_DIR, 'master-audio.mp3');
const outroStart = totalDurationSec - 4;

console.log('\nMixing master-audio.mp3 with sidechain ducking...');
const duckFilter = `[1:a]atrim=0:${totalDurationSec},asetpts=PTS-STARTPTS,afade=t=in:ss=0:d=1.5,afade=t=out:st=${outroStart}:d=3,volume=0.18[bgm];[bgm][0:a]sidechaincompress=threshold=0.03:ratio=4:attack=50:release=350[ducked_bgm];[0:a][ducked_bgm]amix=inputs=2:duration=first:normalize=0[out]`;

execSync(`ffmpeg -y -i "${voFullWav}" -i "${bgmPath}" -filter_complex "${duckFilter}" -map "[out]" -b:a 256k -t ${totalDurationSec} "${masterAudioPath}"`, { stdio: 'inherit' });

console.log(`\n🎉 Master audio generated successfully at: ${masterAudioPath}`);
console.log(`Final duration: ${getDuration(masterAudioPath).toFixed(2)}s`);
