# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project uses semantic versioning after `v0.1.0`.

## [Unreleased]

### Planned

- Stronger fixture coverage for AJAX, admin POST, SQL, filesystem, SSRF, and REST callback cases.
- Optional docs/source refresh workflow.
- Richer Plugin Check integration.
- CI drift check for generated install-target copies.

## [0.1.0] - 2026-04-26

### Added

- GitHub-facing README polish with quickstart, support matrix, repository map, limitations checklist, and example output links.
- Text-based demo docs and normalized audit output examples for the sample plugin fixture.
- Local Markdown link checker wired into the smoke test.
- Portable canonical Agent Skill under `skills/wordpress-plugin-dev/`.
- Synchronized install-target copies for `.agents`, `.claude`, and `.cursor` workflows.
- Codex plugin metadata and local marketplace metadata.
- Compact `SKILL.md` with trigger-oriented metadata, operational WordPress security rules, common workflows, and reference routing.
- Curated reference knowledge base for architecture, security, coding standards, hooks/REST/admin, Gutenberg blocks, Interactivity API, i18n/a11y/privacy, testing/CI, WordPress.org release, and review workflows.
- Production-oriented templates for plugin bootstrap, Composer, npm, `block.json`, REST controllers, Settings API pages, `readme.txt`, and GitHub Actions CI.
- Node scripts for skill validation, source-map checks, install-target sync, and heuristic plugin auditing.
- Audit script unit tests.
- Demo and sample plugin fixtures, including fixture-only unsafe examples for scanner validation.
- GitHub community files, validation workflow, release checklist, and repository setup notes.

### Security

- Added guidance for capabilities, nonces, sanitization, escaping, REST permission callbacks, SQL preparation, filesystem handling, and release checks.
- Hardened install-target sync with explicit path guards.
- Marked `audit-plugin.mjs` as a heuristic scanner, not a replacement for human security review.

### Known Limitations

- Cursor Agent Skill filesystem discovery and slash invocation are version/workflow-dependent and must be verified against current official docs.
- PHP runtime checks were not run in a live WordPress environment for this release.
- The sample fixture intentionally triggers audit findings in `unsafe-example.php`.
