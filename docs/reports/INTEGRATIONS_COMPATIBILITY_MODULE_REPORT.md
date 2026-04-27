# Integrations / Compatibility Module Report

## Executive Summary

Added a full Integrations and Compatibility module for `wordpress-plugin-dev`. The module teaches agents to design compatibility through WordPress core APIs first, feature detection, optional adapters, graceful degradation, scoped CSS/JS, compatibility matrices, and manual verification with real plugin/theme versions.

The module is integrated into the canonical skill, synced install targets, validator, smoke checks, audit script, README, CI workflow, fixtures, and example outputs.

## Files Added

- `skills/wordpress-plugin-dev/references/integrations-compatibility.md`
- Integration templates under `skills/wordpress-plugin-dev/assets/templates/`
- Compatibility examples under `skills/wordpress-plugin-dev/assets/examples/`
- `test-fixtures/compatibility-plugin/`
- `docs/examples/compatibility-audit-human.md`
- `docs/examples/compatibility-audit-json.json`
- `docs/examples/compatibility-audit-explanation.md`
- `INTEGRATIONS_COMPATIBILITY_MODULE_REPORT.md`

## Files Updated

- `skills/wordpress-plugin-dev/SKILL.md`
- `skills/wordpress-plugin-dev/references/source-map.md`
- `skills/wordpress-plugin-dev/references/review-checklists.md`
- `skills/wordpress-plugin-dev/scripts/audit-plugin.mjs`
- `skills/wordpress-plugin-dev/scripts/audit-plugin.test.mjs`
- `skills/wordpress-plugin-dev/scripts/validate-skill.mjs`
- `skills/wordpress-plugin-dev/scripts/check-source-map.mjs`
- `skills/wordpress-plugin-dev/scripts/smoke-test.sh`
- `package.json`
- `.github/workflows/validate.yml`
- `README.md`
- `AGENTS.md`
- `docs/testing-and-fixtures.md`
- `docs/roadmap.md`
- `TODO.md`
- Synced install targets in `.agents/`, `.claude/`, and `.cursor/`

## Skill Changes

`SKILL.md` now routes compatibility tasks to `references/integrations-compatibility.md` and includes compact task types/workflows for:

- Classic Editor compatibility;
- SEO plugin integration;
- cache/performance plugin compatibility;
- theme compatibility;
- page builder compatibility;
- compatibility audits;
- integration adapter implementation;
- compatibility matrix creation;
- plugin conflict troubleshooting.

The mandatory rules explicitly preserve security, performance, design, i18n, and a11y constraints. Compatibility guidance does not recommend disabling SEO/cache/minification plugins as a first solution.

## New Compatibility Reference

`references/integrations-compatibility.md` covers:

- WordPress core APIs first;
- optional adapter architecture;
- feature detection and graceful degradation;
- Classic Editor and Block Editor compatibility;
- SEO plugin duplicate-output avoidance;
- cache/performance plugin compatibility;
- theme-friendly frontend output;
- page-builder adapters;
- compatibility matrix statuses;
- must-fix/should-fix review checklist;
- agent response format.

## Source Map Updates

`references/source-map.md` now includes official/primary source groups for:

- Classic Editor / editor compatibility;
- SEO plugins;
- cache/performance plugins;
- themes;
- page builders;
- generic WordPress compatibility APIs.

Notes remind agents that third-party APIs, popularity, and version support can change and must be verified before release-sensitive integration work.

## Audit Script Changes

`audit-plugin.mjs` now supports:

- `--compatibility`
- `--compatibility-only`
- `--json`
- existing `--fail-on=error|warning|none`

New compatibility heuristics include:

- unguarded optional dependency references;
- direct third-party plugin includes;
- Classic Editor metabox save security gaps;
- TinyMCE/editor asset scoping;
- duplicate SEO head output;
- non-filterable SEO output;
- purge-all cache behavior on normal requests;
- user-specific public cached output risks;
- random/time-based cache busting;
- broad frontend CSS selectors;
- fixed-width/theme CSS review;
- direct theme file assumptions;
- unguarded page-builder references;
- compatibility claims without matrices.

The scanner intentionally avoids `critical` for subjective compatibility issues.

## Templates and Examples

Added templates for:

- integration interface and registry;
- Classic Editor and block/classic fallbacks;
- SEO output guards and SEO adapters;
- cache integration interfaces/adapters;
- generic cache compatibility;
- theme compatibility services;
- Astra/GeneratePress/Kadence placeholders;
- Elementor/Divi optional adapters;
- compatibility matrix.

Added examples for:

- compatibility audit report;
- Classic Editor fallback;
- SEO plugin compatibility;
- cache plugin compatibility;
- theme compatibility before/after;
- page-builder compatibility;
- compatibility matrix.

## Fixture

`test-fixtures/compatibility-plugin/` contains safe and fixture-only bad examples for:

- optional integration detection;
- direct third-party dependency use;
- Classic Editor metabox save security;
- SEO output guards and duplicate SEO output;
- targeted cache purge vs purge-all;
- public/private cache risks;
- theme-friendly CSS vs global CSS;
- Elementor-style optional adapter loading.

Bad examples are explicitly marked fixture-only and do not perform destructive actions.

## Supported vs Experimental

General guidance supported:

- WordPress core APIs first;
- feature detection;
- optional adapters;
- no fatal behavior when optional dependencies are missing;
- scoped CSS/JS;
- compatibility matrix creation;
- manual verification planning.

Optional/experimental:

- third-party SEO/cache/theme/page-builder adapter stubs;
- exact Yoast/Rank Math/AIOSEO/SEOPress/WP Rocket/LiteSpeed/W3TC/Elementor/Divi hook usage;
- theme-specific adapter behavior;
- cache purge and ESI/private-cache strategies.

Requires manual verification:

- current third-party docs;
- rendered SEO output;
- cache behavior across hosting/CDN/cache plugin settings;
- frontend layout in selected themes/builders;
- Classic Editor and Block Editor behavior on target post types.

## Commands Run

- `npm.cmd run validate:skill` - passed.
- `npm.cmd run smoke` - passed.
- `npm.cmd run sync` - first sandboxed run hit `EPERM` on `.agents`; escalated rerun passed.
- Sync parity check for `.agents`, `.claude`, `.cursor` - passed.
- `npm.cmd run compatibility:audit` - passed, fixture reported expected warnings/info and no errors.
- `npm.cmd run compatibility:audit:json` - passed.
- `npm.cmd run --silent compatibility:audit:json | node ...JSON.parse...` - passed.
- `npm.cmd run performance:audit` - passed.
- `npm.cmd run --silent performance:audit:json | node ...JSON.parse...` - passed.
- `npm.cmd run design:audit` - passed.
- `npm.cmd run --silent design:audit:json | node ...JSON.parse...` - passed.
- `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin` - expected exit 1 because the fixture intentionally contains `unsafe-example.php`.
- `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin --json` - expected exit 1 with valid JSON because the fixture intentionally contains an error-level finding.

## Known Limitations

- Static compatibility scanner is heuristic.
- False positives and false negatives are possible.
- Real compatibility requires testing with actual plugin/theme versions.
- Third-party APIs can change.
- Cache behavior depends on hosting, server cache, CDN, and plugin settings.
- SEO output must be verified in rendered HTML and structured data tools.
- Theme/page-builder visual behavior needs manual testing.
- Adapter templates are starting points, not production-certified integrations.

## Recommended Next Steps

- Create WordPress Playground compatibility demos.
- Add a real integration matrix for selected plugin/theme versions.
- Add optional adapters for one SEO plugin and one cache plugin first.
- Add manual test scripts/checklists for cache and SEO output.
- Add screenshots for theme compatibility review.
- Improve false-positive handling in compatibility scanner rules.

## Final Verdict

- Compatibility module ready: yes.
- CI-ready: yes.
- Release-ready after sync: yes, with the documented limitation that third-party integration claims require current docs and manual verification.
