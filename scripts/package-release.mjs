#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const version = packageJson.version;
const artifactName = `wordpress-plugin-dev-skill-v${version}.tar.gz`;
const packagesDir = join(repoRoot, 'packages');
const artifactPath = join(packagesDir, artifactName);
const checksumPath = `${artifactPath}.sha256`;

const includePaths = [
  'skills/wordpress-plugin-dev',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'package.json',
  'composer.json',
  '.codex-plugin/plugin.json',
  '.agents/plugins/marketplace.json',
  'docs/installation.md',
  'docs/release-and-packaging.md',
  'docs/compatibility-matrix.md',
  'docs/limitations.md',
  'docs/ci-hardening.md',
  'docs/demo.md',
  'docs/demo-script.md',
  'docs/examples/audit-sample-human.md',
  'docs/examples/audit-sample-json.json',
  'docs/examples/performance-audit-human.md',
  'docs/examples/performance-audit-json.json',
  'docs/examples/design-audit-human.md',
  'docs/examples/design-audit-json.json',
  'docs/examples/compatibility-audit-human.md',
  'docs/examples/compatibility-audit-json.json',
];

const missing = includePaths.filter((item) => !existsSync(join(repoRoot, item)));
if (missing.length > 0) {
  console.error('Cannot build release package. Missing required file(s):');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

mkdirSync(packagesDir, { recursive: true });

for (const file of [artifactPath, checksumPath]) {
  if (existsSync(file)) {
    unlinkSync(file);
  }
}

function toPosixPath(path) {
  return path.replaceAll('\\', '/');
}

function writeString(buffer, offset, length, value) {
  buffer.write(value.slice(0, length), offset, length, 'utf8');
}

function writeOctal(buffer, offset, length, value) {
  const octal = value.toString(8).padStart(length - 1, '0');
  buffer.write(`${octal}\0`, offset, length, 'ascii');
}

function splitName(name) {
  if (Buffer.byteLength(name) <= 100) {
    return { name, prefix: '' };
  }

  const parts = name.split('/');
  for (let index = 1; index < parts.length; index += 1) {
    const prefix = parts.slice(0, index).join('/');
    const rest = parts.slice(index).join('/');
    if (Buffer.byteLength(prefix) <= 155 && Buffer.byteLength(rest) <= 100) {
      return { name: rest, prefix };
    }
  }

  throw new Error(`Path is too long for ustar archive: ${name}`);
}

function createHeader(entryName, stat, typeFlag) {
  const header = Buffer.alloc(512, 0);
  const { name, prefix } = splitName(entryName);
  const size = typeFlag === '5' ? 0 : stat.size;

  writeString(header, 0, 100, name);
  writeOctal(header, 100, 8, typeFlag === '5' ? 0o755 : 0o644);
  writeOctal(header, 108, 8, 0);
  writeOctal(header, 116, 8, 0);
  writeOctal(header, 124, 12, size);
  writeOctal(header, 136, 12, Math.floor(stat.mtimeMs / 1000));
  header.fill(0x20, 148, 156);
  header.write(typeFlag, 156, 1, 'ascii');
  writeString(header, 257, 6, 'ustar');
  writeString(header, 263, 2, '00');
  writeString(header, 265, 32, 'wordpress-plugin-dev-skill');
  writeString(header, 297, 32, 'wordpress-plugin-dev-skill');
  writeString(header, 345, 155, prefix);

  let checksum = 0;
  for (const byte of header) {
    checksum += byte;
  }
  const checksumValue = checksum.toString(8).padStart(6, '0');
  header.write(`${checksumValue}\0 `, 148, 8, 'ascii');

  return header;
}

function padToBlock(buffer) {
  const remainder = buffer.length % 512;
  if (remainder === 0) {
    return buffer;
  }

  return Buffer.concat([buffer, Buffer.alloc(512 - remainder, 0)]);
}

const archiveParts = [];
const addedDirectories = new Set();

function addDirectory(relativeDir, stat) {
  const normalized = `${toPosixPath(relativeDir).replace(/\/$/, '')}/`;
  if (addedDirectories.has(normalized)) {
    return;
  }
  addedDirectories.add(normalized);
  archiveParts.push(createHeader(normalized, stat, '5'));
}

function addFile(relativeFile, absoluteFile, stat) {
  const normalized = toPosixPath(relativeFile);
  const content = readFileSync(absoluteFile);
  archiveParts.push(createHeader(normalized, stat, '0'));
  archiveParts.push(padToBlock(content));
}

function addPath(absolutePath) {
  const stat = statSync(absolutePath);
  const relativePath = relative(repoRoot, absolutePath);

  if (stat.isDirectory()) {
    addDirectory(relativePath, stat);
    const entries = readdirSync(absolutePath).sort((a, b) => a.localeCompare(b));
    for (const entry of entries) {
      addPath(join(absolutePath, entry));
    }
    return;
  }

  if (stat.isFile()) {
    addFile(relativePath, absolutePath, stat);
  }
}

for (const item of includePaths) {
  addPath(join(repoRoot, item));
}

archiveParts.push(Buffer.alloc(1024, 0));
const tarBuffer = Buffer.concat(archiveParts);
writeFileSync(artifactPath, gzipSync(tarBuffer));

const checksum = createHash('sha256').update(readFileSync(artifactPath)).digest('hex');
writeFileSync(checksumPath, `${checksum}  ${artifactName}\n`, 'utf8');

console.log(`Created ${artifactPath}`);
console.log(`SHA256 ${checksum}`);
