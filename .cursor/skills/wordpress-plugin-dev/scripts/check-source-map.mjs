#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const referencesDir = join(skillDir, 'references');
const sourceMap = readFileSync(join(referencesDir, 'source-map.md'), 'utf8');
const errors = [];

const requiredSourceHints = [
  'Plugin Developer Handbook',
  'REST API Handbook',
  'Common APIs security',
  'Block Editor Handbook',
  'Interactivity API',
  '@wordpress/scripts',
  '@wordpress/env',
  'WP-CLI',
  'Plugin Check',
  'Plugin Directory',
  'Composer',
  'PHPUnit',
];

for (const hint of requiredSourceHints) {
  if (!sourceMap.includes(hint)) {
    errors.push(`source-map.md missing ${hint}`);
  }
}

for (const file of readdirSync(referencesDir).filter((name) => name.endsWith('.md'))) {
  const content = readFileSync(join(referencesDir, file), 'utf8');
  if (!content.includes('Last reviewed: 2026-04-26')) {
    errors.push(`${file} does not use the current Last reviewed date`);
  }
  if (!content.includes('## Official Sources')) {
    errors.push(`${file} missing Official Sources heading`);
  }
}

if (errors.length) {
  console.error(`Source map check failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Source map check passed.');
