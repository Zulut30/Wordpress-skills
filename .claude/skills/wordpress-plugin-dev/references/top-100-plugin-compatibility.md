# Top-100 Plugin Compatibility

Last reviewed: 2026-06-07

## Official Sources

- Title: WordPress.org Plugin Directory
  - Official URL: https://wordpress.org/plugins/
  - What to use it for: Current public plugin listings, popular plugin browsing, plugin status, and user-facing metadata.
  - When to verify online: Before refreshing or relying on the top-100 compatibility watchlist.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: Popularity changes. Do not treat a stored list as permanently current.

- Title: WordPress.org Plugin Installation API
  - Official URL: https://developer.wordpress.org/reference/functions/plugins_api/
  - What to use it for: Official context for the `query_plugins` action and Plugin API request fields.
  - When to verify online: Before changing the top plugin refresh script or Plugin API query shape.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: Use the API for watchlist refreshes; do not scrape plugin pages when the API is sufficient.

- Title: `get_plugins()`
  - Official URL: https://developer.wordpress.org/reference/functions/get_plugins/
  - What to use it for: Installed plugin metadata and plugin file path behavior.
  - When to verify online: Before building active plugin detection utilities.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: Plugin slugs are not always identical to main plugin files; detect safely.

## Purpose

Use this reference when the user asks for broad ecosystem compatibility, top popular plugin support, conflict prevention, or compatibility testing across many WordPress.org plugins.

The current watchlist lives in `data/top-100-popular-plugins.json`. Refresh it with:

```bash
npm run top-100-plugins:update
npm run top-100-plugins:check
```

This list is a compatibility review target, not a support guarantee. It helps the agent avoid likely conflicts with the most common plugin categories and prioritize manual verification.

## Compatibility Claims

Use precise status language:

- `watchlisted`: plugin is in the top-100 data file but has not been manually tested.
- `baseline-safe`: the target plugin follows generic conflict-prevention rules and has no obvious static conflict.
- `adapter-guided`: optional integration guidance or a guarded adapter exists.
- `verified`: tested against an exact plugin version, WordPress version, theme, settings, and workflow.

Do not claim top-100 support only because the watchlist exists. Mark a plugin `verified` only after real WordPress runtime testing.

## Baseline Conflict Rules

- Prefix PHP namespaces, classes, functions, hooks, REST namespaces, option names, transients, cron hooks, script handles, style handles, block names, shortcode tags, nonces, and database tables.
- Never fatal when another plugin is missing, inactive, deactivated later, network-active, or loaded in a different order.
- Use feature detection before optional integration code: `class_exists( Foo::class, false )`, `function_exists()`, `defined()`, `did_action()`, `has_action()`, `has_filter()`, installed plugin metadata, or active plugin files as appropriate.
- Prefer public hooks, filters, REST endpoints, and documented APIs. Avoid private classes, global internals, bundled vendor internals, and DOM assumptions.
- Keep third-party adapters isolated behind interfaces or registries. Load them only after dependencies are available.
- Do not output duplicate SEO meta, schema, canonical, robots, Open Graph, Twitter card, breadcrumb, sitemap, or redirect behavior.
- Do not cache user-specific, nonce-bearing, cart, checkout, account, membership, LMS, form, or admin data in public page cache.
- Do not purge all caches on every request. Prefer targeted invalidation with throttling and documented hooks.
- Scope admin, editor, and frontend assets to the exact screen, block, shortcode, route, or feature.
- Avoid global CSS selectors, hardcoded theme layout overrides, and `!important` compatibility patches.
- Preserve checkout, account, form submission, login, search, import/export, backup, security, multilingual, analytics, and editor workflows.

## Top-100 Review Workflow

1. Refresh `data/top-100-popular-plugins.json` from the WordPress.org Plugins API.
2. Classify each watchlisted plugin by likely risk area: commerce, SEO, cache/performance, forms, security, backup/migration, analytics, editor/page builder, multilingual, LMS/membership, media, email/SMTP, custom fields, search, accessibility, or admin tooling.
3. Compare the target plugin's surfaces against the risk areas it touches.
4. Inspect the target plugin for conflicting handles, hooks, globals, REST namespaces, block names, shortcodes, options, transients, cron hooks, database tables, rewrite rules, cookies, query vars, and output ownership.
5. Add optional adapters only for real integration needs. Prefer generic WordPress-safe behavior when no adapter is needed.
6. Test with the highest-risk plugins first, then broaden coverage.
7. Record exact versions, settings, tested flows, screenshots/logs when useful, and known risks in the compatibility matrix.

## Manual Verification

For each plugin before marking it `verified`:

1. Install the exact WordPress version, theme, target plugin version, and watchlisted plugin version.
2. Test activation order: target first, watchlisted first, deactivate/reactivate both.
3. Check admin screens, settings saves, nonces, notices, and plugin list behavior.
4. Check frontend output, forms, cart/checkout/account pages where relevant, cached/uncached views, and logged-in/logged-out users.
5. Check editor behavior in Block Editor and Classic Editor contexts when relevant.
6. Check REST/AJAX responses, cron tasks, background jobs, email, redirects, sitemaps, schema, and search/indexing when relevant.
7. Watch PHP logs, browser console, network requests, duplicate HTML output, and performance regressions.
8. Update `docs/compatibility-matrix.md` with versioned evidence. Keep untested entries `watchlisted` or `planned`.

## High-Risk Plugin Categories

- Commerce and checkout plugins: protect cart/session/account/checkout data, order meta, webhooks, taxes, shipping, coupons, and emails.
- SEO plugins: avoid duplicate head output, schema graphs, sitemaps, breadcrumbs, canonical URLs, robots directives, redirects, and REST SEO fields.
- Cache and optimization plugins: preserve enqueue dependencies, cache variation, ESI/private fragments, lazy-loading, minification, preload, and targeted purge behavior.
- Forms and CRM plugins: preserve submission lifecycle, validation, spam checks, files, email delivery, webhooks, and consent fields.
- Security plugins: avoid bypassing firewall/login restrictions, nonce/capability checks, 2FA, hardening, file permissions, and audit logs.
- Backup/migration plugins: avoid storing volatile paths, secrets, caches, and generated archives in plugin-owned data without cleanup.
- Builders and editor plugins: avoid global editor assets, private builder internals, duplicate controls, and frontend wrapper collisions.
- Multilingual plugins: make strings translatable, avoid hardcoded language assumptions, and preserve translated URLs/content IDs.
- Analytics and consent plugins: avoid duplicate tags, respect consent mode, and do not leak personal data.
- Custom fields and CPT plugins: avoid meta key collisions, unsafe assumptions about field shape, and unbounded meta queries.

## Agent Behavior

- Treat the top-100 watchlist as a prioritization tool, not a blanket compatibility claim.
- Refresh the watchlist before release-sensitive compatibility work.
- Prefer baseline-safe design over one-off hacks for individual plugins.
- Ask for the target plugin's feature surface when compatibility risk depends on commerce, forms, SEO, cache, editor, membership, LMS, or multilingual behavior.
- If a conflict is found, isolate the adapter or guard and add a matrix entry with exact versions and verification notes.
