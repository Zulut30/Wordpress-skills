#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillDir = resolve(__dirname, '..');
const repoRoot = findRepoRoot(skillDir);
const skillName = basename(skillDir);
const skillPath = join(skillDir, 'SKILL.md');
const readmePath = join(repoRoot, 'README.md');

const REQUIRED_FRONTMATTER = ['name', 'description', 'license', 'compatibility'];
const REQUIRED_TEMPLATES = [
  'plugin-php-main.stub',
  'composer-json.stub',
  'package-json.stub',
  'block-json.stub',
  'rest-controller.stub',
  'settings-page.stub',
  'readme-txt.stub',
  'github-actions-ci.yml.stub',
  'optimized-query.stub',
  'transient-cache-helper.stub',
  'object-cache-helper.stub',
  'scoped-assets.stub',
  'performant-rest-controller.stub',
  'dynamic-block-fragment-cache.stub',
  'cron-batch-job.stub',
  'admin-page-layout.stub',
  'settings-tabs-page.stub',
  'admin-card-grid.stub',
  'empty-state.stub',
  'admin-notice.stub',
  'accessible-form-field.stub',
  'frontend-card-output.stub',
  'block-inspector-controls.stub',
  'block-placeholder.stub',
  'onboarding-step.stub',
  'css-scoped-admin-ui.stub',
  'frontend-scoped-css.stub',
  'integration-interface.stub',
  'integration-registry.stub',
  'classic-editor-metabox-fallback.stub',
  'block-editor-classic-fallback.stub',
  'seo-output-guard.stub',
  'yoast-integration.stub',
  'rankmath-integration.stub',
  'aioseo-integration.stub',
  'seopress-integration.stub',
  'cache-integration-interface.stub',
  'generic-cache-compatibility.stub',
  'litespeed-cache-adapter.stub',
  'wp-rocket-adapter.stub',
  'w3-total-cache-adapter.stub',
  'autoptimize-compatibility.stub',
  'theme-compatibility-service.stub',
  'astra-compatibility.stub',
  'generatepress-compatibility.stub',
  'kadence-compatibility.stub',
  'elementor-adapter.stub',
  'divi-adapter.stub',
  'compatibility-matrix.stub',
];
const REQUIRED_SCRIPTS = [
  'audit-plugin.mjs',
  'check-source-map.mjs',
  'sync-install-targets.mjs',
  'validate-skill.mjs',
  'smoke-test.sh',
];
const REQUIRED_PERFORMANCE_EXAMPLES = [
  'performance-audit-report.md',
  'optimized-rest-endpoint.md',
  'optimized-dynamic-block.md',
  'scoped-asset-loading.md',
  'cache-invalidation-patterns.md',
];
const REQUIRED_PERFORMANCE_DOC_EXAMPLES = [
  'performance-audit-human.md',
  'performance-audit-json.json',
  'performance-audit-explanation.md',
];
const REQUIRED_DESIGN_EXAMPLES = [
  'admin-settings-before-after.md',
  'plugin-dashboard-layout.md',
  'gutenberg-block-ui-before-after.md',
  'frontend-output-design.md',
  'empty-loading-error-states.md',
  'onboarding-flow.md',
  'design-audit-report.md',
];
const REQUIRED_DESIGN_DOC_EXAMPLES = [
  'design-audit-human.md',
  'design-audit-json.json',
  'design-audit-explanation.md',
];
const REQUIRED_COMPATIBILITY_EXAMPLES = [
  'compatibility-audit-report.md',
  'classic-editor-fallback.md',
  'seo-plugin-compatibility.md',
  'cache-plugin-compatibility.md',
  'theme-compatibility-before-after.md',
  'page-builder-compatibility.md',
  'compatibility-matrix-example.md',
];
const REQUIRED_COMPATIBILITY_DOC_EXAMPLES = [
  'compatibility-audit-human.md',
  'compatibility-audit-json.json',
  'compatibility-audit-explanation.md',
];
const SUSPICIOUS_ALLOWED_TOOLS = [
  '*',
  'all',
  'shell',
  'bash',
  'sh',
  'powershell',
  'cmd',
  'python',
  'node',
  'filesystem',
  'network',
];

const results = [];

function findRepoRoot(startDir) {
  let current = resolve(startDir);

  for (let i = 0; i < 8; i += 1) {
    if (existsSync(join(current, 'README.md')) && existsSync(join(current, 'package.json'))) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return resolve(startDir, '..', '..');
}

function pass(message) {
  results.push({ status: 'pass', message });
}

function fail(message) {
  results.push({ status: 'fail', message });
}

function warn(message) {
  results.push({ status: 'warn', message });
}

function readText(file) {
  return readFileSync(file, 'utf8');
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { data: {}, body: content, error: 'SKILL.md does not start with YAML frontmatter.' };
  }

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { data: {}, body: content, error: 'SKILL.md frontmatter is not closed with ---.' };
  }

  const data = {};
  const yaml = match[1];

  for (const rawLine of yaml.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const index = line.indexOf(':');
    if (index === -1) {
      continue;
    }

    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();
    value = value.replace(/^["']|["']$/g, '');
    data[key] = value;
  }

  return {
    data,
    body: content.slice(match[0].length),
    error: null,
  };
}

function extractReferencePaths(skillContent) {
  const references = new Set();
  const patterns = [
    /`(references\/[^`]+?\.md)`/g,
    /\((references\/[^)]+?\.md)\)/g,
    /\b(references\/[A-Za-z0-9._/-]+?\.md)\b/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(skillContent))) {
      references.add(match[1].replaceAll('\\', '/'));
    }
  }

  return [...references].sort();
}

function hasExecutableBit(file) {
  try {
    return Boolean(statSync(file).mode & 0o111);
  } catch {
    return false;
  }
}

function validateAllowedTools(frontmatter) {
  const raw = frontmatter['allowed-tools'] || frontmatter.allowed_tools;
  if (!raw) {
    pass('No allowed-tools field present.');
    return;
  }

  const tools = raw
    .split(/[,\s]+/)
    .map((tool) => tool.trim().toLowerCase())
    .filter(Boolean);
  const suspicious = tools.filter((tool) => SUSPICIOUS_ALLOWED_TOOLS.includes(tool));

  if (suspicious.length > 0) {
    fail(`allowed-tools contains suspicious broad entries: ${suspicious.join(', ')}`);
  } else {
    pass('allowed-tools field is present and does not contain broad entries.');
  }
}

function validateReadmeInstallInstructions() {
  if (!existsSync(readmePath)) {
    fail('README.md is missing.');
    return;
  }

  const readme = readText(readmePath).toLowerCase();
  const missing = ['codex', 'cursor', 'claude code'].filter((label) => !readme.includes(label));

  if (missing.length > 0) {
    fail(`README.md is missing install instructions for: ${missing.join(', ')}`);
  } else if (!readme.includes('install')) {
    fail('README.md mentions Codex/Cursor/Claude Code but does not include an Install section.');
  } else {
    pass('README.md includes install instructions for Codex, Cursor, and Claude Code.');
  }
}

function validateTemplates() {
  const templateDir = join(skillDir, 'assets', 'templates');

  if (!existsSync(templateDir)) {
    fail('assets/templates directory is missing.');
    return;
  }

  pass('assets/templates directory exists.');

  for (const template of REQUIRED_TEMPLATES) {
    const file = join(templateDir, template);
    if (existsSync(file)) {
      pass(`Template exists: assets/templates/${template}`);
    } else {
      fail(`Missing template: assets/templates/${template}`);
    }
  }
}

function validatePerformanceModule(skillContent) {
  const performanceReference = join(skillDir, 'references', 'performance-optimization.md');
  if (existsSync(performanceReference)) {
    pass('Performance reference exists: references/performance-optimization.md');
  } else {
    fail('Missing performance reference: references/performance-optimization.md');
  }

  if (skillContent.includes('references/performance-optimization.md')) {
    pass('SKILL.md routes performance tasks to references/performance-optimization.md.');
  } else {
    fail('SKILL.md does not reference references/performance-optimization.md.');
  }

  const examplesDir = join(skillDir, 'assets', 'examples');
  for (const example of REQUIRED_PERFORMANCE_EXAMPLES) {
    const file = join(examplesDir, example);
    if (existsSync(file)) {
      pass(`Performance example exists: assets/examples/${example}`);
    } else {
      fail(`Missing performance example: assets/examples/${example}`);
    }
  }

  const fixtureDir = join(repoRoot, 'test-fixtures', 'performance-plugin');
  if (existsSync(fixtureDir)) {
    pass('Performance fixture exists: test-fixtures/performance-plugin');
  } else {
    fail('Missing performance fixture: test-fixtures/performance-plugin');
  }

  const docsExamplesDir = join(repoRoot, 'docs', 'examples');
  for (const example of REQUIRED_PERFORMANCE_DOC_EXAMPLES) {
    const file = join(docsExamplesDir, example);
    if (existsSync(file)) {
      pass(`Performance audit doc example exists: docs/examples/${example}`);
    } else {
      fail(`Missing performance audit doc example: docs/examples/${example}`);
    }
  }

  const jsonExample = join(docsExamplesDir, 'performance-audit-json.json');
  if (existsSync(jsonExample)) {
    try {
      JSON.parse(readText(jsonExample));
      pass('Performance audit JSON example parses.');
    } catch (error) {
      fail(`Performance audit JSON example is invalid JSON: ${error.message}`);
    }
  }

  const auditScript = join(skillDir, 'scripts', 'audit-plugin.mjs');
  if (existsSync(auditScript) && readText(auditScript).includes('--performance')) {
    pass('audit-plugin.mjs supports --performance.');
  } else {
    fail('audit-plugin.mjs does not appear to support --performance.');
  }
}

function validateDesignModule(skillContent) {
  const designReference = join(skillDir, 'references', 'design-ux-ui.md');
  if (existsSync(designReference)) {
    pass('Design reference exists: references/design-ux-ui.md');
  } else {
    fail('Missing design reference: references/design-ux-ui.md');
  }

  if (skillContent.includes('references/design-ux-ui.md')) {
    pass('SKILL.md routes design tasks to references/design-ux-ui.md.');
  } else {
    fail('SKILL.md does not reference references/design-ux-ui.md.');
  }

  const sourceMap = join(skillDir, 'references', 'source-map.md');
  if (existsSync(sourceMap) && /Design, UX, and UI/i.test(readText(sourceMap))) {
    pass('source-map.md contains a Design, UX, and UI section.');
  } else {
    fail('source-map.md does not contain a Design, UX, and UI section.');
  }

  const examplesDir = join(skillDir, 'assets', 'examples');
  for (const example of REQUIRED_DESIGN_EXAMPLES) {
    const file = join(examplesDir, example);
    if (existsSync(file)) {
      pass(`Design example exists: assets/examples/${example}`);
    } else {
      fail(`Missing design example: assets/examples/${example}`);
    }
  }

  const fixtureDir = join(repoRoot, 'test-fixtures', 'design-plugin');
  if (existsSync(fixtureDir)) {
    pass('Design fixture exists: test-fixtures/design-plugin');
  } else {
    fail('Missing design fixture: test-fixtures/design-plugin');
  }

  const docsExamplesDir = join(repoRoot, 'docs', 'examples');
  for (const example of REQUIRED_DESIGN_DOC_EXAMPLES) {
    const file = join(docsExamplesDir, example);
    if (existsSync(file)) {
      pass(`Design audit doc example exists: docs/examples/${example}`);
    } else {
      fail(`Missing design audit doc example: docs/examples/${example}`);
    }
  }

  const jsonExample = join(docsExamplesDir, 'design-audit-json.json');
  if (existsSync(jsonExample)) {
    try {
      JSON.parse(readText(jsonExample));
      pass('Design audit JSON example parses.');
    } catch (error) {
      fail(`Design audit JSON example is invalid JSON: ${error.message}`);
    }
  }

  const auditScript = join(skillDir, 'scripts', 'audit-plugin.mjs');
  if (existsSync(auditScript) && readText(auditScript).includes('--design')) {
    pass('audit-plugin.mjs supports --design.');
  } else {
    fail('audit-plugin.mjs does not appear to support --design.');
  }
}

function validateCompatibilityModule(skillContent) {
  const compatibilityReference = join(skillDir, 'references', 'integrations-compatibility.md');
  if (existsSync(compatibilityReference)) {
    pass('Integrations/compatibility reference exists: references/integrations-compatibility.md');
  } else {
    fail('Missing integrations/compatibility reference: references/integrations-compatibility.md');
  }

  if (skillContent.includes('references/integrations-compatibility.md')) {
    pass('SKILL.md routes compatibility tasks to references/integrations-compatibility.md.');
  } else {
    fail('SKILL.md does not reference references/integrations-compatibility.md.');
  }

  const sourceMap = join(skillDir, 'references', 'source-map.md');
  if (existsSync(sourceMap) && /Integrations and compatibility/i.test(readText(sourceMap))) {
    pass('source-map.md contains an Integrations and compatibility section.');
  } else {
    fail('source-map.md does not contain an Integrations and compatibility section.');
  }

  const examplesDir = join(skillDir, 'assets', 'examples');
  for (const example of REQUIRED_COMPATIBILITY_EXAMPLES) {
    const file = join(examplesDir, example);
    if (existsSync(file)) {
      pass(`Compatibility example exists: assets/examples/${example}`);
    } else {
      fail(`Missing compatibility example: assets/examples/${example}`);
    }
  }

  const fixtureDir = join(repoRoot, 'test-fixtures', 'compatibility-plugin');
  if (existsSync(fixtureDir)) {
    pass('Compatibility fixture exists: test-fixtures/compatibility-plugin');
  } else {
    fail('Missing compatibility fixture: test-fixtures/compatibility-plugin');
  }

  const docsExamplesDir = join(repoRoot, 'docs', 'examples');
  for (const example of REQUIRED_COMPATIBILITY_DOC_EXAMPLES) {
    const file = join(docsExamplesDir, example);
    if (existsSync(file)) {
      pass(`Compatibility audit doc example exists: docs/examples/${example}`);
    } else {
      fail(`Missing compatibility audit doc example: docs/examples/${example}`);
    }
  }

  const jsonExample = join(docsExamplesDir, 'compatibility-audit-json.json');
  if (existsSync(jsonExample)) {
    try {
      JSON.parse(readText(jsonExample));
      pass('Compatibility audit JSON example parses.');
    } catch (error) {
      fail(`Compatibility audit JSON example is invalid JSON: ${error.message}`);
    }
  }

  const auditScript = join(skillDir, 'scripts', 'audit-plugin.mjs');
  if (existsSync(auditScript) && readText(auditScript).includes('--compatibility')) {
    pass('audit-plugin.mjs supports --compatibility.');
  } else {
    fail('audit-plugin.mjs does not appear to support --compatibility.');
  }
}

function validateScripts() {
  const scriptDir = join(skillDir, 'scripts');

  if (!existsSync(scriptDir)) {
    fail('scripts directory is missing.');
    return;
  }

  pass('scripts directory exists.');

  const scriptFiles = readdirSync(scriptDir).filter((file) => /\.(mjs|js|sh)$/.test(file));

  for (const script of REQUIRED_SCRIPTS) {
    if (!scriptFiles.includes(script)) {
      fail(`Missing script: scripts/${script}`);
    }
  }

  for (const script of scriptFiles.sort()) {
    const fullPath = join(scriptDir, script);
    const content = readText(fullPath);
    const extension = extname(script);

    if (extension === '.mjs' || extension === '.js') {
      pass(`Script is Node-runnable by extension: scripts/${script}`);
      continue;
    }

    if (extension === '.sh') {
      if (!content.startsWith('#!/usr/bin/env bash')) {
        fail(`Shell script lacks portable bash shebang: scripts/${script}`);
      } else if (process.platform !== 'win32' && !hasExecutableBit(fullPath)) {
        warn(`Shell script has a shebang but is not executable on this filesystem: scripts/${script}`);
      } else {
        pass(`Shell script is runnable: scripts/${script}`);
      }
    }
  }
}

function validateReferences(skillContent) {
  const referencePaths = extractReferencePaths(skillContent);

  if (referencePaths.length === 0) {
    fail('SKILL.md does not list any references/*.md files.');
    return;
  }

  pass(`SKILL.md lists ${referencePaths.length} reference file(s).`);

  for (const reference of referencePaths) {
    const file = join(skillDir, reference);
    if (existsSync(file)) {
      pass(`Reference exists: ${reference}`);
    } else {
      fail(`Missing reference listed in SKILL.md: ${reference}`);
    }
  }
}

function validateSkill() {
  console.log('Validating WordPress Plugin Dev skill');
  console.log(`Skill directory: ${skillDir}`);
  console.log('');

  if (!existsSync(skillPath)) {
    fail('skills/wordpress-plugin-dev/SKILL.md is missing.');
    return;
  }

  pass('SKILL.md exists.');

  const skillContent = readText(skillPath);
  const lineCount = skillContent.split(/\r?\n/).length;
  if (lineCount <= 500) {
    pass(`SKILL.md line count is within limit: ${lineCount}/500.`);
  } else {
    fail(`SKILL.md is too long: ${lineCount}/500 lines.`);
  }

  const { data: frontmatter, error } = parseFrontmatter(skillContent);
  if (error) {
    fail(error);
  } else {
    pass('YAML frontmatter parsed.');
  }

  for (const key of REQUIRED_FRONTMATTER) {
    if (frontmatter[key]) {
      pass(`Frontmatter contains ${key}.`);
    } else {
      fail(`Frontmatter missing required field: ${key}.`);
    }
  }

  if (frontmatter.name) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name)) {
      fail(`Frontmatter name is not lowercase kebab-case: ${frontmatter.name}`);
    } else {
      pass('Frontmatter name is lowercase kebab-case.');
    }

    if (frontmatter.name === skillName) {
      pass(`Frontmatter name matches parent directory: ${skillName}.`);
    } else {
      fail(`Frontmatter name (${frontmatter.name}) does not match parent directory (${skillName}).`);
    }
  }

  if (frontmatter.description) {
    if (frontmatter.description.length <= 1024) {
      pass(`Description length is within limit: ${frontmatter.description.length}/1024.`);
    } else {
      fail(`Description is too long: ${frontmatter.description.length}/1024 characters.`);
    }
  } else {
    fail('Description is empty.');
  }

  validateAllowedTools(frontmatter);
  validateReferences(skillContent);
  validateTemplates();
  validateScripts();
  validatePerformanceModule(skillContent);
  validateDesignModule(skillContent);
  validateCompatibilityModule(skillContent);
  validateReadmeInstallInstructions();
}

validateSkill();

const failures = results.filter((result) => result.status === 'fail');
const warnings = results.filter((result) => result.status === 'warn');

for (const result of results) {
  const prefix = result.status === 'pass' ? '[PASS]' : result.status === 'warn' ? '[WARN]' : '[FAIL]';
  console.log(`${prefix} ${result.message}`);
}

console.log('');
console.log(`Result: ${results.length - failures.length - warnings.length} passed, ${warnings.length} warning(s), ${failures.length} failure(s).`);

if (failures.length > 0) {
  process.exit(1);
}
