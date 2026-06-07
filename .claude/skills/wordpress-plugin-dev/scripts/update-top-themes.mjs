#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const outputPath = join(skillDir, 'data', 'top-100-popular-themes.json');
const apiUrl = 'https://api.wordpress.org/themes/info/1.2/';
const documentationUrl = 'https://codex.wordpress.org/WordPress.org_API#Themes';
const dryRun = process.argv.includes('--dry-run');

const request = {
  page: 1,
  per_page: 100,
  browse: 'popular',
  fields: {
    description: 0,
    sections: 0,
    screenshots: 0,
    screenshot_url: 0,
    tags: 1,
    versions: 0,
  },
};

const premiumThemeWatchlist = [
  {
    slug: 'newspaper',
    name: 'Newspaper',
    vendor: 'tagDiv',
    ecosystem: 'ThemeForest / tagDiv',
    source_url: 'https://themeforest.net/item/newspaper/5489609',
    documentation_url: 'https://forum.tagdiv.com/newspaper-theme-documentation/',
    risk_areas: [
      'news/magazine layouts',
      'tagDiv Composer builder',
      'tagDiv Cloud Library companion plugin',
      'WooCommerce templates',
      'AMP/mobile output',
      'advertising/header/footer injections',
      'cache/minification',
    ],
    notes:
      'Premium themes are not returned by the WordPress.org Themes API. Treat Newspaper as an external watchlist target that needs exact-version manual verification.',
  },
];

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
  params.set('action', 'query_themes');
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
            'User-Agent': 'WordPress Plugin Dev Skill theme compatibility refresh',
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
              reject(new Error(`WordPress.org Themes API returned HTTP ${response.statusCode}: ${body.slice(0, 200)}`));
              return;
            }

            try {
              resolveResult(JSON.parse(body));
            } catch (error) {
              reject(new Error(`WordPress.org Themes API returned invalid JSON: ${error.message}`));
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
      ndash: '-',
      mdash: '-',
      quot: '"',
      raquo: '>>',
      rsquo: "'",
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

function normalizeAuthor(author) {
  if (!author || typeof author !== 'object') {
    return {
      name: decodeHtmlEntities(author || '').trim(),
      profile: '',
      url: '',
    };
  }

  return {
    name: decodeHtmlEntities(author.display_name || author.author || author.user_nicename || '').trim(),
    profile: author.profile || '',
    url: author.author_url || '',
  };
}

function normalizeTags(tags) {
  if (!tags || typeof tags !== 'object') {
    return [];
  }

  return Object.values(tags)
    .map((tag) => decodeHtmlEntities(tag).trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function normalizeTheme(theme, index) {
  return {
    rank: index + 1,
    slug: theme.slug,
    name: decodeHtmlEntities(theme.name).trim(),
    version: theme.version || '',
    author: normalizeAuthor(theme.author),
    requires: theme.requires || '',
    requires_php: theme.requires_php || '',
    rating: Number(theme.rating ?? 0),
    num_ratings: Number(theme.num_ratings ?? 0),
    preview_url: theme.preview_url || '',
    wordpress_org_url: theme.homepage || `https://wordpress.org/themes/${theme.slug}/`,
    tags: normalizeTags(theme.tags),
    is_commercial: Boolean(theme.is_commercial),
    is_community: Boolean(theme.is_community),
    external_support_url: theme.external_support_url || '',
    external_repository_url: theme.external_repository_url || '',
  };
}

const url = buildUrl();
const response = await fetchJson(url);

if (!Array.isArray(response.themes)) {
  throw new Error('WordPress.org Themes API response does not contain a themes array.');
}

if (response.themes.length !== 100) {
  throw new Error(`Expected 100 themes, received ${response.themes.length}.`);
}

const payload = {
  schema: 'wordpress-plugin-dev/top-popular-themes/v1',
  generated_at: new Date().toISOString(),
  source: {
    name: 'WordPress.org Themes API',
    url: apiUrl,
    documentation: documentationUrl,
    query_url: url,
    action: 'query_themes',
    request,
    api_info: response.info || {},
  },
  notes: [
    'This watchlist is ordered by the WordPress.org popular themes browse endpoint at generation time.',
    'The list changes over time; refresh it before release-sensitive compatibility claims.',
    'Presence in this list is a compatibility review target, not a support guarantee.',
    'Premium/commercial themes such as Newspaper are tracked separately because they are not returned by the WordPress.org Themes API.',
  ],
  themes: response.themes.map(normalizeTheme),
  premium_theme_watchlist: premiumThemeWatchlist,
};

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Updated ${outputPath}`);
  console.log(`Themes: ${payload.themes.length}`);
  console.log(`Premium/external themes: ${payload.premium_theme_watchlist.length}`);
  console.log(`Source: ${url}`);
}
