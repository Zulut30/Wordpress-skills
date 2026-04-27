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
  'Performance optimization',
  'WP_Query',
  'wp_cache_get',
  'Design, UX, and UI',
  '@wordpress/components',
  '@wordpress/admin-ui',
  '@wordpress/ui',
  'Integrations and compatibility',
  'Classic Editor',
  'Yoast SEO',
  'WP Rocket',
  'Elementor',
  'Astra',
];

for (const hint of requiredSourceHints) {
  if (!sourceMap.includes(hint)) {
    errors.push(`source-map.md missing ${hint}`);
  }
}

for (const file of readdirSync(referencesDir).filter((name) => name.endsWith('.md'))) {
  const content = readFileSync(join(referencesDir, file), 'utf8');
  if (!/Last reviewed: 20\d{2}-\d{2}-\d{2}/.test(content)) {
    errors.push(`${file} missing Last reviewed date`);
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
