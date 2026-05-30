'use strict';

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const client = require('./apiClient');
const { SAMPLES_DIR } = require('./config');

const SUPPORTED_EXT = ['.wav', '.mp3', '.m4a', '.ogg', '.flac'];

/**
 * Collect all supported audio files from the samples directory.
 */
function collectSamples(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Samples directory not found: ${dir}\n  → Add audio files to ./samples/`);
  }
  const files = fs.readdirSync(dir)
    .filter((f) => SUPPORTED_EXT.includes(path.extname(f).toLowerCase()))
    .map((f) => path.join(dir, f));

  if (files.length === 0) {
    throw new Error(`No audio files found in ${dir}. Supported: ${SUPPORTED_EXT.join(', ')}`);
  }
  console.log(`[Clone] Found ${files.length} sample(s) in ${dir}`);
  return files;
}

/**
 * Upload samples to ElevenLabs and create a new cloned voice.
 * Returns the new voice_id string.
 */
async function createVoiceClone(voiceName, description = '', samplesDir = SAMPLES_DIR) {
  const files = collectSamples(samplesDir);
  const form = new FormData();

  form.append('name', voiceName);
  if (description) form.append('description', description);
  form.append('labels', JSON.stringify({ use_case: 'voiceforge', accent: 'neutral' }));

  for (const filePath of files) {
    form.append('files', fs.createReadStream(filePath), path.basename(filePath));
    console.log(`[Clone] Attaching sample: ${path.basename(filePath)}`);
  }

  console.log('[Clone] Uploading samples to ElevenLabs — this may take a moment...');
  const res = await client.post('/voices/add', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  const voiceId = res.data.voice_id;
  if (!voiceId) throw new Error('ElevenLabs returned no voice_id. Check your plan limits.');

  console.log(`[Clone] ✓ Voice clone created! voice_id = ${voiceId}`);
  console.log(`  → Add this to your .env: ELEVENLABS_VOICE_ID=${voiceId}`);
  return voiceId;
}

/**
 * List all existing voices on the account.
 */
async function listVoices() {
  const res = await client.get('/voices');
  return res.data.voices || [];
}

module.exports = { createVoiceClone, listVoices, collectSamples };
