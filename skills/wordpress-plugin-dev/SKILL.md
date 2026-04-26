---
name: wordpress-plugin-dev
description: Build, review, test, debug, package, and release modern WordPress plugins. Use for PHP plugin architecture, hooks, REST API endpoints, admin and Settings API UI, custom post types and taxonomies, security reviews, nonces, capabilities, sanitization, escaping, i18n, accessibility, privacy, Composer, npm, @wordpress/scripts, block.json, Gutenberg static or dynamic blocks, Interactivity API, wp-env, WP-CLI, PHPUnit, Plugin Check, and WordPress.org readme or release workflows.
---

# WordPress Plugin Dev

Use this skill to act as a senior WordPress plugin engineer. Prefer official WordPress APIs, minimal dependencies, secure defaults, and release-ready structure.

## Start Here

1. Identify the task type: design, implement, review, test, debug, release, or scaffold.
2. Load only the references needed for the task.
3. If the task depends on current WordPress, Gutenberg, WP-CLI, Plugin Check, Composer, npm, or CI behavior, read `references/source-map.md` and verify current official docs first.
4. Inspect the target plugin before editing. Preserve existing architecture unless it is unsafe or clearly blocking the request.
5. Make the smallest complete change, then run available checks.

## Reference Selection

- Architecture, file layout, lifecycle hooks: `references/plugin-architecture.md`
- Capabilities, nonces, REST permissions, sanitization, escaping: `references/wordpress-security.md`
- PHP, JS, CSS, docs, compatibility standards: `references/coding-standards.md`
- Hooks, REST controllers, admin menus, Settings API, CPTs, taxonomies: `references/hooks-rest-admin.md`
- Block Editor, `block.json`, static and dynamic blocks, `@wordpress/scripts`: `references/blocks-gutenberg.md`
- Interactivity API and script modules: `references/interactivity-api.md`
- Internationalization, accessibility, privacy: `references/i18n-a11y-privacy.md`
- wp-env, WP-CLI, PHPUnit, Plugin Check, CI: `references/testing-and-ci.md`
- WordPress.org readme, assets, tagging, release: `references/release-wordpress-org.md`
- Review prompts and acceptance gates: `references/review-checklists.md`
- Official docs index and verification workflow: `references/source-map.md`

## Default Engineering Workflow

1. Define plugin boundaries: public hooks, admin UI, REST API, blocks, storage, cron, privacy, and uninstall behavior.
2. Choose architecture:
   - Small plugin: single bootstrap file plus `includes/` or `src/`.
   - Medium plugin: namespaced classes, service registration, Composer autoload.
   - Block-heavy plugin: `block.json` per block, server-side registration, `@wordpress/scripts`.
3. Register behavior on hooks; avoid executing heavy work at file load.
4. Gate privileged actions with capabilities.
5. Verify intent with nonces for form, admin, AJAX, and state-changing browser requests.
6. Sanitize on input, validate before use, escape on output.
7. Make strings translatable and use the plugin text domain.
8. Add tests or checks proportionate to the change.
9. Update readme/release metadata when behavior or requirements change.

## Security Baseline

- Never trust `$_GET`, `$_POST`, `$_REQUEST`, REST payloads, shortcode attributes, block attributes, options, post meta, or external HTTP responses.
- Use capability checks for authorization; use nonces for intent. Do not treat nonces as authorization.
- REST routes must define a meaningful `permission_callback`.
- Use WordPress sanitizers for storage and escaping functions for output contexts.
- Use prepared database queries and WordPress APIs before direct SQL.
- Treat admin pages, AJAX handlers, cron callbacks, and block render callbacks as public attack surfaces.

## Blocks Baseline

- Prefer `block.json` as the canonical block contract.
- Register blocks server-side with `register_block_type()` or metadata collection APIs when available and appropriate.
- Use dynamic blocks when frontend output must reflect server state or evolve without post resaves.
- Keep editor-only code separate from frontend code.
- For Interactivity API work, verify the current WordPress version and package guidance first.

## Release Baseline

- Keep `Stable tag`, plugin header `Version`, changelog, assets, and built files consistent.
- Run Plugin Check before WordPress.org submission or release.
- Include GPL-compatible licensing.
- Avoid bundling secrets, development-only files, large source maps, or unnecessary dependency trees in release artifacts.

## Bundled Scripts

Run from the repository root:

```bash
node skills/wordpress-plugin-dev/scripts/validate-skill.mjs
node skills/wordpress-plugin-dev/scripts/check-source-map.mjs
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs path/to/plugin
node skills/wordpress-plugin-dev/scripts/sync-install-targets.mjs
```

## Templates

Use `assets/templates/` as starting points, not final code. Replace placeholders, then adapt to the target plugin's namespace, slug, text domain, minimum PHP version, and WordPress version.

## Done Criteria

- Plugin loads without fatal errors.
- Privileged surfaces have capability checks.
- State-changing browser/admin actions verify nonces.
- Inputs are sanitized and outputs are escaped by context.
- REST routes declare schemas and permission callbacks where practical.
- Translatable strings use the correct text domain.
- Blocks are registered server-side when blocks are present.
- Tests/checks have been run or the limitation is stated.
