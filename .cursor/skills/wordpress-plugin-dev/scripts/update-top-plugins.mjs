#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const outputPath = join(skillDir, 'data', 'top-100-popular-plugins.json');
const apiUrl = 'https://api.wordpress.org/plugins/info/1.2/';
const documentationUrl = 'https://developer.wordpress.org/reference/functions/plugins_api/';
const dryRun = process.argv.includes('--dry-run');

const request = {
  page: 1,
  per_page: 100,
  browse: 'popular',
  fields: {
    banners: 0,
    compatibility: 0,
    contributors: 0,
    description: 0,
    icons: 0,
    sections: 0,
    screenshots: 0,
    tags: 0,
    versions: 0,
  },
};

function appendRequestParams(params, prefix, value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      appendRequestParams(params, `${prefix}[${key}]`, nestedValue);
    }
    return;
  }

  params.set(prefix, String(value));
}

function buildUrl() {
  const params = new URLSearchParams();
  params.set('action', 'query_plugins');
  appendRequestParams(params, 'request', request);
  return `${apiUrl}?${params.toString()}`;
}

function fetchJson(url) {
  return new Promise((resolveResult, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'WordPress Plugin Dev Skill compatibility refresh',
          },
        },
        (response) => {
          let body = '';

          response.setEncoding('utf8');
          response.on('data', (chunk) => {
            body += chunk;
          });
          response.on('end', () => {
            if (response.statusCode < 200 || response.statusCode >= 300) {
              reject(new Error(`WordPress.org API returned HTTP ${response.statusCode}: ${body.slice(0, 200)}`));
              return;
            }

            try {
              resolveResult(JSON.parse(body));
            } catch (error) {
              reject(new Error(`WordPress.org API returned invalid JSON: ${error.message}`));
            }
          });
        }
      )
      .on('error', reject);
  });
}

function decodeHtmlEntities(value) {
  return String(value ?? '').replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (entity, key) => {
    const normalized = key.toLowerCase();
    const named = {
      amp: '&',
      apos: "'",
      gt: '>',
      hellip: '...',
      laquo: '<<',
      lsquo: "'",
      lt: '<',
      nbsp: ' ',
      quot: '"',
      raquo: '>>',
      rsquo: "'",
      ndash: '-',
      mdash: '-',
     8211: '-',
     8212: '-',
    };

    if (Object.hasOwn(named, normalized)) {
      return named[normalized];
    }

    if (normalized.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
    }

    if (normalized.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
    }

    return entity;
  });
}

function stripTags(value) {
  return decodeHtmlEntities(value).replace(/<[^>]*>/g, '').trim();
}

function normalizePlugin(plugin, index) {
  return {
    rank: index + 1,
    slug: plugin.slug,
    name: decodeHtmlEntities(plugin.name).trim(),
    active_installs: Number(plugin.active_installs ?? 0),
    version: plugin.version || '',
    author: stripTags(plugin.author || ''),
    requires: plugin.requires || '',
    tested: plugin.tested || '',
    requires_php: plugin.requires_php || '',
    last_updated: plugin.last_updated || '',
    wordpress_org_url: `https://wordpress.org/plugins/${plugin.slug}/`,
    homepage: plugin.homepage || `https://wordpress.org/plugins/${plugin.slug}/`,
    download_link: plugin.download_link || '',
  };
}

const url = buildUrl();
const response = await fetchJson(url);

if (!Array.isArray(response.plugins)) {
  throw new Error('WordPress.org API response does not contain a plugins array.');
}

if (response.plugins.length !== 100) {
  throw new Error(`Expected 100 plugins, received ${response.plugins.length}.`);
}

const payload = {
  schema: 'wordpress-plugin-dev/top-popular-plugins/v1',
  generated_at: new Date().toISOString(),
  source: {
    name: 'WordPress.org Plugins API',
    url: apiUrl,
    documentation: documentationUrl,
    query_url: url,
    action: 'query_plugins',
    request,
    api_info: response.info || {},
  },
  notes: [
    'This watchlist is ordered by the WordPress.org popular plugins browse endpoint at generation time.',
    'The list changes over time; refresh it before release-sensitive compatibility claims.',
    'Presence in this list is a compatibility review target, not a support guarantee.',
  ],
  plugins: response.plugins.map(normalizePlugin),
};

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Updated ${outputPath}`);
  console.log(`Plugins: ${payload.plugins.length}`);
  console.log(`Source: ${url}`);
}
