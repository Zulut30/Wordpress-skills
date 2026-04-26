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

## Known gaps

- No live WordPress install is started by default.
- No browser or block editor runtime test is currently run.
- PHP linting and PHPCS are documented for target plugins, but not required for this repository's default CI.
- More fixture coverage is planned for AJAX, admin POST, SQL, filesystem, SSRF, block rendering, and REST callbacks.
- Performance scanner output is heuristic and still needs real profiling with production-sized data.
