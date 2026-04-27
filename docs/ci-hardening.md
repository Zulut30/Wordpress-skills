# CI Hardening

The validation workflow is intentionally lightweight enough for pull requests while still checking more than Markdown.

## Current CI Checks

The GitHub Actions workflow at `.github/workflows/validate.yml` runs:

- Node LTS setup.
- npm install or npm ci when a lockfile exists.
- Composer validate.
- Composer dependency install.
- PHP syntax lint through `npm run lint:php`.
- PHPCS/WPCS readiness through `composer run lint` as a non-blocking step.
- `npm run validate:skill`.
- `npm run smoke`.
- fixture audits for sample, performance, design, and compatibility fixtures.
- JSON parse checks for generated audit output.
- release package build through `npm run package:skill`.

## Local Commands

Run the core checks:

```bash
npm run validate:skill
npm run smoke
npm run check:links
npm run audit:fixture
npm run performance:audit
npm run design:audit
npm run compatibility:audit
npm run package:skill
```

Run PHP checks when PHP and Composer are available:

```bash
composer validate
composer install
npm run lint:php
composer run lint
```

## PHPCS/WPCS Status

`phpcs.xml.dist` scopes PHPCS to safe fixture examples and excludes intentionally bad fixture files. The workflow currently treats PHPCS as a readiness signal, not a blocking release gate, because the repository mostly contains skill docs, templates, and fixture code rather than a production PHP plugin.

Before making PHPCS blocking, add a reviewed baseline and decide which fixture files should be linted as examples versus intentionally bad scanner inputs.

## PHPStan Status

PHPStan is not configured yet. That is intentional: the repository does not currently ship a production PHP library, and bad fixture files would need careful exclusions. Add PHPStan only after defining a safe target set and baseline.

## WordPress Runtime Tests

The default CI does not start WordPress, Docker, `wp-env`, real SEO plugins, cache plugins, themes, or page builders. Runtime tests are planned, but they should be added as a separate workflow or manual job once the scenarios are clear. See [wp-env smoke tests](wp-env-smoke-tests.md).

Suggested future runtime checks:

- `wp-env` smoke test for the sample plugin.
- WordPress Playground blueprint for demo validation.
- Classic Editor plus Block Editor manual checklist.
- rendered HTML checks for duplicate SEO output.
- cache compatibility checklist for public/private output.
- screenshot-based admin/editor/frontend review.
