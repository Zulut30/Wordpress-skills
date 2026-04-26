#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');
const source = join(repoRoot, 'skills', 'wordpress-plugin-dev');
const targets = [
  join(repoRoot, '.agents', 'skills', 'wordpress-plugin-dev'),
  join(repoRoot, '.claude', 'skills', 'wordpress-plugin-dev'),
  join(repoRoot, '.cursor', 'skills', 'wordpress-plugin-dev'),
];

const skippedNames = new Set([
  '.git',
  '.DS_Store',
  'Thumbs.db',
  'node_modules',
  'vendor',
  '.wp-env',
  '.cache',
  '.parcel-cache',
  '.phpunit.result.cache',
  'coverage',
  'dist',
  'build-release',
]);

const skippedExtensions = new Set([
  '.log',
  '.tmp',
  '.temp',
  '.swp',
  '.bak',
]);

const skippedPatterns = [
  ...skippedNames,
  ...skippedExtensions,
  '*~',
];

function shouldCopy(src) {
  const name = basename(src);

  if (skippedNames.has(name)) {
    return false;
  }

  for (const extension of skippedExtensions) {
    if (name.endsWith(extension)) {
      return false;
    }
  }

  return !name.endsWith('~');
}

function assertSafeTarget(target) {
  const resolvedTarget = resolve(target);
  const relativeTarget = relative(repoRoot, resolvedTarget);
  const allowedTargets = new Set([
    join('.agents', 'skills', 'wordpress-plugin-dev'),
    join('.claude', 'skills', 'wordpress-plugin-dev'),
    join('.cursor', 'skills', 'wordpress-plugin-dev'),
  ]);

  if (relativeTarget.startsWith('..') || relativeTarget === '' || relativeTarget.startsWith('..\\')) {
    throw new Error(`Refusing to sync outside repository root: ${resolvedTarget}`);
  }

  if (!allowedTargets.has(relativeTarget)) {
    throw new Error(`Refusing to sync unexpected target path: ${resolvedTarget}`);
  }

  if (resolvedTarget === resolve(source)) {
    throw new Error('Refusing to remove or overwrite the canonical skill source.');
  }
}

if (!existsSync(source)) {
  console.error(`Source skill not found: ${source}`);
  process.exit(1);
}

console.log('Syncing WordPress Plugin Dev skill install targets');
console.log(`Source: ${source}`);
console.log(`Skipped: ${skippedPatterns.join(', ')}`);

for (const target of targets) {
  console.log('');
  console.log(`Target: ${target}`);

  try {
    assertSafeTarget(target);
    mkdirSync(dirname(target), { recursive: true });
    if (existsSync(target)) {
      rmSync(target, { recursive: true, force: true });
      console.log('Removed existing target');
    }

    cpSync(source, target, {
      recursive: true,
      force: true,
      filter: shouldCopy,
    });
    console.log('Copied canonical skill');
    console.log('Status: success');
  } catch (error) {
    console.error(`Status: failed - ${error.message}`);
    process.exitCode = 1;
  }
}
