#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, isAbsolute, join, relative, resolve } from 'node:path';
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
  /\b(esc_html|esc_attr|esc_url|esc_js|esc_textarea|esc_xml|wp_kses|wp_kses_post|wp_json_encode|get_block_wrapper_attributes|checked|selected|disabled|readonly)\s*\(/;

const SANITIZE_OR_VALIDATE_RE =
  /\b(sanitize_[a-z0-9_]+|rest_sanitize_[a-z0-9_]+|rest_validate_[a-z0-9_]+|validate_[a-z0-9_]+|absint|intval|floatval|boolval|filter_input|wp_unslash|map_deep|preg_match|wp_verify_nonce|check_admin_referer|check_ajax_referer)\s*\(/;

const NONCE_RE = /\b(wp_verify_nonce|check_admin_referer|check_ajax_referer)\s*\(/;
const CAPABILITY_RE = /\b(current_user_can|user_can|map_meta_cap)\s*\(/;

export function parseArgs(argv) {
  const args = [...argv];
  const json = args.includes('--json');
  const help = args.includes('--help') || args.includes('-h');
  const filtered = args.filter((arg) => arg !== '--json' && arg !== '--help' && arg !== '-h');

  return {
    json,
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

function addFinding(report, severity, rule, file, line, message, remediation) {
  report.findings.push({
    severity,
    rule,
    file: file ? toDisplayPath(report.targetPath, file) : null,
    line: line || null,
    message,
    remediation,
  });
}

function addInfo(report, rule, file, line, message, remediation) {
  addFinding(report, 'info', rule, file, line, message, remediation);
}

function addWarning(report, rule, file, line, message, remediation) {
  addFinding(report, 'warning', rule, file, line, message, remediation);
}

function addError(report, rule, file, line, message, remediation) {
  addFinding(report, 'error', rule, file, line, message, remediation);
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

export function auditPlugin(pluginDir) {
  const targetPath = resolve(pluginDir);
  if (!existsSync(targetPath) || !statSync(targetPath).isDirectory()) {
    throw new Error(`Plugin directory not found: ${targetPath}`);
  }

  const report = {
    tool: 'wordpress-plugin-dev audit-plugin',
    limitation:
      'This is a heuristic scanner for agent review triage, not a security oracle. It can miss vulnerabilities and produce false positives; verify findings manually against current WordPress docs and project context.',
    targetPath,
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

  const main = auditMainPluginFile(report, targetPath, phpFiles);
  auditSecurityHeuristics(report, phpFiles);
  auditBlocks(report, files);
  auditBuildFiles(report, targetPath);
  auditReleaseFiles(report, targetPath, main?.headers || null);

  report.summary.findings = {
    error: report.findings.filter((finding) => finding.severity === 'error').length,
    warning: report.findings.filter((finding) => finding.severity === 'warning').length,
    info: report.findings.filter((finding) => finding.severity === 'info').length,
  };

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
    lines.push(`  Remediation: ${finding.remediation}`);
  }

  return `${lines.join('\n')}\n`;
}

function printHelp() {
  console.log(`Usage:
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin
  node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --json

The scanner is heuristic. Use it for agent triage, then verify findings manually.`);
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
    const report = auditPlugin(args.target);
    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      process.stdout.write(formatHumanReport(report));
    }

    process.exit(report.summary.findings.error > 0 ? 1 : 0);
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
