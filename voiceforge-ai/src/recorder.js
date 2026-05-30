'use strict';

const fs = require('fs');
const path = require('path');
const recorder = require('node-record-lpcm16');
const wav = require('wav');
const { SAMPLES_DIR } = require('./config');

const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BIT_DEPTH = 16;

/**
 * Record microphone audio for `durationSeconds` and save to ./samples/.
 * Requires `sox` installed via Homebrew: brew install sox
 *
 * @param {number} durationSeconds
 * @param {string} label - filename prefix
 * @returns {Promise<string>} path to the saved WAV file
 */
function recordSample(durationSeconds = 10, label = 'sample') {
  if (!fs.existsSync(SAMPLES_DIR)) fs.mkdirSync(SAMPLES_DIR, { recursive: true });

  const filename = `${label}_${Date.now()}.wav`;
  const filePath = path.join(SAMPLES_DIR, filename);

  return new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(filePath, {
      channels: CHANNELS,
      sampleRate: SAMPLE_RATE,
      bitDepth: BIT_DEPTH,
    });

    console.log(`[Recorder] Recording for ${durationSeconds}s → ${filename}`);
    console.log('[Recorder] Speak now...');

    const rec = recorder.record({
      sampleRate: SAMPLE_RATE,
      channels: CHANNELS,
      audioType: 'wav',
      recorder: 'sox',
    });

    const stream = rec.stream();
    stream.pipe(writer);

    stream.on('error', (err) => {
      console.error('[Recorder] sox error — is sox installed? Run: brew install sox');
      reject(err);
    });

    setTimeout(() => {
      rec.stop();
      writer.end(() => {
        console.log(`[Recorder] ✓ Saved: ${filePath}`);
        resolve(filePath);
      });
    }, durationSeconds * 1000);
  });
}

module.exports = { recordSample };
