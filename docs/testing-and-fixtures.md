# Testing And Fixtures

This project currently validates the skill package itself, not a full WordPress runtime.

## Current checks

- `npm run validate:skill` checks `SKILL.md`, frontmatter, referenced files, templates, scripts, and README install coverage.
- `npm run check:sources` checks source-map structure.
- `npm run check:links` checks local Markdown links without external dependencies.
- `npm run test:audit` runs unit tests for audit parser/scanner helpers.
- `npm run audit:fixture` runs the audit scanner on the bundled demo fixture.
- `npm run performance:audit` runs performance heuristics on the performance fixture.
- `npm run performance:audit:json` emits structured performance audit JSON.
- `npm run design:audit` runs design/UX/UI heuristics on the design fixture.
- `npm run design:audit:json` emits structured design audit JSON.
- `npm run compatibility:audit` runs integration/compatibility heuristics on the compatibility fixture.
- `npm run compatibility:audit:json` emits structured compatibility audit JSON.
- `npm run lint:php` runs PHP syntax lint when PHP is available.
- `npm run package:skill` builds the versioned skill archive.
- The GitHub Actions workflow runs validation and fixture audit on push and pull request.

## Fixtures

`test-fixtures/sample-plugin/` is the public sample fixture used for demo output. It includes safe examples and one intentionally unsafe file:

```text
test-fixtures/sample-plugin/unsafe-example.php
```

That file is marked fixture-only and exists so the scanner can demonstrate findings. Do not copy it into a real plugin.

The canonical skill also includes an internal demo fixture under:

```text
skills/wordpress-plugin-dev/fixtures/demo-plugin/
```

`test-fixtures/performance-plugin/` exercises the static performance heuristics. It includes safe examples and fixture-only slow examples for hooks, assets, queries, transients, REST, cron, and dynamic block rendering.

`test-fixtures/design-plugin/` exercises static design/UX/UI heuristics. It includes safe and fixture-only bad examples for admin pages, frontend output, CSS, and Gutenberg block UI.

`test-fixtures/compatibility-plugin/` exercises static integration/compatibility heuristics. It includes safe and fixture-only bad examples for optional integration detection, Classic Editor fallback, SEO output, cache behavior, theme CSS, and Elementor-style adapter loading.

## Known gaps

- No live WordPress install is started by default.
- No browser or block editor runtime test is currently run.
- PHP syntax lint is part of CI. PHPCS/WPCS is currently a non-blocking readiness check until the ruleset baseline is reviewed.
- More fixture coverage is planned for AJAX, admin POST, SQL, filesystem, SSRF, block rendering, and REST callbacks.
- Performance scanner output is heuristic and still needs real profiling with production-sized data.
- Design scanner output is heuristic and still needs real WordPress admin/editor/frontend review.
- Compatibility scanner output is heuristic and still needs current third-party docs plus manual testing with actual plugin/theme versions.
