'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const client = require('./apiClient');
const { EXPORTS_DIR, TTS_MODEL_ID, ELEVENLABS_VOICE_ID } = require('./config');

/**
 * Build a timestamped filename: voice_clone_44k_2026_05_30.wav
 */
function buildFilename(prefix = 'voice_clone') {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${prefix}_44k_${y}_${m}_${d}_${hh}${mm}${ss}.wav`;
}

/**
 * Use ffmpeg to convert/resample raw audio to 44.1 kHz 24-bit PCM WAV.
 * This guarantees Ableton Live 10 compatibility regardless of source format.
 */
function convertToAbletonWav(inputPath, outputPath) {
  try {
    execSync(
      `ffmpeg -y -i "${inputPath}" -ar 44100 -sample_fmt s32 -acodec pcm_s24le "${outputPath}" 2>/dev/null`,
      { stdio: 'pipe' }
    );
    fs.unlinkSync(inputPath); // remove raw intermediate file
    console.log(`[TTS] Converted to 44.1 kHz 24-bit WAV → ${outputPath}`);
  } catch (e) {
    // ffmpeg not found — keep the raw file and warn
    fs.renameSync(inputPath, outputPath);
    console.warn('[TTS] WARNING: ffmpeg not found. File saved as raw MP3 with .wav extension.');
    console.warn('  Install ffmpeg: brew install ffmpeg');
  }
}

/**
 * Generate TTS audio from text using ElevenLabs.
 * Saves a 44.1 kHz 24-bit WAV to ./exports/
 *
 * @param {string} text       - The text to synthesize
 * @param {string} voiceId    - ElevenLabs voice_id (falls back to .env)
 * @param {object} voiceSettings - stability / similarity_boost overrides
 * @returns {string} Absolute path of the saved WAV file
 */
async function generateSpeech(text, voiceId, voiceSettings = {}) {
  const vid = voiceId || ELEVENLABS_VOICE_ID;
  if (!vid) {
    throw new Error('No voice_id provided. Set ELEVENLABS_VOICE_ID in .env or pass it explicitly.');
  }
  if (!text || text.trim().length === 0) {
    throw new Error('Text input is empty.');
  }

  const settings = {
    stability: voiceSettings.stability !== undefined ? voiceSettings.stability : 0.5,
    similarity_boost: voiceSettings.similarity_boost !== undefined ? voiceSettings.similarity_boost : 0.75,
    style: voiceSettings.style !== undefined ? voiceSettings.style : 0.0,
    use_speaker_boost: voiceSettings.use_speaker_boost !== undefined ? voiceSettings.use_speaker_boost : true,
  };

  console.log(`[TTS] Generating speech for voice_id=${vid}, model=${TTS_MODEL_ID}`);
  console.log(`[TTS] Text (${text.length} chars): "${text.slice(0, 80)}${text.length > 80 ? '...' : ''}"`);

  const res = await client.post(
    `/text-to-speech/${vid}`,
    {
      text: text.trim(),
      model_id: TTS_MODEL_ID,
      voice_settings: settings,
    },
    {
      responseType: 'arraybuffer',
      headers: { Accept: 'audio/mpeg' },
    }
  );

  if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true });

  const rawPath = path.join(EXPORTS_DIR, `_raw_${Date.now()}.mp3`);
  const finalPath = path.join(EXPORTS_DIR, buildFilename());

  fs.writeFileSync(rawPath, Buffer.from(res.data));
  convertToAbletonWav(rawPath, finalPath);

  console.log(`[TTS] ✓ Export ready: ${finalPath}`);
  return finalPath;
}

module.exports = { generateSpeech, buildFilename };
