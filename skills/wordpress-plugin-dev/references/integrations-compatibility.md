# Integrations and Compatibility for WordPress Plugins

Last reviewed: 2026-04-27

## Purpose

This reference helps an AI coding agent design WordPress plugins that work gracefully in the real WordPress ecosystem:

- support Classic Editor and Block Editor contexts where relevant;
- create safe optional adapters for SEO, cache, performance, theme, and page-builder integrations;
- avoid conflicts with themes, builders, optimization plugins, widgets, block themes, and custom layouts;
- write theme-friendly frontend output;
- create compatibility audits and compatibility matrices;
- degrade gracefully instead of becoming a pile of hardcoded workarounds.

Compatibility work must not weaken security, performance, accessibility, i18n, privacy, or WordPress Coding Standards.

## Core Principles

1. WordPress APIs first.
2. Avoid hard dependencies unless the plugin explicitly requires them.
3. Use feature detection before integration code.
4. Prefer public hooks/APIs over private internals.
5. Keep adapters isolated and optional.
6. Do not break SEO, cache, performance, or optimization plugins by default.
7. Do not globally override theme CSS or admin CSS.
8. Respect Classic Editor and Block Editor contexts separately where relevant.
9. Support graceful degradation when an integration plugin is missing.
10. Add clear admin notices only when the user can act on them.
11. Integration code must remain secure, performant, accessible, and translation-ready.
12. Verify third-party plugin/theme docs before release-sensitive integrations.

## Official Sources

Primary third-party integration docs are included here because compatibility work depends on their public APIs and hooks.

Use this list as a source map, not as copied documentation. Verify current docs before release claims, version-specific hooks, or third-party API usage.

### WordPress Core / Editor

- Title: Classic Editor plugin
  - Official URL: https://wordpress.org/plugins/classic-editor/
  - What to use it for: Classic Editor plugin status, intended behavior, and support context.
  - When to verify online: Before claiming Classic Editor support or minimum compatibility.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Classic Editor support is optional and context-dependent.

- Title: Write Posts Classic Editor
  - Official URL: https://wordpress.org/documentation/article/write-posts-classic-editor/
  - What to use it for: User-facing Classic Editor workflow context.
  - When to verify online: Before writing docs for non-block editing workflows.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Use to understand editorial fallback expectations, not low-level plugin APIs.

- Title: Plugin Handbook
  - Official URL: https://developer.wordpress.org/plugins/
  - What to use it for: WordPress plugin APIs, lifecycle, metadata, hooks, security, and release context.
  - When to verify online: Before changing plugin architecture or public API behavior.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Prefer core APIs before integration-specific code.

- Title: Hooks
  - Official URL: https://developer.wordpress.org/apis/hooks/
  - What to use it for: Actions, filters, priorities, and extensibility contracts.
  - When to verify online: Before adding public hooks or adapter extension points.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Public hooks are safer than private class internals.

- Title: Custom Meta Boxes
  - Official URL: https://developer.wordpress.org/plugins/metadata/custom-meta-boxes/
  - What to use it for: Classic Editor metabox patterns and save flows.
  - When to verify online: Before implementing Classic Editor fallbacks.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Metabox save handlers need nonce, capability, sanitization, and escaping.

- Title: Block Editor Handbook
  - Official URL: https://developer.wordpress.org/block-editor/
  - What to use it for: Gutenberg block/editor extension architecture.
  - When to verify online: Before building editor-specific compatibility behavior.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Keep editor assets scoped to editor contexts.

- Title: Block metadata
  - Official URL: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
  - What to use it for: `block.json`, block asset scoping, render metadata, and block supports.
  - When to verify online: Before relying on newer block metadata fields.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Prefer metadata-driven registration and conditional block assets.

- Title: `use_block_editor_for_post_type()`
  - Official URL: https://developer.wordpress.org/reference/functions/use_block_editor_for_post_type/
  - What to use it for: Detecting whether a post type can use the block editor.
  - When to verify online: Before branching Classic/Block Editor behavior.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Do not assume all post types use the block editor.

### SEO Plugins

- Title: Yoast Developer Portal
  - Official URL: https://developer.yoast.com/
  - What to use it for: Current Yoast extension APIs and developer docs.
  - When to verify online: Before implementing Yoast-specific adapters.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Use documented APIs and loading order; avoid private internals.

- Title: Yoast APIs and classes
  - Official URL: https://developer.yoast.com/customization/apis/using-apis-classes/
  - What to use it for: Safe timing and availability of Yoast APIs/classes.
  - When to verify online: Before referencing Yoast classes.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Guard optional classes and load adapter code after plugins are available.

- Title: Yoast REST API
  - Official URL: https://developer.yoast.com/customization/apis/rest-api/
  - What to use it for: Headless/REST SEO metadata integration.
  - When to verify online: Before exposing SEO data through REST.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Do not duplicate REST metadata if Yoast already provides it.

- Title: Yoast Schema API
  - Official URL: https://developer.yoast.com/features/schema/api/
  - What to use it for: Schema graph extension points.
  - When to verify online: Before adding schema integrations.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Avoid parallel JSON-LD output when Yoast owns the graph.

- Title: Rank Math Filters and Hooks API
  - Official URL: https://rankmath.com/kb/filters-hooks-api-developer/
  - What to use it for: Rank Math extension points and public hooks.
  - When to verify online: Before implementing Rank Math filters.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Avoid duplicate breadcrumbs, schema, robots, canonical, or social meta.

- Title: Rank Math Filters and Hooks
  - Official URL: https://rankmath.com/docs/filters-and-hooks/
  - What to use it for: Additional Rank Math hook docs.
  - When to verify online: Before release-sensitive Rank Math support.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Treat version-specific behavior as experimental until tested.

- Title: AIOSEO Developer Documentation
  - Official URL: https://aioseo.com/doc-categories/developer-documentation/
  - What to use it for: AIOSEO developer APIs.
  - When to verify online: Before coding AIOSEO adapters.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Use documented filters; avoid duplicate meta/schema output.

- Title: AIOSEO Filter Hooks
  - Official URL: https://aioseo.com/doc-categories/filter-hooks/
  - What to use it for: AIOSEO filter extension points.
  - When to verify online: Before relying on hook names or parameters.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Keep integration optional and documented.

- Title: SEOPress Hooks
  - Official URL: https://www.seopress.org/support/hooks/
  - What to use it for: SEOPress hook references.
  - When to verify online: Before adding SEOPress support.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Verify minimum version and hook availability.

- Title: SEOPress Hooks Guide
  - Official URL: https://www.seopress.org/support/guides/how-to-use-seopress-hooks/
  - What to use it for: SEOPress hook usage patterns.
  - When to verify online: Before implementing adapter examples.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Use as implementation context, not as copied code.

- Title: The SEO Framework Action Reference
  - Official URL: https://kb.theseoframework.com/kb/action-reference-for-the-seo-framework/
  - What to use it for: The SEO Framework action/filter reference.
  - When to verify online: Before adding The SEO Framework integrations.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Verify behavior on major releases before marking support as stable.

### Cache / Performance Plugins

- Title: WP Rocket docs
  - Official URL: https://docs.wp-rocket.me/
  - What to use it for: Cache, preload, exclusions, compatibility, and documented PHP functions.
  - When to verify online: Before coding purge/preload/exclusion behavior.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Treat WP Rocket as optional; do not disable it as a first fix.

- Title: LiteSpeed Cache for WordPress API
  - Official URL: https://docs.litespeedtech.com/lscache/lscwp/api/
  - What to use it for: LSCWP public API, purge hooks, and integration points.
  - When to verify online: Before using LiteSpeed-specific hooks.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Be careful with nonce/private data and public page cache.

- Title: LiteSpeed Cache for WordPress cache docs
  - Official URL: https://docs.litespeedtech.com/lscache/lscwp/cache/
  - What to use it for: Cache behavior and ESI/private cache concepts.
  - When to verify online: Before caching forms, nonces, or user-specific fragments.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Never cache private data globally; ESI/private fragments require explicit strategy.

- Title: W3 Total Cache support
  - Official URL: https://www.boldgrid.com/support/w3-total-cache/
  - What to use it for: W3 Total Cache behavior and support docs.
  - When to verify online: Before claiming W3TC-specific compatibility.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Prefer generic cache-safe architecture unless documented APIs are clear.

- Title: Autoptimize plugin page
  - Official URL: https://wordpress.org/plugins/autoptimize/
  - What to use it for: Plugin status and user-facing optimization context.
  - When to verify online: Before making support claims.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Use WordPress enqueue dependencies; do not recommend disabling optimization first.

- Title: LiteSpeed Cache plugin page
  - Official URL: https://wordpress.org/plugins/litespeed-cache/
  - What to use it for: Plugin availability, status, and user-facing context.
  - When to verify online: Before claiming compatibility.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Combine plugin-page context with official LiteSpeed docs for code-level work.

- Title: W3 Total Cache plugin page
  - Official URL: https://wordpress.org/plugins/w3-total-cache/
  - What to use it for: Plugin availability and user-facing context.
  - When to verify online: Before compatibility claims.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Avoid assumptions about active cache layers.

### Themes and Page Builders

- Title: Astra developer docs
  - Official URL: https://developers.wpastra.com/astra-theme/
  - What to use it for: Astra developer concepts and extension points.
  - When to verify online: Before Astra-specific adapters.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Prefer generic WordPress hooks first.

- Title: Astra hooks
  - Official URL: https://developers.wpastra.com/astra-theme/reference/hooks/
  - What to use it for: Astra hook references.
  - When to verify online: Before using Astra hook names or parameters.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Guard by theme detection and never fatal on theme switch.

- Title: GeneratePress hooks
  - Official URL: https://docs.generatepress.com/collection/hooks/
  - What to use it for: GeneratePress hook references.
  - When to verify online: Before GeneratePress-specific code.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Use only when a generic WordPress approach is insufficient.

- Title: GeneratePress filters
  - Official URL: https://docs.generatepress.com/collection/filters/
  - What to use it for: GeneratePress filters.
  - When to verify online: Before filter-specific compatibility.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Keep adapter optional.

- Title: Kadence theme hooks
  - Official URL: https://www.kadencewp.com/help-center/docs/kadence-theme/theme-hooks/
  - What to use it for: Kadence hook locations and usage.
  - When to verify online: Before Kadence-specific placement changes.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Avoid hardcoding visual breakpoints or markup assumptions.

- Title: OceanWP hooks
  - Official URL: https://docs.oceanwp.org/category/376-hooks
  - What to use it for: OceanWP hooks.
  - When to verify online: Before OceanWP-specific integration.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Document unverified behavior as experimental.

- Title: Elementor developer docs
  - Official URL: https://developers.elementor.com/docs/
  - What to use it for: Elementor addon architecture, widgets, hooks, scripts, controls, and extension points.
  - When to verify online: Before building Elementor adapters.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Load Elementor adapters only when Elementor is detected.

- Title: Elementor hooks
  - Official URL: https://developers.elementor.com/docs/hooks/
  - What to use it for: Elementor PHP/JS hooks and lifecycle.
  - When to verify online: Before registering widgets or editor/frontend hooks.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Do not rely on undocumented builder internals.

- Title: Hello Elementor Theme
  - Official URL: https://developers.elementor.com/docs/hello-elementor-theme/
  - What to use it for: Theme context for Elementor-heavy sites.
  - When to verify online: Before claiming Hello Elementor theme compatibility.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Treat theme behavior separately from Elementor plugin behavior.

- Title: Elegant Themes developer docs
  - Official URL: https://www.elegantthemes.com/developers/
  - What to use it for: Divi/Elegant Themes developer entry point.
  - When to verify online: Before Divi extension work.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Divi adapters are optional and should not load globally.

- Title: Divi hooks
  - Official URL: https://www.elegantthemes.com/documentation/developers/hooks/
  - What to use it for: Divi hooks.
  - When to verify online: Before hook-specific Divi integration.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Avoid undocumented builder internals.

- Title: Blocksy docs
  - Official URL: https://creativethemes.com/blocksy/docs/
  - What to use it for: Blocksy theme docs and compatibility context.
  - When to verify online: Before Blocksy-specific work.
  - Last reviewed: 2026-04-27
  - Notes for agent behavior: Prefer theme-friendly markup and CSS before theme-specific adapters.

## Compatibility Architecture

Recommended structure:

```text
src/
  Integrations/
    IntegrationInterface.php
    IntegrationRegistry.php
    ClassicEditorIntegration.php
    Seo/
      YoastIntegration.php
      RankMathIntegration.php
      AioseoIntegration.php
      SeopressIntegration.php
      SeoFrameworkIntegration.php
    Cache/
      CacheIntegrationInterface.php
      WpRocketIntegration.php
      LiteSpeedCacheIntegration.php
      W3TotalCacheIntegration.php
      AutoptimizeIntegration.php
      GenericCacheIntegration.php
    Themes/
      ThemeCompatibility.php
      AstraCompatibility.php
      GeneratePressCompatibility.php
      KadenceCompatibility.php
      OceanWpCompatibility.php
      BlockThemeCompatibility.php
    Builders/
      ElementorCompatibility.php
      DiviCompatibility.php
```

Adapter rules:

- `IntegrationRegistry` registers adapters conditionally.
- Each adapter exposes `detect()`, `register()`, `get_name()`, `get_status()`, and `get_notes()`.
- Never run integration code if its dependency is absent.
- Use namespace-aware `class_exists()`, `interface_exists()`, `function_exists()`, `defined()`, `did_action()`, `has_action()`, and `has_filter()` checks.
- Use `is_plugin_active()` only in admin context or after safely loading `wp-admin/includes/plugin.php`.
- Avoid fatal errors when plugins/themes/builders are missing.
- Do not store adapter state in large autoloaded options.
- Do not show notices on every screen; show actionable notices on relevant screens only.

## Classic Editor Compatibility

### When To Support Classic Editor

Support Classic Editor when the plugin:

- uses post editing screens;
- needs meta boxes;
- supports legacy editorial workflows;
- is used on client sites that cannot move fully to the block editor;
- has both block and non-block content insertion methods.

### What To Implement

- Classic metabox fallback for block/editor-sidebar features.
- Shortcode fallback for block output when users need Classic Editor content insertion.
- Admin settings fallback when block UI is unavailable.
- TinyMCE button only when justified.
- Clear docs: Block Editor recommended, Classic Editor supported.
- Do not assume Gutenberg is available.
- Do not assume Classic Editor is active.

### Checks

- Detect block editor availability per post type with `use_block_editor_for_post_type()` where relevant.
- Keep metabox callbacks secure.
- Sanitize saved meta and escape metabox output.
- Use nonce and capability checks for classic post saves.
- Do not enqueue block-editor assets in classic editor context unnecessarily.
- Do not enqueue classic-editor assets in block editor context unnecessarily.

### Common Pitfalls

- Block-only plugin with no shortcode/fallback where users expect Classic Editor support.
- Duplicate fields between metabox and block sidebar with inconsistent save logic.
- TinyMCE buttons loaded on every admin screen.
- Metabox save handlers missing nonces/capabilities.
- Editor-specific assets globally loaded.

## SEO Plugin Compatibility

### General SEO Compatibility Principles

- Do not output duplicate canonical, title, meta description, Open Graph, Twitter, robots, or schema tags.
- Do not inject JSON-LD schema blindly if an SEO plugin owns the schema graph.
- Avoid overriding robots/canonical unless explicitly configured.
- Provide clean data via filters/hooks where possible.
- Let SEO plugins manage SEO when active.
- Use semantic HTML and sensible headings for frontend components.
- Do not hide SEO-relevant content behind client-only rendering unless intended.
- For dynamic blocks/shortcodes, ensure server-rendered fallback where SEO matters.
- Avoid thin/duplicate indexable archives without canonical/noindex strategy.

### Plugin-Specific Notes

- Yoast SEO: use public developer docs, REST API where appropriate, and documented schema APIs. Do not depend on private internals without version checks.
- Rank Math: use documented hooks/filters; avoid duplicate breadcrumbs, schema, robots, canonical, and social meta.
- AIOSEO: use documented developer/filter hooks and avoid duplicate meta/schema output.
- SEOPress: use documented hooks and verify minimum version when applying them.
- The SEO Framework: use documented action/filter references and verify major-release behavior before claiming support.

### SEO Integration Workflow

1. Detect active SEO plugin.
2. Identify needed output: meta title/description, Open Graph/Twitter, schema, breadcrumbs, sitemaps, robots/canonical, or headless REST metadata.
3. Avoid duplicate output.
4. Use documented plugin hooks when available.
5. Provide fallback only when no SEO plugin handles the concern.
6. Add tests or manual checklist.

## Cache and Performance Plugin Compatibility

### General Cache Compatibility Principles

- Do not disable cache globally.
- Do not use random query strings to bypass cache.
- Separate public cacheable output from private/user-specific output.
- Do not cache nonces globally unless using a plugin-specific ESI/private cache strategy.
- Do not output user-specific data in public cached pages.
- Add cache purge hooks only for relevant content changes.
- Avoid full-cache purges when targeted purge is possible.
- Use WordPress enqueue APIs and asset dependencies so optimization/minification plugins can reason about assets.

### Plugin-Specific Notes

- WP Rocket: optional adapter only; verify official docs before purge/preload/exclusion code.
- LiteSpeed Cache: use official API/docs; treat nonces/forms/private fragments carefully and document ESI/private cache strategy when used.
- W3 Total Cache: use official docs; prefer generic compatibility when public APIs are unclear.
- Autoptimize and asset optimizers: use standard enqueues and dependencies; document exclusions only as fallback; do not instruct users to disable optimization first.

### Cache Compatibility Workflow

1. Identify public vs private output.
2. Identify state-changing actions.
3. Identify pages/endpoints requiring cache purge.
4. Identify nonces/forms/user-specific fragments.
5. Identify asset optimization risks.
6. Use targeted purge/invalidation where docs allow.
7. Document manual exclusions only as fallback.

## Theme Compatibility

### General Theme Compatibility Principles

- Frontend output should inherit theme typography, colors, and spacing where practical.
- Scope plugin CSS to wrapper or block classes.
- Avoid global resets, fixed widths, and layout assumptions.
- Use semantic HTML, responsive CSS, logical properties, and RTL-friendly layout.
- Avoid overriding theme header/footer/content structure.
- Do not assume theme-specific hooks exist.
- Prefer WordPress core hooks and block/theme.json-friendly patterns first.
- Theme adapters should be optional.

### Classic Themes vs Block Themes

- Classic themes often use PHP templates and theme-specific hooks.
- Block themes rely more on block templates, template parts, `theme.json`, and block markup.
- Plugins should not assume both behave the same.
- For blocks, respect block supports and `theme.json`.
- For frontend CSS, avoid fighting theme styles.

### Initial Target Ecosystem

Treat these as commonly encountered integrations, not a ranked popularity claim:

- Astra
- GeneratePress
- Kadence
- OceanWP
- Blocksy
- Hello Elementor
- Divi
- default Twenty Twenty-* themes
- generic block themes

For each: use official docs where available, add theme-specific code only when generic WordPress patterns are insufficient, detect safely, never fatal on theme changes, avoid child-theme path assumptions, and do not hardcode visual breakpoints unless verified.

### Theme Compatibility Audit

Check CSS scope, semantic markup, responsive behavior, RTL, block editor/frontend parity, shortcode output in common content wrappers, widgets/block widgets, forms/buttons, image sizes, layout shifts, commerce templates if touched, and header/footer insertion points if plugin injects UI.

## Page Builder Compatibility

### Elementor

- Use Elementor developer docs for addons/hooks.
- Detect Elementor before registering widgets.
- Do not load Elementor integration unless Elementor is active.
- Register widgets/categories through documented hooks.
- Do not enqueue Elementor assets globally.

### Divi

- Use Divi developer docs for extensions/hooks.
- Treat Divi module integration as optional.
- Avoid relying on builder internals without docs.

### Generic Page Builder Rules

- Provide shortcode/block fallback.
- Avoid global CSS.
- Avoid DOM selectors that depend on builder internals.
- Avoid breaking lazy loading or asset optimization.
- Keep content server-rendered where SEO matters.

## Compatibility Matrix

Use this template:

| Area | Integration | Status | Detection | What works | Risks | Docs verified | Notes |
|---|---|---|---|---|---|---|---|
| Editor | Classic Editor | partial | `use_block_editor_for_post_type()` / plugin state | Metabox fallback | Duplicate save logic | 2026-04-27 | Verify per post type |

Statuses:

- `supported`
- `partial`
- `experimental`
- `planned`
- `not supported`
- `unknown`

Rules:

- `supported` requires docs, detection, tests/fixture/manual checklist.
- `experimental` is for version-dependent or lightly tested integrations.
- `unknown` is better than pretending.

## Integration Review Checklist

### Must Fix

- Fatal errors when plugin/theme/builder is missing.
- Hard dependency not documented.
- Duplicate SEO meta/schema/canonical output.
- Public cache contains private/user-specific data.
- Nonces cached publicly without ESI/private strategy.
- Global CSS breaks themes/builders.
- Assets loaded globally for editor/theme/builder integrations.
- Classic Editor save handlers miss nonce/capability checks.
- Adapter uses private third-party internals without fallback.
- Cache purge runs on every request.

### Should Fix

- No compatibility matrix.
- No graceful fallback.
- No docs for claimed supported integrations.
- Over-purging cache.
- Duplicate UI between block sidebar and classic metabox.
- Theme-specific code when generic WordPress APIs are enough.
- Excessive admin notices.
- No manual testing checklist.

### Nice To Have

- Per-integration fixture.
- WordPress Playground demos.
- Compatibility screenshots.
- E2E tests for major integrations.
- User-facing troubleshooting page.
- Integration health/status admin panel.

## Agent Response Format

```text
Executive Summary
The plugin has medium compatibility risk. The largest issues are duplicate SEO output, unguarded Elementor references, and cache purge-all behavior during normal requests.

Integration Scope
- Classic Editor fallback
- SEO metadata/schema
- Cache purge behavior
- Theme/frontend CSS
- Elementor optional adapter

Detected Ecosystem
- Yoast SEO: active, adapter absent
- Elementor: referenced directly, no guard
- Block theme: unknown

Compatibility Matrix
| Area | Integration | Status | Detection | What works | Risks | Docs verified | Notes |
| SEO | Yoast SEO | experimental | class/function guard needed | planned schema adapter | duplicate JSON-LD | no | verify current docs |

Critical Conflicts
- None found.

SEO Risks
- `src/SeoBad.php:18` outputs JSON-LD in `wp_head` without an SEO plugin guard.

Cache/Performance Risks
- `src/CacheBad.php:14` purges all cache on `init`.

Theme/Page-Builder Risks
- `assets/bad-global-theme-breaker.css:1` styles global headings and buttons.
- `src/ElementorBad.php:9` references Elementor classes without detection.

Classic Editor / Block Editor Compatibility
- Add a metabox fallback using shared save/render services.
- Keep block assets out of Classic Editor screens.

Recommended Adapters
- Add `IntegrationRegistry`.
- Add optional SEO output guard.
- Add optional Elementor adapter.
- Add generic cache compatibility service.

Manual Verification Checklist
- Test Classic Editor and Block Editor on the same post type.
- Inspect rendered HTML for duplicate meta/schema/canonical tags.
- Test with cache enabled and logged-in/logged-out users.
- Test with a classic theme, block theme, and selected page builder.

Requires Current Docs Verification
- Yoast schema API hook names.
- LiteSpeed ESI/private cache strategy.
- Elementor widget registration hooks.

Experimental
- Theme-specific hook placement until tested on current theme versions.
```
