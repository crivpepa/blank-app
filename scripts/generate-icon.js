#!/usr/bin/env node
/**
 * generate-icon.js
 *
 * Generates the Recovery App icon and splash screen PNG files from the SVG
 * sources in the assets/ directory.
 *
 * Requirements:
 *   - Node.js >= 18
 *   - The `sharp` package  (npm install --save-dev sharp)
 *
 * Usage:
 *   node scripts/generate-icon.js
 *
 * Outputs:
 *   assets/icon.png           — 1024x1024 app icon (no alpha for App Store)
 *   assets/splash.png         — 1284x2778 splash screen
 *   assets/adaptive-icon.png  — 1024x1024 Android adaptive icon foreground
 *   assets/favicon.png        — 48x48 web favicon
 *
 * If `sharp` is not installed the script falls back to printing instructions
 * for converting the SVG files manually using free online tools.
 */

'use strict';

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');

const FILES = [
  {
    input: path.join(ASSETS, 'icon.svg'),
    output: path.join(ASSETS, 'icon.png'),
    width: 1024,
    height: 1024,
    description: 'App icon (App Store / Google Play)',
  },
  {
    input: path.join(ASSETS, 'icon.svg'),
    output: path.join(ASSETS, 'adaptive-icon.png'),
    width: 1024,
    height: 1024,
    description: 'Android adaptive icon foreground',
  },
  {
    input: path.join(ASSETS, 'splash.svg'),
    output: path.join(ASSETS, 'splash.png'),
    width: 1284,
    height: 2778,
    description: 'Splash screen (iPhone 6.5")',
  },
  {
    input: path.join(ASSETS, 'icon.svg'),
    output: path.join(ASSETS, 'favicon.png'),
    width: 48,
    height: 48,
    description: 'Web favicon',
  },
];

async function generateWithSharp() {
  const sharp = require('sharp');

  for (const file of FILES) {
    if (!fs.existsSync(file.input)) {
      console.warn(`  [SKIP] Source not found: ${file.input}`);
      continue;
    }

    await sharp(file.input)
      .resize(file.width, file.height)
      .png({ compressionLevel: 9 })
      .toFile(file.output);

    console.log(`  [OK] ${path.basename(file.output)} — ${file.description}`);
  }
}

function printManualInstructions() {
  console.log('\nManual conversion instructions');
  console.log('================================');
  console.log('The `sharp` package is not installed. You can convert the SVG files');
  console.log('to PNG manually using any of the following free options:\n');

  console.log('Option A — Online converter (svgtopng.com / cloudconvert.com):');
  FILES.forEach((f) => {
    console.log(
      `  ${path.basename(f.input)}  →  ${path.basename(f.output)}  (${f.width}x${f.height}px)`
    );
  });

  console.log('\nOption B — Install sharp and re-run this script:');
  console.log('  npm install --save-dev sharp');
  console.log('  node scripts/generate-icon.js\n');

  console.log('Option C — Inkscape CLI (if installed):');
  FILES.forEach((f) => {
    console.log(
      `  inkscape "${f.input}" --export-type=png --export-filename="${f.output}" -w ${f.width} -h ${f.height}`
    );
  });

  console.log('\nOption D — ImageMagick (if installed):');
  FILES.forEach((f) => {
    console.log(
      `  convert -background none -resize ${f.width}x${f.height} "${f.input}" "${f.output}"`
    );
  });

  console.log(
    '\nIMPORTANT: The App Store requires assets/icon.png to have NO alpha channel (no transparency).'
  );
  console.log('If your tool exports with alpha, flatten it against a white or blue background.\n');
}

async function main() {
  console.log('\nRecovery App — Icon & Splash Generator\n');

  try {
    require.resolve('sharp');
    console.log('Using sharp for SVG → PNG conversion...\n');
    await generateWithSharp();
    console.log('\nAll assets generated successfully.');
  } catch (_) {
    console.warn('sharp is not available. Falling back to manual instructions.\n');
    printManualInstructions();
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
