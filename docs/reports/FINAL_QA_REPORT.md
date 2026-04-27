# Final QA Report

## Executive Summary

The repository is ready for a first public `v0.1.0` release as a work-in-progress but usable Agent Skill package. The canonical skill is compact, reference-driven, synchronized into install targets, and supported by validation, source-map, sync, audit, and smoke-test scripts.

No secrets, large binaries, `node_modules`, `vendor`, or copied official documentation blocks were found in the release review. The main remaining limitation is intentional: `audit-plugin.mjs` is a heuristic triage scanner, not a complete WordPress security oracle.

## What Was Checked

- Canonical skill structure under `skills/wordpress-plugin-dev/`.
- Install targets under `.agents/skills/`, `.claude/skills/`, and `.cursor/skills/`.
- `SKILL.md` frontmatter, line count, trigger description, reference routing, workflows, and security rules.
- All reference files for practical agent usefulness, official-source mapping, `Last reviewed` dates, and copied-doc risk.
- All templates under `assets/templates/` for secure defaults, placeholders, capability checks, nonces, sanitization, escaping, and asset separation.
- Scripts under `scripts/` for safe behavior, useful output, JSON mode, validation coverage, and sync correctness.
- Root `package.json`, `composer.json`, `.codex-plugin/plugin.json`, and `.agents/plugins/marketplace.json`.
- `test-fixtures/sample-plugin/` fixture behavior.
- README, AGENTS, RELEASE_NOTES, TODO, local markdown links, JSON validity, secret patterns, and large files.
- Compatibility notes for Codex, Claude Code, and Cursor.

## Commands Run

```bash
npm.cmd run validate:skill
npm.cmd run smoke
npm.cmd run sync
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin --json
```

Additional checks were run with Node/PowerShell for:

- Canonical vs install-target file comparison.
- Markdown local link validation.
- JSON parsing for root/plugin metadata.
- Secret-pattern and large-file scanning.
- Reference-file review metadata and official-source coverage.

## Results

- `validate:skill`: passed, `40 passed, 0 warning(s), 0 failure(s)`.
- `smoke`: passed.
- `sync`: passed; all three install targets match canonical skill with 39 files each.
- `audit-plugin.mjs test-fixtures/sample-plugin`: works and intentionally exits `1` because the fixture contains one error-level unsafe example.
- `audit-plugin.mjs test-fixtures/sample-plugin --json`: works and returns structured JSON with the expected findings.
- Markdown links: 71 markdown files checked, no broken local links.
- JSON manifests: `package.json`, `composer.json`, `.codex-plugin/plugin.json`, and `.agents/plugins/marketplace.json` parse successfully.
- `SKILL.md`: 96 lines, under the 500-line limit.
- Reference files: all checked files include `Last reviewed: 2026-04-26` and `## Official Sources`.
- No large files over 1 MiB outside `.git`.
- No high-confidence secret/token/private-key patterns found.

## Issues Found

- README claimed Cursor skill discovery paths and slash invocation too confidently.
- `plugin-php-main.stub` flushed rewrite rules on activation/deactivation by default.
- `plugin-php-main.stub` used a singleton as the default architecture pattern.
- `settings-page.stub` did not pass `label_for` to `add_settings_field()`.
- `sync-install-targets.mjs` removed target directories without an explicit path guard beyond hardcoded target construction.
- Root `composer.json` declared PHPCS-related packages incompletely and had no useful Composer scripts.
- Some templates did not expose the standard project placeholders clearly enough.

## Issues Fixed

- Reworded Cursor installation guidance to mark filesystem discovery and slash invocation as version/workflow-dependent and requiring verification against current official docs.
- Removed default rewrite flushing from the plugin bootstrap template and left explicit activation/deactivation extension points.
- Replaced the default singleton bootstrap pattern with direct plugin instantiation.
- Added `{{PLUGIN_SLUG}}` to the bootstrap template constants.
- Added `label_for` support to the Settings API template.
- Added safety guards to `sync-install-targets.mjs` so it refuses to sync outside the expected repository target paths or over the canonical source.
- Added root Composer PHPCS dependencies and `lint`/`format` scripts.
- Added clearer placeholder metadata to Composer/npm templates.
- Re-synced `.agents`, `.claude`, and `.cursor` install targets from canonical skill.

## Remaining Limitations

- `audit-plugin.mjs` is heuristic. It can miss vulnerabilities and produce false positives.
- The root sample fixture intentionally contains unsafe code in `unsafe-example.php`; audit exit code `1` is expected for that fixture.
- PHP runtime checks were not run inside a live WordPress installation.
- Composer dependencies were not installed during this pass, so Composer scripts were checked structurally but not executed.
- Cursor Agent Skill path and slash invocation behavior should be verified against the user's current Cursor version and official docs before claiming support in a specific environment.
- WordPress.org, Plugin Check, WP-CLI, `@wordpress/scripts`, Interactivity API, Codex plugin, Cursor, and Claude Code release-sensitive details should be verified against current official docs before future releases.

## Release Readiness Verdict

`v0.1.0` is release-ready as a public work-in-progress developer tool.

The repository should not be marketed as a complete WordPress security scanner or fully automated release system. It is ready as a curated, portable Agent Skill with practical references, templates, scripts, fixtures, and honest limitations.

## Recommended Next Steps

- Add a CI workflow for this repository that runs `npm run smoke`, markdown link checks, and canonical-vs-target sync comparison.
- Add a dedicated fixture assertion script for `test-fixtures/sample-plugin`.
- Add more negative fixtures for AJAX, admin POST, SQL, filesystem, and SSRF patterns.
- Expand WordPress.org release guidance with an SVN packaging walkthrough after verifying current official docs.
- Add optional live WordPress/wp-env integration checks for the fixture plugin.
