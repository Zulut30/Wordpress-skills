# Design / UX / UI Module Report

## Executive Summary

The WordPress Plugin Dev Skill now includes a practical Design / UX / UI module for WordPress plugin interfaces. It covers WordPress-native admin screens, settings pages, dashboards, onboarding flows, Gutenberg block UI, frontend output, accessibility, RTL/i18n readiness, scoped CSS, and static design-audit heuristics.

The module is ready for inclusion in the next v0.x release. It is intentionally framed as guidance plus heuristic triage, not as a replacement for manual visual review in a real WordPress admin/editor/frontend environment.

## Files Added

- `skills/wordpress-plugin-dev/references/design-ux-ui.md`
- `skills/wordpress-plugin-dev/assets/templates/admin-page-layout.stub`
- `skills/wordpress-plugin-dev/assets/templates/settings-tabs-page.stub`
- `skills/wordpress-plugin-dev/assets/templates/admin-card-grid.stub`
- `skills/wordpress-plugin-dev/assets/templates/empty-state.stub`
- `skills/wordpress-plugin-dev/assets/templates/admin-notice.stub`
- `skills/wordpress-plugin-dev/assets/templates/accessible-form-field.stub`
- `skills/wordpress-plugin-dev/assets/templates/frontend-card-output.stub`
- `skills/wordpress-plugin-dev/assets/templates/block-inspector-controls.stub`
- `skills/wordpress-plugin-dev/assets/templates/block-placeholder.stub`
- `skills/wordpress-plugin-dev/assets/templates/onboarding-step.stub`
- `skills/wordpress-plugin-dev/assets/templates/css-scoped-admin-ui.stub`
- `skills/wordpress-plugin-dev/assets/templates/frontend-scoped-css.stub`
- `skills/wordpress-plugin-dev/assets/examples/admin-settings-before-after.md`
- `skills/wordpress-plugin-dev/assets/examples/plugin-dashboard-layout.md`
- `skills/wordpress-plugin-dev/assets/examples/gutenberg-block-ui-before-after.md`
- `skills/wordpress-plugin-dev/assets/examples/frontend-output-design.md`
- `skills/wordpress-plugin-dev/assets/examples/empty-loading-error-states.md`
- `skills/wordpress-plugin-dev/assets/examples/onboarding-flow.md`
- `skills/wordpress-plugin-dev/assets/examples/design-audit-report.md`
- `test-fixtures/design-plugin/`
- `docs/examples/design-audit-human.md`
- `docs/examples/design-audit-json.json`
- `docs/examples/design-audit-explanation.md`

Synced copies were also generated under `.agents/skills/wordpress-plugin-dev/`, `.claude/skills/wordpress-plugin-dev/`, and `.cursor/skills/wordpress-plugin-dev/`.

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
- `TODO.md`
- `docs/roadmap.md`
- `package.json`
- `.github/workflows/validate.yml`

## Skill Changes

`SKILL.md` now routes design, UX, visual polish, admin UI, settings page UX, frontend output, Gutenberg block UI, onboarding, and accessibility review tasks to `references/design-ux-ui.md`.

The mandatory rules explicitly say design work must not weaken security, accessibility, performance, i18n, escaping, capability checks, or scoped asset loading. `SKILL.md` remains compact and under the 500-line limit.

## New Design Reference

`references/design-ux-ui.md` provides practical guidance for AI coding agents:

- WordPress-native admin UI principles.
- Settings page, form, notice, empty/loading/error state patterns.
- Gutenberg block UI guidance for canvas, toolbar, InspectorControls, placeholders, and frontend/editor consistency.
- Frontend output guidance that respects theme styles and scopes plugin CSS.
- UX writing, accessibility, RTL/localization, and security/performance intersections.
- A design audit workflow and agent response format.

Official source routing was added to `source-map.md`, including Make WordPress Design Handbook, Block Editor accessibility, `@wordpress/components`, `@wordpress/admin-ui`, `@wordpress/ui`, Settings API, admin menus, HTML/CSS Coding Standards, and i18n docs. Experimental/evolving packages are marked for current-docs verification.

## Audit Script Changes

`audit-plugin.mjs` now supports:

- `--design`
- `--design-only`
- existing `--json`
- existing `--fail-on=error|warning|none`

New design categories include:

- Admin UI structure and scoped admin assets.
- Forms without labels, fieldsets, nonce/settings flow, or clear required/error handling.
- Frontend CSS scope, hardcoded fonts, fixed widths, RTL review, and excessive `!important`.
- Gutenberg editor UI strings, overloaded inspector controls, missing labels, missing placeholders, and toolbar accessibility.
- Dynamic UI notices/errors and low-confidence live-region reminders.

The scanner avoids critical claims for subjective visual issues. Strong accessibility/security-adjacent issues are warnings; most visual/layout guidance is info or low-confidence.

## Templates And Examples

The new templates are safe by default, translation-ready, escaped where output is rendered, scoped by plugin root classes, and avoid Bootstrap/Tailwind/Material defaults.

Examples show before/after patterns for admin settings, plugin dashboards, Gutenberg UI, frontend output, empty/loading/error states, onboarding, and final design audit reports.

## Fixture

`test-fixtures/design-plugin/` includes paired good and intentionally weak examples:

- Good admin page with `.wrap`, settings flow, labels, and scoped assets.
- Bad admin page marked fixture-only with unscoped assets, missing labels, placeholder-only input, vague button text, and weak notices.
- Good frontend output with semantic escaped markup.
- Bad frontend output marked fixture-only with missing labels and div-heavy markup.
- Good and bad Gutenberg block editor examples.
- Good and bad scoped CSS examples.

The bad examples are minimal, non-destructive, and explicitly marked as fixtures.

## Commands Run

- `node skills\wordpress-plugin-dev\scripts\audit-plugin.test.mjs` — passed, 6/6 tests.
- `node skills\wordpress-plugin-dev\scripts\audit-plugin.mjs test-fixtures\design-plugin --design` — passed, 35 design findings, 0 errors.
- `node skills\wordpress-plugin-dev\scripts\audit-plugin.mjs test-fixtures\design-plugin --design --json` — produced valid JSON.
- `npm.cmd run validate:skill` — passed, 91 checks.
- `npm.cmd run design:audit` — passed, 35 design findings, 0 errors.
- `npm.cmd run design:audit:json` — passed.
- `npm.cmd run smoke` — passed, including source-map, markdown links, audit tests, fixture audits, performance audit, and design audit.
- `node skills\wordpress-plugin-dev\scripts\audit-plugin.mjs test-fixtures\sample-plugin` — found the intended unsafe fixture error and exited non-zero by default `--fail-on=error`.
- `node skills\wordpress-plugin-dev\scripts\audit-plugin.mjs test-fixtures\sample-plugin --json` — produced valid JSON with the intended unsafe fixture error and exited non-zero by default `--fail-on=error`.
- `npm.cmd run performance:audit` — passed.
- `npm.cmd run performance:audit:json` — passed.
- `npm.cmd run sync` — passed after rerun with elevated filesystem permission for `.agents/skills`.
- Custom sync comparison — `.agents`, `.claude`, and `.cursor` skill folders match the canonical `skills/wordpress-plugin-dev/` folder.

PowerShell blocks direct `npm` execution in this environment because `npm.ps1` is disabled by execution policy, so checks were run via `npm.cmd`.

## Known Limitations

- Static design scanning is heuristic and can produce false positives.
- Visual quality, contrast, responsive behavior, real keyboard operation, and usability still require manual review.
- The scanner does not run WordPress, the block editor, browsers, screenshots, Playwright, or assistive technology.
- Experimental WordPress UI packages such as `@wordpress/ui` must be verified against current official docs before production use.
- Design recommendations should be validated in the target theme/admin/editor context.

## Recommended Next Steps

- Add screenshot-based manual review workflow.
- Add optional Playwright visual smoke tests if the project later adopts browser tooling.
- Expand block UI examples for toolbar/canvas/sidebar tradeoffs.
- Add more accessibility fixture coverage.
- Explore lightweight contrast checks without making false claims.
- Improve false-positive handling as real plugin examples are collected.

## Final Verdict

- Design module ready: yes.
- CI-ready: yes, as a lightweight static audit.
- Release-ready after sync: yes.
