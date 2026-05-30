'use strict';

require('dotenv').config();
const path = require('path');

function requireEnv(key) {
  const val = process.env[key];
  if (!val || val.trim() === '' || val.includes('your_')) {
    console.error(`\n[VoiceForge] FATAL: Missing required env var "${key}".`);
    console.error(`  → Copy .env.example to .env and fill in your credentials.\n`);
    process.exit(1);
  }
  return val.trim();
}

function optionalEnv(key, fallback = '') {
  const val = process.env[key];
  return (val && val.trim() !== '') ? val.trim() : fallback;
}

module.exports = {
  ELEVENLABS_API_KEY: requireEnv('ELEVENLABS_API_KEY'),
  ELEVENLABS_VOICE_ID: optionalEnv('ELEVENLABS_VOICE_ID'),
  TTS_MODEL_ID: optionalEnv('TTS_MODEL_ID', 'eleven_multilingual_v2'),
  SAMPLES_DIR: path.resolve(optionalEnv('SAMPLES_DIR', './samples')),
  EXPORTS_DIR: path.resolve(optionalEnv('EXPORTS_DIR', './exports')),
  PORT: parseInt(optionalEnv('PORT', '3000'), 10),
  ELEVENLABS_BASE_URL: 'https://api.elevenlabs.io/v1',
};
