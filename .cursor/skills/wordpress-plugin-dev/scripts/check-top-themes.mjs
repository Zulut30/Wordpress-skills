#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const dataPath = join(skillDir, 'data', 'top-100-popular-themes.json');
const referencePath = join(skillDir, 'references', 'top-100-theme-compatibility.md');
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
  fail(`Missing top-100 theme data: ${dataPath}`);
}

if (!existsSync(referencePath)) {
  fail(`Missing top-100 theme compatibility reference: ${referencePath}`);
}

const data = existsSync(dataPath) ? readJson(dataPath) : null;

if (data) {
  if (data.schema !== 'wordpress-plugin-dev/top-popular-themes/v1') {
    fail(`Unexpected schema: ${data.schema}`);
  }

  if (!data.generated_at || Number.isNaN(Date.parse(data.generated_at))) {
    fail('generated_at is missing or invalid.');
  }

  if (data.source?.url !== 'https://api.wordpress.org/themes/info/1.2/') {
    fail('source.url must point to the WordPress.org Themes API.');
  }

  if (data.source?.action !== 'query_themes') {
    fail('source.action must be query_themes.');
  }

  if (data.source?.request?.browse !== 'popular') {
    fail('source.request.browse must be popular.');
  }

  if (data.source?.request?.per_page !== 100) {
    fail('source.request.per_page must be 100.');
  }

  if (!Array.isArray(data.themes)) {
    fail('themes must be an array.');
  } else {
    if (data.themes.length !== 100) {
      fail(`Expected exactly 100 themes, found ${data.themes.length}.`);
    }

    const slugs = new Set();
    const ranks = new Set();

    data.themes.forEach((theme, index) => {
      const expectedRank = index + 1;

      if (theme.rank !== expectedRank) {
        fail(`Theme at index ${index} has rank ${theme.rank}; expected ${expectedRank}.`);
      }

      if (!theme.slug || !/^[a-z0-9._-]+$/.test(theme.slug)) {
        fail(`Theme rank ${expectedRank} has invalid slug: ${theme.slug}`);
      } else if (slugs.has(theme.slug)) {
        fail(`Duplicate theme slug: ${theme.slug}`);
      } else {
        slugs.add(theme.slug);
      }

      if (ranks.has(theme.rank)) {
        fail(`Duplicate theme rank: ${theme.rank}`);
      } else {
        ranks.add(theme.rank);
      }

      if (!theme.name || /&[a-z0-9#]+;/i.test(theme.name)) {
        fail(`Theme ${theme.slug || expectedRank} has missing or undecoded name.`);
      }

      if (!theme.wordpress_org_url || theme.wordpress_org_url !== `https://wordpress.org/themes/${theme.slug}/`) {
        fail(`Theme ${theme.slug || expectedRank} has missing or suspicious wordpress_org_url.`);
      }

      if (theme.preview_url && !/^https?:\/\//i.test(theme.preview_url)) {
        fail(`Theme ${theme.slug || expectedRank} has invalid preview_url.`);
      }

      if (!theme.author || typeof theme.author !== 'object' || !theme.author.name) {
        fail(`Theme ${theme.slug || expectedRank} has missing author metadata.`);
      }

      if (!Array.isArray(theme.tags)) {
        fail(`Theme ${theme.slug || expectedRank} tags must be an array.`);
      }
    });
  }

  if (!Array.isArray(data.premium_theme_watchlist)) {
    fail('premium_theme_watchlist must be an array.');
  } else if (!data.premium_theme_watchlist.some((theme) => theme.slug === 'newspaper' && /tagdiv/i.test(theme.vendor))) {
    fail('premium_theme_watchlist must include Newspaper by tagDiv.');
  }
}

if (existsSync(referencePath)) {
  const reference = readFileSync(referencePath, 'utf8');
  const requiredPhrases = [
    'data/top-100-popular-themes.json',
    'Newspaper',
    'child theme',
    'template hierarchy',
    'Theme Compatibility Claims',
    'not a support guarantee',
  ];

  for (const phrase of requiredPhrases) {
    if (!reference.includes(phrase)) {
      fail(`top-100 theme compatibility reference is missing required phrase: ${phrase}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Top-100 theme compatibility check failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Top-100 theme compatibility check passed for ${data.themes.length} WordPress.org theme(s) and ${data.premium_theme_watchlist.length} premium/external theme(s).`
);
