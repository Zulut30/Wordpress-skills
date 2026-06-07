#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');
const source = join(repoRoot, 'skills', 'wordpress-plugin-dev');
const checkOnly = process.argv.includes('--check');
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

function toPosixPath(path) {
  return path.replaceAll('\\', '/');
}

function hashFile(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function collectManifest(root) {
  const manifest = new Map();

  function walk(current) {
    const entries = readdirSync(current).sort((a, b) => a.localeCompare(b));

    for (const entry of entries) {
      const fullPath = join(current, entry);
      if (!shouldCopy(fullPath)) {
        continue;
      }

      const stat = statSync(fullPath);
      const relativePath = toPosixPath(relative(root, fullPath));

      if (stat.isDirectory()) {
        manifest.set(`${relativePath}/`, {
          type: 'directory',
          mode: stat.mode & 0o777,
        });
        walk(fullPath);
        continue;
      }

      if (stat.isFile()) {
        manifest.set(relativePath, {
          type: 'file',
          mode: stat.mode & 0o777,
          hash: hashFile(fullPath),
        });
      }
    }
  }

  walk(root);
  return manifest;
}

function diffManifests(sourceManifest, targetManifest) {
  const differences = [];

  for (const [path, sourceEntry] of sourceManifest) {
    const targetEntry = targetManifest.get(path);
    if (!targetEntry) {
      differences.push(`missing in target: ${path}`);
      continue;
    }

    if (targetEntry.type !== sourceEntry.type) {
      differences.push(`type differs: ${path}`);
      continue;
    }

    if (targetEntry.mode !== sourceEntry.mode) {
      differences.push(
        `mode differs: ${path} source=${sourceEntry.mode.toString(8)} target=${targetEntry.mode.toString(8)}`
      );
    }

    if (sourceEntry.type === 'file' && targetEntry.hash !== sourceEntry.hash) {
      differences.push(`content differs: ${path}`);
    }
  }

  for (const path of targetManifest.keys()) {
    if (!sourceManifest.has(path)) {
      differences.push(`extra in target: ${path}`);
    }
  }

  return differences;
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

console.log(checkOnly ? 'Checking WordPress Plugin Dev skill install targets' : 'Syncing WordPress Plugin Dev skill install targets');
console.log(`Source: ${source}`);
console.log(`Skipped: ${skippedPatterns.join(', ')}`);

const sourceManifest = checkOnly ? collectManifest(source) : null;

for (const target of targets) {
  console.log('');
  console.log(`Target: ${target}`);

  try {
    assertSafeTarget(target);
    if (checkOnly) {
      if (!existsSync(target)) {
        throw new Error(`Target does not exist: ${target}`);
      }

      const differences = diffManifests(sourceManifest, collectManifest(target));
      if (differences.length > 0) {
        console.error(`Status: drift detected - ${differences.length} difference(s)`);
        for (const difference of differences.slice(0, 50)) {
          console.error(`- ${difference}`);
        }
        if (differences.length > 50) {
          console.error(`- ... ${differences.length - 50} more`);
        }
        process.exitCode = 1;
      } else {
        console.log('Status: in sync');
      }
      continue;
    }

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
