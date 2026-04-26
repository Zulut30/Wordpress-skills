# Security Policy

## Reporting A Vulnerability

Please do not publicly disclose exploit details before maintainers have had a chance to review the issue.

If you find a security issue in the skill, scripts, templates, or fixtures, open a private report if the repository has GitHub private vulnerability reporting enabled. If private reporting is not available, open a minimal public issue that says a security concern exists and avoid posting exploit details.

## What Counts As A Security Issue

Examples:

- A template encourages unsafe WordPress code, missing capability checks, missing nonces, missing sanitization, or missing escaping.
- A script deletes or modifies files outside documented generated targets.
- A script leaks local paths, secrets, or private data unnecessarily.
- The audit script produces misleading output that could cause a user to trust unsafe code.
- Documentation tells agents to use insecure WordPress APIs or skip required checks.

## Audit Script Limitations

`audit-plugin.mjs` is a heuristic scanner. It can find common issues, but it is not a guarantee that a plugin is secure.

Do not treat a clean audit output as proof that a plugin is safe. Use human review, tests, WordPress Coding Standards, Plugin Check, and current official WordPress docs.

## Unsafe Fixture Code

The fixture file `test-fixtures/sample-plugin/unsafe-example.php` is intentionally unsafe so the audit script has predictable findings. Do not copy fixture-only unsafe patterns into real plugins.

## Safe Handling

- Do not include secrets, tokens, private keys, or real user data in bug reports.
- Prefer minimal reproductions.
- Redact sensitive paths or private repository details when possible.
- Share exploit details privately when available.
