#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');
const skipDirs = new Set(['.git', 'node_modules', 'vendor', '.wp-env', '.cache']);
const markdownFiles = [];
const brokenLinks = [];
const linkPattern = /!??\[[^\]]*]\(([^)]+)\)/g;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (skipDirs.has(name)) {
      continue;
    }

    const fullPath = resolve(dir, name);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (stat.isFile() && fullPath.endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }
}

function isExternal(target) {
  return /^(https?:|mailto:|file:|app:)/i.test(target);
}

function normalizeTarget(rawTarget) {
  return rawTarget.trim().replace(/^<|>$/g, '');
}

walk(repoRoot);

for (const file of markdownFiles) {
  const content = readFileSync(file, 'utf8');
  let match;

  while ((match = linkPattern.exec(content))) {
    const target = normalizeTarget(match[1]);

    if (!target || target.startsWith('#') || isExternal(target)) {
      continue;
    }

    const [filePart] = target.split('#');
    if (!filePart) {
      continue;
    }

    const resolvedTarget = resolve(dirname(file), decodeURIComponent(filePart));
    if (!existsSync(resolvedTarget)) {
      brokenLinks.push({
        file: file.replace(`${repoRoot}\\`, '').replaceAll('\\', '/'),
        target,
      });
    }
  }
}

if (brokenLinks.length > 0) {
  console.error(`Markdown link check failed with ${brokenLinks.length} broken local link(s):`);
  for (const link of brokenLinks) {
    console.error(`- ${link.file}: ${link.target}`);
  }
  process.exit(1);
}

console.log(`Markdown link check passed for ${markdownFiles.length} file(s).`);
