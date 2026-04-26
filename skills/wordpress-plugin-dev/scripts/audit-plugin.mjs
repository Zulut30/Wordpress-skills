#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

const pluginDir = resolve(process.argv[2] || '.');
const findings = [];
const notes = [];

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    if (['.git', 'node_modules', 'vendor'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full));
    } else {
      entries.push(full);
    }
  }
  return entries;
}

function add(priority, file, message) {
  findings.push({ priority, file, message });
}

if (!existsSync(pluginDir)) {
  console.error(`Plugin directory not found: ${pluginDir}`);
  process.exit(2);
}

const files = walk(pluginDir);
const phpFiles = files.filter((file) => extname(file) === '.php');
const mainCandidates = phpFiles.filter((file) => /Plugin Name:\s*/.test(readFileSync(file, 'utf8')));
const mainFile = mainCandidates[0];

if (!mainFile) {
  add('P1', pluginDir, 'No PHP file with a WordPress Plugin Name header was found.');
} else {
  const main = readFileSync(mainFile, 'utf8');
  for (const header of ['Description:', 'Version:', 'Requires at least:', 'Requires PHP:', 'License:', 'Text Domain:']) {
    if (!main.includes(header)) add('P2', mainFile, `Plugin header missing ${header}`);
  }
  if (!main.includes("defined( 'ABSPATH' ) || exit;") && !main.includes('defined( "ABSPATH" ) || exit;')) {
    add('P1', mainFile, 'Main plugin file is missing a direct access guard.');
  }
}

for (const file of phpFiles) {
  const content = readFileSync(file, 'utf8');
  if (/register_rest_route\s*\(/.test(content) && !/permission_callback/.test(content)) {
    add('P1', file, 'REST route registration does not include permission_callback.');
  }
  if (/\$_(GET|POST|REQUEST|COOKIE)\b/.test(content) && !/sanitize_|filter_input|wp_unslash|absint|intval|rest_sanitize/.test(content)) {
    add('P1', file, 'Request superglobal is used without an obvious sanitization path.');
  }
  if (/\becho\s+\$_(GET|POST|REQUEST|COOKIE)\b/.test(content)) {
    add('P1', file, 'Request data appears to be echoed directly.');
  }
  if (/\$wpdb->query\s*\([^)]*\$/.test(content) && !/\$wpdb->prepare\s*\(/.test(content)) {
    add('P1', file, 'Possible direct SQL query without wpdb::prepare().');
  }
  if (/add_(menu|submenu)_page\s*\(/.test(content) && !/current_user_can\s*\(/.test(content)) {
    add('P2', file, 'Admin menu file should include a capability check in the render/action path.');
  }
  if (/wp_die\s*\(\s*__\(/.test(content)) {
    add('P2', file, 'Translated wp_die output should be escaped.');
  }
}

const blockFiles = files.filter((file) => basename(file) === 'block.json');
for (const file of blockFiles) {
  const content = readFileSync(file, 'utf8');
  try {
    const block = JSON.parse(content);
    for (const field of ['apiVersion', 'name', 'title', 'category', 'textdomain']) {
      if (!Object.prototype.hasOwnProperty.call(block, field)) {
        add('P2', file, `block.json missing ${field}`);
      }
    }
  } catch (error) {
    add('P1', file, `Invalid block.json: ${error.message}`);
  }
}

if (!existsSync(join(pluginDir, 'readme.txt'))) {
  add('P2', pluginDir, 'readme.txt not found.');
}

if (!existsSync(join(pluginDir, 'composer.json'))) {
  notes.push('composer.json not found; acceptable for small plugins, but recommended for namespaced medium plugins.');
}

console.log(`Audited ${phpFiles.length} PHP file(s), ${blockFiles.length} block.json file(s) in ${pluginDir}`);

if (findings.length) {
  console.log('\nFindings:');
  for (const finding of findings) {
    console.log(`- [${finding.priority}] ${finding.file}: ${finding.message}`);
  }
} else {
  console.log('\nNo blocking static audit findings found.');
}

if (notes.length) {
  console.log('\nNotes:');
  for (const note of notes) console.log(`- ${note}`);
}

process.exit(findings.some((finding) => finding.priority === 'P1') ? 1 : 0);
