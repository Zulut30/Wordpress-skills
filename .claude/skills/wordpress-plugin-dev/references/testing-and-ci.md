# Testing And CI

Last reviewed: 2026-04-26

## Official Sources

- `@wordpress/env`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- WP-CLI handbook: https://make.wordpress.org/cli/handbook/
- `wp scaffold plugin-tests`: https://developer.wordpress.org/cli/commands/scaffold/plugin-tests/
- Plugin Check: https://wordpress.org/plugins/plugin-check/
- Plugin Check repository: https://github.com/WordPress/plugin-check
- PHPUnit docs: https://phpunit.de/documentation.html
- GitHub Actions docs: https://docs.github.com/actions
- WordPress Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/

## Verify Current Docs First

Verify current docs before changing CI for `@wordpress/env`, `@wordpress/scripts`, PHPUnit, Plugin Check, WP-CLI scaffold output, GitHub Actions versions, WordPress/PHP compatibility, and Node LTS requirements. Tool flags, generated scaffold files, and action versions change over time.

## Local Dev With wp-env

Use `wp-env` when the plugin needs a repeatable local WordPress site for block editor work, REST/admin UI testing, Plugin Check, or integration tests. It is Docker-backed by default and expects Node.js plus Docker.

Minimal `.wp-env.json`:

```json
{
  "$schema": "https://schemas.wp.org/trunk/wp-env.json",
  "core": null,
  "plugins": [ "." ],
  "config": {
    "WP_DEBUG": true,
    "SCRIPT_DEBUG": true
  }
}
```

Useful package scripts:

```json
{
  "scripts": {
    "wp-env": "wp-env",
    "env:start": "wp-env start",
    "env:start:update": "wp-env start --update",
    "env:stop": "wp-env stop",
    "env:status": "wp-env status",
    "env:logs": "wp-env logs",
    "env:destroy": "wp-env destroy"
  },
  "devDependencies": {
    "@wordpress/env": "verify-current-version"
  }
}
```

Agent rules:

- Do not assume Docker is available; detect or document it.
- Prefer `.wp-env.override.json` for local-only ports, PHP versions, and secrets.
- Use `wp-env run cli ...` for WP-CLI, Composer, and PHPUnit inside the environment when local PHP is missing or inconsistent.
- Avoid `wp-env destroy` unless the user expects data loss.

## PHP Tests

Use PHPUnit with the WordPress test suite for plugin integration behavior. Scaffold baseline files with WP-CLI when the project has no test harness:

```bash
wp scaffold plugin-tests plugin-slug --ci=github
```

Scaffold output commonly includes `phpunit.xml.dist`, `bin/install-wp-tests.sh`, `tests/bootstrap.php`, sample tests, and PHPCS rules. Verify current output before relying on exact filenames.

Integration tests vs unit tests:

- Unit tests: pure PHP logic that does not need WordPress bootstrapped, such as sanitizers, normalizers, value objects, parsers, or service classes.
- Integration tests: WordPress-loaded behavior such as hooks, REST routes, Settings API registration, custom post types, taxonomies, capabilities, block registration, and database writes.
- Prefer integration tests for WordPress APIs; mocks often hide hook timing and capability mistakes.

Typical Composer scripts:

```json
{
  "scripts": {
    "test": "phpunit",
    "test:php": "phpunit --configuration phpunit.xml.dist",
    "test:php:coverage": "phpunit --coverage-text"
  }
}
```

When using `wp-env`, run tests inside the CLI container:

```bash
wp-env run cli --env-cwd=wp-content/plugins/plugin-slug composer install
wp-env run cli --env-cwd=wp-content/plugins/plugin-slug vendor/bin/phpunit
```

## JS Tests

Use `@wordpress/scripts` when the plugin has block/editor JavaScript or frontend modules.

Recommended package scripts:

```json
{
  "scripts": {
    "test:unit": "wp-scripts test-unit-js",
    "test:unit:watch": "wp-scripts test-unit-js --watch",
    "test:e2e": "wp-scripts test-e2e",
    "test:playwright": "wp-scripts test-playwright"
  }
}
```

Use `test-unit-js` for:

- Block edit component behavior.
- Utility functions.
- Data transforms and selectors.
- Reducer/store behavior.

Use `test-e2e` or `test-playwright` when:

- The workflow crosses editor UI, admin screens, REST calls, or frontend rendering.
- Regressions would be hard to catch with unit tests.
- The project already has a stable `wp-env` or browser test setup.

Do not add browser tests for every small change. Add them for critical editor/admin workflows and release-sensitive flows.

## Static Analysis

PHP:

- PHPCS with WordPress Coding Standards is the baseline for plugin style and many security/i18n/a11y patterns.
- Include PHPCompatibilityWP when the plugin supports multiple PHP versions.
- Use PHPStan or Psalm as optional deeper analysis when the project has typed code, services, or meaningful domain logic.
- Do not rewrite third-party libraries to satisfy WPCS; exclude `vendor/`, generated files, and bundled external code.

JS/CSS:

- Use `wp-scripts lint-js` for ESLint.
- Use `wp-scripts lint-style` for Stylelint.
- Use `wp-scripts format` where the project accepts automated formatting.

Typical scripts:

```json
{
  "scripts": {
    "lint:php": "phpcs",
    "fix:php": "phpcbf",
    "analyse:php": "phpstan analyse",
    "lint:js": "wp-scripts lint-js",
    "lint:style": "wp-scripts lint-style",
    "format": "wp-scripts format"
  }
}
```

## Plugin Check

Plugin Check helps identify WordPress.org requirement issues and best-practice concerns. It can run through WP Admin or WP-CLI after the Plugin Check plugin is installed and active.

WP-CLI examples:

```bash
wp plugin install plugin-check --activate
wp plugin check plugin-slug
wp plugin check /path/to/plugin.zip
```

For runtime checks, verify current Plugin Check instructions. Some workflows require loading Plugin Check's CLI bootstrap with `--require`.

Release-blocking failures:

- Security findings: missing authorization, nonce failures, unsafe escaping/sanitization, SQL injection risk, arbitrary file access, exposed secrets.
- WordPress.org requirement failures: invalid headers, incompatible license, forbidden files, malformed `readme.txt`, missing stable tag alignment, or disallowed behavior.
- Fatal errors, activation errors, runtime check failures, broken dependency loading.
- i18n/a11y issues on public UI when they affect release quality.

Should-fix before release:

- Performance warnings from globally loaded assets, inefficient queries, or large bundles.
- Coding standards issues in plugin-owned code.
- Missing tests for high-risk release changes.

Nice-to-have:

- Low-risk style consistency warnings.
- Coverage improvements outside touched paths.

## GitHub Actions

Use the template in `assets/templates/github-actions-ci.yml.stub` as a starting point, then adapt it to the plugin's supported WordPress/PHP/Node matrix.

Recommended CI jobs:

- PHP matrix: run PHPCS and PHPUnit against supported PHP versions.
- WordPress version matrix: test latest stable and selected older supported versions; add nightly/trunk as allowed-to-fail only when the project wants early Core signals.
- Node build: install Node dependencies, lint JS/CSS, run unit tests, build assets.
- PHPCS: run WPCS and PHPCompatibilityWP for plugin-owned code.
- PHPUnit: run WordPress integration tests, preferably with a test database or `wp-env`.
- npm lint/build: run `npm run lint:js`, `npm run lint:style`, `npm run test:unit`, and `npm run build` when scripts exist.
- Plugin Check: run on the built plugin or release zip before release.

CI rules for agents:

- Keep CI deterministic: lock dependency versions and use caches where safe.
- Never print secrets, SVN credentials, WordPress.org credentials, or deployment tokens.
- Do not deploy from CI unless the user explicitly asks for release automation.
- Use `continue-on-error` only for experimental matrices, never for required release gates.
- Make release jobs depend on successful lint, test, build, and Plugin Check jobs.

## Agent Checklist

- Read existing `composer.json`, `package.json`, `phpunit.xml.dist`, `phpcs.xml.dist`, `.wp-env.json`, and workflows before changing commands.
- Match PHP/WordPress/Node matrices to plugin headers and support policy.
- Add only tests that can run in the repository's actual tooling.
- Prefer `wp-env` or CI containers when local PHP/MySQL are missing.
- Treat Plugin Check security and WordPress.org requirement failures as release blockers.
- Document skipped checks clearly when dependencies are missing.
