# Starter Issues

If GitHub issues have not been created yet, use these prepared issue bodies. Check existing issues first to avoid duplicates.

## Labels To Create

- `good first issue`
- `help wanted`
- `documentation`
- `testing`
- `enhancement`
- `wordpress`
- `compatibility`
- `ci`
- `agent-skill`

## 1. Add PHPCS/WPCS Coverage For Generated Plugin Templates

Labels: `good first issue`, `testing`, `ci`, `wordpress`

Problem: PHP template stubs are useful, but placeholder substitution is not yet checked with PHPCS/WPCS.

Scope:

- `skills/wordpress-plugin-dev/assets/templates/`
- `phpcs.xml.dist`
- validation scripts

Acceptance criteria:

- replace common placeholders with sample values;
- parse/lint generated PHP where possible;
- document templates that cannot be linted directly;
- keep intentionally bad fixtures excluded.

## 2. Add PHPStan Baseline For Safe Source Files

Labels: `testing`, `ci`, `help wanted`

Problem: PHPStan is not configured because the repository contains fixture-only bad examples.

Scope:

- `composer.json`
- future `phpstan.neon.dist`
- safe fixture/example files only

Acceptance criteria:

- identify safe PHP targets;
- exclude fixture-only bad examples;
- add a minimal baseline or level;
- document known limits in `docs/ci-hardening.md`.

## 3. Add Real Classic Editor Manual Verification Notes

Labels: `documentation`, `compatibility`, `good first issue`

Problem: Classic Editor guidance exists, but no exact plugin version has been manually verified.

Scope:

- `docs/compatibility-matrix.md`
- `skills/wordpress-plugin-dev/assets/examples/classic-editor-fallback.md`

Acceptance criteria:

- install WordPress and Classic Editor;
- verify metabox fallback flow;
- record versions and manual steps;
- update status only if evidence supports it.

## 4. Add Compatibility Verification For One SEO Plugin

Labels: `compatibility`, `testing`, `help wanted`

Problem: SEO adapters are documented as experimental until real plugin versions are checked.

Scope:

- `docs/compatibility-matrix.md`
- `skills/wordpress-plugin-dev/assets/examples/seo-plugin-compatibility.md`

Acceptance criteria:

- choose one SEO plugin and exact version;
- verify no duplicate title/meta/canonical/schema output;
- document public hooks used;
- update the matrix conservatively.

## 5. Add Compatibility Verification For One Cache Plugin

Labels: `compatibility`, `testing`, `help wanted`

Problem: Cache compatibility needs real public/private output and purge behavior checks.

Scope:

- `docs/compatibility-matrix.md`
- `skills/wordpress-plugin-dev/assets/examples/cache-plugin-compatibility.md`

Acceptance criteria:

- choose one cache plugin and exact version;
- test public versus private output;
- test targeted purge behavior where documented;
- document any manual exclusions as fallback only.

## 6. Add Screenshot-Based Admin UI Review Example

Labels: `documentation`, `testing`, `enhancement`

Problem: Design/UX guidance is static and would benefit from a manual screenshot review example.

Scope:

- `docs/examples/`
- `skills/wordpress-plugin-dev/assets/examples/design-audit-report.md`

Acceptance criteria:

- use a local, license-safe fixture screen;
- include before/after review notes;
- do not add fake screenshots;
- document accessibility and responsive checks.

## 7. Add wp-env Smoke Test Blueprint

Labels: `testing`, `ci`, `wordpress`, `help wanted`

Problem: Default CI does not start WordPress runtime tests yet.

Scope:

- `docs/wp-env-smoke-tests.md`
- optional `.wp-env.json`
- optional manual workflow

Acceptance criteria:

- document install/start/test/stop flow;
- keep it optional unless it is stable in CI;
- avoid requiring Docker in the default validation job;
- explain what runtime coverage adds beyond static scanner checks.

