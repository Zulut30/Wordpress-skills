# TODO

Realistic next improvements for the WordPress Plugin Dev Skill.

## Documentation

- Expand `references/release-wordpress-org.md` with a fuller SVN release checklist and asset packaging notes.
- Add a short `references/custom-data-models.md` or expand architecture notes for custom tables, metadata, options, and migrations.
- Add a small reference for uninstall/privacy/export/erase workflows with practical examples.
- Review all official source links on a scheduled cadence and update `Last reviewed` dates only after actual review.

## Scripts

- Add a dedicated markdown-link checker script instead of relying on ad hoc quality-pass commands.
- Add a fixture audit assertion script that expects `unsafe-example.php` findings and exits zero only when they are present.
- Improve `audit-plugin.mjs` heuristics for:
  - nonce checks mapped to actual handler callbacks
  - REST route callback analysis
  - SQL query interpolation edge cases
  - file upload/delete patterns
  - outbound HTTP/SSRF risk
- Add optional JSON schema validation for `block.json`, `composer.json`, and `package.json` stubs.

## Fixtures

- Add a clean sample plugin fixture that should produce zero error-level findings.
- Add separate fixtures for unsafe AJAX, unsafe admin POST, unsafe SQL, and unsafe file operations.
- Add a fixture with a static block and a fixture with an Interactivity API block.

## Packaging

- Add a release packaging script that produces a clean archive of the skill repository.
- Add CI for this repository that runs `npm run smoke`, markdown link checks, and sync-tree comparisons.
- Document exact manual test steps for Codex, Claude Code, and Cursor discovery after installing from a clean checkout.
- Verify Cursor Agent Skill discovery paths and slash invocation against current official Cursor docs before making stronger install claims.
- Add a repository release checklist that includes `FINAL_QA_REPORT.md`, synced install targets, fixture audit output, and source-map review status.

## Quality

- Add snapshot tests for `audit-plugin.mjs --json` output.
- Add a contributor checklist for updating references without copying official documentation.
- Add a lightweight copyright/originality check for reference files.
- Keep `SKILL.md` under 500 lines by moving detailed guidance into references.
- Add a non-destructive `--check` mode to `sync-install-targets.mjs` for CI drift detection without rewriting target directories.
