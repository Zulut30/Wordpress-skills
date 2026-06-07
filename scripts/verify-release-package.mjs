#!/usr/bin/env node
import {
  existsSync,
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, normalize, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const artifactName = `wordpress-plugin-dev-skill-v${packageJson.version}.tar.gz`;
const artifactPath = process.argv[2] ? resolve(process.argv[2]) : join(repoRoot, 'packages', artifactName);
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

if (!existsSync(artifactPath)) {
  console.error(`Release package not found: ${artifactPath}`);
  console.error('Run npm run package:skill before verifying the release package.');
  process.exit(1);
}

function readString(buffer, start, length) {
  return buffer
    .subarray(start, start + length)
    .toString('utf8')
    .replace(/\0.*$/, '');
}

function readOctal(buffer, start, length) {
  const raw = readString(buffer, start, length).trim();
  return raw ? Number.parseInt(raw, 8) : 0;
}

function assertSafePath(outputDir, entryName) {
  const normalized = normalize(entryName).replaceAll('\\', '/');
  if (!normalized || normalized.startsWith('../') || normalized === '..' || normalized.startsWith('/')) {
    throw new Error(`Unsafe archive path: ${entryName}`);
  }

  const target = resolve(outputDir, normalized);
  if (!target.startsWith(`${resolve(outputDir)}/`) && target !== resolve(outputDir)) {
    throw new Error(`Archive path escapes output directory: ${entryName}`);
  }

  return target;
}

function extractTarGz(sourceFile, outputDir) {
  const buffer = gunzipSync(readFileSync(sourceFile));
  let offset = 0;

  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      break;
    }

    const name = readString(header, 0, 100);
    const prefix = readString(header, 345, 155);
    const entryName = prefix ? `${prefix}/${name}` : name;
    const mode = readOctal(header, 100, 8);
    const size = readOctal(header, 124, 12);
    const typeFlag = readString(header, 156, 1) || '0';
    const target = assertSafePath(outputDir, entryName);

    offset += 512;

    if (typeFlag === '5') {
      mkdirSync(target, { recursive: true });
      chmodSync(target, mode || 0o755);
    } else if (typeFlag === '0') {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, buffer.subarray(offset, offset + size));
      chmodSync(target, mode || 0o644);
    }

    offset += Math.ceil(size / 512) * 512;
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }
}

const tempDir = mkdtempSync(join(tmpdir(), 'wordpress-plugin-dev-release-'));

try {
  console.log(`Verifying release package: ${artifactPath}`);
  console.log(`Extracting to: ${tempDir}`);
  extractTarGz(artifactPath, tempDir);
  run(npmCommand, ['run', 'validate:skill'], tempDir);
  run(npmCommand, ['run', 'smoke'], tempDir);
  console.log('Release package verification passed.');
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
