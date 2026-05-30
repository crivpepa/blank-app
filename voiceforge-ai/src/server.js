'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const { createVoiceClone, listVoices } = require('./voiceClone');
const { generateSpeech } = require('./tts');
const { EXPORTS_DIR, PORT } = require('./config');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ── Routes ────────────────────────────────────────────────────

app.get('/api/voices', async (req, res) => {
  try {
    const voices = await listVoices();
    res.json({ voices });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/clone', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: '"name" is required' });
  try {
    const voiceId = await createVoiceClone(name, description || '');
    res.json({ voice_id: voiceId, message: `Voice "${name}" cloned successfully.` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/tts', async (req, res) => {
  const { text, voice_id, stability, similarity_boost } = req.body;
  if (!text) return res.status(400).json({ error: '"text" is required' });
  try {
    const filePath = await generateSpeech(text, voice_id || '', {
      stability: stability !== undefined ? stability : 0.5,
      similarity_boost: similarity_boost !== undefined ? similarity_boost : 0.75,
    });
    const filename = path.basename(filePath);
    res.json({ file: filename, path: filePath, message: 'WAV generated successfully.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/exports', (req, res) => {
  if (!fs.existsSync(EXPORTS_DIR)) return res.json({ files: [] });
  const files = fs.readdirSync(EXPORTS_DIR)
    .filter((f) => f.endsWith('.wav'))
    .sort()
    .reverse();
  res.json({ files });
});

app.get('/exports/:filename', (req, res) => {
  const filePath = path.join(EXPORTS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath);
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n[VoiceForge AI] Server running at http://localhost:${PORT}`);
  console.log(`  Web UI:  http://localhost:${PORT}`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
