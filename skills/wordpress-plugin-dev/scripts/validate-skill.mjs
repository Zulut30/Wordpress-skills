#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const errors = [];

function read(relPath) {
  return readFileSync(join(skillDir, relPath), 'utf8');
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full));
    } else {
      entries.push(full);
    }
  }
  return entries;
}

const skillPath = join(skillDir, 'SKILL.md');
assert(existsSync(skillPath), 'Missing SKILL.md');

if (existsSync(skillPath)) {
  const skill = read('SKILL.md');
  const lines = skill.split(/\r?\n/);
  assert(lines.length < 500, `SKILL.md must be under 500 lines; found ${lines.length}`);
  assert(skill.startsWith('---\n'), 'SKILL.md must start with YAML frontmatter');
  assert(/name:\s+wordpress-plugin-dev/.test(skill), 'SKILL.md frontmatter must include name');
  assert(/description:\s+/.test(skill), 'SKILL.md frontmatter must include description');
  assert(skill.includes('references/source-map.md'), 'SKILL.md should point to source-map.md');
}

for (const dir of ['references', 'scripts', 'assets/templates', 'fixtures/demo-plugin']) {
  assert(existsSync(join(skillDir, dir)), `Missing ${dir}`);
}

const referencesDir = join(skillDir, 'references');
if (existsSync(referencesDir)) {
  const refs = readdirSync(referencesDir).filter((file) => file.endsWith('.md'));
  assert(refs.length >= 10, `Expected at least 10 reference files; found ${refs.length}`);
  for (const file of refs) {
    const content = read(join('references', file));
    assert(content.includes('Last reviewed:'), `${file} missing Last reviewed`);
    assert(content.includes('Official Sources'), `${file} missing Official Sources`);
    assert(/https:\/\/(?:developer\.wordpress\.org|wordpress\.org|make\.wordpress\.org|github\.com|getcomposer\.org|phpunit\.de|docs\.github\.com)/.test(content), `${file} missing official source URL`);
  }
}

const templateDir = join(skillDir, 'assets', 'templates');
if (existsSync(templateDir)) {
  const templates = readdirSync(templateDir).filter((file) => file.endsWith('.stub'));
  assert(templates.length >= 8, `Expected at least 8 template stubs; found ${templates.length}`);
}

const fixtureMain = join(skillDir, 'fixtures', 'demo-plugin', 'demo-plugin.php');
if (existsSync(fixtureMain)) {
  const fixture = read('fixtures/demo-plugin/demo-plugin.php');
  assert(fixture.includes('Plugin Name:'), 'Fixture plugin missing Plugin Name header');
  assert(fixture.includes('Text Domain:'), 'Fixture plugin missing Text Domain header');
  assert(fixture.includes('defined( \'ABSPATH\' ) || exit;'), 'Fixture plugin missing direct access guard');
}

if (errors.length) {
  console.error(`Skill validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Skill validation passed.');
