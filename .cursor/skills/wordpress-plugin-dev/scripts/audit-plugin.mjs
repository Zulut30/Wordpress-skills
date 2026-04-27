#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const EXCLUDED_DIRS = new Set([
  '.git',
  '.svn',
  '.hg',
  'node_modules',
  'vendor',
  '.wp-env',
  '.cache',
  'coverage',
  'dist',
  'build-release',
]);

const SAFE_OUTPUT_RE =
  /\b(esc_html|esc_attr|esc_url|esc_js|esc_textarea|esc_xml|esc_html__|esc_attr__|esc_html_e|esc_attr_e|wp_kses|wp_kses_post|wp_json_encode|get_block_wrapper_attributes|checked|selected|disabled|readonly)\s*\(/;

const SANITIZE_OR_VALIDATE_RE =
  /\b(sanitize_[a-z0-9_]+|rest_sanitize_[a-z0-9_]+|rest_validate_[a-z0-9_]+|validate_[a-z0-9_]+|absint|intval|floatval|boolval|filter_input|wp_unslash|map_deep|preg_match|wp_verify_nonce|check_admin_referer|check_ajax_referer)\s*\(/;

const NONCE_RE = /\b(wp_verify_nonce|check_admin_referer|check_ajax_referer)\s*\(/;
const CAPABILITY_RE = /\b(current_user_can|user_can|map_meta_cap)\s*\(/;
const PERFORMANCE_EXPENSIVE_RE =
  /\b(wp_remote_get|wp_remote_post|file_get_contents|glob|scandir|get_posts|flush_rewrite_rules)\s*\(|new\s+WP_Query\s*\(|\$wpdb->get_results\s*\(/;
const PERFORMANCE_SCOPE_RE =
  /\b(is_admin|wp_doing_ajax|REST_REQUEST|get_current_screen|is_singular|is_page|is_post_type_archive|has_shortcode|has_block|is_main_query|current_user_can|wp_is_serving_rest_request)\s*\(/;
const CACHE_RE = /\b(get_transient|set_transient|wp_cache_get|wp_cache_set)\s*\(/;
const BATCH_RE = /\b(batch|limit|offset|paged|per_page|posts_per_page|numberposts)\b/i;
const BROAD_CSS_SELECTOR_RE = /^\s*(body|html|h[1-6]|p|a|button|input|select|textarea|table|tr|td|th|ul|ol|li|\*)\s*[{,]/i;
const COMPAT_GUARD_RE =
  /\b(class_exists|interface_exists|function_exists|defined|did_action|has_action|has_filter|is_plugin_active|wp_script_is|wp_style_is)\s*\(/;
const THIRD_PARTY_PATTERNS = [
  { name: 'Yoast SEO', pattern: /\b(WPSEO_|YoastSEO|Yoast\\|Yoast_SEO|wpseo_)\b/i },
  { name: 'Rank Math', pattern: /\b(RankMath|RANK_MATH_VERSION|rank_math_)\b/i },
  { name: 'AIOSEO', pattern: /\b(AIOSEO|aioseo|All_In_One_SEO)\b/i },
  { name: 'SEOPress', pattern: /\b(SEOPRESS|seopress_)\b/i },
  { name: 'The SEO Framework', pattern: /\b(THE_SEO_FRAMEWORK|the_seo_framework|tsf_)\b/i },
  { name: 'WP Rocket', pattern: /\b(WP_ROCKET|rocket_clean|rocket_.*cache)\b/i },
  { name: 'LiteSpeed Cache', pattern: /\b(LSCWP|LiteSpeed_Cache|litespeed_)\b/i },
  { name: 'W3 Total Cache', pattern: /\b(W3TC|w3tc_|W3_Total_Cache)\b/i },
  { name: 'Autoptimize', pattern: /\b(autoptimize|AUTOPTIMIZE)\b/i },
  { name: 'Elementor', pattern: /\b(ELEMENTOR_VERSION|Elementor\\|elementor\/|elementor_)\b/i },
  { name: 'Divi', pattern: /\b(ET_Builder|ET_BUILDER|et_pb_|et_core)\b/i },
  { name: 'Astra', pattern: /\b(ASTRA_EXT|astra_)\b/i },
];
const THEME_SPECIFIC_RE = /\b(astra_|generatepress_|kadence_|oceanwp_|blocksy_|hello_elementor|twentytwenty|ET_Builder|et_pb_)\b/i;

export function parseArgs(argv) {
  const args = [...argv];
  const json = args.includes('--json');
  const performance = args.includes('--performance') || args.includes('--performance-only');
  const performanceOnly = args.includes('--performance-only');
  const design = args.includes('--design') || args.includes('--design-only');
  const designOnly = args.includes('--design-only');
  const compatibility = args.includes('--compatibility') || args.includes('--compatibility-only');
  const compatibilityOnly = args.includes('--compatibility-only');
  const help = args.includes('--help') || args.includes('-h');
  const failOnArg = args.find((arg) => arg.startsWith('--fail-on='));
  const failOn = failOnArg ? failOnArg.split('=')[1] : 'error';
  const filtered = args.filter(
    (arg) =>
      arg !== '--json' &&
      arg !== '--performance' &&
      arg !== '--performance-only' &&
      arg !== '--design' &&
      arg !== '--design-only' &&
      arg !== '--compatibility' &&
      arg !== '--compatibility-only' &&
      arg !== '--help' &&
      arg !== '-h' &&
      !arg.startsWith('--fail-on=')
  );

  return {
    json,
    performance,
    performanceOnly,
    design,
    designOnly,
    compatibility,
    compatibilityOnly,
    failOn: ['error', 'warning', 'none'].includes(failOn) ? failOn : 'error',
    help,
    target: filtered[0] ? resolve(filtered[0]) : null,
  };
}

export function parsePluginHeaders(content) {
  const headerLabels = [
    'Plugin Name',
    'Description',
    'Version',
    'Requires at least',
    'Requires PHP',
    'Author',
    'License',
    'License URI',
    'Text Domain',
    'Domain Path',
    'Update URI',
    'Requires Plugins',
  ];
  const headers = {};

  for (const label of headerLabels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = content.match(new RegExp(`^[ \\t/*#@]*${escaped}:\\s*(.+?)\\s*$`, 'im'));
    if (match) {
      headers[label] = match[1].trim();
    }
  }

  return headers;
}

export function lineNumberForIndex(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

export function walkFiles(rootDir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of readdirSync(currentDir)) {
      if (EXCLUDED_DIRS.has(entry)) {
        continue;
      }

      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return files.sort();
}

function readText(file) {
  return readFileSync(file, 'utf8');
}

function toDisplayPath(rootDir, file) {
  if (!file) {
    return null;
  }

  return isAbsolute(file) ? relative(rootDir, file).replaceAll('\\', '/') || basename(file) : file;
}

function categoryFromRule(rule) {
  return rule.includes('.') ? rule.split('.')[0] : 'general';
}

function addFinding(report, severity, rule, file, line, message, remediation, details = {}) {
  report.findings.push({
    severity,
    category: details.category || categoryFromRule(rule),
    rule,
    file: file ? toDisplayPath(report.targetPath, file) : null,
    line: line || null,
    message,
    why: details.why || undefined,
    remediation,
    confidence: details.confidence || undefined,
  });
}

function addInfo(report, rule, file, line, message, remediation, details = {}) {
  addFinding(report, 'info', rule, file, line, message, remediation, details);
}

function addWarning(report, rule, file, line, message, remediation, details = {}) {
  addFinding(report, 'warning', rule, file, line, message, remediation, details);
}

function addError(report, rule, file, line, message, remediation, details = {}) {
  addFinding(report, 'error', rule, file, line, message, remediation, details);
}

function nearbyText(lines, lineIndex, before = 3, after = 3) {
  const start = Math.max(0, lineIndex - before);
  const end = Math.min(lines.length, lineIndex + after + 1);
  return lines.slice(start, end).join('\n');
}

function callWindow(lines, startIndex, maxLines = 80) {
  const collected = [];
  let depth = 0;
  let started = false;

  for (let i = startIndex; i < Math.min(lines.length, startIndex + maxLines); i += 1) {
    const line = lines[i];
    collected.push(line);

    for (const char of line) {
      if (char === '(') {
        depth += 1;
        started = true;
      } else if (char === ')') {
        depth -= 1;
      }
    }

    if (started && depth <= 0 && /;\s*$/.test(line)) {
      break;
    }
  }

  return collected.join('\n');
}

function countTopLevelCommas(callText) {
  let depth = 0;
  let commas = 0;
  let inString = null;
  let escaped = false;

  for (const char of callText) {
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = char;
      continue;
    }

    if (char === '(' || char === '[' || char === '{') {
      depth += 1;
    } else if (char === ')' || char === ']' || char === '}') {
      depth = Math.max(0, depth - 1);
    } else if (char === ',' && depth <= 1) {
      commas += 1;
    }
  }

  return commas;
}

function parseJsonFile(report, file, rule) {
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    addError(
      report,
      rule,
      file,
      1,
      `Invalid JSON: ${error.message}`,
      'Fix JSON syntax before relying on this file in WordPress or build tooling.'
    );
    return null;
  }
}

function findMainPluginFile(rootDir, phpFiles) {
  const candidates = [];

  for (const file of phpFiles) {
    const content = readText(file);
    const headers = parsePluginHeaders(content);
    if (headers['Plugin Name']) {
      candidates.push({ file, headers });
    }
  }

  candidates.sort((a, b) => {
    const aDepth = relative(rootDir, a.file).split(/[\\/]/).length;
    const bDepth = relative(rootDir, b.file).split(/[\\/]/).length;
    return aDepth - bDepth || a.file.localeCompare(b.file);
  });

  return candidates[0] || null;
}

function auditMainPluginFile(report, rootDir, phpFiles) {
  const main = findMainPluginFile(rootDir, phpFiles);

  if (!main) {
    addError(
      report,
      'main-plugin-file.missing-header',
      rootDir,
      null,
      'No PHP file with a WordPress plugin header was found.',
      'Add a valid plugin header with at least Plugin Name, Version, and Text Domain to the main plugin PHP file.'
    );
    return null;
  }

  report.summary.mainPluginFile = toDisplayPath(rootDir, main.file);
  const content = readText(main.file);
  const headers = main.headers;

  for (const required of ['Plugin Name', 'Version', 'Text Domain']) {
    if (!headers[required]) {
      addError(
        report,
        `main-plugin-file.missing-${required.toLowerCase().replaceAll(' ', '-')}`,
        main.file,
        1,
        `Plugin header is missing ${required}.`,
        `Add a ${required}: field to the main plugin header.`
      );
    }
  }

  for (const recommended of ['Requires at least', 'Requires PHP']) {
    if (!headers[recommended]) {
      addWarning(
        report,
        `main-plugin-file.missing-${recommended.toLowerCase().replaceAll(' ', '-')}`,
        main.file,
        1,
        `Plugin header is missing ${recommended}.`,
        `Add ${recommended}: to declare compatibility for users, CI, and WordPress.org release checks.`
      );
    }
  }

  if (!/defined\s*\(\s*['"]ABSPATH['"]\s*\)\s*(\|\|\s*exit|or\s+die|\|\|\s*die)/.test(content)) {
    addWarning(
      report,
      'main-plugin-file.missing-abspath-guard',
      main.file,
      1,
      'Main plugin file does not have an obvious ABSPATH direct access guard.',
      "Add `defined( 'ABSPATH' ) || exit;` near the top of executable plugin files."
    );
  }

  return main;
}

function auditSecurityHeuristics(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index);

      if (/\$_(?:GET|POST|REQUEST)\s*\[/.test(line) && !SANITIZE_OR_VALIDATE_RE.test(window)) {
        addWarning(
          report,
          'security.superglobal-without-nearby-sanitization',
          file,
          lineNumber,
          'Request superglobal is used without nearby sanitization or validation.',
          'Validate intent and type first, then sanitize using a WordPress sanitizer such as sanitize_text_field(), sanitize_key(), absint(), or map_deep() as appropriate.'
        );
      }

      if (/\b(?:echo|print)\b/.test(line) && !SAFE_OUTPUT_RE.test(line)) {
        addWarning(
          report,
          'security.output-without-obvious-escaping',
          file,
          lineNumber,
          'Output statement does not include an obvious escaping function.',
          'Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.'
        );
      }

      if (/\$wpdb->(?:query|get_results|get_var|get_row|get_col)\s*\(/.test(line)) {
        const sqlWindow = nearbyText(lines, index, 3, 8);
        const withoutWpdb = sqlWindow.replace(/\$wpdb/g, '');
        if (/\$[A-Za-z_][A-Za-z0-9_]*/.test(withoutWpdb) && !/\$wpdb->prepare\s*\(/.test(sqlWindow)) {
          addWarning(
            report,
            'security.wpdb-query-without-prepare',
            file,
            lineNumber,
            '$wpdb query appears to include variables without nearby prepare().',
            'Prefer WordPress APIs. When custom SQL is necessary, use $wpdb->prepare() for every variable value.'
          );
        }
      }

      if (/register_rest_route\s*\(/.test(line)) {
        const routeWindow = callWindow(lines, index);
        if (!/permission_callback\s*['"]?\s*=>/.test(routeWindow)) {
          addError(
            report,
            'security.rest-route-missing-permission-callback',
            file,
            lineNumber,
            'register_rest_route() call has no permission_callback.',
            'Add a permission_callback. Use __return_true only for intentionally public endpoints.'
          );
        } else if (/permission_callback\s*['"]?\s*=>\s*['"]__return_true['"]/.test(routeWindow)) {
          addInfo(
            report,
            'security.rest-route-public-permission-callback',
            file,
            lineNumber,
            'REST route uses __return_true as permission_callback.',
            'Confirm the endpoint is intentionally public and does not expose private data or mutation operations.'
          );
        }
      }

      if (/add_action\s*\(\s*['"]admin_post(?:_nopriv)?_[^'"]+['"]/.test(line)) {
        const handlerWindow = callWindow(lines, index, 120);
        const fileWindow = content;

        if (!NONCE_RE.test(handlerWindow) && !NONCE_RE.test(fileWindow)) {
          addWarning(
            report,
            'security.admin-post-handler-missing-nonce',
            file,
            lineNumber,
            'admin_post handler has no obvious nonce check.',
            'Verify intent with check_admin_referer() or wp_verify_nonce() before mutating data.'
          );
        }

        if (!CAPABILITY_RE.test(handlerWindow) && !CAPABILITY_RE.test(fileWindow)) {
          addWarning(
            report,
            'security.admin-post-handler-missing-capability',
            file,
            lineNumber,
            'admin_post handler has no obvious capability check.',
            'Check current_user_can() for the exact operation before reading or writing protected data.'
          );
        }
      }

      if (/add_action\s*\(\s*['"]wp_ajax_[^'"]+['"]/.test(line)) {
        const handlerWindow = callWindow(lines, index, 120);
        const fileWindow = content;

        if (!NONCE_RE.test(handlerWindow) && !NONCE_RE.test(fileWindow)) {
          addWarning(
            report,
            'security.ajax-handler-missing-nonce',
            file,
            lineNumber,
            'wp_ajax handler has no obvious nonce check.',
            'Use check_ajax_referer() or wp_verify_nonce() before processing AJAX requests.'
          );
        }

        if (!/_nopriv_/.test(line) && !CAPABILITY_RE.test(handlerWindow) && !CAPABILITY_RE.test(fileWindow)) {
          addWarning(
            report,
            'security.ajax-handler-missing-capability',
            file,
            lineNumber,
            'wp_ajax handler has no obvious capability check.',
            'Check current_user_can() for authenticated AJAX operations that read or mutate protected data.'
          );
        }
      }
    });
  }
}

function auditBlocks(report, files) {
  const blockFiles = files.filter((file) => basename(file) === 'block.json');
  report.summary.blockJsonFiles = blockFiles.length;

  if (blockFiles.length === 0) {
    addInfo(
      report,
      'blocks.no-block-json',
      null,
      null,
      'No block.json files found.',
      'This is fine for non-block plugins. For block plugins, use block.json as the block metadata source of truth.'
    );
    return;
  }

  for (const file of blockFiles) {
    const block = parseJsonFile(report, file, 'blocks.invalid-block-json');
    if (!block) {
      continue;
    }

    if (!block.name || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(block.name)) {
      addError(
        report,
        'blocks.invalid-name',
        file,
        1,
        'block.json name is missing or does not use namespace/slug format.',
        'Set name to a lowercase namespace/slug value such as my-plugin/featured-card.'
      );
    }

    if (!block.apiVersion) {
      addWarning(
        report,
        'blocks.missing-api-version',
        file,
        1,
        'block.json is missing apiVersion.',
        'Set apiVersion to the current stable version supported by the plugin minimum WordPress version.'
      );
    }

    if (!block.textdomain) {
      addWarning(
        report,
        'blocks.missing-textdomain',
        file,
        1,
        'block.json is missing textdomain.',
        'Set textdomain to the plugin text domain so block strings can be translated.'
      );
    }

    if (block.render || block.renderCallback) {
      addInfo(
        report,
        'blocks.dynamic-render-reminder',
        file,
        1,
        'Dynamic block render output should be validated and escaped.',
        'Treat attributes as untrusted in render.php or render callbacks; validate, sanitize, authorize if needed, and escape late.'
      );
    }
  }
}

function auditBuildFiles(report, rootDir) {
  const packageFile = join(rootDir, 'package.json');
  const composerFile = join(rootDir, 'composer.json');

  if (!existsSync(packageFile)) {
    addInfo(
      report,
      'build.no-package-json',
      packageFile,
      null,
      'package.json not found.',
      'This is fine for PHP-only plugins. Block/editor plugins should usually define @wordpress/scripts build, lint, and package scripts.'
    );
  } else {
    const pkg = parseJsonFile(report, packageFile, 'build.invalid-package-json');
    const scripts = pkg?.scripts || {};

    for (const scriptName of ['build', 'start', 'lint:js']) {
      if (!scripts[scriptName]) {
        addWarning(
          report,
          `build.package-json-missing-${scriptName}`,
          packageFile,
          1,
          `package.json is missing scripts.${scriptName}.`,
          `Add a ${scriptName} script when the plugin ships block/editor JavaScript.`
        );
      }
    }

    if (!scripts['lint:css'] && !scripts['lint:style']) {
      addWarning(
        report,
        'build.package-json-missing-style-lint',
        packageFile,
        1,
        'package.json is missing a CSS/style lint script.',
        'Add lint:css or lint:style using wp-scripts lint-style when the plugin has CSS or SCSS.'
      );
    }
  }

  if (!existsSync(composerFile)) {
    addInfo(
      report,
      'build.no-composer-json',
      composerFile,
      null,
      'composer.json not found.',
      'Small plugins can avoid Composer, but namespaced or tested plugins should usually define autoload and lint/test scripts.'
    );
  } else {
    const composer = parseJsonFile(report, composerFile, 'build.invalid-composer-json');
    const autoload = composer?.autoload || {};
    const scripts = composer?.scripts || {};

    if (!autoload['psr-4']) {
      addWarning(
        report,
        'build.composer-missing-psr4',
        composerFile,
        1,
        'composer.json does not define autoload.psr-4.',
        'Use PSR-4 autoloading for namespaced plugin classes when the plugin has a src/ architecture.'
      );
    }

    if (!scripts.lint && !scripts['lint:php']) {
      addWarning(
        report,
        'build.composer-missing-lint-script',
        composerFile,
        1,
        'composer.json does not define a PHP lint script.',
        'Add a lint or lint:php script that runs PHPCS with WPCS.'
      );
    }
  }
}

function auditReleaseFiles(report, rootDir, mainHeaders) {
  const readmeFile = join(rootDir, 'readme.txt');
  if (!existsSync(readmeFile)) {
    addWarning(
      report,
      'release.missing-readme',
      readmeFile,
      null,
      'readme.txt not found.',
      'Add a WordPress.org-style readme.txt with stable tag, tested up to, requires at least, requires PHP, FAQ, and changelog sections before public release.'
    );
  }

  const licenseFiles = ['LICENSE', 'LICENSE.txt', 'license.txt', 'COPYING'].map((name) => join(rootDir, name));
  const hasLicenseFile = licenseFiles.some((file) => existsSync(file));
  const hasLicenseHeader = Boolean(mainHeaders?.License);

  if (!hasLicenseFile && !hasLicenseHeader) {
    addWarning(
      report,
      'release.missing-license',
      rootDir,
      null,
      'No license file or License plugin header found.',
      'Add a GPL-compatible license file and keep the plugin header/readme license metadata consistent.'
    );
  }
}

function addPerformanceFinding(report, severity, rule, file, line, message, why, remediation, confidence = 'medium') {
  addFinding(report, severity, rule, file, line, message, remediation, {
    category: 'performance',
    why,
    confidence,
  });
}

function auditPerformanceHooks(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 8, 12);

      if (/flush_rewrite_rules\s*\(/.test(line) && !/register_(activation|deactivation|uninstall)_hook|activate|deactivate|uninstall/i.test(window)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.hooks.flush-rewrite-rules-on-request',
          file,
          lineNumber,
          'flush_rewrite_rules() appears outside activation/deactivation/uninstall context.',
          'Flushing rewrite rules is expensive and writes rewrite state; it should not run on normal requests.',
          'Move rewrite flushing to activation/deactivation or a versioned migration after rewrite-dependent objects are registered.',
          'high'
        );
      }

      if (/wp_schedule_event\s*\(/.test(line) && !/wp_next_scheduled\s*\(/.test(window)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.hooks.cron-schedule-without-guard',
          file,
          lineNumber,
          'wp_schedule_event() appears without a nearby wp_next_scheduled() guard.',
          'Unconditional scheduling can create duplicate cron events or unnecessary option writes.',
          'Schedule on activation or guard scheduling with wp_next_scheduled().',
          'high'
        );
      }

      if (/add_action\s*\(\s*['"]pre_get_posts['"]/.test(line)) {
        const fileWindow = content;
        if (!/is_admin\s*\(/.test(fileWindow) || !/is_main_query\s*\(/.test(fileWindow)) {
          addPerformanceFinding(
            report,
            'warning',
            'performance.hooks.unscoped-pre-get-posts',
            file,
            lineNumber,
            'pre_get_posts hook has no obvious admin/main-query context guards.',
            'Unscoped query mutation can affect unrelated frontend, admin, REST, and editor queries.',
            'Gate with is_admin(), is_main_query(), query vars, post type, route, or another narrow context check.',
            'medium'
          );
        }
      }

      if (/add_action\s*\(\s*['"](init|plugins_loaded|admin_init|wp)['"]/.test(line)) {
        const hookWindow = callWindow(lines, index, 140);
        if (PERFORMANCE_EXPENSIVE_RE.test(hookWindow) && !PERFORMANCE_SCOPE_RE.test(hookWindow)) {
          addPerformanceFinding(
            report,
            'warning',
            'performance.hooks.expensive-work-on-broad-hook',
            file,
            lineNumber,
            'Broad lifecycle hook appears to run expensive work without an obvious scope guard.',
            'Expensive work on broad hooks can slow every frontend/admin/editor/REST request.',
            'Move setup to activation, lazy-load work, or gate the callback by request context before running expensive operations.',
            'medium'
          );
        }
      }

      if (/\b(wp_remote_get|wp_remote_post)\s*\(/.test(line) && !CACHE_RE.test(window)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.hooks.remote-call-without-cache-nearby',
          file,
          lineNumber,
          'Remote HTTP call has no nearby cache usage.',
          'Remote calls during request handling can block page render and fail unpredictably.',
          'Add a short timeout, cache successful public responses, short-cache failures, and move heavy sync to cron when suitable.',
          'medium'
        );
      }
    });
  }
}

function auditPerformanceAssets(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);
    const enqueueCount = (content.match(/\bwp_enqueue_(?:script|style)\s*\(/g) || []).length;

    if (enqueueCount >= 8) {
      addPerformanceFinding(
        report,
        'info',
        'performance.assets.many-enqueues-in-file',
        file,
        1,
        `File contains ${enqueueCount} enqueue calls.`,
        'Many assets in one file can be legitimate, but often indicates global loading or missing asset boundaries.',
        'Review whether admin, editor, frontend, and block assets can be split and scoped.',
        'low'
      );
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = callWindow(lines, index, 120);
      const nearby = nearbyText(lines, index, 10, 14);

      if (/add_action\s*\(\s*['"]admin_enqueue_scripts['"]/.test(line) && !/\$hook_suffix|get_current_screen\s*\(/.test(window + nearby)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.assets.admin-enqueue-without-screen-check',
          file,
          lineNumber,
          'admin_enqueue_scripts callback has no obvious screen check.',
          'Admin assets loaded on every wp-admin screen slow unrelated admin workflows.',
          'Gate by $hook_suffix or get_current_screen()->id before enqueueing plugin-specific assets.',
          'medium'
        );
      }

      if (/add_action\s*\(\s*['"]wp_enqueue_scripts['"]/.test(line)) {
        const hookWindow = callWindow(lines, index, 160);
        if (/\bwp_enqueue_(?:script|style)\s*\(/.test(hookWindow) && !PERFORMANCE_SCOPE_RE.test(hookWindow)) {
          addPerformanceFinding(
            report,
            'info',
            'performance.assets.frontend-enqueue-without-context-check',
            file,
            lineNumber,
            'Frontend enqueue callback has no obvious context check.',
            'Global frontend assets increase bytes and parse/execute work on pages that may not use the plugin UI.',
            'Scope by block presence, shortcode, route, template, post type, or feature state when practical.',
            'low'
          );
        }
      }

      if (/\bwp_enqueue_script\s*\(/.test(line)) {
        const enqueueWindow = callWindow(lines, index, 30);
        if (/plugins_url\s*\(|plugin_dir_url\s*\(|content_url\s*\(/.test(enqueueWindow) && !/(PLUGIN_VERSION|VERSION|filemtime|asset\[['"]version['"]|wp_get_theme|time\s*\(|['"]\d+\.\d+(?:\.\d+)?['"])/i.test(enqueueWindow)) {
          addPerformanceFinding(
            report,
            'info',
            'performance.assets.script-missing-obvious-version',
            file,
            lineNumber,
            'Script enqueue has no obvious version argument.',
            'Missing versions can make cache invalidation unreliable for static assets.',
            'Use plugin version or generated .asset.php metadata for dependencies and versioning.',
            'low'
          );
        }

        if (!/strategy\s*['"]?\s*=>|in_footer\s*['"]?\s*=>|true\s*\)/.test(enqueueWindow)) {
          addPerformanceFinding(
            report,
            'info',
            'performance.assets.consider-script-loading-strategy',
            file,
            lineNumber,
            'Script enqueue does not show an explicit footer/strategy decision.',
            'Non-critical frontend scripts can often avoid blocking render when loaded in the footer or with a safe loading strategy.',
            'Verify target WordPress support and add a footer or loading strategy only when dependencies and behavior remain correct.',
            'low'
          );
        }
      }
    });
  }
}

function auditPerformanceQueries(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = callWindow(lines, index, 120);
      const nearbyBefore = nearbyText(lines, index, 6, 1);

      if (/['"]posts_per_page['"]\s*=>\s*-1|['"]numberposts['"]\s*=>\s*-1/.test(line)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.query.unbounded-post-query',
          file,
          lineNumber,
          'Query requests all matching posts with -1.',
          'Unbounded post queries can load large datasets and exhaust memory on production sites.',
          'Add pagination or a safe upper bound. Use fields => ids when only IDs are needed.',
          'high'
        );
      }

      if (/new\s+WP_Query\s*\(|get_posts\s*\(/.test(line)) {
        if (!/no_found_rows\s*['"]?\s*=>/.test(window) && !/paged\s*['"]?\s*=>|pagination|paginate/i.test(window)) {
          addPerformanceFinding(
            report,
            'info',
            'performance.query.missing-no-found-rows',
            file,
            lineNumber,
            'Query has no obvious no_found_rows setting.',
            'When pagination totals are not needed, avoiding FOUND_ROWS-style totals can reduce database work.',
            'Set no_found_rows => true for non-paginated queries where total counts are not needed.',
            'low'
          );
        }

        if (/foreach\s*\(|while\s*\(/.test(nearbyBefore)) {
          addPerformanceFinding(
            report,
            'warning',
            'performance.query.query-inside-loop',
            file,
            lineNumber,
            'WP_Query/get_posts appears inside a loop.',
            'Queries inside loops often create N+1 query patterns.',
            'Prefetch data, batch IDs, prime caches, or move the query outside the loop.',
            'medium'
          );
        }
      }

      if (/\$wpdb->(?:get_results|get_var|get_row|get_col|query)\s*\(/.test(line) && /SELECT/i.test(window) && !/\bLIMIT\b/i.test(window)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.query.direct-select-without-limit',
          file,
          lineNumber,
          'Direct SQL SELECT has no obvious LIMIT.',
          'Unbounded SQL can scan and return too many rows on production data.',
          'Add LIMIT/OFFSET or use a paginated WordPress API. Keep using $wpdb->prepare() for variables.',
          'medium'
        );
      }

      if (/CREATE\s+TABLE/i.test(window) && !/\b(KEY|INDEX|PRIMARY\s+KEY)\b/i.test(window)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.query.custom-table-without-index',
          file,
          lineNumber,
          'Custom table schema has no obvious key or index.',
          'High-volume custom tables need indexes for lookup, joins, cleanup, and reporting queries.',
          'Add PRIMARY KEY and targeted KEY/INDEX definitions for expected access patterns.',
          'medium'
        );
      }
    });
  }
}

function auditPerformanceOptionsAndCache(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = callWindow(lines, index, 80);
      const nearby = nearbyText(lines, index, 6, 6);

      if (/\b(add_option|update_option)\s*\(/.test(line) && /add_action\s*\(\s*['"](init|wp|plugins_loaded|template_redirect)['"]/.test(content)) {
        addPerformanceFinding(
          report,
          'info',
          'performance.options.option-write-in-request-context',
          file,
          lineNumber,
          'Option write appears in a file with broad request hooks.',
          'Option writes during normal page views can cause database writes, cache invalidations, and autoload bloat.',
          'Ensure option writes happen only on explicit admin actions, activation, migrations, cron, or validated REST/admin requests.',
          'low'
        );
      }

      if (/set_transient\s*\(/.test(line) && countTopLevelCommas(window) < 2) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.cache.transient-without-expiration',
          file,
          lineNumber,
          'set_transient() appears without an expiration argument.',
          'Non-expiring transients can persist indefinitely and may be autoloaded when stored in options.',
          'Add an explicit TTL and an invalidation strategy.',
          'medium'
        );
      }

      if (/=\s*get_transient\s*\(/.test(line) && !/false\s*!==|false\s*===/.test(nearby)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.cache.transient-loose-miss-check',
          file,
          lineNumber,
          'get_transient() result has no obvious strict false cache-miss check nearby.',
          'Falsey cached values such as 0, empty string, or empty array can be mistaken for cache misses.',
          'Use false === $cached or false !== $cached checks.',
          'medium'
        );
      }

      if (/set_transient\s*\(/.test(line) && !/delete_transient\s*\(/.test(content)) {
        addPerformanceFinding(
          report,
          'info',
          'performance.cache.no-obvious-transient-invalidation',
          file,
          lineNumber,
          'Transient writes found with no delete_transient() in the same file.',
          'Caches that depend on content/settings can serve stale output without invalidation hooks.',
          'Add invalidation on relevant content, option, term, or plugin-specific change hooks, or document TTL-only behavior.',
          'low'
        );
      }
    });
  }
}

function auditPerformanceRest(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (!/register_rest_route\s*\(/.test(line)) {
        return;
      }

      const lineNumber = index + 1;
      const routeWindow = callWindow(lines, index, 180);
      const fileWindow = content;

      if (!/(page|paged|per_page|limit)\s*['"]?\s*=>/.test(routeWindow)) {
        addPerformanceFinding(
          report,
          'info',
          'performance.rest.collection-without-pagination-args',
          file,
          lineNumber,
          'REST route has no obvious pagination/limit args.',
          'Collection endpoints without pagination can return large payloads and run expensive queries.',
          'Add page/per_page or limit args with validation and a safe maximum for collection endpoints.',
          'low'
        );
      }

      if (/(new\s+WP_Query|get_posts)\s*\(/.test(fileWindow) && /posts_per_page\s*['"]?\s*=>\s*-1/.test(fileWindow)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.rest.unbounded-query-near-route',
          file,
          lineNumber,
          'REST route file contains an unbounded post query.',
          'REST endpoints are often high-volume and should not return unbounded datasets.',
          'Paginate, limit fields, and cache public safe responses when appropriate.',
          'medium'
        );
      }

      if (/permission_callback\s*['"]?\s*=>\s*['"]__return_true['"]/.test(routeWindow) && PERFORMANCE_EXPENSIVE_RE.test(fileWindow) && !CACHE_RE.test(fileWindow)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.rest.public-expensive-endpoint-without-cache',
          file,
          lineNumber,
          'Public REST endpoint appears near expensive operations without cache usage.',
          'Public endpoints can receive repeated anonymous traffic and amplify expensive work.',
          'Cache safe public responses, paginate, and keep permission/validation semantics intact.',
          'medium'
        );
      }

      if (!/schema|properties|fields|context/.test(routeWindow)) {
        addPerformanceFinding(
          report,
          'info',
          'performance.rest.no-obvious-response-shape-control',
          file,
          lineNumber,
          'REST route has no obvious schema or response shape control nearby.',
          'Small response shapes reduce payload size and client-side work.',
          'Return only required fields and add schema/field controls where practical.',
          'low'
        );
      }
    });
  }
}

function auditPerformanceBlocks(report, files) {
  const blockJsonFiles = files.filter((file) => basename(file) === 'block.json');
  const blockLikeFiles = files.filter((file) => /[\\/]blocks[\\/].+\.(php|js|json)$/.test(file));
  const blockDirsWithJson = new Set(blockJsonFiles.map((file) => dirname(file)));

  for (const file of files.filter((candidate) => basename(candidate) === 'render.php' || extname(candidate).toLowerCase() === '.php')) {
    if (!/[\\/]blocks[\\/]|render/i.test(file)) {
      continue;
    }

    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = callWindow(lines, index, 120);

      if (/(new\s+WP_Query|get_posts)\s*\(/.test(line)) {
        if (!CACHE_RE.test(content)) {
          addPerformanceFinding(
            report,
            'warning',
            'performance.blocks.dynamic-render-query-without-cache',
            file,
            lineNumber,
            'Dynamic block render code runs a query without obvious caching.',
            'Dynamic block render callbacks can run on every page view where the block appears.',
            'Bound the query and add fragment caching with invalidation when output is safe to cache.',
            'medium'
          );
        }

        if (!/posts_per_page\s*['"]?\s*=>/.test(window)) {
          addPerformanceFinding(
            report,
            'warning',
            'performance.blocks.dynamic-render-query-without-limit',
            file,
            lineNumber,
            'Dynamic block render query has no obvious posts_per_page limit.',
            'Unbounded render queries can slow high-traffic pages and archives.',
            'Add a small upper bound and pagination or cache strategy as needed.',
            'medium'
          );
        }
      }
    });
  }

  for (const file of blockJsonFiles) {
    const block = parseJsonFile(report, file, 'performance.blocks.invalid-block-json');
    if (!block) {
      continue;
    }

    if (block.script || block.viewScript || block.viewScriptModule) {
      addPerformanceFinding(
        report,
        'info',
        'performance.blocks.review-frontend-block-assets',
        file,
        1,
        'block.json declares frontend-capable script assets.',
        'Frontend block scripts add bytes and runtime work to pages where the block appears.',
        'Verify the script is needed on the frontend and keep editor/view scripts split.',
        'low'
      );
    }
  }

  for (const file of blockLikeFiles) {
    const dir = dirname(file);
    if (!blockDirsWithJson.has(dir) && basename(file) !== 'block.json') {
      addPerformanceFinding(
        report,
        'info',
        'performance.blocks.block-files-without-block-json',
        file,
        1,
        'Block-like files exist without block.json in the same directory.',
        'Missing block metadata can lead to manual asset loading and less predictable block registration.',
        'Use block.json as the block metadata source when this directory represents a block.',
        'low'
      );
    }
  }
}

function auditPerformanceCron(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    if (!/wp_schedule_event|wp_cron|cron|_scheduled|schedule/i.test(content)) {
      continue;
    }

    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 12, 24);

      if (/(new\s+WP_Query|get_posts)\s*\(/.test(line) && /posts_per_page\s*['"]?\s*=>\s*-1/.test(window)) {
        addPerformanceFinding(
          report,
          'warning',
          'performance.cron.unbounded-query-in-cron',
          file,
          lineNumber,
          'Cron/background code appears to run an unbounded post query.',
          'Long cron runs can overlap, time out, or block other scheduled work.',
          'Batch work with limits, offsets/cursors, locks, and idempotent processing.',
          'medium'
        );
      }

      if (PERFORMANCE_EXPENSIVE_RE.test(line) && !BATCH_RE.test(window)) {
        addPerformanceFinding(
          report,
          'info',
          'performance.cron.expensive-job-without-batching-indicator',
          file,
          lineNumber,
          'Cron/background code has expensive work without an obvious batching indicator.',
          'Large jobs should avoid doing all work in one request.',
          'Add batching, locks, retry/backoff, and observability appropriate to the job.',
          'low'
        );
      }

      if (PERFORMANCE_EXPENSIVE_RE.test(line) && !/lock|get_transient|set_transient|wp_cache_add/i.test(window)) {
        addPerformanceFinding(
          report,
          'info',
          'performance.cron.expensive-job-without-lock-indicator',
          file,
          lineNumber,
          'Expensive cron/background work has no obvious lock.',
          'Without a lock, overlapping runs can duplicate work or increase load.',
          'Use a short-lived transient/object-cache lock and make the job idempotent.',
          'low'
        );
      }
    });
  }
}

function auditPerformanceHeuristics(report, files, phpFiles) {
  report.performance = {
    limitation:
      'Performance findings are static heuristics. They can miss bottlenecks and produce false positives; verify with profiling, production-sized data, and current WordPress docs.',
  };

  auditPerformanceHooks(report, phpFiles);
  auditPerformanceAssets(report, phpFiles);
  auditPerformanceQueries(report, phpFiles);
  auditPerformanceOptionsAndCache(report, phpFiles);
  auditPerformanceRest(report, phpFiles);
  auditPerformanceBlocks(report, files);
  auditPerformanceCron(report, phpFiles);
}

function addDesignFinding(report, severity, rule, file, line, message, why, remediation, confidence = 'medium') {
  addFinding(report, severity, rule, file, line, message, remediation, {
    category: 'design',
    why,
    confidence,
  });
}

function isAdminUiFile(file, content) {
  return (
    /admin|settings|dashboard|notice|onboard/i.test(file) ||
    /\b(add_menu_page|add_submenu_page|register_setting|settings_fields|admin_enqueue_scripts)\s*\(/.test(content)
  );
}

function lineHasTranslatableString(line) {
  return /(__|_x|_n|sprintf|esc_html__|esc_attr__)\s*\(/.test(line);
}

function hasNearbyLabel(lines, index) {
  const nearby = nearbyText(lines, index, 8, 3);
  return /<label\b|aria-label\s*=|aria-labelledby\s*=|<fieldset\b|<legend\b/i.test(nearby);
}

function auditDesignAdmin(report, phpFiles) {
  for (const file of phpFiles) {
    const content = readText(file);
    if (!isAdminUiFile(file, content)) {
      continue;
    }

    const lines = content.split(/\r?\n/);

    if (/\b(add_menu_page)\s*\(/.test(content)) {
      addDesignFinding(
        report,
        'info',
        'design.admin.top-level-menu-review',
        file,
        lineNumberForIndex(content, content.search(/\badd_menu_page\s*\(/)),
        'Plugin registers a top-level admin menu.',
        'Top-level menus add navigation weight and should be reserved for primary plugin workflows.',
        'Confirm the feature deserves top-level placement; otherwise prefer an appropriate submenu such as Settings, Tools, or a product-specific parent.',
        'low'
      );
    }

    if (/<form\b/i.test(content) && !/\b(settings_fields|wp_nonce_field|check_admin_referer)\s*\(/.test(content)) {
      addDesignFinding(
        report,
        'warning',
        'design.admin.form-without-obvious-nonce-flow',
        file,
        lineNumberForIndex(content, content.search(/<form\b/i)),
        'Admin form has no obvious Settings API or nonce flow.',
        'Good UI must preserve secure save behavior and clear state-changing intent.',
        'Use Settings API with settings_fields() or add wp_nonce_field() plus a capability and nonce check in the handler.',
        'medium'
      );
    }

    if (/<form\b/i.test(content) && !/class\s*=\s*["'][^"']*\bwrap\b/.test(content)) {
      addDesignFinding(
        report,
        'info',
        'design.admin.page-without-wrap',
        file,
        lineNumberForIndex(content, content.search(/<form\b/i)),
        'Admin page markup has no obvious .wrap container.',
        'Classic WordPress admin pages feel more native and inherit spacing when using the standard wrap structure.',
        'Render the page inside <div class="wrap plugin-root-class"> unless a custom app shell is explicitly justified.',
        'low'
      );
    }

    if (isAdminUiFile(file, content) && /<form\b|class\s*=\s*["'][^"']*\bwrap\b/.test(content) && !/<h1\b/i.test(content)) {
      addDesignFinding(
        report,
        'info',
        'design.admin.missing-page-heading',
        file,
        1,
        'Admin UI file has no obvious page h1.',
        'A clear page heading anchors the screen for visual, keyboard, and screen-reader users.',
        'Add one escaped, translatable <h1> that describes the current admin screen.',
        'low'
      );
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 8, 8);

      if (/add_action\s*\(\s*['"]admin_enqueue_scripts['"]/.test(line) && !/\$hook_suffix|get_current_screen\s*\(/.test(window + content)) {
        addDesignFinding(
          report,
          'warning',
          'design.admin.assets-not-screen-scoped',
          file,
          lineNumber,
          'Admin assets are enqueued without an obvious screen check.',
          'Unscoped admin CSS/JS can alter unrelated WordPress screens and slow the admin experience.',
          'Gate admin assets by $hook_suffix or get_current_screen()->id.',
          'medium'
        );
      }

      if (/\b(submit_button)\s*\(\s*['"](?:Submit|Go|OK)['"]|<button[^>]*>\s*(?:Submit|Go|OK)\s*<\/button>|value\s*=\s*['"](?:Submit|Go|OK)['"]/i.test(line)) {
        addDesignFinding(
          report,
          'info',
          'design.admin.vague-action-label',
          file,
          lineNumber,
          'Action label is vague.',
          'Specific button text reduces mistakes and helps users predict what will happen.',
          'Use task-specific labels such as Save settings, Connect account, Regenerate cache, or Import items.',
          'low'
        );
      }

      if (/notice(?:-|_)(?:success|error|warning|info)|class\s*=\s*["'][^"']*\bnotice\b/.test(line) && /\becho\b/.test(line) && !SAFE_OUTPUT_RE.test(line)) {
        addDesignFinding(
          report,
          'warning',
          'design.admin.notice-output-not-escaped',
          file,
          lineNumber,
          'Admin notice appears to echo content without obvious escaping.',
          'Notices are high-visibility UI and often include request or option data.',
          'Escape notice text with esc_html(), wp_kses_post(), or another context-appropriate escaping function.',
          'medium'
        );
      }

      if (/is-dismissible/.test(line) && !/dismiss|preference|user_meta|option/i.test(content)) {
        addDesignFinding(
          report,
          'info',
          'design.admin.dismissible-notice-without-persistence',
          file,
          lineNumber,
          'Dismissible notice has no obvious persistence plan.',
          'Dismissed notices that return unexpectedly create admin noise and reduce trust.',
          'Persist dismissal when the notice is not tied to a transient event.',
          'low'
        );
      }
    });
  }
}

function auditDesignForms(report, files) {
  const formFiles = files.filter((file) => /\.(php|html|js|jsx|ts|tsx)$/i.test(file));

  for (const file of formFiles) {
    const content = readText(file);
    if (!/<(?:input|select|textarea)\b|<(?:TextControl|SelectControl|ToggleControl|CheckboxControl|RadioControl)\b/.test(content)) {
      continue;
    }

    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 6, 6);

      if (/<(?:input|select|textarea)\b/i.test(line) && !hasNearbyLabel(lines, index)) {
        addDesignFinding(
          report,
          'warning',
          'design.forms.control-without-label',
          file,
          lineNumber,
          'Form control has no obvious label or accessible name nearby.',
          'Controls without names are difficult or impossible to use with assistive technology.',
          'Add a visible <label for="..."> or a justified aria-label/aria-labelledby association.',
          'medium'
        );
      }

      if (/<(?:input|textarea)\b/i.test(line) && /placeholder\s*=/.test(line) && !hasNearbyLabel(lines, index)) {
        addDesignFinding(
          report,
          'warning',
          'design.forms.placeholder-used-as-label',
          file,
          lineNumber,
          'Placeholder appears to be used without a real label.',
          'Placeholder text disappears as users type and is not a reliable accessible name.',
          'Keep the placeholder optional and add a persistent visible label.',
          'medium'
        );
      }

      if (/type\s*=\s*["'](?:checkbox|radio)["']/.test(line) && !/<fieldset\b|<legend\b/i.test(window)) {
        addDesignFinding(
          report,
          'info',
          'design.forms.choice-group-without-fieldset',
          file,
          lineNumber,
          'Checkbox/radio control has no nearby fieldset/legend.',
          'Grouped choices need context so users understand what the selection controls.',
          'Wrap related checkbox/radio controls in a fieldset with a concise legend.',
          'low'
        );
      }

      if (/class\s*=\s*["'][^"']*(error|invalid|notice-error)/i.test(line) && !/aria-describedby|role\s*=\s*["']alert|wp\.a11y|speak\(/.test(window)) {
        addDesignFinding(
          report,
          'info',
          'design.forms.error-not-programmatically-associated',
          file,
          lineNumber,
          'Error message is not obviously associated with a field or live region.',
          'Users should be able to find and hear validation errors near the affected control.',
          'Connect field errors with aria-describedby and use role="alert" or wp.a11y.speak() for dynamic errors when appropriate.',
          'low'
        );
      }

      if (/<(?:input|select|textarea)\b/i.test(line) && /required\b/.test(line) && !/(required|aria-required|screen-reader-text|\*)/i.test(window.replace(line, ''))) {
        addDesignFinding(
          report,
          'info',
          'design.forms.required-field-not-explained',
          file,
          lineNumber,
          'Required field has no obvious visible or screen-reader explanation nearby.',
          'Users need to know which fields are required before submission.',
          'Add text or screen-reader text that explains required fields and keep server-side validation.',
          'low'
        );
      }
    });
  }
}

function auditDesignFrontend(report, files) {
  const candidateFiles = files.filter((file) => /\.(php|html|css|scss)$/i.test(file));

  for (const file of candidateFiles) {
    const content = readText(file);
    const lowerPath = file.toLowerCase();
    const isFrontend = /frontend|public|shortcode|widget|block|render|view/.test(lowerPath) && !/admin/.test(lowerPath);
    const lines = content.split(/\r?\n/);

    if (/\.(css|scss)$/i.test(file)) {
      lines.forEach((line, index) => {
        const lineNumber = index + 1;

        if (isFrontend && BROAD_CSS_SELECTOR_RE.test(line)) {
          addDesignFinding(
            report,
            'warning',
            'design.frontend.global-css-selector',
            file,
            lineNumber,
            'Frontend stylesheet contains a broad global selector.',
            'Plugin frontend CSS should not override theme typography, spacing, or controls globally.',
            'Scope selectors under the plugin wrapper or block class.',
            'medium'
          );
        }

        if (isFrontend && /font-family\s*:/.test(line)) {
          addDesignFinding(
            report,
            'info',
            'design.frontend.hardcoded-font-family',
            file,
            lineNumber,
            'Frontend CSS sets a font family.',
            'Plugin output should usually inherit the active theme typography unless branding is explicitly configured.',
            'Remove the hardcoded font-family or make it an opt-in branded setting.',
            'low'
          );
        }
      });
    }

    if (isFrontend && /<form\b/i.test(content) && !/<label\b|aria-label\s*=|aria-labelledby\s*=/i.test(content)) {
      addDesignFinding(
        report,
        'warning',
        'design.frontend.form-without-labels',
        file,
        lineNumberForIndex(content, content.search(/<form\b/i)),
        'Frontend form has no obvious labels or accessible names.',
        'Public forms must be understandable to keyboard and screen-reader users.',
        'Add labels, descriptions, error states, and semantic form structure.',
        'medium'
      );
    }

    if (isFrontend && /style\s*=\s*["'][^"']*(?:<\?php\s+echo|\$\w+)/.test(content)) {
      addDesignFinding(
        report,
        'warning',
        'design.frontend.inline-style-from-dynamic-data',
        file,
        lineNumberForIndex(content, content.search(/style\s*=/)),
        'Frontend inline style appears to include dynamic data.',
        'Inline user-controlled styles can create sanitization, maintainability, and theme-compatibility problems.',
        'Sanitize allowed style values strictly, prefer classes, and escape attributes.',
        'medium'
      );
    }

    if (isFrontend && (content.match(/<div\b/g) || []).length >= 8 && !/<(?:section|article|header|footer|nav|main|ul|ol|form)\b/i.test(content)) {
      addDesignFinding(
        report,
        'info',
        'design.frontend.div-heavy-markup',
        file,
        1,
        'Frontend output appears div-heavy with little semantic structure.',
        'Semantic HTML improves accessibility, theme styling, and maintainability.',
        'Use section/article/list/form/headings where they match the content meaning.',
        'low'
      );
    }
  }
}

function auditDesignGutenberg(report, files) {
  const blockJsFiles = files.filter((file) => /[\\/]blocks[\\/].+\.(js|jsx|ts|tsx)$/.test(file));

  for (const file of blockJsFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);
    const controlCount = (content.match(/<(?:TextControl|TextareaControl|ToggleControl|SelectControl|RangeControl|ColorPalette|PanelBody|ToolsPanelItem)\b/g) || []).length;

    if (/InspectorControls/.test(content) && controlCount >= 10) {
      addDesignFinding(
        report,
        'warning',
        'design.blocks.overloaded-inspector-controls',
        file,
        1,
        `Block editor file contains many inspector controls (${controlCount}).`,
        'Overloaded sidebars hide the primary editing task and increase cognitive load.',
        'Move primary content controls onto the canvas, group advanced settings, and remove controls that can use block supports.',
        'medium'
      );
    }

    if (!/Placeholder/.test(content) && /attributes|setAttributes|InspectorControls/.test(content)) {
      addDesignFinding(
        report,
        'info',
        'design.blocks.no-obvious-placeholder',
        file,
        1,
        'Block edit UI has no obvious Placeholder component.',
        'Blocks that require setup should explain the next step before content exists.',
        'Add a concise Placeholder with a primary setup action when the block starts empty or disconnected.',
        'low'
      );
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const componentWindow = callWindow(lines, index, 60);

      if (/<(?:TextControl|TextareaControl|ToggleControl|SelectControl|RangeControl)\b/.test(line) && !/label\s*=/.test(componentWindow)) {
        addDesignFinding(
          report,
          'warning',
          'design.blocks.control-without-label',
          file,
          lineNumber,
          'Block editor control has no obvious label prop.',
          'Editor controls need labels for usability, accessibility, and translation context.',
          'Add a concise translatable label prop.',
          'medium'
        );
      }

      if (/(?:label|title|help|text|children)\s*=\s*["'][A-Z][^"']+["']/.test(line) && !lineHasTranslatableString(line)) {
        addDesignFinding(
          report,
          'info',
          'design.blocks.editor-string-not-i18n',
          file,
          lineNumber,
          'Editor UI string is not obviously wrapped in @wordpress/i18n.',
          'Block editor UI text should be translation-ready.',
          'Wrap strings with __(), _x(), or related @wordpress/i18n helpers and use the plugin text domain.',
          'low'
        );
      }

      if (/<ToolbarButton\b/.test(line) && !/(label|title|aria-label)\s*=/.test(componentWindow)) {
        addDesignFinding(
          report,
          'info',
          'design.blocks.toolbar-button-without-label',
          file,
          lineNumber,
          'ToolbarButton has no obvious accessible label/title.',
          'Icon-only toolbar controls need accessible names.',
          'Add a translatable label/title or aria-label that names the action.',
          'low'
        );
      }

      if (/<button\b/i.test(line) && !/(aria-label|aria-labelledby|>\s*{?\s*__\(|>\s*[A-Za-z])/.test(componentWindow)) {
        addDesignFinding(
          report,
          'warning',
          'design.blocks.custom-button-without-accessible-name',
          file,
          lineNumber,
          'Custom button has no obvious accessible name.',
          'Buttons need visible text or an accessible name to be operable by assistive technology.',
          'Use @wordpress/components Button with translatable text or add a justified aria-label.',
          'medium'
        );
      }
    });
  }
}

function auditDesignDynamicUi(report, files) {
  const uiFiles = files.filter((file) => /\.(js|jsx|ts|tsx|php)$/i.test(file));

  for (const file of uiFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 6, 6);

      if (/\b(textContent|innerText|innerHTML)\s*=/.test(line) && !/(wp\.a11y|speak\s*\(|aria-live|role\s*=\s*["']status)/.test(content)) {
        addDesignFinding(
          report,
          'info',
          'design.dynamic-update-without-announcement',
          file,
          lineNumber,
          'Dynamic UI update has no obvious screen-reader announcement.',
          'Important async status changes should be perceivable beyond visual changes.',
          'Use @wordpress/a11y speak(), wp.a11y.speak(), or an appropriate live region for meaningful updates.',
          'low'
        );
      }

      if (/\b(error|exception)\.message\b|stack trace|var_dump\s*\(|print_r\s*\(/i.test(line) && !/debug|fixture/i.test(window)) {
        addDesignFinding(
          report,
          'warning',
          'design.errors.raw-error-exposed',
          file,
          lineNumber,
          'Raw error details appear in user-facing UI.',
          'Raw errors can confuse users and may expose internals.',
          'Show a safe human-readable message and log detailed diagnostics privately.',
          'medium'
        );
      }
    });
  }
}

function auditDesignCss(report, files) {
  const cssFiles = files.filter((file) => /\.(css|scss)$/i.test(file));

  for (const file of cssFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);
    const importantCount = (content.match(/!important/g) || []).length;
    const hasMotion = /\b(animation|transition)\s*:/.test(content);

    if (/admin/i.test(file)) {
      lines.forEach((line, index) => {
        if (BROAD_CSS_SELECTOR_RE.test(line)) {
          addDesignFinding(
            report,
            'warning',
            'design.admin.global-css-selector',
            file,
            index + 1,
            'Admin stylesheet contains a broad/global selector.',
            'Plugin admin CSS should not override unrelated WordPress admin screens.',
            'Scope selectors under the plugin admin root class.',
            'medium'
          );
        }
      });
    }

    if (importantCount >= 4) {
      addDesignFinding(
        report,
        'info',
        'design.css.excessive-important',
        file,
        1,
        `Stylesheet contains ${importantCount} !important declarations.`,
        'Heavy !important usage usually indicates specificity conflicts and can break themes/admin styles.',
        'Reduce specificity conflicts by scoping CSS and using predictable component classes.',
        'low'
      );
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 2, 4);

      if (/outline\s*:\s*none|outline\s*:\s*0/.test(line) && !/focus-visible|box-shadow|outline\s*:/i.test(window.replace(line, ''))) {
        addDesignFinding(
          report,
          'warning',
          'design.css.removes-focus-without-replacement',
          file,
          lineNumber,
          'CSS removes outline without an obvious replacement focus style.',
          'Visible focus is required for keyboard users.',
          'Add a strong :focus or :focus-visible style when removing the browser default.',
          'high'
        );
      }

      if (/\b(left|right|margin-left|margin-right|padding-left|padding-right)\s*:/.test(line)) {
        addDesignFinding(
          report,
          'info',
          'design.css.physical-direction-property',
          file,
          lineNumber,
          'CSS uses physical left/right properties.',
          'Physical direction assumptions can make RTL layouts harder to support.',
          'Prefer logical properties such as margin-inline-start, inset-inline-end, or text-align: start where practical.',
          'low'
        );
      }

      if (/(^|[;{\s])width\s*:\s*(?:\d{3,}|[4-9]\d)px/.test(line)) {
        addDesignFinding(
          report,
          'info',
          'design.css.fixed-width-review',
          file,
          lineNumber,
          'CSS uses a fixed pixel width.',
          'Fixed widths can break mobile admin, narrow editor sidebars, or theme layouts.',
          'Use max-width, minmax(), flex/grid, or responsive constraints where possible.',
          'low'
        );
      }
    });

    if (hasMotion && !/prefers-reduced-motion/.test(content)) {
      addDesignFinding(
        report,
        'info',
        'design.css.motion-without-reduced-motion',
        file,
        1,
        'Stylesheet uses animation/transition without a prefers-reduced-motion branch.',
        'Some users prefer reduced motion, and admin UI should respect that preference.',
        'Add a @media (prefers-reduced-motion: reduce) override when motion is not essential.',
        'low'
      );
    }
  }
}

function auditDesignHeuristics(report, files, phpFiles) {
  report.design = {
    limitation:
      'Design findings are static heuristics. They cannot fully judge visual quality, contrast, responsiveness, usability, or real WordPress admin/editor behavior; verify with manual UI review and assistive-technology checks.',
  };

  auditDesignAdmin(report, phpFiles);
  auditDesignForms(report, files);
  auditDesignFrontend(report, files);
  auditDesignGutenberg(report, files);
  auditDesignDynamicUi(report, files);
  auditDesignCss(report, files);
}

function addCompatibilityFinding(report, severity, rule, file, line, message, why, remediation, confidence = 'medium') {
  addFinding(report, severity, rule, file, line, message, remediation, {
    category: 'compatibility',
    why,
    confidence,
  });
}

function hasCompatibilityGuard(text) {
  const withoutBootstrapGuard = text.replace(/\bdefined\s*\(\s*['"]ABSPATH['"]\s*\)/g, '');
  return COMPAT_GUARD_RE.test(withoutBootstrapGuard) || /\bif\s*\(|\?\s*:/.test(withoutBootstrapGuard);
}

function isCompatCandidateFile(file) {
  return /\.(php|js|jsx|ts|tsx|css|scss|md|txt)$/i.test(file);
}

function isCompatCodeFile(file) {
  return /\.(php|js|jsx|ts|tsx|css|scss)$/i.test(file);
}

function auditCompatibilityOptionalDependencies(report, files) {
  for (const file of files.filter(isCompatCodeFile)) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 8, 8);

      if (/\b(?:include|include_once|require|require_once)\b.*(?:wp-content[\\/]+plugins[\\/]+|WP_PLUGIN_DIR)/i.test(line)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.optional-dependency.direct-plugin-include',
          file,
          lineNumber,
          'Code includes files from another plugin directory.',
          'Directly including third-party plugin files is fragile and can fatal when paths or versions change.',
          'Use feature detection and documented public APIs/hooks instead of requiring third-party plugin internals.',
          'high'
        );
      }

      for (const integration of THIRD_PARTY_PATTERNS) {
        if (!integration.pattern.test(line) || hasCompatibilityGuard(window)) {
          continue;
        }

        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.optional-dependency.unguarded-reference',
          file,
          lineNumber,
          `${integration.name} appears to be referenced without nearby feature detection.`,
          'Optional integrations can fatal or misbehave when the plugin/theme/builder is inactive or changes APIs.',
          'Move integration code into an adapter and guard it with class_exists(), function_exists(), defined(), did_action(), or a documented detection method.',
          'medium'
        );
      }
    });
  }
}

function auditCompatibilityClassicEditor(report, files, phpFiles) {
  const hasBlocks = files.some((file) => basename(file) === 'block.json');
  const allPhp = phpFiles.map(readText).join('\n');

  if (hasBlocks && !/add_shortcode\s*\(|add_meta_box\s*\(/.test(allPhp)) {
    addCompatibilityFinding(
      report,
      'info',
      'compatibility.editor.block-only-no-classic-fallback',
      null,
      null,
      'Block files were found without an obvious shortcode or Classic Editor fallback.',
      'Some plugins need non-block insertion for Classic Editor or legacy workflows.',
      'Document that the plugin is block-only, or add a shortcode/metabox fallback backed by shared render/save services.',
      'low'
    );
  }

  for (const file of phpFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    if (/add_meta_box\s*\(/.test(content) && /save_post/.test(content)) {
      const saveFunctionIndex = lines.findIndex((line) => /function\s+\w*save|public function save/.test(line));
      const saveActionIndex = lines.findIndex((line) => /save_post/.test(line));
      const saveIndex = saveFunctionIndex >= 0 ? saveFunctionIndex : saveActionIndex;
      const saveWindow = saveIndex >= 0 ? lines.slice(saveIndex, saveIndex + 80).join('\n') : content;
      if (!NONCE_RE.test(saveWindow) || !CAPABILITY_RE.test(saveWindow)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.editor.metabox-save-missing-security',
          file,
          saveIndex >= 0 ? saveIndex + 1 : 1,
          'Classic Editor metabox save flow lacks an obvious nonce and capability check.',
          'Classic fallbacks must preserve the same security posture as block/editor saves.',
          'Add wp_verify_nonce()/check_admin_referer(), current_user_can(), sanitization, and escaping.',
          'medium'
        );
      }
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 6, 8);

      if (/\b(mce_buttons|mce_external_plugins|teeny_mce_before_init)\b/.test(line) && !/(get_current_screen|post\.php|post-new\.php|use_block_editor_for_post_type)/.test(window)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.editor.tinymce-assets-not-scoped',
          file,
          lineNumber,
          'TinyMCE/editor integration has no obvious screen or editor-context guard.',
          'Classic editor assets loaded globally can slow wp-admin and conflict with block editor screens.',
          'Gate TinyMCE assets by screen ID, post type, and editor context.',
          'low'
        );
      }

      if (/wp_enqueue_(?:script|style)\s*\(/.test(line) && /wp-edit-post|wp-block-editor|wp-blocks/.test(window) && !/use_block_editor_for_post_type|get_current_screen|enqueue_block_editor_assets/.test(content)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.editor.block-assets-context-review',
          file,
          lineNumber,
          'Block editor assets appear without an obvious editor-context guard.',
          'Block editor assets should not load in Classic Editor or unrelated admin screens.',
          'Use enqueue_block_editor_assets or screen/post-type checks.',
          'low'
        );
      }
    });
  }
}

function auditCompatibilitySeo(report, files, phpFiles) {
  const schemaFiles = [];

  for (const file of files.filter(isCompatCodeFile)) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);
    if (/application\/ld\+json|Schema\.org|schema_org|schema/i.test(content)) {
      schemaFiles.push(file);
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 10, 12);
      const seoOutputLine =
        /<title\b|rel=["']canonical|name=["']description|property=["']og:|name=["']twitter:|application\/ld\+json|name=["']robots/i.test(
          line
        );
      const seoOutput =
        seoOutputLine ||
        /<title\b|rel=["']canonical|name=["']description|property=["']og:|name=["']twitter:|application\/ld\+json|name=["']robots/i.test(
          window
        );

      if (seoOutputLine && /wp_head/.test(window) && !/(WPSEO|RANK_MATH|AIOSEO|SEOPRESS|THE_SEO_FRAMEWORK|apply_filters|should_output|seo_plugin)/i.test(content)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.seo.unconditional-head-output',
          file,
          lineNumber,
          'SEO-relevant head output appears without an SEO plugin guard.',
          'Manual title, canonical, meta, social, or schema output can duplicate SEO plugin output.',
          'Add an SEO output guard, use documented SEO plugin hooks, and fallback only when no SEO plugin handles the concern.',
          'medium'
        );
      }

      if (seoOutputLine && seoOutput && !/apply_filters\s*\(/.test(content)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.seo.output-not-filterable',
          file,
          lineNumber,
          'SEO-relevant output is not obviously filterable.',
          'SEO integrations often need project-specific overrides without editing plugin code.',
          'Expose documented filters around fallback SEO output and document when they run.',
          'low'
        );
      }

      if (/fetch\s*\(|wp\.apiFetch|axios\./.test(line) && /(schema|description|title|seo|content)/i.test(window) && !/render\.php|register_block_type|add_shortcode/.test(content)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.seo.client-only-content-review',
          file,
          lineNumber,
          'SEO-relevant content appears to be fetched client-side without an obvious server-rendered fallback.',
          'Search crawlers and social scrapers may miss client-only content depending on context.',
          'Provide server-rendered block/shortcode fallback when the content matters for SEO.',
          'low'
        );
      }
    });
  }

  if (schemaFiles.length > 1) {
    addCompatibilityFinding(
      report,
      'info',
      'compatibility.seo.multiple-schema-files',
      schemaFiles[0],
      1,
      `Schema-related output appears in multiple files (${schemaFiles.length}).`,
      'Multiple schema sources increase duplicate or inconsistent structured data risk.',
      'Centralize schema fallback logic and guard against active SEO plugins.',
      'low'
    );
  }
}

function auditCompatibilityCache(report, files) {
  for (const file of files.filter(isCompatCandidateFile)) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 10, 10);
      const purgeAllLine = /\b(rocket_clean_domain|wp_cache_flush|w3tc_flush_all|litespeed_purge_all|do_action\s*\(\s*['"]litespeed_purge_all)/i.test(line);

      if (purgeAllLine && /\b(add_action\s*\(\s*['"](?:init|wp|admin_init)|function\s+\w+)/.test(window)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.cache.purge-all-on-request',
          file,
          lineNumber,
          'Full cache purge appears in a normal request hook or broad callback.',
          'Purging all cache during normal requests can destroy site performance and conflict with cache plugins.',
          'Purge only affected URLs/posts on content/settings changes or explicit admin maintenance actions.',
          'high'
        );
      }

      if (/delete_(?:site_)?transient\s*\(\s*['"]_?transient|DELETE\s+FROM\s+.*_options.*_transient/i.test(window)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.cache.broad-transient-delete',
          file,
          lineNumber,
          'Code appears to delete broad transient/cache data.',
          'Broad cache deletion can remove unrelated plugin/theme cache and cause avoidable load.',
          'Delete only plugin-owned cache keys or document an explicit admin maintenance action.',
          'medium'
        );
      }

      if (/(get_current_user_id|wp_get_current_user|is_user_logged_in)\s*\(/.test(window) && /\b(echo|print|return)\b/.test(line) && !/(DONOTCACHEPAGE|nocache_headers|private cache|ESI|do not cache)/i.test(content)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.cache.user-specific-public-output',
          file,
          lineNumber,
          'Frontend output may include user-specific data without a cache compatibility note.',
          'User-specific data can leak through public page caches if not isolated.',
          'Separate private fragments, set no-cache behavior where appropriate, or document a private/ESI strategy.',
          'medium'
        );
      }

      if (/(wp_nonce_field|wp_create_nonce)\s*\(/.test(line) && /(shortcode|render|frontend|template|blocks[\\/].*render)/i.test(file) && !/(ESI|private cache|DONOTCACHEPAGE|cache compatibility)/i.test(content)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.cache.public-nonce-review',
          file,
          lineNumber,
          'Public output contains a nonce without an obvious cache compatibility note.',
          'Nonces in public cached HTML can expire or be shared between users.',
          'Avoid public caching for nonce fragments, load nonces dynamically, or use a documented private/ESI strategy.',
          'low'
        );
      }

      if (/(?:time|microtime|rand|mt_rand)\s*\(\s*\)/.test(line) && /(wp_enqueue_|add_query_arg|ver|version)/.test(window)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.cache.random-cache-busting',
          file,
          lineNumber,
          'Asset or URL cache busting appears to use random/time-based values.',
          'Random query strings defeat browser/CDN/cache optimization and can fight performance plugins.',
          'Use plugin version, filemtime during development, or generated asset metadata.',
          'medium'
        );
      }

      if (/disable (?:the )?(?:cache|seo|minification|optimization) plugin/i.test(line)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.docs.disable-plugin-first-solution',
          file,
          lineNumber,
          'Documentation recommends disabling an integration plugin as a first solution.',
          'Compatibility guidance should prefer scoped fixes before disabling other plugins.',
          'Document targeted exclusions, guards, or adapter fixes before suggesting disabling a plugin.',
          'medium'
        );
      }

      if (/<script\b|wp_add_inline_script\s*\(/.test(line) && /(jQuery|document\.ready|window\.|var\s+)/.test(window)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.assets.inline-script-optimizer-review',
          file,
          lineNumber,
          'Inline script may be sensitive to minification or execution-order changes.',
          'Optimization plugins can combine/defer scripts and expose fragile ordering assumptions.',
          'Prefer registered scripts with explicit dependencies and keep inline data small via wp_add_inline_script after the handle.',
          'low'
        );
      }
    });
  }
}

function auditCompatibilityThemes(report, files) {
  for (const file of files.filter(isCompatCandidateFile)) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);
    const isFrontend = /front|public|template|shortcode|blocks|render|theme/i.test(file);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 6, 6);

      if (/\.(css|scss)$/i.test(file) && isFrontend && BROAD_CSS_SELECTOR_RE.test(line)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.theme.global-frontend-css',
          file,
          lineNumber,
          'Frontend stylesheet contains broad/global selectors.',
          'Global CSS can break active themes, block themes, and page-builder layouts.',
          'Scope CSS under a plugin wrapper or block class and avoid resets.',
          'medium'
        );
      }

      if (/\.(css|scss)$/i.test(file) && /!important/.test(line)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.theme.important-review',
          file,
          lineNumber,
          'Stylesheet uses !important.',
          'Specificity fights are a common source of theme and builder conflicts.',
          'Reduce specificity conflicts through scoped selectors and component classes.',
          'low'
        );
      }

      if (/\.(css|scss)$/i.test(file) && /(^|[;{\s])width\s*:\s*(?:\d{3,}|[4-9]\d)px/.test(line)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.theme.fixed-width-review',
          file,
          lineNumber,
          'CSS uses a fixed pixel width.',
          'Fixed widths can break responsive themes and builder columns.',
          'Use max-width, minmax(), flex/grid, and logical properties where practical.',
          'low'
        );
      }

      if (isFrontend && /<div\b/i.test(line) && !/class\s*=/.test(window) && !/<(?:article|section|form|ul|ol|nav)\b/i.test(content)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.theme.frontend-markup-without-wrapper-class',
          file,
          lineNumber,
          'Frontend markup has no obvious scoped wrapper class.',
          'Wrapper classes help scope CSS without overriding theme elements globally.',
          'Add a plugin or block wrapper class and keep markup semantic.',
          'low'
        );
      }

      if (THEME_SPECIFIC_RE.test(line) && !/(wp_get_theme|get_template|get_stylesheet|class_exists|function_exists|defined)/.test(window)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.theme.specific-hook-without-detection',
          file,
          lineNumber,
          'Theme-specific hook or identifier appears without detection.',
          'Theme-specific code can break when the theme changes or a child theme is active.',
          'Detect the theme safely and prefer generic WordPress hooks where possible.',
          'medium'
        );
      }

      if (/get_(?:stylesheet|template)_directory\s*\(|wp-content[\\/]+themes[\\/]+|require.*themes/i.test(line)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.theme.theme-file-assumption',
          file,
          lineNumber,
          'Code appears to depend on theme files or paths.',
          'Plugins should not assume a theme file structure or edit/include theme internals.',
          'Use public hooks, templates, blocks, or documented theme APIs instead.',
          'medium'
        );
      }
    });
  }
}

function auditCompatibilityPageBuilders(report, files) {
  const hasGenericFallback = files
    .filter((file) => /\.(php|js|jsx|ts|tsx)$/i.test(file))
    .some((file) => /(add_shortcode\s*\(|register_block_type\s*\()/.test(readText(file)));

  for (const file of files.filter(isCompatCodeFile)) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);
    const referencesBuilder = /\b(Elementor\\|ELEMENTOR_VERSION|elementor\/|elementor_|ET_Builder|ET_BUILDER|et_pb_)\b/i.test(content);

    if (!referencesBuilder) {
      continue;
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const window = nearbyText(lines, index, 8, 8);

      if (/\b(Elementor\\|ELEMENTOR_VERSION|elementor\/|elementor_|ET_Builder|ET_BUILDER|et_pb_)\b/i.test(line) && !hasCompatibilityGuard(window)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.builder.unguarded-builder-reference',
          file,
          lineNumber,
          'Page-builder-specific code appears without a dependency guard.',
          'Builder adapters should not load when the builder is inactive.',
          'Move code into an optional adapter and detect Elementor/Divi through documented signals.',
          'medium'
        );
      }

      if (/wp_enqueue_(?:script|style)\s*\(/.test(line) && !/(elementor|divi|builder|did_action|class_exists|get_current_screen)/i.test(window)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.builder.assets-not-scoped',
          file,
          lineNumber,
          'Builder-related assets may be enqueued without builder context scoping.',
          'Builder assets loaded globally can affect non-builder pages and admin screens.',
          'Enqueue builder assets only in documented builder/editor/frontend contexts.',
          'low'
        );
      }

      if (/\.(?:elementor|elementor-widget|et_pb_|et-fb)/i.test(line) && !/(adapter|compat|builder)/i.test(file)) {
        addCompatibilityFinding(
          report,
          'info',
          'compatibility.builder.dom-internals-review',
          file,
          lineNumber,
          'CSS/JS selector appears tied to page-builder DOM internals.',
          'Builder DOM internals can change and break compatibility.',
          'Prefer documented hooks/classes or isolate selectors in a builder adapter with manual tests.',
          'low'
        );
      }
    });

    if (!hasGenericFallback) {
      addCompatibilityFinding(
        report,
        'info',
        'compatibility.builder.no-generic-fallback',
        file,
        1,
        'Builder integration file has no obvious shortcode or block fallback.',
        'Builder-specific content should usually have a generic insertion path.',
        'Provide shortcode/block fallback unless the plugin is explicitly builder-only.',
        'low'
      );
    }
  }
}

function auditCompatibilityDocs(report, files) {
  const docFiles = files.filter((file) => /\.(md|txt)$/i.test(file));
  const claimFiles = [];

  for (const file of docFiles) {
    const content = readText(file);
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (/compatible with (?:all|any) (?:themes|plugins|builders)|works with (?:all|any) (?:themes|plugins|builders)/i.test(line)) {
        addCompatibilityFinding(
          report,
          'warning',
          'compatibility.docs.overbroad-claim',
          file,
          index + 1,
          'Documentation makes an overbroad compatibility claim.',
          'No plugin can honestly claim compatibility with all themes/plugins/builders without qualification.',
          'Replace with a tested compatibility matrix and known limitations.',
          'high'
        );
      }

      if (/(Yoast|Rank Math|AIOSEO|SEOPress|WP Rocket|LiteSpeed|W3 Total Cache|Autoptimize|Astra|GeneratePress|Kadence|Elementor|Divi)/i.test(line)) {
        claimFiles.push(file);
      }
    });

    if (/(Yoast|Rank Math|AIOSEO|SEOPress|WP Rocket|LiteSpeed|W3 Total Cache|Autoptimize|Astra|GeneratePress|Kadence|Elementor|Divi)/i.test(content) && !/(compatibility matrix|Status|Docs verified|Known issues)/i.test(content)) {
      addCompatibilityFinding(
        report,
        'info',
        'compatibility.docs.claims-without-matrix',
        file,
        1,
        'Documentation mentions integrations without an obvious compatibility matrix.',
        'Integration claims need status, detection, tested versions, risks, and manual verification notes.',
        'Add a compatibility matrix or mark integrations as planned/experimental/unknown.',
        'low'
      );
    }
  }

  if (claimFiles.length > 0 && !files.some((file) => /compatibility-matrix/i.test(file))) {
    addCompatibilityFinding(
      report,
      'info',
      'compatibility.docs.no-matrix-file',
      claimFiles[0],
      1,
      'Integration claims found but no compatibility matrix file was detected.',
      'A matrix prevents vague support claims and guides manual verification.',
      'Add docs/compatibility-matrix.md or equivalent.',
      'low'
    );
  }
}

function auditCompatibilityHeuristics(report, files, phpFiles) {
  report.compatibility = {
    limitation:
      'Compatibility findings are static heuristics. They cannot prove support for real plugin/theme/builder versions; verify with current third-party docs and manual tests.',
  };

  auditCompatibilityOptionalDependencies(report, files);
  auditCompatibilityClassicEditor(report, files, phpFiles);
  auditCompatibilitySeo(report, files, phpFiles);
  auditCompatibilityCache(report, files);
  auditCompatibilityThemes(report, files);
  auditCompatibilityPageBuilders(report, files);
  auditCompatibilityDocs(report, files);
}

export function auditPlugin(pluginDir, options = {}) {
  const targetPath = resolve(pluginDir);
  if (!existsSync(targetPath) || !statSync(targetPath).isDirectory()) {
    throw new Error(`Plugin directory not found: ${targetPath}`);
  }

  const performance = Boolean(options.performance || options.performanceOnly);
  const performanceOnly = Boolean(options.performanceOnly);
  const design = Boolean(options.design || options.designOnly);
  const designOnly = Boolean(options.designOnly);
  const compatibility = Boolean(options.compatibility || options.compatibilityOnly);
  const compatibilityOnly = Boolean(options.compatibilityOnly);
  const securityEnabled = !performanceOnly && !designOnly && !compatibilityOnly;

  const report = {
    tool: 'wordpress-plugin-dev audit-plugin',
    limitation:
      performance || design || compatibility
        ? 'This is a heuristic scanner for agent review triage, not a security, performance, accessibility, design, or compatibility oracle. It can miss issues and produce false positives; verify findings manually against current WordPress docs, profiling, real UI review, third-party docs, and real integration tests.'
        : 'This is a heuristic scanner for agent review triage, not a security oracle. It can miss vulnerabilities and produce false positives; verify findings manually against current WordPress docs and project context.',
    targetPath,
    modes: {
      security: securityEnabled,
      performance,
      performanceOnly,
      design,
      designOnly,
      compatibility,
      compatibilityOnly,
    },
    summary: {
      phpFiles: 0,
      blockJsonFiles: 0,
      mainPluginFile: null,
    },
    findings: [],
  };

  const files = walkFiles(targetPath);
  const phpFiles = files.filter((file) => extname(file).toLowerCase() === '.php');
  report.summary.phpFiles = phpFiles.length;
  report.summary.blockJsonFiles = files.filter((file) => basename(file) === 'block.json').length;

  let main = null;
  if (!securityEnabled) {
    main = findMainPluginFile(targetPath, phpFiles);
    report.summary.mainPluginFile = main ? toDisplayPath(targetPath, main.file) : null;
  } else {
    main = auditMainPluginFile(report, targetPath, phpFiles);
    auditSecurityHeuristics(report, phpFiles);
    auditBlocks(report, files);
    auditBuildFiles(report, targetPath);
    auditReleaseFiles(report, targetPath, main?.headers || null);
  }

  if (performance) {
    auditPerformanceHeuristics(report, files, phpFiles);
  }

  if (design) {
    auditDesignHeuristics(report, files, phpFiles);
  }

  if (compatibility) {
    auditCompatibilityHeuristics(report, files, phpFiles);
  }

  report.summary.findings = {
    error: report.findings.filter((finding) => finding.severity === 'error').length,
    warning: report.findings.filter((finding) => finding.severity === 'warning').length,
    info: report.findings.filter((finding) => finding.severity === 'info').length,
  };
  report.summary.performanceFindings = report.findings.filter((finding) => finding.category === 'performance').length;
  report.summary.designFindings = report.findings.filter((finding) => finding.category === 'design').length;
  report.summary.compatibilityFindings = report.findings.filter((finding) => finding.category === 'compatibility').length;

  return report;
}

export function formatHumanReport(report) {
  const lines = [];
  lines.push('WordPress Plugin Audit');
  lines.push(`Target: ${report.targetPath}`);
  lines.push(`Limitation: ${report.limitation}`);
  lines.push('');
  lines.push('Summary:');
  lines.push(`- Main plugin file: ${report.summary.mainPluginFile || 'not found'}`);
  lines.push(`- PHP files scanned: ${report.summary.phpFiles}`);
  lines.push(`- block.json files scanned: ${report.summary.blockJsonFiles}`);
  if (report.modes?.performance) {
    lines.push(`- Performance findings: ${report.summary.performanceFindings}`);
  }
  if (report.modes?.design) {
    lines.push(`- Design findings: ${report.summary.designFindings}`);
  }
  if (report.modes?.compatibility) {
    lines.push(`- Compatibility findings: ${report.summary.compatibilityFindings}`);
  }
  lines.push(
    `- Findings: ${report.summary.findings.error} error, ${report.summary.findings.warning} warning, ${report.summary.findings.info} info`
  );

  if (report.findings.length === 0) {
    lines.push('');
    lines.push('No heuristic findings found.');
    return `${lines.join('\n')}\n`;
  }

  lines.push('');
  lines.push('Findings:');

  const severityOrder = { error: 0, warning: 1, info: 2 };
  const sorted = [...report.findings].sort((a, b) => {
    return (
      severityOrder[a.severity] - severityOrder[b.severity] ||
      String(a.file || '').localeCompare(String(b.file || '')) ||
      Number(a.line || 0) - Number(b.line || 0)
    );
  });

  for (const finding of sorted) {
    const location = finding.file ? `${finding.file}${finding.line ? `:${finding.line}` : ''}` : 'global';
    lines.push(`- [${finding.severity.toUpperCase()}] ${location} ${finding.rule}`);
    lines.push(`  ${finding.message}`);
    if (finding.why) {
      lines.push(`  Why it matters: ${finding.why}`);
    }
    lines.push(`  Remediation: ${finding.remediation}`);
    if (finding.confidence) {
      lines.push(`  Confidence: ${finding.confidence}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

function printHelp() {
  console.log(`Usage:
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --json
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --performance
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --performance --json
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --performance-only --fail-on=warning
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --design
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --design --json
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --design-only --fail-on=warning
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --compatibility
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --compatibility --json
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --compatibility-only --fail-on=warning

Options:
  --performance       Include static performance heuristics.
  --performance-only  Skip non-performance checks except basic file counting.
  --design            Include static design/UX/UI/a11y heuristics.
  --design-only       Skip non-design checks except basic file counting.
  --compatibility     Include static integration/compatibility heuristics.
  --compatibility-only Skip non-compatibility checks except basic file counting.
  --json              Print structured JSON.
  --fail-on=LEVEL     error, warning, or none. Default: error.

The scanner is heuristic. Use it for agent triage, then verify findings manually.`);
}

function shouldFail(report, failOn) {
  if (failOn === 'none') {
    return false;
  }

  if (report.summary.findings.error > 0) {
    return true;
  }

  return failOn === 'warning' && report.summary.findings.warning > 0;
}

function isDirectRun() {
  if (!process.argv[1]) {
    return false;
  }

  return import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
}

if (isDirectRun()) {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.target) {
    printHelp();
    process.exit(2);
  }

  try {
    const report = auditPlugin(args.target, {
      performance: args.performance,
      performanceOnly: args.performanceOnly,
      design: args.design,
      designOnly: args.designOnly,
      compatibility: args.compatibility,
      compatibilityOnly: args.compatibilityOnly,
    });
    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      process.stdout.write(formatHumanReport(report));
    }

    process.exit(shouldFail(report, args.failOn) ? 1 : 0);
  } catch (error) {
    if (args.json) {
      console.log(
        JSON.stringify(
          {
            tool: 'wordpress-plugin-dev audit-plugin',
            error: error.message,
          },
          null,
          2
        )
      );
    } else {
      console.error(error.message);
    }

    process.exit(2);
  }
}
