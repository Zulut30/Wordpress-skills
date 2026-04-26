# Source Map

Last reviewed: 2026-04-27

Use this file as the factual routing map for WordPress plugin work. It tells the agent where to verify claims, which source owns which topic, and when online verification is required. Do not copy official documentation into generated work; summarize briefly and link to the source.

## Verification Policy

- Verify online before using version-sensitive details: commands, package requirements, release rules, Plugin Check behavior, block metadata fields, Interactivity API, and WordPress.org submission rules.
- Prefer official WordPress, WordPress.org, WP-CLI, Gutenberg package, Composer, PHPUnit, and GitHub Actions sources.
- If the official docs and local project disagree, preserve the local project behavior unless it is unsafe, deprecated for the target version, or contradicted by release requirements.

## Official Sources

This map uses official WordPress Developer Resources, WordPress.org Plugin Directory docs, WP-CLI docs, Gutenberg package docs, Composer docs, PHPUnit docs, and GitHub Actions docs. Use the topic sections below for the canonical URL and agent behavior notes for each source.

## 1. Plugin basics

- Title: WordPress Plugin Developer Handbook
- Official URL: https://developer.wordpress.org/plugins/
- What to use it for: Overall plugin development orientation, handbook navigation, and finding the official chapter for plugin APIs.
- When to verify online: Before giving broad guidance that may depend on reorganized handbook chapters or new official recommendations.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Treat this as the table of contents, not the implementation source. Route to narrower pages before making specific claims.

- Title: Plugin Basics
- Official URL: https://developer.wordpress.org/plugins/plugin-basics/
- What to use it for: Basic plugin layout, how WordPress detects plugins, lifecycle hooks, and first-plugin structure.
- When to verify online: Before scaffolding a new plugin or explaining current minimum setup.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Use this to confirm baseline structure; use architecture references for production structure decisions.

## 2. Plugin headers

- Title: Header Requirements
- Official URL: https://developer.wordpress.org/plugins/plugin-basics/header-requirements/
- What to use it for: Required and supported plugin header fields, text domain, version, license, and compatibility metadata.
- When to verify online: Before release, Plugin Check remediation, or changing `Requires at least`, `Requires PHP`, `Update URI`, or WordPress.org-facing headers.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Only one PHP file should carry the plugin header. Keep plugin header, `readme.txt`, and release metadata consistent.

## 3. Plugin security

- Title: Plugin Security
- Official URL: https://developer.wordpress.org/plugins/security/
- What to use it for: Plugin Handbook security chapter entry point for capabilities, validation, nonces, escaping, and sanitization.
- When to verify online: Before security reviews, public release, or when older plugin code uses legacy patterns.
- Last reviewed: 2026-04-26
- Notes for agent behavior: This page may redirect conceptually into Common APIs security pages; follow the current official chapter links.

- Title: Common APIs Security Handbook
- Official URL: https://developer.wordpress.org/apis/security/
- What to use it for: Authoritative security concepts, including sanitizing data, validating data, escaping data, nonces, roles, and capabilities.
- When to verify online: Before making security-sensitive recommendations or changing request handling.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Always separate authorization, intent, validation, sanitization, and escaping. Do not treat nonces as permissions.

## 4. Coding standards

- Title: WordPress Coding Standards
- Official URL: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/
- What to use it for: WordPress PHP, JavaScript, CSS, HTML, and accessibility coding style expectations.
- When to verify online: Before setting PHPCS/WPCS rules, reviewing style issues, or enforcing compatibility standards.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Use standards to align with WordPress conventions, but avoid broad reformatting unrelated to the user task.

## 5. Hooks/actions/filters

- Title: Hooks
- Official URL: https://developer.wordpress.org/plugins/hooks/
- What to use it for: Actions vs filters, callback behavior, custom hooks, and extension points.
- When to verify online: Before designing public plugin hooks or reviewing side effects in filters.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Use actions for side effects and filters for transforming values. Document custom hooks near use sites.

## 6. REST API

- Title: REST API Handbook
- Official URL: https://developer.wordpress.org/rest-api/
- What to use it for: REST concepts, routing, requests, responses, schemas, authentication, and controller patterns.
- When to verify online: Before designing new REST endpoints or changing route schemas/auth behavior.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Prefer schemas and controller classes for non-trivial endpoints.

- Title: `register_rest_route()`
- Official URL: https://developer.wordpress.org/reference/functions/register_rest_route/
- What to use it for: Exact route registration signature, `rest_api_init` timing, namespacing, args, and `permission_callback` requirements.
- When to verify online: Before writing route registration code or fixing Plugin Check REST findings.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Every route needs `permission_callback`; public routes should make public intent explicit.

## 7. Admin UI / Settings API

- Title: Administration Menus
- Official URL: https://developer.wordpress.org/plugins/administration-menus/
- What to use it for: Admin menu and submenu registration, menu capabilities, and admin page placement.
- When to verify online: Before adding or changing WP admin screens.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Match menu capability to the data being managed and repeat capability checks inside render/action handlers.

- Title: Settings API
- Official URL: https://developer.wordpress.org/plugins/settings/settings-api/
- What to use it for: Registering settings, sections, fields, sanitization callbacks, and WordPress-native settings forms.
- When to verify online: Before creating settings pages or changing option registration.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Always define sanitize callbacks for writable options and escape option values when rendering.

## 8. Custom post types / taxonomies / metadata

- Title: Custom Post Types
- Official URL: https://developer.wordpress.org/plugins/post-types/
- What to use it for: Registering and working with custom post types, supports, capabilities, REST exposure, and rewrite behavior.
- When to verify online: Before adding CPTs or changing labels, rewrite rules, capabilities, or REST visibility.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Register on `init`; flush rewrites only on activation/deactivation when needed.

- Title: Taxonomies
- Official URL: https://developer.wordpress.org/plugins/taxonomies/
- What to use it for: Custom taxonomy registration, object type relationships, rewrite behavior, and admin/REST visibility.
- When to verify online: Before adding or changing taxonomies.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Align taxonomy capabilities and REST exposure with the content model.

- Title: Metadata
- Official URL: https://developer.wordpress.org/plugins/metadata/
- What to use it for: Post metadata, meta boxes, rendering metadata, and metadata storage patterns.
- When to verify online: Before changing meta registration, meta boxes, or exposed meta behavior.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Sanitize before storage, escape on render, and avoid exposing private meta without intent.

## 9. Shortcodes

- Title: Shortcodes
- Official URL: https://developer.wordpress.org/plugins/shortcodes/
- What to use it for: Shortcode registration, attributes, enclosing shortcodes, and output behavior.
- When to verify online: Before adding public shortcode APIs or migrating shortcode behavior.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Treat shortcode attributes as user input. Return output instead of echoing unless the API explicitly requires otherwise.

## 10. Internationalization

- Title: Internationalization
- Official URL: https://developer.wordpress.org/apis/internationalization/
- What to use it for: PHP and JavaScript i18n functions, text domains, translator comments, and JS translation loading.
- When to verify online: Before changing text domains, JS i18n setup, or translation extraction workflows.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Use i18n for new public strings and avoid concatenating translatable sentence fragments.

## 11. Accessibility

- Title: Accessibility Coding Standards
- Official URL: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/
- What to use it for: WordPress accessibility expectations, WCAG conformance targets, keyboard support, labels, and semantic interface guidance.
- When to verify online: Before shipping admin UI, block controls, frontend interactive UI, or form changes.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Prefer semantic HTML first, then ARIA only when needed. Automated checks do not replace manual keyboard/screen-reader review.

## 12. Privacy

- Title: Privacy
- Official URL: https://developer.wordpress.org/plugins/privacy/
- What to use it for: Personal data exporters, erasers, privacy policy suggestions, and privacy-related hooks/capabilities.
- When to verify online: Before storing personal data, sending data externally, adding tracking, or preparing public release.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Identify what personal data is collected, where it is stored, how it is exported/deleted, and whether external services are involved.

## 13. Block Editor / Gutenberg

- Title: Block Editor Handbook
- Official URL: https://developer.wordpress.org/block-editor/
- What to use it for: Block Editor concepts, block development environment, block APIs, package references, components, and editor extension points.
- When to verify online: Before implementing Gutenberg features, editor UI, slotfills, block supports, or package-specific APIs.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Use this as the Block Editor table of contents; route to block metadata, package, or Interactivity API docs for exact implementation.

## 14. `block.json` metadata

- Title: Metadata in `block.json`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
- What to use it for: Exact `block.json` fields, asset references, API version, textdomain, attributes, render behavior, and frontend enqueueing.
- When to verify online: Before authoring or changing `block.json`, block asset loading, or compatibility with new WordPress versions.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Prefer `block.json` as the canonical block contract and register blocks server-side.

## 15. `@wordpress/create-block`

- Title: `@wordpress/create-block`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/
- What to use it for: Official block plugin scaffolding, command options, templates, variants, namespace/textdomain flags, and generated scripts.
- When to verify online: Before recommending exact `npx` commands, Node/npm requirements, or scaffold flags.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Use exact commands only after checking current requirements; scaffold output may change between package versions.

## 16. `@wordpress/scripts`

- Title: `@wordpress/scripts`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- What to use it for: Standard WordPress JavaScript build, lint, format, test, and package scripts.
- When to verify online: Before adding build commands, changing package scripts, or using experimental flags.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Prefer `@wordpress/scripts` for block/editor builds unless the existing project has a justified custom pipeline.

## 17. Interactivity API

- Title: Interactivity API Reference
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
- What to use it for: Frontend block interactivity, directives, stores, server-side rendering support, and script module patterns.
- When to verify online: Always verify for Interactivity API work, especially WordPress minimum version, `viewScriptModule`, and package/build requirements.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Do not invent directives or store APIs. Keep sensitive data out of frontend state.

## 18. `wp-env`

- Title: `@wordpress/env`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/
- What to use it for: Local Docker-based WordPress environments for plugin/block development and testing.
- When to verify online: Before writing `.wp-env.json`, recommending Docker requirements, or using command flags.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Treat local env config as project-specific. Do not assume Docker is available.

## 19. WP-CLI / scaffold plugin-tests

- Title: WP-CLI Handbook
- Official URL: https://make.wordpress.org/cli/handbook/
- What to use it for: WP-CLI installation, command behavior, global parameters, packages, and operational guidance.
- When to verify online: Before recommending operational commands on production, remote, SSH, or multisite targets.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Prefer dry-run or read-only commands when inspecting live sites. Be explicit about data mutation.

- Title: `wp scaffold plugin-tests`
- Official URL: https://developer.wordpress.org/cli/commands/scaffold/plugin-tests/
- What to use it for: Generating PHPUnit test harness files for a plugin.
- When to verify online: Before generating test scaffolds or relying on current scaffolded file names/options.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Scaffold output changes over time; adapt to the existing plugin's test setup rather than overwriting blindly.

## 20. Plugin Check

- Title: Plugin Check
- Official URL: https://wordpress.org/plugins/plugin-check/
- What to use it for: Automated checks for WordPress.org requirements and plugin best practices across security, performance, accessibility, and i18n.
- When to verify online: Before release, before interpreting check categories/severity, or before recommending exact WP-CLI usage.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Plugin Check supports review but does not replace manual review. Treat false positives carefully and document unresolved findings.

## 21. Performance optimization

- Title: WordPress Advanced Administration Performance / Optimization
- Official URL: https://developer.wordpress.org/advanced-administration/performance/optimization/
- What to use it for: Broad WordPress performance context, performance factors, testing mindset, caching, database tuning, and autoloaded options.
- When to verify online: Before giving hosting, caching, database, autoload, or version-sensitive performance recommendations.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use as context, then inspect plugin-specific hot paths. Do not reduce performance advice to "install a cache plugin."

- Title: WordPress Core Performance Team Handbook
- Official URL: https://make.wordpress.org/performance/handbook/
- What to use it for: Current Core performance team guidance, terminology, and performance project context.
- When to verify online: Before citing current Core priorities or tool recommendations.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use for orientation and current-doc verification; do not claim Core benchmark results for a plugin without measuring.

- Title: `wp_enqueue_script()`
- Official URL: https://developer.wordpress.org/reference/functions/wp_enqueue_script/
- What to use it for: Script handles, dependencies, versions, footer loading, and current script loading strategy parameters.
- When to verify online: Before adding `defer`/`async` strategies, script module assumptions, or version-sensitive enqueue behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Scope assets by frontend/admin/editor/block context and preserve dependencies/versions.

- Title: Transients API / `set_transient()`
- Official URL: https://developer.wordpress.org/reference/functions/set_transient/
- What to use it for: Transient writes, expiration behavior, key limits, object-cache interaction, and autoload implications for non-expiring transients.
- When to verify online: Before changing cache expiration, cache key strategy, or transient hook behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Prefer explicit TTLs and invalidation. Never cache private/user-specific data globally.

- Title: Transients API / `get_transient()`
- Official URL: https://developer.wordpress.org/reference/functions/get_transient/
- What to use it for: Transient reads and cache miss handling.
- When to verify online: Before changing falsey cache handling or transient fallback logic.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use strict `false` checks; cached values can be `0`, `''`, or empty arrays.

- Title: Object Cache / `wp_cache_get()`
- Official URL: https://developer.wordpress.org/reference/functions/wp_cache_get/
- What to use it for: Object cache reads, cache groups, and the `$found` flag.
- When to verify online: Before using advanced object-cache parameters or group behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use `$found` to distinguish cache misses from falsey cached values.

- Title: Object Cache / `wp_cache_set()`
- Official URL: https://developer.wordpress.org/reference/functions/wp_cache_set/
- What to use it for: Object cache writes, cache groups, and expirations.
- When to verify online: Before relying on persistent object-cache behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Persistence depends on hosting/object-cache drop-ins; document assumptions.

- Title: `WP_Query`
- Official URL: https://developer.wordpress.org/reference/classes/wp_query/
- What to use it for: Query arguments, pagination, return fields, caching parameters, and post data reset behavior.
- When to verify online: Before using less common query flags or optimizing query parameters for a specific WordPress version.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Bound results, avoid unnecessary totals, use IDs when possible, and do not query inside loops without justification.

- Title: Block Metadata / `block.json`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
- What to use it for: Block asset fields, render metadata, and block-scoped asset loading.
- When to verify online: Before relying on newer metadata fields, script modules, or conditional asset behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Prefer metadata-driven registration and block-scoped frontend assets.

- Title: REST API route registration
- Official URL: https://developer.wordpress.org/reference/functions/register_rest_route/
- What to use it for: Route args, namespace/versioning, permissions, and REST callback structure.
- When to verify online: Before changing REST route behavior, args, schema, or permission semantics.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Performance fixes must keep `permission_callback`, validation, sanitization, and response safety intact.

## 22. WordPress.org `readme.txt` and release process

- Title: Plugin Readmes
- Official URL: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- What to use it for: `readme.txt` headers, sections, stable tag, screenshots, changelog, and directory display behavior.
- When to verify online: Before public release, readme validation, or changing WordPress.org listing metadata.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Keep `readme.txt`, plugin headers, and release tags consistent.

- Title: Detailed Plugin Guidelines
- Official URL: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- What to use it for: WordPress.org plugin repository rules, licensing, naming, external services, security, and review expectations.
- When to verify online: Before submission, resubmission, takeover, or policy-sensitive changes.
- Last reviewed: 2026-04-26
- Notes for agent behavior: For public releases, policy compliance is a release blocker, not a style preference.

- Title: Using Subversion
- Official URL: https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/
- What to use it for: WordPress.org SVN checkout, trunk/tags/assets workflow, and release upload process.
- When to verify online: Before issuing SVN commands or advising a WordPress.org release workflow.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Do not run release commands without explicit user intent and repository credentials.

## Additional official ecosystem sources

- Title: Composer Documentation
- Official URL: https://getcomposer.org/doc/
- What to use it for: PHP dependency management, autoloading, scripts, and package metadata.
- When to verify online: Before changing Composer constraints, plugin autoloading, or install/update commands.
- Last reviewed: 2026-04-26
- Notes for agent behavior: WordPress.org distribution may require vendored production dependencies; check project release policy.

- Title: PHPUnit Documentation
- Official URL: https://phpunit.de/documentation.html
- What to use it for: PHPUnit configuration, assertions, compatibility, and test runner behavior.
- When to verify online: Before changing test framework versions or CI test commands.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Match PHPUnit version to supported PHP and WordPress test suite constraints.

- Title: GitHub Actions Documentation
- Official URL: https://docs.github.com/actions
- What to use it for: CI workflow syntax, matrix builds, caching, artifacts, and secrets handling.
- When to verify online: Before editing release CI, publishing workflows, or security-sensitive automation.
- Last reviewed: 2026-04-26
- Notes for agent behavior: Never expose secrets in logs or generated examples.
