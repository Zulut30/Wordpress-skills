#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..', '..');
const blueprintDir = join(repoRoot, 'docs', 'playground-blueprints');
const errors = [];

const requiredBlueprints = [
  'baseline-block-theme.json',
  'elementor-hello-elementor.json',
  'woocommerce-astra.json',
  'seo-cache-generatepress.json',
  'forms-blocksy.json',
  'classic-editor-oceanwp.json',
  'security-migration-kadence.json',
  'newspaper-manual-prep.json',
];

function fail(message) {
  errors.push(message);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${file} is invalid JSON: ${error.message}`);
    return null;
  }
}

function validateResource(file, step, key, expectedResource) {
  const data = step[key];
  if (!data || typeof data !== 'object') {
    fail(`${file}: ${step.step} missing ${key}.`);
    return;
  }

  if (data.resource !== expectedResource) {
    fail(`${file}: ${step.step}.${key}.resource must be ${expectedResource}.`);
  }

  if (!data.slug || !/^[a-z0-9._-]+$/.test(data.slug)) {
    fail(`${file}: ${step.step}.${key}.slug is missing or invalid.`);
  }
}

if (!existsSync(blueprintDir)) {
  fail(`Missing Playground blueprint directory: ${blueprintDir}`);
} else {
  for (const blueprint of requiredBlueprints) {
    if (!existsSync(join(blueprintDir, blueprint))) {
      fail(`Missing required Playground blueprint: ${blueprint}`);
    }
  }

  const files = readdirSync(blueprintDir)
    .filter((file) => file.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b));

  for (const fileName of files) {
    const file = join(blueprintDir, fileName);
    const blueprint = readJson(file);
    if (!blueprint) {
      continue;
    }

    if (blueprint.$schema !== 'https://playground.wordpress.net/blueprint-schema.json') {
      fail(`${fileName}: missing or unexpected $schema.`);
    }

    if (!blueprint.preferredVersions || typeof blueprint.preferredVersions !== 'object') {
      fail(`${fileName}: missing preferredVersions.`);
    }

    if (!blueprint.features?.networking) {
      fail(`${fileName}: features.networking must be true for WordPress.org installs.`);
    }

    if (!Array.isArray(blueprint.steps) || blueprint.steps.length === 0) {
      fail(`${fileName}: steps must be a non-empty array.`);
      continue;
    }

    if (!blueprint.steps.some((step) => step.step === 'login')) {
      fail(`${fileName}: expected a login step.`);
    }

    for (const step of blueprint.steps) {
      if (!step || typeof step !== 'object' || !step.step) {
        fail(`${fileName}: each step must be an object with a step field.`);
        continue;
      }

      if (step.step === 'installPlugin') {
        validateResource(fileName, step, 'pluginData', 'wordpress.org/plugins');
        if (step.options && typeof step.options.activate !== 'boolean') {
          fail(`${fileName}: installPlugin.options.activate must be boolean when present.`);
        }
      }

      if (step.step === 'installTheme') {
        validateResource(fileName, step, 'themeData', 'wordpress.org/themes');
        if (step.options && typeof step.options.activate !== 'boolean') {
          fail(`${fileName}: installTheme.options.activate must be boolean when present.`);
        }
      }

      if (step.step === 'setSiteOptions' && (!step.options || typeof step.options !== 'object')) {
        fail(`${fileName}: setSiteOptions requires options.`);
      }
    }

    if (basename(fileName) === 'newspaper-manual-prep.json') {
      const installsNewspaper = blueprint.steps.some(
        (step) => step.step === 'installTheme' && /newspaper/i.test(step.themeData?.slug || '')
      );
      if (installsNewspaper) {
        fail('newspaper-manual-prep.json must not pretend to install the premium Newspaper theme from WordPress.org.');
      }

      if (!JSON.stringify(blueprint).includes('Newspaper')) {
        fail('newspaper-manual-prep.json should mention Newspaper in site options or metadata.');
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Playground blueprint check failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Playground blueprint check passed for ${requiredBlueprints.length} required blueprint(s).`);
