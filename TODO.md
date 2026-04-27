# TODO

Realistic next improvements for the WordPress Plugin Dev Skill.

## Documentation

- Expand `references/release-wordpress-org.md` with a fuller SVN release checklist and asset packaging notes.
- Add a short `references/custom-data-models.md` or expand architecture notes for custom tables, metadata, options, and migrations.
- Add a small reference for uninstall/privacy/export/erase workflows with practical examples.
- Review all official source links on a scheduled cadence and update `Last reviewed` dates only after actual review.
- Expand performance docs with optional profiling workflow notes for Query Monitor, server traces, and manual before/after measurements.
- Add more block performance examples for dynamic render caching and frontend asset splitting.
- Expand design docs with richer admin UI examples for settings pages, dashboards, onboarding, notices, and state handling.
- Add screenshot-based manual review workflow for wp-admin, editor, and frontend output.
- Add Figma/WordPress Design System notes while clearly marking experimental UI packages.
- Add more Gutenberg block UI examples for Placeholder, ToolbarButton, InspectorControls, and mobile editor behavior.
- Add deeper integrations docs for Classic Editor plus Block Editor parity, SEO output guards, cache plugin compatibility, and theme/page-builder adapter patterns.
- Add WordPress Playground compatibility demo notes after target integrations are chosen.

## Scripts

- Expand the markdown-link checker with optional anchor validation if it stays low-noise.
- Add a fixture audit assertion script that expects `unsafe-example.php` findings and exits zero only when they are present.
- Improve `audit-plugin.mjs` heuristics for:
  - nonce checks mapped to actual handler callbacks
  - REST route callback analysis
  - SQL query interpolation edge cases
  - file upload/delete patterns
  - outbound HTTP/SSRF risk
- Add optional JSON schema validation for `block.json`, `composer.json`, and `package.json` stubs.
- Make PHPCS/WPCS blocking after the readiness ruleset has a reviewed baseline.
- Add PHPStan only for safe source and fixture files with explicit bad-fixture exclusions.
- Improve performance heuristics in `audit-plugin.mjs` for:
  - fewer false positives around safe cache invalidation
  - better callback resolution for hooks and REST routes
  - custom table index checks
  - large asset bundle hints when build output exists
- Add an optional benchmark harness for fixtures without claiming production benchmark results.
- Improve design heuristics in `audit-plugin.mjs` for:
  - fewer false positives around labels and fieldsets
  - better block component label detection
  - optional contrast checks where static analysis is feasible
  - screenshot metadata support for manual review
  - frontend theme-compatibility hints
- Improve compatibility heuristics in `audit-plugin.mjs` for:
  - fewer false positives around guarded third-party references
  - SEO rendered-output duplication patterns
  - cache purge callback resolution
  - optional builder/theme adapter scoping
  - compatibility matrix detection and report quality

## Fixtures

- Add a clean sample plugin fixture that should produce zero error-level findings.
- Add separate fixtures for unsafe AJAX, unsafe admin POST, unsafe SQL, and unsafe file operations.
- Add a fixture with a static block and a fixture with an Interactivity API block.
- Expand `test-fixtures/performance-plugin` with more REST, admin, cron, custom table, and block-render performance scenarios.
- Add snapshot tests for performance JSON output.
- Expand `test-fixtures/design-plugin` with more admin settings, dashboard, onboarding, block UI, modal, and frontend shortcode scenarios.
- Add snapshot tests for design JSON output.
- Add accessibility fixture coverage for focus management, field errors, live regions, and keyboard-only controls.
- Expand `test-fixtures/compatibility-plugin` with Classic Editor plus Block Editor parity, SEO rendered-output cases, cache public/private output, page-builder adapters, and block theme examples.
- Add snapshot tests for compatibility JSON output.

## Packaging

- Attach `npm run package:skill` artifacts to GitHub releases after verifying checksums.
- Add sync-tree comparison as a non-destructive CI check.
- Keep the performance fixture audit in CI and validate JSON output.
- Keep the design fixture audit in CI and validate JSON output.
- Keep the compatibility fixture audit in CI and validate JSON output.
- Add a real integration test matrix only after selecting specific plugin/theme versions and documenting manual verification.
- Document exact manual test steps for Codex, Claude Code, and Cursor discovery after installing from a clean checkout.
- Verify Cursor Agent Skill discovery paths and slash invocation against current official Cursor docs before making stronger install claims.
- Add a repository release checklist that includes `docs/reports/FINAL_QA_REPORT.md`, synced install targets, fixture audit output, and source-map review status.

## Quality

- Add snapshot tests for `audit-plugin.mjs --json` output.
- Add a contributor checklist for updating references without copying official documentation.
- Add a lightweight copyright/originality check for reference files.
- Keep `SKILL.md` under 500 lines by moving detailed guidance into references.
- Add a non-destructive `--check` mode to `sync-install-targets.mjs` for CI drift detection without rewriting target directories.
