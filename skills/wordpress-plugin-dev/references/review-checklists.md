# Review Checklists

Last reviewed: 2026-04-26

## Official Sources

- Plugin Handbook: https://developer.wordpress.org/plugins/
- Common APIs security: https://developer.wordpress.org/apis/security/
- Coding Standards: https://developer.wordpress.org/coding-standards/
- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Plugin Check: https://wordpress.org/plugins/plugin-check/
- WordPress.org Plugin Directory: https://developer.wordpress.org/plugins/wordpress-org/

## Verify Current Docs First

For release or compatibility reviews, verify current official docs and tool output before declaring a plugin ready.

## Security Review

- Capability checks protect privileged actions.
- Nonces protect state-changing browser/admin actions.
- REST routes have appropriate `permission_callback`.
- Inputs are validated and sanitized before storage/use.
- Outputs are escaped by context.
- SQL uses `$wpdb->prepare()` or safe WordPress APIs.
- File operations validate paths and permissions.
- External requests handle errors and timeouts.

## Architecture Review

- Bootstrap is minimal.
- Services register on hooks.
- Names are prefixed or namespaced.
- Activation/deactivation/uninstall behavior is deliberate.
- Admin, REST, block, and storage responsibilities are separated.
- Public hooks are documented.

## Block Review

- `block.json` is canonical.
- Server-side registration exists.
- Dynamic render callbacks escape output.
- Assets are scoped to editor/frontend needs.
- Build output is release-ready.

## Release Review

- Versions and stable tag match.
- Readme passes official expectations.
- Plugin Check has been run.
- CI is green or limitations are documented.
- License and third-party dependency licenses are compatible.
