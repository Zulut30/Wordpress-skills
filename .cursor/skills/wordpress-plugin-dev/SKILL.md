---
name: wordpress-plugin-dev
description: "Helps agents develop, review, test, secure, package, and release modern WordPress plugins. Use for WordPress plugin architecture, Gutenberg block work, block.json, REST API, WP admin screens, shortcode implementation, Settings API, WP-CLI workflows, PHPUnit tests, wp-env environments, Plugin Check, WordPress.org release preparation, and security audit tasks."
license: MIT
compatibility: "Designed for Codex, Cursor, Claude Code, and other Agent Skills-compatible tools."
---

# WordPress Plugin Dev

Act as a senior WordPress plugin engineer. Build in the style of the target codebase, prefer official WordPress APIs, keep changes scoped, and make security, maintainability, accessibility, and release readiness part of the default workflow.

## Start By Classifying The Task

Before planning or editing, identify the primary task type:

- `new plugin`
- `feature implementation`
- `code review`
- `security audit`
- `Gutenberg/block work`
- `REST/admin/settings work`
- `testing/CI`
- `release to WordPress.org`

Then inspect the plugin structure and load only the references needed for that task. For review tasks, use the advanced workflow in `references/review-checklists.md` that matches the requested review type before writing findings.

## Mandatory Rules

- Do not write unsafe PHP. Treat request data, options, meta, block attributes, REST payloads, shortcode attributes, and external responses as untrusted.
- Check both capability and nonce for browser/admin actions that change data. Use capabilities for authorization and nonces for intent.
- Sanitize on input, validate before use, and escape on output for the exact context.
- Give every REST route a real `permission_callback`; use explicit public access only when the route truly exposes public data.
- Prefer `block.json` and server-side block registration for blocks.
- Prefer `@wordpress/scripts` for JavaScript builds unless the existing project has a clear reason to use custom webpack, Vite, or another pipeline.
- Use WordPress i18n functions for new public strings in PHP and JavaScript.
- For public release, check `readme.txt`, plugin headers, licenses, assets, build artifacts, and Plugin Check output.

## Reference Routing

- Architecture, lifecycle, layout, activation, deactivation, uninstall: `references/plugin-architecture.md`
- Security, capabilities, nonces, sanitization, escaping, REST permissions: `references/wordpress-security.md`
- PHP/JS/CSS/docs standards and compatibility tooling: `references/coding-standards.md`
- Hooks, REST, admin menus, Settings API, CPTs, taxonomies: `references/hooks-rest-admin.md`
- Gutenberg blocks, `block.json`, dynamic blocks, build tooling: `references/blocks-gutenberg.md`
- Interactivity API and script modules: `references/interactivity-api.md`
- i18n, accessibility, privacy, personal data workflows: `references/i18n-a11y-privacy.md`
- `wp-env`, WP-CLI, PHPUnit, Plugin Check, CI: `references/testing-and-ci.md`
- WordPress.org readme, assets, SVN/release workflow: `references/release-wordpress-org.md`
- Review workflows and acceptance checklists for architecture, security, blocks, REST, admin settings, release, performance, and a11y/i18n: `references/review-checklists.md`
- Official source index and version-sensitive verification: `references/source-map.md`

## Common Workflows

### build-new-plugin

1. Read `references/plugin-architecture.md`, then choose a minimal architecture for the plugin size.
2. Create a safe bootstrap with plugin headers, `ABSPATH` guard, constants, lifecycle hooks, and service registration.
3. Add only the required surfaces: admin, REST, shortcode, blocks, cron, privacy, or uninstall.
4. Add templates from `assets/templates/` only as starting points; replace placeholders and adapt to the project.
5. Run available validation, lint, tests, or audit scripts and document anything unavailable.

### add-secure-rest-endpoint

1. Read `references/hooks-rest-admin.md` and `references/wordpress-security.md`.
2. Register the route on `rest_api_init` with namespace, method, callback, `permission_callback`, args, and schema where practical.
3. Validate and sanitize request data, enforce capability checks, return `WP_REST_Response` or `WP_Error`, and avoid leaking private data.
4. Add tests or smoke checks for authorized, unauthorized, invalid, and successful requests.

### create-dynamic-block

1. Read `references/blocks-gutenberg.md`; read `references/interactivity-api.md` only when frontend interactivity is needed.
2. Define block metadata in `block.json` with namespace, attributes, textdomain, assets, and render behavior.
3. Register the block server-side and keep editor assets separate from frontend assets.
4. In render callbacks, sanitize attributes and escape all output.
5. Use `@wordpress/scripts` unless the existing project already standardizes on another build tool.

### review-plugin-security

1. Read `references/wordpress-security.md` and `references/review-checklists.md`.
2. Inspect admin actions, AJAX, REST routes, shortcodes, block render callbacks, options/meta writes, SQL, filesystem operations, and external HTTP calls.
3. Prioritize findings by exploitability and user impact.
4. Recommend minimal fixes that preserve plugin behavior.

### prepare-wordpress-org-release

1. Read `references/release-wordpress-org.md`, `references/testing-and-ci.md`, and `references/source-map.md`.
2. Verify current official docs before relying on release, Plugin Check, or SVN details.
3. Check plugin headers, `readme.txt`, stable tag, changelog, license compatibility, assets, built files, and excluded development files.
4. Run Plugin Check and available test/build scripts; report unresolved warnings clearly.

## When Unsure

- Check `references/source-map.md`.
- Verify the current official WordPress, Block Editor, WP-CLI, Plugin Check, npm, Composer, or PHPUnit documentation before giving version-sensitive advice.
- Do not invent APIs, flags, hooks, metadata fields, or release rules. If uncertain, say what needs verification and use the safest documented alternative.
