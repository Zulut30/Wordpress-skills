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
| i18n/a11y/privacy | `references/i18n-a11y-privacy.md` | Text domains, translations, labels, focus, privacy exports/erasure, and review checklist. |
| Testing/CI | `references/testing-and-ci.md` | `wp-env`, WP-CLI scaffold tests, PHPUnit, JS tests, static analysis, Plugin Check, CI. |
| Release | `references/release-wordpress-org.md` | `readme.txt`, Plugin Check, assets, packaging, and WordPress.org readiness. |
| Review workflows | `references/review-checklists.md` | Architecture, security, block, REST, settings, release, performance, and a11y/i18n review workflows. |

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

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run validate:skill` | Validate `SKILL.md`, metadata, references, templates, scripts, and README install docs. |
| `npm run smoke` | Run validation, source-map check, markdown link check, audit unit tests, and demo fixture audit. |
| `npm run sync` | Copy canonical skill into `.agents`, `.claude`, and `.cursor` install targets. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin` | Run the heuristic plugin audit in human-readable mode. |
| `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --json` | Run the heuristic plugin audit with structured JSON output. |

## Testing And Fixtures

See [docs/testing-and-fixtures.md](docs/testing-and-fixtures.md).

Current coverage:

- skill metadata validation;
- source-map validation;
- markdown local link validation;
- audit script unit tests;
- demo fixture audit;
- intentionally unsafe sample fixture for expected scanner findings.

## Limitations

- The audit script is heuristic and can miss vulnerabilities.
- A clean audit output is not proof that a plugin is secure.
- Cursor install paths and slash invocation are version/workflow-dependent.
- Live WordPress runtime checks are not part of the default local workflow yet.
- Composer/PHPStan/PHPCS checks are documented but not wired into the root CI matrix yet.
- Release-sensitive guidance should be verified against current official docs.
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


---

## Auto-generated contribution

Added by bounty bot.
