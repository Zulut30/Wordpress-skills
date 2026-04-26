# Release Notes

## v0.1.0

Initial work-in-progress release of the WordPress Plugin Dev Agent Skill.

### Added

- Portable canonical skill at `skills/wordpress-plugin-dev/`.
- Synced install targets for Codex-style agents, Claude Code, and Cursor-compatible workflows:
  - `.agents/skills/wordpress-plugin-dev/`
  - `.claude/skills/wordpress-plugin-dev/`
  - `.cursor/skills/wordpress-plugin-dev/`
- Codex plugin metadata in `.codex-plugin/plugin.json`.
- Local testing marketplace metadata in `.agents/plugins/marketplace.json`.
- Compact `SKILL.md` under the 500-line limit with reference routing and common workflows.
- Curated reference files for:
  - plugin architecture
  - WordPress security
  - coding standards
  - hooks, REST, admin UI, Settings API, and shortcodes
  - Gutenberg blocks and `block.json`
  - Interactivity API
  - i18n, accessibility, and privacy
  - testing and CI
  - WordPress.org release preparation
  - review checklists
  - official source map
- Production-oriented templates for plugin bootstrap, Composer, npm, `block.json`, REST controllers, Settings API pages, WordPress.org readme, and GitHub Actions CI.
- Node-based scripts for skill validation, source-map checks, install-target sync, and heuristic plugin audit.
- Local Markdown link checker wired into `npm run smoke`.
- Unit tests for the audit script parsing and scanner rules.
- Demo fixture plugin under the skill folder.
- Project-level sample plugin fixture under `test-fixtures/sample-plugin/` with a fixture-only unsafe example for audit validation.
- README install guidance for Codex, Claude Code, and Cursor, plus quickstart, support matrix, repository map, limitations checklist, and example output links.
- Text-based demo docs with representative human and JSON audit output.
- Compatibility notes that mark Cursor filesystem discovery and slash invocation as version/workflow-dependent and requiring verification against current official docs.

### Validation

Quality pass commands run for this release:

```bash
npm run validate:skill
npm run smoke
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
npm run sync
```

Additional checks:

- Markdown local links checked.
- `.codex-plugin/plugin.json` parsed as valid JSON.
- `source-map.md` checked for official sources and review dates.
- Install target directories compared against canonical skill files.
- Secret-pattern and large-file scans completed with no release blockers found.

### Final QA Fixes

- Reworded Cursor install guidance to avoid claiming unverified filesystem paths or slash behavior as universal.
- Hardened `sync-install-targets.mjs` with target path guards before removing generated install-target directories.
- Improved templates:
  - removed default rewrite flushing from the plugin bootstrap stub
  - avoided singleton as the default bootstrap pattern
  - added `label_for` support to the Settings API stub
  - clarified common placeholders in Composer/npm metadata
- Added `FINAL_QA_REPORT.md` for the v0.1.0 release review.

### Known Limitations

- `audit-plugin.mjs` is heuristic and not a security oracle.
- The sample fixture intentionally returns an error-level finding for `unsafe-example.php`.
- PHP runtime checks were not run in a live WordPress environment.
- Release-sensitive WordPress, Plugin Check, Cursor, Claude Code, Codex, npm, and WP-CLI details should still be verified against current official docs before publication.
