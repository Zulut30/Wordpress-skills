# WordPress Security

Last reviewed: 2026-04-26

## Official Sources

- Common APIs security: https://developer.wordpress.org/apis/security/
- Nonces: https://developer.wordpress.org/apis/security/nonces/
- Data validation: https://developer.wordpress.org/apis/security/data-validation/
- Sanitizing: https://developer.wordpress.org/apis/security/sanitizing/
- Escaping: https://developer.wordpress.org/apis/security/escaping/
- Roles and capabilities: https://developer.wordpress.org/plugins/users/roles-and-capabilities/
- REST API Handbook: https://developer.wordpress.org/rest-api/

## Verify Current Docs First

Verify current sanitization helpers, REST schema behavior, and Plugin Check security rules before final release recommendations.

## Security Model

- Authentication answers "who is the user?"
- Authorization answers "may this user do this?"
- Intent answers "did this user mean to perform this browser-triggered action?"
- Validation answers "is this value acceptable?"
- Sanitization answers "how should this value be normalized before storage or use?"
- Escaping answers "how should this value be encoded for this output context?"

## Required Patterns

- Capability checks: use `current_user_can()` for admin pages, form handlers, AJAX handlers, REST permissions, destructive actions, and private data.
- Nonces: use `wp_nonce_field()`, `wp_nonce_url()`, `check_admin_referer()`, `check_ajax_referer()`, or REST nonce handling for browser-originated state changes.
- REST: every route needs a `permission_callback`. Public routes should explicitly return `true` and avoid exposing private data.
- Database: prefer WordPress APIs; when SQL is necessary, use `$wpdb->prepare()`.
- Redirects: use `wp_safe_redirect()` for user-controlled URLs.
- Filesystem: use WordPress filesystem APIs when writing plugin/theme files, validate paths, and avoid arbitrary uploads.

## Sanitization And Escaping

- Text fields: `sanitize_text_field()`, `sanitize_textarea_field()`.
- Keys/slugs: `sanitize_key()`, `sanitize_title()`.
- Email/URL: `sanitize_email()`, `esc_url_raw()` for storage, `esc_url()` for output.
- HTML: allow only intentional markup with `wp_kses()` or `wp_kses_post()`.
- Integers/booleans: cast and range-check.
- Output HTML text: `esc_html()`.
- Output attributes: `esc_attr()`.
- Output JS data: prefer `wp_json_encode()` and WordPress script data APIs.

## Red Flags

- Nonce check without capability check.
- `permission_callback => '__return_true'` on private or mutating REST routes.
- Echoing option, meta, request, or block attribute values without escaping.
- Storing raw request arrays.
- Direct SQL with interpolated variables.
- Admin action triggered by GET without nonce.
