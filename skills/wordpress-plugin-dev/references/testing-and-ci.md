# Testing And CI

Last reviewed: 2026-04-26

## Official Sources

- WP-CLI handbook: https://make.wordpress.org/cli/handbook/
- WP-CLI scaffold plugin: https://developer.wordpress.org/cli/commands/scaffold/plugin/
- WP-CLI scaffold plugin tests: https://developer.wordpress.org/cli/commands/scaffold/plugin-tests/
- `@wordpress/env`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- Plugin Check: https://wordpress.org/plugins/plugin-check/
- PHPUnit docs: https://phpunit.de/documentation.html
- GitHub Actions docs: https://docs.github.com/actions

## Verify Current Docs First

Verify current WP-CLI scaffold output, PHPUnit compatibility, Plugin Check version, and `@wordpress/env` commands before changing CI.

## Local Checks

- PHP syntax: `php -l path/to/file.php`.
- PHPCS: use WPCS and PHPCompatibilityWP.
- Unit tests: use WordPress test suite with PHPUnit.
- Plugin Check: run via WP Admin or WP-CLI when installed.
- Blocks: run `npm run build`, `npm run lint:js`, and `npm run lint:css` when configured.
- Environment: use `wp-env` for local WordPress when the project already uses Node tooling.

## WP-CLI

- Use `wp scaffold plugin` for new plugin baselines when appropriate.
- Use `wp scaffold plugin-tests` to add PHPUnit harnesses to existing plugins.
- Use `wp eval`, `wp option`, `wp post`, and `wp rewrite` commands for smoke checks, but avoid mutating production data.

## CI Baseline

- Matrix PHP versions against supported WordPress/PHP policy.
- Install Composer dependencies with cache.
- Install Node dependencies and build assets when blocks are present.
- Run PHPCS, PHP unit tests, npm lint/build, and Plugin Check where possible.
- Upload build artifacts only after excluding dev files and secrets.

## Test Strategy

- Unit-test sanitizers, permission decisions, REST callbacks, and data transforms.
- Integration-test registration of CPTs, taxonomies, settings, blocks, and REST routes.
- Browser-test critical admin screens and block editor flows when UI changes are risky.
