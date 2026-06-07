#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const repoRoot = resolve(skillDir, '..', '..');
const topPluginsPath = join(skillDir, 'data', 'top-100-popular-plugins.json');
const topThemesPath = join(skillDir, 'data', 'top-100-popular-themes.json');
const outputJsonPath = join(repoRoot, 'docs', 'compatibility-runtime-plan.json');
const outputMarkdownPath = join(repoRoot, 'docs', 'compatibility-runtime-plan.md');
const checkOnly = process.argv.includes('--check');

const scenarios = [
  {
    id: 'baseline-block-theme',
    title: 'Baseline block theme',
    theme: 'twentytwentyfive',
    plugins: [],
    blueprint: 'docs/playground-blueprints/baseline-block-theme.json',
    riskAreas: ['block theme', 'theme.json', 'frontend output', 'editor canvas'],
    flows: ['activation', 'frontend page', 'single post', 'block editor', 'logged-in and logged-out view'],
  },
  {
    id: 'elementor-hello-elementor',
    title: 'Elementor builder shell',
    theme: 'hello-elementor',
    plugins: ['elementor'],
    blueprint: 'docs/playground-blueprints/elementor-hello-elementor.json',
    riskAreas: ['page builder', 'builder assets', 'frontend wrappers', 'global CSS', 'editor context'],
    flows: ['builder editor load', 'frontend builder page', 'non-builder page', 'asset scoping', 'deactivation fallback'],
  },
  {
    id: 'commerce-astra',
    title: 'WooCommerce on Astra',
    theme: 'astra',
    plugins: ['woocommerce'],
    blueprint: 'docs/playground-blueprints/woocommerce-astra.json',
    riskAreas: ['commerce', 'cart/session data', 'checkout/account pages', 'emails', 'public cache'],
    flows: ['shop archive', 'product page', 'cart', 'checkout', 'my account', 'logged-in and logged-out view'],
  },
  {
    id: 'seo-cache-generatepress',
    title: 'SEO plus cache on GeneratePress',
    theme: 'generatepress',
    plugins: ['wordpress-seo', 'litespeed-cache'],
    blueprint: 'docs/playground-blueprints/seo-cache-generatepress.json',
    riskAreas: ['SEO output', 'schema/canonical/meta', 'cache purge', 'minification', 'asset ordering'],
    flows: ['wp_head output', 'single post schema', 'archive metadata', 'cached frontend', 'asset dependency order'],
  },
  {
    id: 'forms-blocksy',
    title: 'Popular forms on Blocksy',
    theme: 'blocksy',
    plugins: ['contact-form-7', 'wpforms-lite'],
    blueprint: 'docs/playground-blueprints/forms-blocksy.json',
    riskAreas: ['forms', 'nonces', 'submission lifecycle', 'email delivery', 'frontend CSS'],
    flows: ['form render', 'validation error', 'successful submission', 'logged-out cache', 'mobile layout'],
  },
  {
    id: 'classic-editor-oceanwp',
    title: 'Classic Editor fallback on OceanWP',
    theme: 'oceanwp',
    plugins: ['classic-editor'],
    blueprint: 'docs/playground-blueprints/classic-editor-oceanwp.json',
    riskAreas: ['Classic Editor', 'metabox fallback', 'admin assets', 'theme frontend CSS'],
    flows: ['classic post edit', 'metabox save', 'shortcode fallback', 'frontend render', 'block editor disabled flow'],
  },
  {
    id: 'security-migration-kadence',
    title: 'Security and migration plugins on Kadence',
    theme: 'kadence',
    plugins: ['wordfence', 'all-in-one-wp-migration'],
    blueprint: 'docs/playground-blueprints/security-migration-kadence.json',
    riskAreas: ['security hardening', 'firewall/login behavior', 'backup paths', 'export/import data', 'file operations'],
    flows: ['activation order', 'admin screens', 'export/import dry run', 'login/admin access', 'PHP log review'],
  },
  {
    id: 'newspaper-tagdiv-manual',
    title: 'Newspaper / tagDiv premium manual pass',
    externalTheme: 'newspaper',
    plugins: ['woocommerce', 'litespeed-cache'],
    blueprint: 'docs/playground-blueprints/newspaper-manual-prep.json',
    riskAreas: ['premium theme', 'tagDiv Composer', 'Cloud Library', 'news layouts', 'ads', 'WooCommerce', 'mobile/AMP'],
    flows: [
      'manual premium theme install',
      'tagDiv Composer editor',
      'homepage/category/single templates',
      'ads and schema output',
      'cached mobile frontend',
    ],
  },
];

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function bySlug(items) {
  return new Map(items.map((item) => [item.slug, item]));
}

function escapeMarkdown(value) {
  return String(value ?? '').replaceAll('|', '\\|').replace(/\s+/g, ' ').trim();
}

function pluginSummary(plugin) {
  if (!plugin) {
    return null;
  }

  return {
    slug: plugin.slug,
    name: plugin.name,
    rank: plugin.rank,
    version: plugin.version,
    active_installs: plugin.active_installs,
    status: 'watchlisted',
  };
}

function themeSummary(theme) {
  if (!theme) {
    return null;
  }

  return {
    slug: theme.slug,
    name: theme.name,
    rank: theme.rank,
    version: theme.version,
    status: 'watchlisted',
  };
}

function externalThemeSummary(theme) {
  if (!theme) {
    return null;
  }

  return {
    slug: theme.slug,
    name: theme.name,
    vendor: theme.vendor,
    ecosystem: theme.ecosystem,
    status: 'watchlisted',
  };
}

function buildPlan() {
  const pluginData = readJson(topPluginsPath);
  const themeData = readJson(topThemesPath);
  const plugins = bySlug(pluginData.plugins);
  const themes = bySlug(themeData.themes);
  const externalThemes = bySlug(themeData.premium_theme_watchlist || []);

  return {
    schema: 'wordpress-plugin-dev/compatibility-runtime-plan/v1',
    generated_from: {
      top_plugins_generated_at: pluginData.generated_at,
      top_themes_generated_at: themeData.generated_at,
    },
    limitation:
      'This is a deterministic runtime verification plan. It does not prove compatibility until each scenario is executed against exact versions and recorded in the compatibility matrix.',
    scenarios: scenarios.map((scenario) => {
      const theme = scenario.theme ? themeSummary(themes.get(scenario.theme)) : null;
      const externalTheme = scenario.externalTheme ? externalThemeSummary(externalThemes.get(scenario.externalTheme)) : null;
      const scenarioPlugins = scenario.plugins.map((slug) => {
        const plugin = pluginSummary(plugins.get(slug));
        return plugin || { slug, status: 'missing-from-current-top-100-watchlist' };
      });

      return {
        id: scenario.id,
        title: scenario.title,
        status: 'planned',
        theme,
        external_theme: externalTheme,
        plugins: scenarioPlugins,
        playground_blueprint: scenario.blueprint,
        risk_areas: scenario.riskAreas,
        flows: scenario.flows,
        evidence_required: [
          'WordPress version',
          'PHP version',
          'Theme version and child theme status',
          'Plugin versions and settings',
          'Activation order',
          'Screens or flows tested',
          'Known failures, warnings, screenshots, or logs',
        ],
      };
    }),
  };
}

function renderMarkdown(plan) {
  const lines = [
    '# Compatibility Runtime Plan',
    '',
    'This plan turns the top-100 plugin and theme watchlists into concrete runtime verification batches.',
    '',
    `Generated from plugin watchlist: ${plan.generated_from.top_plugins_generated_at}`,
    `Generated from theme watchlist: ${plan.generated_from.top_themes_generated_at}`,
    '',
    'Status: `planned`. A scenario becomes `verified` only after exact versions and manual/runtime evidence are recorded in `docs/compatibility-matrix.md`.',
    '',
    '## Scenario Matrix',
    '',
    '| Scenario | Theme | Plugins | Blueprint | Primary risks |',
    '|---|---|---|---|---|',
  ];

  for (const scenario of plan.scenarios) {
    const theme = scenario.theme
      ? `${scenario.theme.name} (#${scenario.theme.rank})`
      : `${scenario.external_theme.name} (${scenario.external_theme.ecosystem})`;
    const plugins =
      scenario.plugins.length > 0
        ? scenario.plugins
            .map((plugin) => (plugin.name ? `${plugin.name} (#${plugin.rank})` : `${plugin.slug} (${plugin.status})`))
            .join(', ')
        : 'None';

    lines.push(
      `| ${escapeMarkdown(scenario.title)} | ${escapeMarkdown(theme)} | ${escapeMarkdown(plugins)} | ${escapeMarkdown(
        scenario.playground_blueprint
      )} | ${escapeMarkdown(scenario.risk_areas.join(', '))} |`
    );
  }

  lines.push('', '## Required Evidence', '');
  for (const item of plan.scenarios[0].evidence_required) {
    lines.push(`- ${item}`);
  }

  lines.push('', '## Manual Flow Checklist', '');
  for (const scenario of plan.scenarios) {
    lines.push(`### ${scenario.title}`, '');
    for (const flow of scenario.flows) {
      lines.push(`- ${flow}`);
    }
    lines.push('');
  }

  lines.push(
    '## Notes',
    '',
    '- Newspaper/tagDiv is a premium external target. The included Playground blueprint can prepare a site, but it cannot install paid theme files.',
    '- Playground blueprints are smoke-test starting points, not a replacement for exact-version verification on a real site.',
    '- Use `watchlisted` or `baseline-safe` language until a scenario has evidence.',
    ''
  );

  return `${lines.join('\n')}`;
}

function assertOutputs(plan, markdown) {
  const expectedJson = `${JSON.stringify(plan, null, 2)}\n`;
  const expectedMarkdown = markdown;
  const diffs = [];

  if (!existsSync(outputJsonPath) || readFileSync(outputJsonPath, 'utf8') !== expectedJson) {
    diffs.push(outputJsonPath);
  }

  if (!existsSync(outputMarkdownPath) || readFileSync(outputMarkdownPath, 'utf8') !== expectedMarkdown) {
    diffs.push(outputMarkdownPath);
  }

  if (diffs.length > 0) {
    console.error('Compatibility runtime plan is out of date:');
    for (const file of diffs) {
      console.error(`- ${file}`);
    }
    console.error('Run npm run compatibility:plan to regenerate it.');
    process.exit(1);
  }
}

const plan = buildPlan();
const markdown = renderMarkdown(plan);

if (checkOnly) {
  assertOutputs(plan, markdown);
  console.log(`Compatibility runtime plan check passed for ${plan.scenarios.length} scenario(s).`);
} else {
  mkdirSync(dirname(outputJsonPath), { recursive: true });
  writeFileSync(outputJsonPath, `${JSON.stringify(plan, null, 2)}\n`);
  writeFileSync(outputMarkdownPath, markdown);
  console.log(`Wrote ${outputJsonPath}`);
  console.log(`Wrote ${outputMarkdownPath}`);
  console.log(`Scenarios: ${plan.scenarios.length}`);
}
