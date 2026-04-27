# WordPress Plugin Dev Skill

[![Validate](https://github.com/Zulut30/Wordpress-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/Zulut30/Wordpress-skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Version v0.1.0](https://img.shields.io/badge/version-v0.1.0-blue)
![Agent Skill](https://img.shields.io/badge/Agent%20Skill-portable-4b5563)
![WordPress Plugin Development](https://img.shields.io/badge/WordPress-plugin%20development-21759b)

![WordPress Plugin Dev Skill repository card](assets/repo-card.svg)

A professional Agent Skill for building, reviewing, testing, optimizing, designing, integrating, and releasing modern WordPress plugins with Codex, Cursor, Claude Code, and other Agent Skills-compatible tools.

Status: `v0.1.0` work in progress. The repository is usable and validated, but it does not claim broad production adoption or universal compatibility.

## Contents

- [For Whom](#for-whom)
- [1-Minute Quickstart](#1-minute-quickstart)
- [Proof: Real Outputs](#proof-real-outputs)
- [Demo](#demo)
- [Features](#features)
- [Why This Is Better Than Generic Coding Agents](#why-this-is-better-than-generic-coding-agents)
- [Repository Map](#repository-map)
- [Tool Support Matrix](#tool-support-matrix)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
- [CI And Validation](#ci-and-validation)
- [Versioned Packages](#versioned-packages)
- [Compatibility](#compatibility)
- [Limitations](#limitations)
- [Project Maturity And Contribution](#project-maturity-and-contribution)
- [Contributing](#contributing)
- [License](#license)

## For Whom

| Question | Answer |
|---|---|
| For whom? | WordPress developers and teams using AI coding agents to build or review plugins. |
| When to use? | Plugin scaffolding, feature work, REST/admin/settings flows, Gutenberg blocks, security review, performance review, UI/UX review, compatibility audits, tests/CI, and release prep. |
| When not to use? | Non-WordPress apps, fully automated security decisions, legal/license advice, or claims that a plugin is compatible with every theme/plugin. |

## 1-Minute Quickstart

```bash
git clone https://github.com/Zulut30/Wordpress-skills.git
cd Wordpress-skills
npm install
npm run sync
npm run validate:skill
```

Use the skill in your agent:

```text
Use wordpress-plugin-dev to audit this plugin for security, performance, design, compatibility, and WordPress.org release readiness.
```

Run the bundled scanner on the sample fixture:

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
```

Expected result: validation passes, the fixture audit finds the intentionally unsafe `unsafe-example.php`, and the agent uses WordPress-specific references instead of generic PHP advice.

## Proof: Real Outputs

This repository includes real generated audit outputs from local fixtures. They are not screenshots of fake runs; they are generated from the included test fixtures and checked by validation scripts.

| Proof | Input | Output | What it demonstrates |
|---|---|---|---|
| Security/plugin audit | `test-fixtures/sample-plugin/` | [human](docs/examples/audit-sample-human.md), [JSON](docs/examples/audit-sample-json.json) | Baseline scanner and structured JSON output. |
| Performance audit | `test-fixtures/performance-plugin/` | [human](docs/examples/performance-audit-human.md), [JSON](docs/examples/performance-audit-json.json) | Performance smells and remediation hints. |
| Design/UX audit | `test-fixtures/design-plugin/` | [human](docs/examples/design-audit-human.md), [JSON](docs/examples/design-audit-json.json) | Admin/frontend UI and accessibility heuristics. |
| Compatibility audit | `test-fixtures/compatibility-plugin/` | [human](docs/examples/compatibility-audit-human.md), [JSON](docs/examples/compatibility-audit-json.json) | Classic Editor, SEO, cache, theme, and builder compatibility heuristics. |

Running the quickstart commands should validate the skill, run smoke checks, and produce the same style of reports on the included fixtures. The scanners are heuristic; they are proof of behavior, not proof of exhaustive coverage.

## Demo

For now, the project uses a reproducible text demo rather than a fake GIF:

- [Demo walkthrough](docs/demo.md)
- [Terminal demo script](docs/demo-script.md)
- [Example outputs](docs/examples/)

A lightweight terminal GIF can be added later if it is generated from real commands and stays small.

## Features

- Modern WordPress plugin architecture guidance.
- Security workflows for capabilities, nonces, sanitization, escaping, REST, AJAX, SQL, and block rendering.
- Gutenberg and `block.json` workflows, including dynamic blocks and Interactivity API notes.
- Performance optimization guidance for hooks, queries, options/autoload, cache, REST, admin screens, blocks, assets, cron, and external HTTP.
- Design/UX/UI guidance for native-feeling admin pages, settings screens, dashboards, block UI, frontend output, onboarding, states, accessibility, RTL, and i18n.
- Integrations and compatibility guidance for Classic Editor, Block Editor, SEO plugins, cache/performance plugins, themes, page builders, and graceful fallback.
- Safe starter templates, fixture plugins, local validation scripts, and example audit outputs.

## Why This Is Better Than Generic Coding Agents

Generic coding agents can write PHP, but WordPress plugins have specific failure modes: missing capability checks, unsafe REST routes, global admin assets, duplicate SEO output, cache-private data leaks, block render bottlenecks, and theme-breaking CSS.

This skill gives the agent curated WordPress workflows, references, templates, scanner heuristics, and release checklists so it asks better questions and produces safer code by default.

## Repository Map

```text
skills/wordpress-plugin-dev/        canonical skill
  SKILL.md                          compact router and operating rules
  references/                       curated WordPress knowledge base
  assets/templates/                 safe starter templates
  assets/examples/                  practical examples and before/after notes
  scripts/                          validation, sync, and audit scripts

.agents/skills/wordpress-plugin-dev/ generated by npm run sync
.claude/skills/wordpress-plugin-dev/ generated by npm run sync
.cursor/skills/wordpress-plugin-dev/ generated by npm run sync

test-fixtures/                      scanner fixtures
docs/                               examples, install notes, reports, release docs
.github/                            workflow and community files
packages/                           local generated release artifacts, ignored by git
```

Edit the canonical skill only, then run `npm run sync`.

For detailed QA, growth, module, and release reports, see [docs/reports/](docs/reports/).

## Tool Support Matrix

| Tool | Status | Notes |
|---|---|---|
| Codex | Supported source/package workflow | Includes `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json` for local testing. |
| Claude Code | Supported filesystem workflow | Project and personal install paths are documented. |
| Cursor | Version-dependent | Cursor supports skill-style workflows, but install paths/UI can vary. Use documented Cursor import/create flow when needed. |
| Other Agent Skills-compatible tools | Possible | Use the canonical skill folder and verify invocation syntax. |

See [installation](docs/installation.md) for details.

## Installation

Local source install:

```bash
npm install
npm run sync
npm run validate:skill
```

Versioned archive install:

```bash
npm run package:skill
```

The generated archive is meant for GitHub Releases, not for committing to git. See [release and packaging](docs/release-and-packaging.md).

## Usage Examples

```text
Use wordpress-plugin-dev to create a secure WordPress plugin skeleton with Composer, @wordpress/scripts, PHPCS, and readme.txt.
```

```text
Use wordpress-plugin-dev to audit this plugin for security, WordPress Coding Standards, Gutenberg/block.json usage, performance, design, compatibility, and WordPress.org release readiness.
```

```text
Use wordpress-plugin-dev to optimize this dynamic Gutenberg block. Check render.php, block.json assets, query limits, cache strategy, invalidation, escaping, and frontend JS size.
```

```text
Use wordpress-plugin-dev to redesign this settings page so it feels native to WordPress, with clear labels, validation, notices, accessibility, i18n, and scoped assets.
```

```text
Use wordpress-plugin-dev to make this plugin SEO/cache/theme/page-builder friendly without hard dependencies or universal compatibility claims.
```

## CI And Validation

Core local checks:

```bash
npm run validate:skill
npm run smoke
npm run check:links
npm run audit:fixture
npm run performance:audit
npm run design:audit
npm run compatibility:audit
```

PHP/Composer checks when available:

```bash
composer validate
composer install
npm run lint:php
composer run lint
```

GitHub Actions runs Node validation, Composer validation, PHP syntax lint, fixture audits, JSON parse checks, and release package build. PHPCS/WPCS is included as a non-blocking readiness check until the ruleset baseline is reviewed.

See [CI hardening](docs/ci-hardening.md) and [testing and fixtures](docs/testing-and-fixtures.md).

## Versioned Packages

Build locally:

```bash
npm run package:skill
```

Current archive name:

```text
packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz
```

The package includes the canonical skill, README, license, changelog, package metadata, and selected install/demo/release docs. It excludes `node_modules`, `vendor`, `test-fixtures`, generated reports, and git metadata.

## Compatibility

The skill now includes compatibility guidance and scanner heuristics for:

- Classic Editor and Block Editor fallback.
- SEO plugin duplicate meta/schema/canonical risks.
- cache/performance plugin public/private output and purge risks.
- theme-friendly frontend output and scoped CSS.
- optional page-builder adapters.

There is no "compatible with all plugins/themes" claim. See the conservative [compatibility matrix](docs/compatibility-matrix.md) for statuses, verification type, and version notes.

## Limitations

- Audit scripts are heuristic scanners, not security, performance, design, or compatibility oracles.
- Static scanners cannot replace human review, profiling, accessibility testing, rendered HTML inspection, or live WordPress runtime tests.
- Third-party plugin/theme APIs can change; verify current official docs before release-sensitive integration work.
- Cursor, Codex, and Claude Code install/invocation details can vary by version.
- The project does not claim broad production adoption yet.

More detail: [limitations](docs/limitations.md).

## Project Maturity And Contribution

This is an early but validated project. It includes CI, fixtures, real generated outputs, curated references, templates, and release/package scripts. It does not use fake stars, testimonials, downloads, screenshots, or compatibility claims.

Good next contributions:

- make PHPCS/WPCS blocking after a reviewed baseline;
- add PHPStan for safe source targets;
- verify one SEO plugin and one cache plugin with exact versions;
- add WordPress runtime smoke tests;
- add screenshot-based admin/editor/frontend review examples.

See [starter issues](docs/starter-issues.md), [roadmap](docs/roadmap.md), [roadmap milestones](docs/roadmap-milestones.md), and [manual GitHub actions](docs/github-manual-actions.md).

## Contributing

Keep `SKILL.md` concise. Add detailed guidance to `references/`, examples, templates, or docs instead of bloating the router.

Before a PR:

```bash
npm run validate:skill
npm run smoke
npm run check:links
```

Use official WordPress sources where possible, do not copy official docs wholesale, keep scripts local-first and non-destructive, and avoid fake proof. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

