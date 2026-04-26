# Human Audit Output

Command:

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
```

Representative output, with the local workspace path normalized:

```text
WordPress Plugin Audit
Target: test-fixtures/sample-plugin
Limitation: This is a heuristic scanner for agent review triage, not a security oracle. It can miss vulnerabilities and produce false positives; verify findings manually against current WordPress docs and project context.

Summary:
- Main plugin file: sample-plugin.php
- PHP files scanned: 6
- block.json files scanned: 1
- Findings: 1 error, 2 warning, 1 info

Findings:
- [ERROR] unsafe-example.php:16 security.rest-route-missing-permission-callback
  register_rest_route() call has no permission_callback.
  Remediation: Add a permission_callback. Use __return_true only for intentionally public endpoints.
- [WARNING] unsafe-example.php:29 security.superglobal-without-nearby-sanitization
  Request superglobal is used without nearby sanitization or validation.
  Remediation: Validate intent and type first, then sanitize using a WordPress sanitizer such as sanitize_text_field(), sanitize_key(), absint(), or map_deep() as appropriate.
- [WARNING] unsafe-example.php:32 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [INFO] blocks/sample-block/block.json:1 blocks.dynamic-render-reminder
  Dynamic block render output should be validated and escaped.
  Remediation: Treat attributes as untrusted in render.php or render callbacks; validate, sanitize, authorize if needed, and escape late.
```

Exit code: `1`, because the fixture intentionally contains error-level findings.
