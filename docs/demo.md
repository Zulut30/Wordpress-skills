# Demo

This repository uses a text-based demo for `v0.1.0` so the result is easy to review in GitHub without downloading a binary screencast.

## Scenario

Input plugin:

```text
test-fixtures/sample-plugin/
```

The fixture is a small WordPress plugin with:

- a valid main plugin header;
- a safe class-based REST endpoint;
- a safe Settings API page;
- a dynamic block using `block.json`;
- one intentionally unsafe fixture file: `unsafe-example.php`.

## Run the audit

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

## Future demo option

A short terminal GIF or screencast can be added later if it is generated from real commands, small enough for the repository, and does not require copyrighted or external assets.
