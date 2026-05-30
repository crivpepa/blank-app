#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const { createVoiceClone, listVoices } = require('./voiceClone');
const { generateSpeech } = require('./tts');
const { recordSample } = require('./recorder');

const banner = `
${chalk.cyan('╔══════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('VoiceForge AI')} ${chalk.gray('— Ableton-Ready TTS')}  ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════╝')}
`;

async function mainMenu() {
  console.log(banner);

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🎤  Record a new voice sample (requires sox)', value: 'record' },
        { name: '📁  Upload existing samples & clone voice',    value: 'clone' },
        { name: '📋  List voices on my ElevenLabs account',    value: 'list' },
        { name: '🔊  Generate speech (TTS)',                   value: 'tts' },
        { name: '🚪  Exit',                                    value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'record':   return handleRecord();
    case 'clone':    return handleClone();
    case 'list':     return handleList();
    case 'tts':      return handleTTS();
    case 'exit':     console.log(chalk.gray('Goodbye.')); process.exit(0);
  }
}

async function handleRecord() {
  const { label, duration } = await inquirer.prompt([
    { type: 'input',  name: 'label',    message: 'Sample label (filename prefix):', default: 'sample' },
    { type: 'number', name: 'duration', message: 'Recording duration (seconds):',   default: 10 },
  ]);
  await recordSample(duration, label);
  return mainMenu();
}

async function handleClone() {
  const { name, description } = await inquirer.prompt([
    { type: 'input', name: 'name',        message: 'Name for your cloned voice:',       default: 'MyVoice' },
    { type: 'input', name: 'description', message: 'Short description (optional):',     default: '' },
  ]);
  const voiceId = await createVoiceClone(name, description);
  console.log(chalk.green(`\n✓ voice_id: ${chalk.bold(voiceId)}`));
  console.log(chalk.yellow('→ Save this to your .env as ELEVENLABS_VOICE_ID=') + chalk.bold(voiceId) + '\n');
  return mainMenu();
}

async function handleList() {
  console.log('[List] Fetching voices...');
  const voices = await listVoices();
  if (voices.length === 0) {
    console.log(chalk.yellow('No voices found on your account.'));
  } else {
    voices.forEach((v, i) => {
      console.log(`  ${chalk.cyan(i + 1)}. ${chalk.bold(v.name)} — ${chalk.gray(v.voice_id)}`);
    });
  }
  return mainMenu();
}

async function handleTTS() {
  const voices = await listVoices();
  const voiceChoices = voices.map((v) => ({ name: `${v.name} (${v.voice_id})`, value: v.voice_id }));

  const { voiceId, text, stability, similarity } = await inquirer.prompt([
    {
      type: 'list',
      name: 'voiceId',
      message: 'Select a voice:',
      choices: voiceChoices.length > 0 ? voiceChoices : [{ name: 'Use ELEVENLABS_VOICE_ID from .env', value: '' }],
    },
    {
      type: 'editor',
      name: 'text',
      message: 'Enter the text to synthesize (opens $EDITOR):',
    },
    {
      type: 'number',
      name: 'stability',
      message: 'Stability (0.0 – 1.0, default 0.5):',
      default: 0.5,
    },
    {
      type: 'number',
      name: 'similarity',
      message: 'Similarity boost (0.0 – 1.0, default 0.75):',
      default: 0.75,
    },
  ]);

  const filePath = await generateSpeech(text, voiceId, {
    stability,
    similarity_boost: similarity,
  });

  console.log(chalk.green(`\n✓ WAV exported to: ${chalk.bold(filePath)}\n`));
  return mainMenu();
}

mainMenu().catch((err) => {
  console.error(chalk.red(`\n[CLI Error] ${err.message}`));
  process.exit(1);
});
