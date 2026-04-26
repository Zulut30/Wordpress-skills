# Release Summary v0.1.0

## Release Title

WordPress Plugin Dev Skill v0.1.0

## Short Description

Initial public work-in-progress release of a portable Agent Skill for developing, reviewing, testing, securing, packaging, and preparing modern WordPress plugins for release.

## Highlights

- Compact, production-oriented `SKILL.md` for Codex, Claude Code, Cursor-compatible workflows, and other Agent Skills-compatible tools.
- Curated WordPress plugin development reference library with source mapping and review dates.
- Secure-by-default templates for common WordPress plugin surfaces.
- Heuristic plugin audit script with human and JSON output.
- Text-based demo docs with sample human and JSON audit output.
- Validation, source-map, smoke, and install-target sync scripts.
- Sample fixtures for validating audit behavior.
- Honest compatibility and limitation notes for release-sensitive tooling.

## Included Files And Features

- Canonical skill: `skills/wordpress-plugin-dev/`.
- Install-target copies:
  - `.agents/skills/wordpress-plugin-dev/`
  - `.claude/skills/wordpress-plugin-dev/`
  - `.cursor/skills/wordpress-plugin-dev/`
- Codex plugin metadata: `.codex-plugin/plugin.json`.
- Local marketplace metadata: `.agents/plugins/marketplace.json`.
- References for architecture, security, coding standards, REST/admin/hooks, Gutenberg, Interactivity API, i18n/a11y/privacy, testing/CI, WordPress.org release, source mapping, and review workflows.
- Templates for plugin bootstrap, Composer, npm, `block.json`, REST controllers, settings pages, `readme.txt`, and GitHub Actions CI.
- Scripts:
  - `validate-skill.mjs`
  - `audit-plugin.mjs`
  - `audit-plugin.test.mjs`
  - `check-source-map.mjs`
  - `sync-install-targets.mjs`
  - `smoke-test.sh`

## Installation Summary

Use the canonical skill folder for all manual installs:

```text
skills/wordpress-plugin-dev/
```

Refresh generated install targets with:

```bash
npm run sync
```

Claude Code project and personal skill paths are documented in README. Cursor skill discovery and slash invocation can vary by version/workflow; verify current Cursor docs or in-app support before relying on `.cursor/skills/` or `/wordpress-plugin-dev`.

## Known Limitations

- `audit-plugin.mjs` is a heuristic scanner, not a complete security oracle.
- The sample plugin intentionally contains unsafe fixture-only code and should trigger audit findings.
- PHP runtime checks were not run inside a live WordPress installation for this release.
- Composer dependencies were not installed during final release checks.
- Release-sensitive guidance should be verified against current official docs before future releases.
- No public maintainer email was provided; metadata uses a neutral maintainer name without email.

## Suggested GitHub Release Notes

```markdown
## WordPress Plugin Dev Skill v0.1.0

Initial public work-in-progress release of a portable Agent Skill for modern WordPress plugin development.

### Highlights

- Canonical Agent Skill at `skills/wordpress-plugin-dev/`
- Install-target copies for `.agents`, `.claude`, and `.cursor` workflows
- Curated WordPress plugin development references
- Secure starter templates for common plugin surfaces
- Heuristic plugin audit script with human and JSON output
- Text-based demo docs with sample human and JSON audit output
- Validation, source-map, sync, smoke, and audit test scripts
- Sample plugin fixture for audit validation

### Notes

- `audit-plugin.mjs` is heuristic and does not replace human security review.
- Cursor installation paths and slash invocation should be verified against the user's current Cursor version and official docs.
- This release is intentionally marked as work in progress.
```

## Commands Run

```bash
npm.cmd run validate:skill
npm.cmd run smoke
npm.cmd run sync
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin --json
```

Additional version and metadata checks were run with PowerShell/Node against `package.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, and `SKILL.md`.

## Final Readiness Verdict

`v0.1.0` is ready for a GitHub release as a public work-in-progress Agent Skill package. Do not create the git tag until the maintainer explicitly requests it.
