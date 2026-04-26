# Testing Fixture

`test-fixtures/sample-plugin/` is a small WordPress plugin fixture for testing the `wordpress-plugin-dev` skill and `audit-plugin.mjs`.

## Contents

- `sample-plugin.php`: valid plugin header and bootstrap.
- `src/Plugin.php`: registers the safe REST controller, settings page, and sample block.
- `src/Rest/Safe_Controller.php`: safe REST endpoint with `permission_callback`, args validation, and capability check.
- `src/Admin/Settings_Page.php`: Settings API page with capability check, `settings_fields()`, sanitization, and escaped output.
- `blocks/sample-block/block.json`: valid block metadata for a dynamic block.
- `unsafe-example.php`: fixture-only intentionally unsafe endpoint and request/output handling examples.
- `package.json`, `composer.json`, and `readme.txt`: minimal release/build metadata for audit coverage.

## Expected Audit Result

Run:

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
```

The audit should report `unsafe-example.php` findings, including:

- `security.rest-route-missing-permission-callback`
- `security.superglobal-without-nearby-sanitization`
- `security.output-without-obvious-escaping`

It may also report informational reminders, such as dynamic block render output needing validation and escaping.

The fixture intentionally causes audit findings. A non-zero exit code from `audit-plugin.mjs` is expected when an error-level finding is present.

## Safety Note

`unsafe-example.php` is not production code. It is a minimal static fixture for scanner coverage and must not be copied into real plugins.
