#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const scanRoots = [
  'skills/wordpress-plugin-dev/fixtures',
  'test-fixtures',
];
const skipDirs = new Set(['.git', 'node_modules', 'vendor', 'build', 'dist']);
const phpFiles = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (skipDirs.has(entry)) {
      continue;
    }

    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (stat.isFile() && fullPath.endsWith('.php')) {
      phpFiles.push(fullPath);
    }
  }
}

const phpVersion = spawnSync('php', ['-v'], { encoding: 'utf8' });
if (phpVersion.error && phpVersion.error.code === 'ENOENT') {
  console.log('PHP executable not found; skipping PHP syntax lint.');
  process.exit(0);
}

if (phpVersion.status !== 0) {
  console.log('PHP executable is unavailable or not runnable; skipping PHP syntax lint.');
  process.exit(0);
}

for (const root of scanRoots) {
  walk(resolve(repoRoot, root));
}

if (phpFiles.length === 0) {
  console.log('No PHP files found for syntax lint.');
  process.exit(0);
}

const failures = [];

for (const file of phpFiles) {
  const result = spawnSync('php', ['-l', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures.push({
      file: file.replace(`${repoRoot}\\`, '').replaceAll('\\', '/'),
      output: `${result.stdout}${result.stderr}`.trim(),
    });
  }
}

if (failures.length > 0) {
  console.error(`PHP syntax lint failed for ${failures.length} file(s):`);
  for (const failure of failures) {
    console.error(`- ${failure.file}`);
    console.error(failure.output);
  }
  process.exit(1);
}

console.log(`PHP syntax lint passed for ${phpFiles.length} file(s).`);
