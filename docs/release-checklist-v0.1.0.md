# Release Checklist v0.1.0

## Version And Metadata

- [x] `package.json` version is `0.1.0`.
- [x] `.codex-plugin/plugin.json` version is `0.1.0`.
- [x] `.agents/plugins/marketplace.json` plugin entry version is `0.1.0`.
- [x] `SKILL.md` metadata uses `name: wordpress-plugin-dev`.
- [x] `SKILL.md` includes `license: MIT`.
- [x] `SKILL.md` includes compatibility notes for Codex, Cursor, Claude Code, and Agent Skills-compatible tools.
- [x] Codex plugin author uses a neutral maintainer value. No public email was provided, so no email is included.

## Documentation

- [x] `README.md` explains purpose, audience, install options, usage examples, limitations, and security model.
- [x] `CHANGELOG.md` exists for v0.1.0.
- [x] `RELEASE_NOTES.md` exists for v0.1.0.
- [x] `FINAL_QA_REPORT.md` exists.
- [x] `GITHUB_POLISH_REPORT.md` exists.
- [x] `TODO.md` contains realistic next improvements.
- [x] Cursor install wording says to verify current official docs or in-app support before relying on paths/slash invocation.

## Skill Package

- [x] Canonical skill exists at `skills/wordpress-plugin-dev/`.
- [x] Canonical skill contains `SKILL.md`, `references/`, `assets/templates/`, `assets/examples/`, and `scripts/`.
- [x] Install targets exist under `.agents/skills/`, `.claude/skills/`, and `.cursor/skills/`.
- [x] Install targets were synced from canonical skill with `npm run sync`.

## Validation Commands

- [x] `npm.cmd run validate:skill`
- [x] `npm.cmd run smoke`
- [x] `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin`
- [x] `node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin --json`

## Expected Audit Fixture Result

- [x] Audit finds the fixture-only unsafe REST route in `test-fixtures/sample-plugin/unsafe-example.php`.
- [x] Audit finds unsanitized request access in the fixture-only unsafe example.
- [x] Audit finds unescaped output in the fixture-only unsafe example.
- [x] Audit exits with code `1` for the sample fixture because an error-level finding is expected.

## Release Guardrails

- [x] Create the `v0.1.0` tag only as part of the explicit release publication request.
- [x] Do not claim the audit script is a complete security scanner.
- [x] Do not claim Cursor filesystem paths are universally supported.
- [x] Verify release-sensitive WordPress, Plugin Check, WP-CLI, npm, Composer, Codex, Cursor, and Claude Code behavior against current official docs before future releases.
