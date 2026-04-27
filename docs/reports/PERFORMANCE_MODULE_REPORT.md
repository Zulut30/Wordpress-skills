# Performance Module Report

Date: 2026-04-27

## Executive Summary

Added a WordPress-plugin-specific performance optimization module to the existing Agent Skill architecture. The module helps agents identify hot paths, inspect performance smells, produce remediation plans, and generate safer/faster WordPress plugin code without removing security checks.

The implementation keeps `SKILL.md` compact and routes detailed guidance into `references/performance-optimization.md`.

## Files Added

- `skills/wordpress-plugin-dev/references/performance-optimization.md`
- `skills/wordpress-plugin-dev/assets/templates/optimized-query.stub`
- `skills/wordpress-plugin-dev/assets/templates/transient-cache-helper.stub`
- `skills/wordpress-plugin-dev/assets/templates/object-cache-helper.stub`
- `skills/wordpress-plugin-dev/assets/templates/scoped-assets.stub`
- `skills/wordpress-plugin-dev/assets/templates/performant-rest-controller.stub`
- `skills/wordpress-plugin-dev/assets/templates/dynamic-block-fragment-cache.stub`
- `skills/wordpress-plugin-dev/assets/templates/cron-batch-job.stub`
- `skills/wordpress-plugin-dev/assets/examples/performance-audit-report.md`
- `skills/wordpress-plugin-dev/assets/examples/optimized-rest-endpoint.md`
- `skills/wordpress-plugin-dev/assets/examples/optimized-dynamic-block.md`
- `skills/wordpress-plugin-dev/assets/examples/scoped-asset-loading.md`
- `skills/wordpress-plugin-dev/assets/examples/cache-invalidation-patterns.md`
- `test-fixtures/performance-plugin/`
- `docs/examples/performance-audit-human.md`
- `docs/examples/performance-audit-json.json`
- `docs/examples/performance-audit-explanation.md`
- `PERFORMANCE_MODULE_REPORT.md`

## Files Updated

- `skills/wordpress-plugin-dev/SKILL.md`
- `skills/wordpress-plugin-dev/references/source-map.md`
- `skills/wordpress-plugin-dev/references/review-checklists.md`
- `skills/wordpress-plugin-dev/scripts/audit-plugin.mjs`
- `skills/wordpress-plugin-dev/scripts/audit-plugin.test.mjs`
- `skills/wordpress-plugin-dev/scripts/validate-skill.mjs`
- `skills/wordpress-plugin-dev/scripts/check-source-map.mjs`
- `skills/wordpress-plugin-dev/scripts/smoke-test.sh`
- `README.md`
- `AGENTS.md`
- `package.json`
- `.github/workflows/validate.yml`
- `docs/roadmap.md`
- `docs/testing-and-fixtures.md`
- `TODO.md`
- `CHANGELOG.md`
- synced install targets under `.agents/`, `.claude/`, and `.cursor/`

## Skill Changes

`SKILL.md` now classifies performance-related tasks:

- performance optimization;
- performance audit;
- frontend asset optimization;
- database/query optimization;
- block render optimization;
- REST/admin performance review.

It adds operational rules for hot-path identification, scoped assets/hooks/queries, bounded queries, explicit cache TTL/invalidation, autoloaded options, remote HTTP calls, rewrite flushing, and block asset behavior.

Detailed guidance is routed to:

```text
references/performance-optimization.md
```

## New Performance Reference

`performance-optimization.md` covers:

- core principles;
- official WordPress performance sources;
- performance audit workflow;
- common smells and fixes for hooks, assets, queries, options/autoload, cache, REST, AJAX, Gutenberg blocks, admin UI, cron, external HTTP, and filesystem work;
- secure performance code patterns;
- review checklist;
- agent response format.

Official sources were verified from WordPress Developer Resources and Make WordPress Performance pages on 2026-04-27.

## Audit Script Changes

`audit-plugin.mjs` now supports:

```bash
--performance
--performance-only
--fail-on=error|warning|none
--json
```

New static performance heuristic categories include:

- broad hooks with expensive work;
- `flush_rewrite_rules()` on request paths;
- cron scheduling without `wp_next_scheduled()`;
- unscoped `pre_get_posts`;
- unscoped frontend/admin asset loading;
- missing asset version/strategy reminders;
- unbounded `WP_Query`/`get_posts`;
- missing `no_found_rows` reminders;
- query inside loops;
- direct SQL `SELECT` without `LIMIT`;
- custom table schema without obvious indexes;
- transients without TTL or strict miss checks;
- REST collection endpoints without pagination hints;
- public expensive REST endpoints without cache hints;
- dynamic block render queries without cache/limits;
- cron/background jobs without batching/lock indicators.

Performance findings include:

- severity;
- category;
- rule;
- file;
- line;
- message;
- why it matters;
- remediation;
- confidence.

## Templates And Examples

Templates added for:

- bounded queries;
- transient cache helpers;
- object cache helpers;
- scoped frontend/admin assets;
- performant REST controllers;
- dynamic block fragment cache;
- batched cron jobs.

Examples added for:

- performance audit report format;
- optimized REST endpoint before/after;
- optimized dynamic block before/after;
- scoped asset loading before/after;
- cache invalidation patterns.

## Fixture

`test-fixtures/performance-plugin/` contains:

- `SafeExamples.php` with scoped admin enqueue, bounded query, transient TTL, and paginated REST endpoint;
- `PerformanceSmells.php`, clearly marked fixture-only, with intentional slow patterns;
- `blocks/expensive-block/render.php`, fixture-only expensive dynamic block render example;
- minimal `readme.txt`, `package.json`, and `composer.json`.

The fixture is for scanner tests only. It should not be copied into production.

## Commands Run

```bash
npm.cmd run sync
npm.cmd run validate:skill
npm.cmd run smoke
npm.cmd run performance:audit
npm.cmd run performance:audit:json
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin --json
node -e "JSON.parse(require('fs').readFileSync('docs/examples/performance-audit-json.json','utf8')); console.log('performance example JSON valid')"
npm.cmd run --silent performance:audit:json | node -e "..."
```

Results:

- `validate:skill`: passed, 62 passed, 0 warnings, 0 failures.
- `smoke`: passed.
- `performance:audit`: passed and reported expected performance warnings/infos in the performance fixture.
- `performance:audit:json`: produced valid JSON when run with `npm run --silent`.
- Existing `sample-plugin` audit still reports the intentional `unsafe-example.php` security fixture.
- Markdown link check passed for 119 Markdown files during smoke.
- `npm run sync` completed after an initial Windows EPERM on `.agents`; rerun with elevated filesystem permission restored and synced all targets.

## Known Limitations

- Static scanner output is heuristic.
- False positives and false negatives are possible.
- Real profiling is still required for production performance decisions.
- Hosting, theme code, object cache, database size, traffic pattern, and other plugins can dominate performance.
- Cache invalidation must be tested manually.
- The scanner does not run WordPress, execute REST routes, load the editor, or measure query timings.
- Some recommendations depend on current WordPress behavior and should be verified against official docs before release-sensitive changes.

## Recommended Next Steps

- Add stronger performance tests and snapshot coverage for JSON output.
- Add optional profiling docs for Query Monitor/manual profiling notes.
- Expand performance fixture scenarios for admin screens, AJAX, REST callbacks, custom tables, and block rendering.
- Improve false-positive handling in callback analysis.
- Add before/after optimization examples for real-world plugin patterns.
- Consider an optional benchmark harness for fixtures without publishing fake benchmark claims.

## Final Verdict

Performance module ready: yes.

CI-ready: yes, as a static heuristic module.

Release-ready after sync: yes.
