# Demo

This repository uses a text-based demo so the result is easy to review in GitHub without downloading a binary screencast.

## Scenario

Baseline input plugin:

```text
test-fixtures/sample-plugin/
```

The fixture is a small WordPress plugin with:

- a valid main plugin header;
- a safe class-based REST endpoint;
- a safe Settings API page;
- a dynamic block using `block.json`;
- one intentionally unsafe fixture file: `unsafe-example.php`.

## Run the baseline audit

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin --json
```

## Expected result

The audit should find the fixture-only unsafe file and report:

- missing REST `permission_callback`;
- direct request superglobal usage without nearby sanitization;
- output without obvious escaping;
- an informational reminder for dynamic block render output.

See:

- [Human audit output](examples/audit-sample-human.md)
- [JSON audit output](examples/audit-sample-json.json)
- [Audit explanation](examples/audit-sample-explanation.md)
- [Agent review example](examples/agent-review-example.md)

## Additional audit modules

The repository also includes real generated outputs for specialized fixtures:

| Audit | Input | Human output | JSON output |
|---|---|---|---|
| Performance | `test-fixtures/performance-plugin/` | [performance-audit-human.md](examples/performance-audit-human.md) | [performance-audit-json.json](examples/performance-audit-json.json) |
| Design/UX/UI | `test-fixtures/design-plugin/` | [design-audit-human.md](examples/design-audit-human.md) | [design-audit-json.json](examples/design-audit-json.json) |
| Compatibility | `test-fixtures/compatibility-plugin/` | [compatibility-audit-human.md](examples/compatibility-audit-human.md) | [compatibility-audit-json.json](examples/compatibility-audit-json.json) |

Reproduce them locally:

```bash
npm run performance:audit
npm run design:audit
npm run compatibility:audit
```

Each scanner is heuristic. The outputs demonstrate triage behavior, not exhaustive proof that a plugin is secure, fast, accessible, or compatible.

## Future demo option

A short terminal GIF or screencast can be added later if it is generated from real commands, small enough for the repository, and does not require copyrighted or external assets.
