#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const dataPath = join(skillDir, 'data', 'top-100-popular-plugins.json');
const referencePath = join(skillDir, 'references', 'top-100-plugin-compatibility.md');
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in ${file}: ${error.message}`);
    return null;
  }
}

if (!existsSync(dataPath)) {
  fail(`Missing top-100 plugin data: ${dataPath}`);
}

if (!existsSync(referencePath)) {
  fail(`Missing top-100 compatibility reference: ${referencePath}`);
}

const data = existsSync(dataPath) ? readJson(dataPath) : null;

if (data) {
  if (data.schema !== 'wordpress-plugin-dev/top-popular-plugins/v1') {
    fail(`Unexpected schema: ${data.schema}`);
  }

  if (!data.generated_at || Number.isNaN(Date.parse(data.generated_at))) {
    fail('generated_at is missing or invalid.');
  }

  if (data.source?.url !== 'https://api.wordpress.org/plugins/info/1.2/') {
    fail('source.url must point to the WordPress.org Plugins API.');
  }

  if (data.source?.action !== 'query_plugins') {
    fail('source.action must be query_plugins.');
  }

  if (data.source?.request?.browse !== 'popular') {
    fail('source.request.browse must be popular.');
  }

  if (data.source?.request?.per_page !== 100) {
    fail('source.request.per_page must be 100.');
  }

  if (!Array.isArray(data.plugins)) {
    fail('plugins must be an array.');
  } else {
    if (data.plugins.length !== 100) {
      fail(`Expected exactly 100 plugins, found ${data.plugins.length}.`);
    }

    const slugs = new Set();
    const ranks = new Set();

    data.plugins.forEach((plugin, index) => {
      const expectedRank = index + 1;

      if (plugin.rank !== expectedRank) {
        fail(`Plugin at index ${index} has rank ${plugin.rank}; expected ${expectedRank}.`);
      }

      if (!plugin.slug || !/^[a-z0-9._-]+$/.test(plugin.slug)) {
        fail(`Plugin rank ${expectedRank} has invalid slug: ${plugin.slug}`);
      } else if (slugs.has(plugin.slug)) {
        fail(`Duplicate plugin slug: ${plugin.slug}`);
      } else {
        slugs.add(plugin.slug);
      }

      if (ranks.has(plugin.rank)) {
        fail(`Duplicate plugin rank: ${plugin.rank}`);
      } else {
        ranks.add(plugin.rank);
      }

      if (!plugin.name || /&[a-z0-9#]+;/i.test(plugin.name)) {
        fail(`Plugin ${plugin.slug || expectedRank} has missing or undecoded name.`);
      }

      if (!Number.isInteger(plugin.active_installs) || plugin.active_installs < 0) {
        fail(`Plugin ${plugin.slug || expectedRank} has invalid active_installs.`);
      }

      if (!plugin.wordpress_org_url || plugin.wordpress_org_url !== `https://wordpress.org/plugins/${plugin.slug}/`) {
        fail(`Plugin ${plugin.slug || expectedRank} has missing or suspicious wordpress_org_url.`);
      }

      if (!plugin.homepage || !/^https?:\/\//i.test(plugin.homepage)) {
        fail(`Plugin ${plugin.slug || expectedRank} has missing or invalid homepage.`);
      }
    });
  }
}

if (existsSync(referencePath)) {
  const reference = readFileSync(referencePath, 'utf8');
  const requiredPhrases = [
    'data/top-100-popular-plugins.json',
    'feature detection',
    'Compatibility Claims',
    'Manual Verification',
    'not a support guarantee',
  ];

  for (const phrase of requiredPhrases) {
    if (!reference.includes(phrase)) {
      fail(`top-100 compatibility reference is missing required phrase: ${phrase}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Top-100 plugin compatibility check failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Top-100 plugin compatibility check passed for ${data.plugins.length} plugin(s).`);
