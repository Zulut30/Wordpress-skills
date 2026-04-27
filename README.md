# WordPress Plugin Dev Skill

[![Validate](https://github.com/Zulut30/Wordpress-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/Zulut30/Wordpress-skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Version v0.1.0](https://img.shields.io/badge/version-v0.1.0-blue)
![Agent Skill](https://img.shields.io/badge/Agent%20Skill-portable-4b5563)
![WordPress Plugin Development](https://img.shields.io/badge/WordPress-plugin%20development-21759b)

![WordPress Plugin Dev Skill repository card](assets/repo-card.svg)

A professional Agent Skill for building, reviewing, testing, and releasing modern WordPress plugins with Codex, Cursor, Claude Code, and other Agent Skills-compatible tools.

Status: `v0.1.0` work in progress. Useful today, but intentionally honest about limitations.

## Table Of Contents

- [For Whom](#for-whom)
- [1-Minute Quickstart](#1-minute-quickstart)
- [Demo And Example Outputs](#demo-and-example-outputs)
- [Features](#features)
- [Why This Is Better Than Generic Coding Agents](#why-this-is-better-than-generic-coding-agents)
- [Repository Map](#repository-map)
- [Canonical Vs Generated Skill Folders](#canonical-vs-generated-skill-folders)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [Performance Optimization](#performance-optimization)
- [Design, UX, And UI](#design-ux-and-ui)
- [Integrations And Compatibility](#integrations-and-compatibility)
- [Tool Support Matrix](#tool-support-matrix)
- [Included References](#included-references)
- [Templates](#templates)
- [Scripts](#scripts)
- [Testing And Fixtures](#testing-and-fixtures)
- [Limitations](#limitations)
- [Security Model](#security-model)
- [Project Maturity](#project-maturity)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## For Whom

| Question | Answer |
| --- | --- |
| For whom? | Developers and teams using AI coding agents to build or review WordPress plugins. |
| When to use? | Plugin scaffolding, feature implementation, REST/admin/settings work, Gutenberg blocks, security review, tests/CI, and WordPress.org release readiness. |
| When not to use? | Non-WordPress PHP apps, full custom security audits, legal/license advice, or fully automated release decisions without human review. |

## 1-Minute Quickstart

```bash
git clone https://github.com/Zulut30/Wordpress-skills.git
cd Wordpress-skills
npm install
npm run sync
npm run validate:skill
```

Then invoke the skill in your agent:

```text
Use wordpress-plugin-dev to audit this plugin for security and WordPress.org release readiness.
```

Expected result: the agent loads the compact `SKILL.md`, routes into the relevant reference files, uses safe WordPress-specific checklists, and reports concrete findings instead of generic PHP advice.

You can also run the bundled audit scanner directly:

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
```

The sample fixture intentionally reports issues in `unsafe-example.php`.

## Demo And Example Outputs

The repository includes text-based demos and real audit outputs:

| Demo | File |
| --- | --- |
| Demo overview | [docs/demo.md](docs/demo.md) |
| Terminal demo script | [docs/demo-script.md](docs/demo-script.md) |
| Human audit output | [docs/examples/audit-sample-human.md](docs/examples/audit-sample-human.md) |
| JSON audit output | [docs/examples/audit-sample-json.json](docs/examples/audit-sample-json.json) |
| Audit output explanation | [docs/examples/audit-sample-explanation.md](docs/examples/audit-sample-explanation.md) |
| Agent review example | [docs/examples/agent-review-example.md](docs/examples/agent-review-example.md) |

Optional future improvement: add a short terminal GIF or screencast after the text demo is stable.

## Features

- Modern plugin architecture guidance.
- WordPress security review workflows.
- WordPress plugin performance audit workflows.
- WordPress-native design, UX, and UI review workflows.
- Integration and compatibility workflows for Classic Editor, SEO/cache plugins, themes, and page builders.
- REST API and admin/settings guidance.
- Gutenberg and `block.json` workflows.
- Interactivity API notes.
- i18n, accessibility, and privacy guidance.
- WordPress.org release readiness checks.
- Safe starter templates.
- Heuristic audit script with human and JSON output.
- Codex, Cursor, Claude Code, and other Agent Skills-compatible workflow notes.

## Why This Is Better Than Generic Coding Agents

Generic coding agents can write PHP and JavaScript, but they often miss WordPress-specific rules: capabilities, nonces, REST `permission_callback`, context-aware escaping, block metadata, text domains, Plugin Check, and WordPress.org release requirements.

This skill gives the agent:

- a compact role and routing file instead of a long prompt;
- curated WordPress references with official source links;
- operational security and release workflows;
- safe templates for common plugin surfaces;
- a local audit script for quick triage;
- performance heuristics for plugin hot paths;
- design/UX heuristics for admin, editor, and frontend UI;
- compatibility heuristics for optional integrations, SEO output, cache behavior, theme CSS, builders, and editor fallbacks;
- fixture outputs that show what the tool actually reports.

## Repository Map

```text
skills/wordpress-plugin-dev/                  canonical skill
|-- SKILL.md                                  skill router
|-- references/                               curated WordPress knowledge base
|-- assets/templates/                         starter templates
|-- assets/examples/                          small examples for agents
`-- scripts/                                  validation, audit, and sync scripts

test-fixtures/                                test plugins for scanner/CI
docs/                                         examples, release, setup, and roadmap notes
.github/                                     workflows and community files
.agents/skills/wordpress-plugin-dev/          generated by npm run sync
.claude/skills/wordpress-plugin-dev/          generated by npm run sync
.cursor/skills/wordpress-plugin-dev/          generated by npm run sync
```

## Canonical Vs Generated Skill Folders

Edit this folder:

```text
skills/wordpress-plugin-dev/
```

These folders are synchronized install targets:

```text
.agents/skills/wordpress-plugin-dev/
.claude/skills/wordpress-plugin-dev/
.cursor/skills/wordpress-plugin-dev/
```

Regenerate them with:

```bash
npm run sync
```

Do not edit generated folders directly unless you are debugging sync behavior.

## Installation

### Codex

For local skill testing through `.agents/skills`, run:

```bash
npm run sync
```

Codex plugin metadata is included in:

```text
.codex-plugin/plugin.json
```

Local marketplace metadata for testing is included in:

```text
.agents/plugins/marketplace.json
```

Where explicit skill invocation is supported, use:

```text
$wordpress-plugin-dev review this plugin for security issues.
```

### Claude Code

Project-level skill:

```text
.claude/skills/wordpress-plugin-dev/
```

Personal skill:

```bash
mkdir -p ~/.claude/skills
cp -R skills/wordpress-plugin-dev ~/.claude/skills/
```

If slash invocation is unavailable in your version, use natural language:

```text
Use the wordpress-plugin-dev skill to review this WordPress plugin.
```

### Cursor

Cursor support for Agent Skills or skill-style workflows can vary by version and rollout. This repository includes a synchronized `.cursor/skills/wordpress-plugin-dev/` copy for workflows that support project-level skills, but verify current Cursor docs or in-app Settings before relying on a specific path or slash invocation.

Use the canonical folder if your Cursor version offers an import/create workflow:

```text
skills/wordpress-plugin-dev/
```

When your Cursor version supports skill invocation, try:

```text
/wordpress-plugin-dev create a dynamic block with render.php
```

## Usage Examples

```text
Use wordpress-plugin-dev to create a secure WordPress plugin skeleton with Composer, @wordpress/scripts, PHPCS, and a readme.txt.
```

```text
Use wordpress-plugin-dev to audit this plugin for security, WordPress Coding Standards, Gutenberg/block.json usage, and WordPress.org release readiness.
```

```text
Use wordpress-plugin-dev to create a dynamic Gutenberg block registered with block.json and server-side render.php.
```

```text
Use wordpress-plugin-dev to review this REST API endpoint for permission_callback, nonce handling, sanitization, escaping, and WP_Error responses.
```

## Performance Optimization

`wordpress-plugin-dev` can help audit and improve WordPress plugin performance without trading away security or correctness. It focuses on plugin hot paths rather than generic advice.

It can inspect:

- hooks and expensive work on every request;
- database queries, `WP_Query`, `get_posts()`, custom tables, and N+1 patterns;
- options/autoload usage;
- transients and object cache strategy;
- REST endpoints and response size;
- admin screens and list/report pagination;
- Gutenberg dynamic block rendering and `block.json` assets;
- frontend/admin/editor asset loading;
- AJAX handlers;
- cron/background jobs;
- external HTTP calls and filesystem work.

Copy-paste prompts:

```text
Use wordpress-plugin-dev to audit this plugin for performance bottlenecks. Focus on hooks, queries, assets, REST endpoints, blocks, options/autoload, transients, cron jobs, and external HTTP calls. Do not change code yet; create PERFORMANCE_AUDIT_REPORT.md first.
```

```text
Use wordpress-plugin-dev to optimize this dynamic Gutenberg block. Check render.php, block.json assets, query limits, cache strategy, invalidation, escaping, and frontend JS size.
```

```text
Use wordpress-plugin-dev to optimize this REST endpoint for performance. Add pagination, args validation, bounded queries, small response shape, caching where safe, and a measurement plan.
```

Local commands:

```bash
npm run performance:audit
npm run performance:audit:json
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --performance
```

References and examples:

- [Performance optimization reference](skills/wordpress-plugin-dev/references/performance-optimization.md)
- [Performance audit human output](docs/examples/performance-audit-human.md)
- [Performance audit JSON output](docs/examples/performance-audit-json.json)
- [Performance audit explanation](docs/examples/performance-audit-explanation.md)
- [Performance fixture plugin](test-fixtures/performance-plugin/)

Performance limitations:

- Static performance audit is heuristic.
- No scanner can replace profiling.
- Actual speed depends on hosting, object cache, database size, traffic pattern, theme, and other plugins.
- Cache changes require invalidation tests.
- User-specific/private data must not be cached globally.

## Design, UX, And UI

`wordpress-plugin-dev` can help design and review WordPress plugin interfaces while keeping them native to WordPress. It is meant for practical UI work, not decoration for its own sake.

It covers:

- admin settings pages;
- plugin dashboards;
- onboarding/setup flows;
- Gutenberg block UI;
- frontend block, shortcode, and widget output;
- empty, loading, error, and success states;
- accessibility;
- RTL and i18n;
- scoped CSS;
- WordPress-native UI patterns.

Copy-paste prompts:

```text
Use wordpress-plugin-dev to redesign this plugin settings page. Make it feel native to WordPress, improve hierarchy, labels, empty/error states, accessibility, scoped assets, and save feedback. Do not change business logic yet; create UI_UX_REVIEW.md first.
```

```text
Use wordpress-plugin-dev to improve this Gutenberg block UI. Review canvas controls, toolbar actions, InspectorControls, placeholders, i18n, accessibility, mobile editor behavior, and frontend/editor consistency.
```

```text
Use wordpress-plugin-dev to improve this frontend shortcode output. Keep it theme-friendly, semantic, responsive, accessible, escaped, and scoped. Avoid global CSS and hardcoded fonts.
```

```text
Use wordpress-plugin-dev to create a clean WordPress-native onboarding flow for this plugin with setup steps, skip/back/finish actions, accessible headings, clear microcopy, and safe defaults.
```

Local commands:

```bash
npm run design:audit
npm run design:audit:json
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --design
```

References and examples:

- [Design, UX, and UI reference](skills/wordpress-plugin-dev/references/design-ux-ui.md)
- [Design audit human output](docs/examples/design-audit-human.md)
- [Design audit JSON output](docs/examples/design-audit-json.json)
- [Design audit explanation](docs/examples/design-audit-explanation.md)
- [Design fixture plugin](test-fixtures/design-plugin/)

Design limitations:

- Static design audit is heuristic.
- Visual quality still needs human review.
- The scanner cannot fully verify contrast, layout, responsiveness, keyboard behavior, screen-reader behavior, or usability.
- Final UI should be tested in real WordPress admin, editor, and frontend contexts.
- Experimental UI packages must be verified against current official docs.

## Integrations And Compatibility

`wordpress-plugin-dev` can help design and audit plugin compatibility with the real WordPress ecosystem without turning a plugin into a pile of hardcoded workarounds.

It covers:

- Classic Editor and Block Editor / Gutenberg fallback;
- SEO plugins and duplicate meta/schema/canonical risks;
- cache, performance, and asset optimization plugins;
- classic themes, block themes, `theme.json`, and theme-friendly frontend output;
- page builders such as Elementor and Divi as optional adapters;
- classic widgets, block widgets, shortcodes, and dynamic blocks;
- admin/editor compatibility and scoped assets.

Compatibility defaults:

- prefer WordPress core APIs before third-party plugin/theme APIs;
- keep integrations optional and feature-detected;
- verify current third-party plugin/theme docs before release-sensitive work;
- maintain a compatibility matrix for support claims;
- avoid claims like "compatible with all plugins/themes".

Copy-paste prompts:

```text
Use wordpress-plugin-dev to audit this plugin for Classic Editor, Block Editor, SEO plugin, cache plugin, theme, and page builder compatibility. Do not change code yet; create COMPATIBILITY_AUDIT_REPORT.md with a compatibility matrix and prioritized fixes.
```

```text
Use wordpress-plugin-dev to make this plugin SEO-plugin friendly. Avoid duplicate meta/schema output, detect active SEO plugins safely, use documented hooks where appropriate, and provide fallback output only when no SEO plugin handles it.
```

```text
Use wordpress-plugin-dev to make this plugin cache-plugin compatible. Separate public and private output, avoid caching user-specific data, add targeted purge hooks, avoid purge-all on normal requests, and document manual cache exclusions only as fallback.
```

```text
Use wordpress-plugin-dev to adapt this plugin frontend output to common themes. Scope CSS, use semantic HTML, inherit theme typography where practical, support responsive/RTL layouts, and avoid hardcoded theme assumptions.
```

Local commands:

```bash
npm run compatibility:audit
npm run compatibility:audit:json
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --compatibility
```

References and examples:

- [Integrations and compatibility reference](skills/wordpress-plugin-dev/references/integrations-compatibility.md)
- [Compatibility audit human output](docs/examples/compatibility-audit-human.md)
- [Compatibility audit JSON output](docs/examples/compatibility-audit-json.json)
- [Compatibility audit explanation](docs/examples/compatibility-audit-explanation.md)
- [Compatibility fixture plugin](test-fixtures/compatibility-plugin/)
- [Compatibility matrix example](skills/wordpress-plugin-dev/assets/examples/compatibility-matrix-example.md)

Compatibility limitations:

- Static compatibility audit is heuristic.
- Real compatibility requires testing with actual plugin/theme versions.
- Third-party APIs can change.
- Theme and page-builder visual behavior requires manual testing.
- Cache behavior depends on hosting, server cache, CDN, and plugin settings.
- SEO output must be verified in rendered HTML and structured data tools.
- "Supported" integrations require tests or documented manual verification.

## Tool Support Matrix

| Tool | What Works | Status |
| --- | --- | --- |
| Codex | Local skill folder, plugin metadata, explicit invocation where supported. | Supported |
| Claude Code | Project skill and personal skill filesystem install. | Supported |
| Cursor | Skill-style workflows using canonical folder or `.cursor/skills` when supported by the user's version. | Experimental / verify current docs |
| Other Agent Skills-compatible tools | Use `skills/wordpress-plugin-dev/` as the portable skill folder. | Portable fallback |

## Included References

| Area | File | Purpose |
| --- | --- | --- |
| Source map | `references/source-map.md` | Official source routing and version-sensitive verification rules. |
| Architecture | `references/plugin-architecture.md` | Bootstrap, lifecycle hooks, autoloading, data models, assets, and boundaries. |
| Security | `references/wordpress-security.md` | XSS, CSRF, SQL injection, capabilities, nonces, REST security, filesystem, and remediation. |
| Coding standards | `references/coding-standards.md` | WordPress PHP, JS, CSS, HTML, docs, and tooling conventions. |
| Hooks, REST, admin | `references/hooks-rest-admin.md` | Actions, filters, admin menus, Settings API, REST controllers, AJAX, and shortcodes. |
| Blocks | `references/blocks-gutenberg.md` | `block.json`, dynamic blocks, server-side registration, and build workflow. |
| Interactivity API | `references/interactivity-api.md` | When to use the Interactivity API, core concepts, warnings, and examples. |
| Performance | `references/performance-optimization.md` | Hot paths, hooks, queries, caching, REST/admin/block performance, assets, cron, and remediation plans. |
| Design/UX/UI | `references/design-ux-ui.md` | WordPress-native admin UI, settings pages, dashboards, block UI, frontend output, states, a11y, RTL, and scoped CSS. |
| Integrations/compatibility | `references/integrations-compatibility.md` | Classic Editor and Block Editor fallbacks, SEO/cache/theme/page-builder adapters, feature detection, graceful degradation, and compatibility matrices. |
| i18n/a11y/privacy | `references/i18n-a11y-privacy.md` | Text domains, translations, labels, focus, privacy exports/erasure, and review checklist. |
| Testing/CI | `references/testing-and-ci.md` | `wp-env`, WP-CLI scaffold tests, PHPUnit, JS tests, static analysis, Plugin Check, CI. |
| Release | `references/release-wordpress-org.md` | `readme.txt`, Plugin Check, assets, packaging, and WordPress.org readiness. |
| Review workflows | `references/review-checklists.md` | Architecture, security, block, REST, settings, release, performance, design/UX/UI, integrations/compatibility, and a11y/i18n review workflows. |

## Templates

| Template | Purpose |
| --- | --- |
| `plugin-php-main.stub` | Main plugin file with headers, guards, lifecycle hooks, textdomain loading, and bootstrap. |
| `composer-json.stub` | Composer PSR-4 autoload, WPCS/PHPCS dev tooling, and PHP scripts. |
| `package-json.stub` | `@wordpress/scripts`, lint, format, build, packages-update, and plugin zip scripts. |
| `block-json.stub` | API v3 `block.json` starter for dynamic blocks. |
| `rest-controller.stub` | Class-based REST controller with args, permissions, sanitization, and `WP_Error` responses. |
| `settings-page.stub` | Settings API page with capability checks, sanitize callback, escaping, and accessible labels. |
| `readme-txt.stub` | WordPress.org-style `readme.txt` structure. |
| `github-actions-ci.yml.stub` | Starter CI skeleton for real plugin repositories. |
| `optimized-query.stub` | Bounded `WP_Query` pattern with IDs and `no_found_rows`. |
| `transient-cache-helper.stub` | Expiring transient helper with strict miss checks and invalidation. |
| `object-cache-helper.stub` | Object cache helper with cache group and `$found` flag. |
| `scoped-assets.stub` | Frontend/admin asset loading scoped by context and screen. |
| `performant-rest-controller.stub` | Paginated REST collection controller with validation and optional cache. |
| `dynamic-block-fragment-cache.stub` | Dynamic block render fragment cache pattern. |
| `cron-batch-job.stub` | Activation-scheduled, locked, batched cron job pattern. |
| `admin-page-layout.stub` | Classic WordPress admin page layout with `.wrap`, heading, status, and primary action. |
| `settings-tabs-page.stub` | Settings API tabs with sanitized active tab and accessible tab nav. |
| `admin-card-grid.stub` | Responsive admin card grid with semantic headings and scoped classes. |
| `empty-state.stub` | Short empty state with explanation and next action. |
| `admin-notice.stub` | Escaped admin notice pattern. |
| `accessible-form-field.stub` | Label/help/error association for form fields. |
| `frontend-card-output.stub` | Theme-friendly semantic frontend card markup. |
| `block-inspector-controls.stub` | Small Gutenberg InspectorControls pattern using WordPress components. |
| `block-placeholder.stub` | Gutenberg Placeholder with loading/error/setup states. |
| `onboarding-step.stub` | Simple accessible onboarding step. |
| `css-scoped-admin-ui.stub` | Scoped wp-admin CSS with focus states and responsive grid. |
| `frontend-scoped-css.stub` | Scoped frontend CSS with logical/responsive patterns. |
| `integration-interface.stub` | Optional integration adapter interface. |
| `integration-registry.stub` | Safe integration registry that detects adapters before registering. |
| `classic-editor-metabox-fallback.stub` | Classic Editor metabox fallback with nonce/capability flow. |
| `block-editor-classic-fallback.stub` | Shared block/shortcode render fallback pattern. |
| `seo-output-guard.stub` | SEO fallback output guard to avoid duplicate meta/schema. |
| `yoast-integration.stub` | Optional Yoast SEO adapter placeholder. |
| `rankmath-integration.stub` | Optional Rank Math adapter placeholder. |
| `aioseo-integration.stub` | Optional AIOSEO adapter placeholder. |
| `seopress-integration.stub` | Optional SEOPress adapter placeholder. |
| `cache-integration-interface.stub` | Cache integration contract with targeted purge defaults. |
| `generic-cache-compatibility.stub` | Public/private output separation and cache notes. |
| `litespeed-cache-adapter.stub` | Optional LiteSpeed Cache adapter placeholder. |
| `wp-rocket-adapter.stub` | Optional WP Rocket adapter placeholder. |
| `w3-total-cache-adapter.stub` | Optional W3 Total Cache adapter placeholder. |
| `autoptimize-compatibility.stub` | Asset optimization compatibility notes. |
| `theme-compatibility-service.stub` | Generic theme-friendly wrapper/service pattern. |
| `astra-compatibility.stub` | Optional Astra adapter placeholder. |
| `generatepress-compatibility.stub` | Optional GeneratePress adapter placeholder. |
| `kadence-compatibility.stub` | Optional Kadence adapter placeholder. |
| `elementor-adapter.stub` | Optional Elementor adapter placeholder. |
| `divi-adapter.stub` | Optional Divi adapter placeholder. |
| `compatibility-matrix.stub` | Markdown compatibility matrix starter. |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run validate:skill` | Validate `SKILL.md`, metadata, references, templates, scripts, and README install docs. |
| `npm run smoke` | Run validation, source-map check, markdown link check, audit unit tests, demo fixture audit, and performance fixture audit. |
| `npm run sync` | Copy canonical skill into `.agents`, `.claude`, and `.cursor` install targets. |
| `npm run performance:audit` | Run performance heuristics against `test-fixtures/performance-plugin`. |
| `npm run performance:audit:json` | Run performance heuristics against the performance fixture in JSON mode. |
| `npm run design:audit` | Run design/UX/UI heuristics against `test-fixtures/design-plugin`. |
| `npm run design:audit:json` | Run design/UX/UI heuristics against the design fixture in JSON mode. |
| `npm run compatibility:audit` | Run integration/compatibility heuristics against `test-fixtures/compatibility-plugin`. |
| `npm run compatibility:audit:json` | Run integration/compatibility heuristics against the compatibility fixture in JSON mode. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin` | Run the heuristic plugin audit in human-readable mode. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --json` | Run the heuristic plugin audit with structured JSON output. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --performance` | Include static performance heuristics. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --performance-only --fail-on=warning` | Run only performance heuristics and exit non-zero on warnings. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --design` | Include static design/UX/UI/a11y heuristics. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --design-only --fail-on=warning` | Run only design heuristics and exit non-zero on warnings. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --compatibility` | Include static integration/compatibility heuristics. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --compatibility-only --fail-on=warning` | Run only compatibility heuristics and exit non-zero on warnings. |

## Testing And Fixtures

See [docs/testing-and-fixtures.md](docs/testing-and-fixtures.md).

Current coverage:

- skill metadata validation;
- source-map validation;
- markdown local link validation;
- audit script unit tests;
- demo fixture audit;
- performance fixture audit;
- design fixture audit;
- compatibility fixture audit;
- intentionally unsafe sample fixture for expected scanner findings.

## Limitations

- The audit script is heuristic and can miss vulnerabilities.
- The performance scanner is heuristic and can miss bottlenecks or report false positives.
- The design scanner is heuristic and can miss usability/accessibility issues or report false positives.
- The compatibility scanner is heuristic and can miss integration conflicts or report false positives.
- A clean audit output is not proof that a plugin is secure.
- A clean performance audit is not proof that a plugin is fast under production data and traffic.
- A clean design audit is not proof that UI is accessible, responsive, or usable in real WordPress contexts.
- A clean compatibility audit is not proof that a plugin works with real third-party plugin/theme versions.
- Cursor install paths and slash invocation are version/workflow-dependent.
- Live WordPress runtime checks are not part of the default local workflow yet.
- Composer/PHPStan/PHPCS checks are documented but not wired into the root CI matrix yet.
- Release-sensitive guidance should be verified against current official docs.
- Performance-sensitive changes need profiling, cache invalidation tests, and rollout monitoring.
- Design-sensitive changes need manual visual review, keyboard testing, and real admin/editor/frontend checks.
- Compatibility-sensitive changes need current third-party docs verification, rendered output checks, and manual tests with target versions.
- The project is `v0.1.0`; it does not claim broad production adoption.

## Security Model

- Scripts run locally in your workspace.
- The skill does not require secrets.
- `audit-plugin.mjs` reads plugin files and prints findings; it does not modify target plugins.
- Review generated code before using it in a real plugin.
- Verify external docs for release-sensitive tasks.
- Do not blindly trust generated plugin code, especially around auth, capabilities, nonces, SQL, filesystem operations, external requests, and privacy.

## Project Maturity

This is an early `v0.1.0` release. The project already includes a validated Agent Skill structure, curated WordPress references, templates, local scripts, CI checks, example outputs, and test fixtures. It does not yet claim broad production adoption.

Trust comes from visible checks, examples, limitations, roadmap, and open starter work rather than fake stars, testimonials, or adoption claims.

## Roadmap

See [docs/roadmap.md](docs/roadmap.md).

Near-term priorities:

- stronger fixture tests;
- richer audit rules;
- better CI matrix;
- more block examples;
- optional docs refresh script;
- Cursor install verification.
- Real compatibility test matrix with selected plugin/theme versions.

Prepared starter issues live in [docs/starter-issues.md](docs/starter-issues.md). If they are not open on GitHub yet, use that file as the source for labels, issue bodies, and acceptance criteria.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Short version:

- Keep `SKILL.md` concise.
- Add references instead of bloating `SKILL.md`.
- Prefer official WordPress sources.
- Do not copy official docs wholesale.
- Keep templates safe by default.
- Run validation before opening a PR:

```bash
npm run validate:skill
npm run smoke
```

## License

MIT. See [LICENSE](LICENSE).
