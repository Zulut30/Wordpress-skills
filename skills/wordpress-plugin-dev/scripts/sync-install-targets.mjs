#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');
const source = join(repoRoot, 'skills', 'wordpress-plugin-dev');
const targets = [
  join(repoRoot, '.agents', 'skills', 'wordpress-plugin-dev'),
  join(repoRoot, '.claude', 'skills', 'wordpress-plugin-dev'),
  join(repoRoot, '.cursor', 'skills', 'wordpress-plugin-dev'),
];

if (!existsSync(source)) {
  console.error(`Source skill not found: ${source}`);
  process.exit(1);
}

for (const target of targets) {
  try {
    mkdirSync(dirname(target), { recursive: true });
    mkdirSync(target, { recursive: true });
    cpSync(source, target, {
      recursive: true,
      force: true,
      filter: (src) => !src.includes(`${source}\\fixtures\\demo-plugin\\vendor`) && !src.includes(`${source}\\fixtures\\demo-plugin\\node_modules`) && !src.includes(`${source}/fixtures/demo-plugin/vendor`) && !src.includes(`${source}/fixtures/demo-plugin/node_modules`),
    });
    console.log(`Synced ${target}`);
  } catch (error) {
    console.error(`Could not sync ${target}: ${error.message}`);
    process.exitCode = 1;
  }
}
