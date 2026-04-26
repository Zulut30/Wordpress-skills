# Agent Review Example

Prompt:

```text
Use wordpress-plugin-dev to audit test-fixtures/sample-plugin for security and WordPress.org readiness.
```

Expected agent response shape:

```text
Findings

1. [High] unsafe-example.php registers a REST route without permission_callback.
   Add permission_callback and use __return_true only for truly public read-only endpoints.

2. [Medium] unsafe-example.php reads request data without nearby validation or sanitization.
   Validate expected type and intent, then sanitize with the appropriate WordPress sanitizer.

3. [Medium] unsafe-example.php prints output without obvious escaping.
   Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-specific API.

Notes

- sample-plugin.php has a valid plugin header.
- The block metadata exists and uses namespace/slug naming.
- Dynamic block render output still needs manual review.
- The unsafe file is marked fixture-only and should not be copied into a real plugin.
```

Good agent behavior:

- Lead with concrete findings.
- Reference files and lines when available.
- Explain why a WordPress-specific rule matters.
- Suggest safe remediation.
- State scanner limitations.
- Avoid claiming the plugin is secure just because common checks pass.
