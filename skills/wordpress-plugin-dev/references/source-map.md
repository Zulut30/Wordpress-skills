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

## 22. Design, UX, and UI

- Title: Make WordPress Design Handbook
- Official URL: https://make.wordpress.org/design/handbook/
- What to use it for: WordPress ecosystem design foundations, interface design context, inclusion, and design-team orientation.
- When to verify online: Before claiming current WordPress design-system direction, colors, typography, iconography, or design-team guidance.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use as context for WordPress-native feel. Do not copy official branding or use WordPress marks as plugin branding.

- Title: `@wordpress/admin-ui`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-admin-ui/
- What to use it for: Consistent admin page layout primitives for React-based admin pages.
- When to verify online: Before production use because package status, APIs, and CSS requirements can change.
- Last reviewed: 2026-04-27
- Notes for agent behavior: It can help with consistent admin page layouts, but classic Settings API pages may not need it.

- Title: Component Reference / `@wordpress/components`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/components/
- What to use it for: WordPress editor/admin controls such as Button, Notice, TextControl, ToggleControl, SelectControl, Placeholder, PanelBody, Modal, Spinner, and ToolbarButton.
- When to verify online: Before relying on specific component props, newer components, or behavior not already used in the project.
- Last reviewed: 2026-04-27
- Notes for agent behavior: This is the safer default for many editor/admin UI elements.

- Title: `@wordpress/ui`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-ui/
- What to use it for: Low-level UI primitives for custom WordPress/Gutenberg interfaces.
- When to verify online: Always verify current docs and package maturity before production use.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Treat as experimental/evolving for plugin work. Prefer `@wordpress/components` unless the project already uses it or current docs justify it.

- Title: Block Design
- Official URL: https://developer.wordpress.org/block-editor/explanations/user-interface/block-design/
- What to use it for: Gutenberg block UI decisions, canvas/sidebar balance, block controls, and user task flow.
- When to verify online: Before implementing block editor UI or citing current editor patterns.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Keep primary content work on the canvas and avoid overloading InspectorControls.

- Title: Block Editor Accessibility
- Official URL: https://developer.wordpress.org/block-editor/how-to-guides/accessibility/
- What to use it for: Accessibility guidance for block editor extensions, landmarks, keyboard behavior, and dynamic UI.
- When to verify online: Before implementing complex editor interactions, modals, keyboard flows, or live updates.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Accessibility requirements are design requirements, not optional polish.

- Title: `@wordpress/a11y`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-a11y/
- What to use it for: Screen-reader announcements and accessibility helpers for dynamic updates.
- When to verify online: Before importing helpers or adding spoken messages.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Announce meaningful async status changes; do not spam assistive technologies.

- Title: Administration Menus
- Official URL: https://developer.wordpress.org/plugins/administration-menus/
- What to use it for: Admin menu placement, capabilities, top-level vs submenu decisions, and admin screen registration.
- When to verify online: Before adding new wp-admin navigation or moving plugin screens.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Avoid unnecessary top-level menus. Navigation design must respect capabilities and context.

- Title: Settings API
- Official URL: https://developer.wordpress.org/plugins/settings/settings-api/
- What to use it for: WordPress-native settings screens, forms, sections, fields, nonce flow, and sanitization.
- When to verify online: Before creating or refactoring settings pages.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Design improvements must preserve sanitize callbacks, nonces, capability checks, and save feedback.

- Title: HTML Coding Standards
- Official URL: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/
- What to use it for: Semantic, maintainable WordPress HTML.
- When to verify online: Before reviewing HTML standards or changing templates.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Prefer semantic HTML and escaped output over decorative markup.

- Title: CSS Coding Standards
- Official URL: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/
- What to use it for: CSS selector quality, admin CSS cautions, media queries, and maintainable stylesheet structure.
- When to verify online: Before adding style rules, linting guidance, or CSS standards advice.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Scope plugin CSS and do not override global wp-admin or theme elements by default.

- Title: Internationalization
- Official URL: https://developer.wordpress.org/apis/internationalization/
- What to use it for: PHP/JS translations, text domains, translator comments, and text expansion.
- When to verify online: Before changing i18n setup or generated UI strings.
- Last reviewed: 2026-04-27
- Notes for agent behavior: UI copy must be translation-ready and resilient to longer strings.

- Design guidance must not override security, accessibility, performance, or i18n rules.

## 23. Integrations and compatibility

### Classic Editor / editor compatibility

- Title: Classic Editor plugin
- Official URL: https://wordpress.org/plugins/classic-editor/
- What to use it for: Classic Editor plugin status and context.
- When to verify online: Before claiming Classic Editor compatibility or support status.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Classic Editor is optional and context-dependent.

- Title: Write Posts Classic Editor
- Official URL: https://wordpress.org/documentation/article/write-posts-classic-editor/
- What to use it for: User workflow context for Classic Editor fallbacks.
- When to verify online: Before writing user-facing Classic Editor docs.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use for workflow expectations, not low-level plugin APIs.

- Title: Custom Meta Boxes
- Official URL: https://developer.wordpress.org/plugins/metadata/custom-meta-boxes/
- What to use it for: Classic metabox UI and save handlers.
- When to verify online: Before implementing metabox fallbacks.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Metabox saves need nonce, capability, sanitization, and escaping.

- Title: Block Editor Handbook
- Official URL: https://developer.wordpress.org/block-editor/
- What to use it for: Block/editor extension context and editor-scoped assets.
- When to verify online: Before adding editor-specific compatibility behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Do not assume all edit screens use the block editor.

- Title: Block Metadata / `block.json`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
- What to use it for: Block metadata, asset fields, render behavior, and block-scoped assets.
- When to verify online: Before relying on newer metadata fields or block asset behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Prefer block metadata and conditional assets for editor/frontend compatibility.

- Title: `use_block_editor_for_post_type()`
- Official URL: https://developer.wordpress.org/reference/functions/use_block_editor_for_post_type/
- What to use it for: Per-post-type block editor compatibility checks.
- When to verify online: Before branching Classic/Block Editor behavior.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Check context instead of guessing editor availability.

### SEO plugins

- Title: Yoast Developer Portal
- Official URL: https://developer.yoast.com/
- What to use it for: Current Yoast SEO developer APIs and extension docs.
- When to verify online: Before release-sensitive Yoast integration.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use public APIs, not private internals.

- Title: Yoast APIs and classes
- Official URL: https://developer.yoast.com/customization/apis/using-apis-classes/
- What to use it for: Yoast API/class loading timing.
- When to verify online: Before referencing Yoast classes.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Guard optional classes and hook adapter loading after plugins are available.

- Title: Yoast REST API
- Official URL: https://developer.yoast.com/customization/apis/rest-api/
- What to use it for: Headless/REST SEO metadata.
- When to verify online: Before exposing SEO data through REST.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Avoid duplicating data already provided by Yoast.

- Title: Yoast Schema API
- Official URL: https://developer.yoast.com/features/schema/api/
- What to use it for: Schema graph extension.
- When to verify online: Before adding Yoast schema graph integration.
- Last reviewed: 2026-04-27
- Notes for agent behavior: SEO integrations must avoid duplicate meta/schema output.

- Title: Rank Math Filters and Hooks API
- Official URL: https://rankmath.com/kb/filters-hooks-api-developer/
- What to use it for: Rank Math documented hooks and filters.
- When to verify online: Before implementing Rank Math adapters.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Avoid duplicate schema, breadcrumbs, robots, canonical, and social meta.

- Title: Rank Math Filters and Hooks
- Official URL: https://rankmath.com/docs/filters-and-hooks/
- What to use it for: Additional Rank Math hook references.
- When to verify online: Before release claims or hook-specific code.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Mark lightly tested support as experimental.

- Title: AIOSEO Developer Documentation
- Official URL: https://aioseo.com/doc-categories/developer-documentation/
- What to use it for: AIOSEO developer APIs.
- When to verify online: Before adding AIOSEO support.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Keep integration optional and guarded.

- Title: AIOSEO Filter Hooks
- Official URL: https://aioseo.com/doc-categories/filter-hooks/
- What to use it for: AIOSEO hook/filter names.
- When to verify online: Before using hook signatures.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Do not output fallback meta/schema when AIOSEO owns it.

- Title: SEOPress Hooks
- Official URL: https://www.seopress.org/support/hooks/
- What to use it for: SEOPress hook references.
- When to verify online: Before SEOPress-specific code.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Verify version-specific hooks.

- Title: SEOPress Hooks Guide
- Official URL: https://www.seopress.org/support/guides/how-to-use-seopress-hooks/
- What to use it for: SEOPress usage context.
- When to verify online: Before adapter implementation.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use examples as context, not copied implementation.

- Title: The SEO Framework Action Reference
- Official URL: https://kb.theseoframework.com/kb/action-reference-for-the-seo-framework/
- What to use it for: The SEO Framework actions/filters.
- When to verify online: Before adding support or release claims.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Verify major-release behavior before marking supported.

### Cache/performance plugins

- Title: WP Rocket Docs
- Official URL: https://docs.wp-rocket.me/
- What to use it for: WP Rocket cache, compatibility, exclusions, and PHP functions.
- When to verify online: Before purge/preload/exclusion logic.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Do not disable cache as a first fix; prefer targeted integration.

- Title: LiteSpeed Cache for WordPress API
- Official URL: https://docs.litespeedtech.com/lscache/lscwp/api/
- What to use it for: LiteSpeed public API and purge hooks.
- When to verify online: Before LiteSpeed-specific integration.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Cache integrations must avoid private data leakage and over-purging.

- Title: LiteSpeed Cache behavior
- Official URL: https://docs.litespeedtech.com/lscache/lscwp/cache/
- What to use it for: Cache behavior, ESI, and private cache considerations.
- When to verify online: Before caching forms, nonces, or user-specific fragments.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Never cache user-specific output publicly without a private/ESI strategy.

- Title: W3 Total Cache Support
- Official URL: https://www.boldgrid.com/support/w3-total-cache/
- What to use it for: W3 Total Cache documentation and behavior.
- When to verify online: Before W3TC-specific support.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use generic cache-safe design if public APIs are unclear.

- Title: Autoptimize plugin page
- Official URL: https://wordpress.org/plugins/autoptimize/
- What to use it for: Plugin status and optimization context.
- When to verify online: Before support claims.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use standard enqueues and dependencies; do not disable optimization first.

- Title: LiteSpeed Cache plugin page
- Official URL: https://wordpress.org/plugins/litespeed-cache/
- What to use it for: Plugin availability and user-facing context.
- When to verify online: Before compatibility claims.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Combine with official LiteSpeed docs for code-level work.

- Title: W3 Total Cache plugin page
- Official URL: https://wordpress.org/plugins/w3-total-cache/
- What to use it for: Plugin availability and user-facing context.
- When to verify online: Before compatibility claims.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Hosting/CDN/server cache can dominate behavior; document assumptions.

### Themes

- Title: Astra Developer Docs
- Official URL: https://developers.wpastra.com/astra-theme/
- What to use it for: Astra developer concepts.
- When to verify online: Before Astra-specific adapters.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Theme compatibility should prefer generic WordPress APIs before theme-specific hooks.

- Title: Astra Hooks
- Official URL: https://developers.wpastra.com/astra-theme/reference/hooks/
- What to use it for: Astra hook references.
- When to verify online: Before using Astra hook names or parameters.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Guard with theme detection and never fatal on theme switch.

- Title: GeneratePress Hooks
- Official URL: https://docs.generatepress.com/collection/hooks/
- What to use it for: GeneratePress hook locations.
- When to verify online: Before GeneratePress-specific integration.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use theme-specific hooks only when generic placement is insufficient.

- Title: GeneratePress Filters
- Official URL: https://docs.generatepress.com/collection/filters/
- What to use it for: GeneratePress filter references.
- When to verify online: Before using filters.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Mark untested support as experimental.

- Title: Kadence Theme Hooks
- Official URL: https://www.kadencewp.com/help-center/docs/kadence-theme/theme-hooks/
- What to use it for: Kadence hook locations.
- When to verify online: Before Kadence-specific placement.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Avoid hardcoded breakpoints or layout assumptions.

- Title: OceanWP Hooks
- Official URL: https://docs.oceanwp.org/category/376-hooks
- What to use it for: OceanWP hook references.
- When to verify online: Before OceanWP-specific code.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Keep adapter optional.

- Title: Blocksy Docs
- Official URL: https://creativethemes.com/blocksy/docs/
- What to use it for: Blocksy theme context.
- When to verify online: Before Blocksy support claims.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Theme-friendly markup/CSS comes before theme-specific adapters.

### Page builders

- Title: Elementor Developer Docs
- Official URL: https://developers.elementor.com/docs/
- What to use it for: Elementor addon architecture, widgets, scripts, controls, and extension points.
- When to verify online: Before Elementor adapter code.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Elementor integrations are optional and should not load unless detected.

- Title: Elementor Hooks
- Official URL: https://developers.elementor.com/docs/hooks/
- What to use it for: Elementor PHP/JS hook lifecycle.
- When to verify online: Before registering widgets or editor/frontend hooks.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Avoid private builder internals.

- Title: Hello Elementor Theme
- Official URL: https://developers.elementor.com/docs/hello-elementor-theme/
- What to use it for: Theme context for Elementor-heavy sites.
- When to verify online: Before Hello Elementor compatibility claims.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Treat theme behavior separately from Elementor plugin behavior.

- Title: Elegant Themes Developer Docs
- Official URL: https://www.elegantthemes.com/developers/
- What to use it for: Divi/Elegant Themes developer entry point.
- When to verify online: Before Divi extension work.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Divi adapters are optional and should not load globally.

- Title: Divi Hooks
- Official URL: https://www.elegantthemes.com/documentation/developers/hooks/
- What to use it for: Divi hook references.
- When to verify online: Before Divi hook-specific code.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Avoid undocumented builder internals.

### Generic WordPress compatibility APIs

- Title: Plugin APIs
- Official URL: https://developer.wordpress.org/plugins/
- What to use it for: Core-first plugin APIs and architecture.
- When to verify online: Before adding compatibility surfaces.
- Last reviewed: 2026-04-27
- Notes for agent behavior: WordPress core APIs first; third-party adapters second.

- Title: Hooks API
- Official URL: https://developer.wordpress.org/apis/hooks/
- What to use it for: Public extension points and adapter boundaries.
- When to verify online: Before publishing hooks or using third-party hooks.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Prefer public hooks over private classes.

- Popularity and version support can change; verify before making release claims.
- “Compatible with all plugins/themes” is not an acceptable claim.

## 24. WordPress.org `readme.txt` and release process

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
