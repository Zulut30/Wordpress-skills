# Top-100 Theme Compatibility

Last reviewed: 2026-06-07

## Official Sources

- Title: WordPress.org Popular Themes
  - Official URL: https://wordpress.org/themes/browse/popular/
  - What to use it for: Current WordPress.org popular theme ordering and public theme directory context.
  - When to verify online: Before refreshing or relying on the top-100 theme compatibility watchlist.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: Popularity changes. Do not treat a stored list as permanently current.

- Title: WordPress.org Themes API
  - Official URL: https://codex.wordpress.org/WordPress.org_API#Themes
  - What to use it for: `query_themes`, `browse=popular`, `per_page`, fields, and Theme API response shape.
  - When to verify online: Before changing the top theme refresh script or API query shape.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: Use the API for WordPress.org theme watchlist refreshes; do not scrape pages when the API is sufficient.

- Title: WP-CLI `wp theme search`
  - Official URL: https://developer.wordpress.org/cli/commands/theme/search/
  - What to use it for: WordPress.org theme search fields and CLI-based verification options.
  - When to verify online: Before recommending exact WP-CLI commands or fields.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: WP-CLI is useful for manual verification but not required for the stored watchlist.

- Title: Theme Developer Handbook
  - Official URL: https://developer.wordpress.org/themes/
  - What to use it for: Template hierarchy, block themes, classic themes, theme.json, enqueueing, and theme architecture context.
  - When to verify online: Before theme-sensitive plugin output or template integration work.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: Prefer theme-friendly plugin output before theme-specific adapters.

- Title: Newspaper ThemeForest Listing
  - Official URL: https://themeforest.net/item/newspaper/5489609
  - What to use it for: Newspaper theme vendor, premium distribution context, sales/popularity signals, and high-level feature areas.
  - When to verify online: Before making Newspaper-specific compatibility claims.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: ThemeForest marketplace data is not the WordPress.org Themes API. Treat it as an external watchlist source.

- Title: Newspaper Theme Documentation
  - Official URL: https://forum.tagdiv.com/newspaper-theme-documentation/
  - What to use it for: tagDiv Newspaper setup, companion plugins, builder concepts, and theme-specific workflows.
  - When to verify online: Before coding Newspaper/tagDiv-specific behavior.
  - Last reviewed: 2026-06-07
  - Notes for agent behavior: Verify exact theme and tagDiv plugin versions before marking support as verified.

## Purpose

Use this reference when the user asks for broad theme compatibility, top popular theme support, Newspaper compatibility, or conflict prevention across common WordPress themes.

The current WordPress.org watchlist lives in `data/top-100-popular-themes.json`. Refresh it with:

```bash
npm run top-100-themes:update
npm run top-100-themes:check
```

This list is a compatibility review target, not a support guarantee. Premium/commercial themes such as Newspaper are tracked in `premium_theme_watchlist` because they are not returned by the WordPress.org Themes API.

## Theme Compatibility Claims

Use precise status language:

- `watchlisted`: theme is in the top-100 data file or premium watchlist but has not been manually tested.
- `baseline-safe`: the target plugin follows generic theme-safe output rules and has no obvious static conflict.
- `adapter-guided`: optional theme-specific guidance or a guarded adapter exists.
- `verified`: tested against exact WordPress, theme, child theme, plugin, builder, and target plugin versions.

Do not claim top-100 theme support only because the watchlist exists. Mark a theme `verified` only after real WordPress runtime testing.

## Baseline Theme Conflict Rules

- Prefix PHP namespaces, classes, hooks, REST namespaces, block names, shortcode tags, script/style handles, option keys, transients, cookies, and CSS classes.
- Do not edit, include, or assume theme files. Use public hooks, shortcodes, blocks, widgets, template parts, block patterns, or documented extension points.
- Respect the template hierarchy. Avoid forcing templates globally unless the plugin owns a clear feature surface and exposes filters.
- Support child theme scenarios by checking both `get_template()` and `get_stylesheet()`.
- Keep frontend CSS scoped under a plugin wrapper or block class. Avoid global resets, broad element selectors, fixed widths, and `!important`.
- Inherit theme typography, colors, spacing, and responsive behavior where practical.
- Scope frontend assets by block presence, shortcode presence, route, template, or feature state.
- Keep editor assets separate from frontend assets and avoid loading builder-specific code globally.
- Avoid duplicate breadcrumbs, schema, Open Graph, canonical, title, ad slots, consent banners, lazy loading, and image optimization behavior.
- Keep WooCommerce, membership, LMS, forms, comments, search, archive, pagination, and account/checkout flows intact.
- Do not cache user-specific theme fragments in public page cache.

## Newspaper / tagDiv Notes

Newspaper is a premium news/magazine theme by tagDiv and is tracked as an external popular theme target.

Before claiming Newspaper support:

- Verify the exact Newspaper version, WordPress version, child theme status, tagDiv Composer status, tagDiv Cloud Library status, WooCommerce status, cache plugin, and active optimization settings.
- Test homepage templates, single posts, category/archive pages, search, pagination, author pages, mobile header, AMP/mobile flows if enabled, ad slots, lazy loading, infinite scroll/load more, and widgets/blocks.
- Avoid hardcoded selectors against Newspaper/tagDiv markup unless a versioned adapter owns them and includes fallback behavior.
- Avoid duplicate ad, schema, breadcrumb, social, rating/review, and related-post output.
- Treat tagDiv Composer and Cloud Library as optional companion plugin surfaces. Feature-detect and never fatal when inactive.
- Check logged-in admin/editor flows and logged-out cached frontend flows separately.

## Top-100 Theme Review Workflow

1. Refresh `data/top-100-popular-themes.json` from the WordPress.org Themes API.
2. Confirm whether the target site uses a WordPress.org theme, a child theme, or a premium/external theme such as Newspaper.
3. Classify likely risk areas: block theme, classic theme, builder shell, magazine/news layout, WooCommerce, accessibility-ready theme, FSE/theme.json, performance-focused theme, or heavy demo/import theme.
4. Compare the plugin's output surfaces against those risk areas.
5. Inspect hooks, shortcodes, blocks, frontend wrappers, CSS, JS handles, template overrides, query vars, rewrite rules, image handling, breadcrumbs, schema, cache behavior, and editor assets.
6. Add optional theme adapters only when generic theme-friendly output is insufficient.
7. Test the highest-risk themes first, then broaden coverage.
8. Record exact versions, theme settings, child theme status, screenshots/logs when useful, and known risks in the compatibility matrix.

## Manual Verification

For each theme before marking it `verified`:

1. Install the exact WordPress version, theme version, child theme if used, target plugin version, and relevant builder/companion plugins.
2. Test activation order and theme switch behavior.
3. Check frontend templates: home, single, page, archive, category, search, 404, comments, pagination, and WooCommerce templates when relevant.
4. Check editor behavior in Site Editor, Block Editor, Classic Editor, and builder contexts as applicable.
5. Check mobile and desktop layouts, RTL/text expansion where relevant, keyboard focus, and accessibility basics.
6. Check browser console, network requests, PHP logs, duplicate HTML output, and layout shifts.
7. Check cached and uncached views, logged-in and logged-out users, minified assets, lazy-loaded media, and critical CSS behavior.
8. Update `docs/compatibility-matrix.md` with versioned evidence. Keep untested entries `watchlisted` or `planned`.

## Agent Behavior

- Treat the top-100 theme watchlist as a prioritization tool, not a blanket compatibility claim.
- Refresh the watchlist before release-sensitive theme compatibility work.
- Prefer baseline-safe theme behavior over one-off CSS or template hacks.
- Ask for the active theme, parent theme, child theme, builder, WooCommerce, cache plugin, and target plugin feature surface when risk depends on layout/rendering.
- If a conflict is found, isolate the adapter or guard and add a matrix entry with exact versions and verification notes.
