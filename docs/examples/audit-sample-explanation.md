# Audit Sample Explanation

The sample output comes from `test-fixtures/sample-plugin`, a small fixture plugin designed to exercise the scanner.

## Why the audit fails

The fixture includes `unsafe-example.php`, which is clearly marked as fixture-only code. It intentionally demonstrates patterns the scanner should catch:

- `register_rest_route()` without `permission_callback`;
- request data read from `$_GET` without nearby validation or sanitization;
- direct output without obvious escaping.

The audit exits with code `1` when it finds error-level issues. That is expected for this fixture.

## What the dynamic block reminder means

The scanner also emits an informational reminder for dynamic blocks. Dynamic block markup is generated server-side, so attributes and derived data should be treated as untrusted and escaped late in `render.php` or the render callback.

## What this does not prove

The scanner is useful for quick triage, but it is not a complete security review. It does not execute WordPress, resolve all control flow, or prove that a plugin is safe.
