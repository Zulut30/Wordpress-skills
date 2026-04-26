---
name: wordpress-plugin-dev
description: "Helps agents develop, review, test, secure, optimize, package, and release modern WordPress plugins. Use for WordPress plugin architecture, Gutenberg block work, block.json, REST API, WP admin screens, shortcode implementation, Settings API, WP-CLI workflows, PHPUnit tests, wp-env environments, Plugin Check, WordPress.org release preparation, security audit, and performance optimization tasks."
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
- `performance optimization`
- `performance audit`
- `frontend asset optimization`
- `database/query optimization`
- `block render optimization`
- `REST/admin performance review`
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
- Do not optimize by removing security checks, validation, escaping, capability gates, or nonces.
- Measure or identify hot paths before optimizing; avoid expensive work on every request.
- Scope assets, hooks, queries, REST responses, admin screens, and block rendering.
- Prefer bounded queries, pagination, `no_found_rows` when totals are not needed, and `fields => 'ids'` when only IDs are required.
- Cache expensive safe operations with explicit TTL and invalidation. Do not cache private/user-specific data globally.
- Do not store large rarely used data in autoloaded options.
- Do not make remote HTTP calls during frontend render without caching, timeout, and fallback.
- Do not call `flush_rewrite_rules()` on normal requests.
- Use `block.json` and conditional block assets for Gutenberg where suitable.

## Reference Routing

- Architecture, lifecycle, layout, activation, deactivation, uninstall: `references/plugin-architecture.md`
- Security, capabilities, nonces, sanitization, escaping, REST permissions: `references/wordpress-security.md`
- PHP/JS/CSS/docs standards and compatibility tooling: `references/coding-standards.md`
- Hooks, REST, admin menus, Settings API, CPTs, taxonomies: `references/hooks-rest-admin.md`
- Gutenberg blocks, `block.json`, dynamic blocks, build tooling: `references/blocks-gutenberg.md`
- Interactivity API and script modules: `references/interactivity-api.md`
- Performance optimization, hot paths, queries, caching, assets, REST/admin/block performance: `references/performance-optimization.md`
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

### audit-plugin-performance

1. Read `references/performance-optimization.md` and the performance workflow in `references/review-checklists.md`.
2. Identify plugin type and hot paths before recommending changes.
3. Inspect hooks, assets, queries, options/autoload, transients/object cache, REST/AJAX, admin screens, blocks, cron, and external HTTP calls.
4. Separate quick wins from changes that require profiling, cache invalidation tests, or rollout monitoring.

### optimize-frontend-assets

1. Find where frontend scripts/styles are registered and enqueued.
2. Scope assets by route, shortcode, block presence, template, or feature state.
3. Preserve dependencies, versions, i18n, and security behavior.

### optimize-rest-endpoint-performance

1. Keep `permission_callback`, validation, and sanitization intact.
2. Add pagination, bounded queries, response shape limits, and safe caching only when data is public or correctly scoped.
3. Return `WP_Error` for invalid or overly expensive requests.

### optimize-dynamic-block-rendering

1. Treat block attributes as untrusted and escape output.
2. Bound render-time queries and avoid remote calls during render.
3. Add fragment caching only with a clear TTL and invalidation hooks.

### optimize-admin-screen-performance

1. Scope admin assets by screen ID.
2. Paginate tables, lazy-load expensive data, cache counts, and avoid synchronous remote calls in page render.
3. Preserve capability checks and Settings API behavior.

### optimize-database-queries

1. Bound query size and avoid N+1 patterns.
2. Use `fields => 'ids'`, `no_found_rows => true`, and cache priming where appropriate.
3. Prefer WordPress APIs; use prepared SQL and indexes when custom tables are justified.

## When Unsure

- Check `references/source-map.md`.
- Verify the current official WordPress, Block Editor, WP-CLI, Plugin Check, npm, Composer, or PHPUnit documentation before giving version-sensitive advice.
- Do not invent APIs, flags, hooks, metadata fields, or release rules. If uncertain, say what needs verification and use the safest documented alternative.
