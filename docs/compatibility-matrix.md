# Compatibility Matrix

This matrix is conservative. It documents what has evidence, what is only fixture/docs coverage, and what still needs real WordPress ecosystem verification.

## Status Definitions

- `supported`: tested or manually verified with a documented version and notes.
- `partial`: some flows are verified, but coverage is incomplete.
- `experimental`: adapter/guidance exists with limited verification.
- `planned`: intended target, not implemented or verified yet.
- `unknown`: no claim.

## Matrix

| Area | Integration | Version tested | Status | Verification type | What works | Known risks | Last verified | Notes |
|---|---|---:|---|---|---|---|---|---|
| Ecosystem | Top-100 popular plugin watchlist | Generated 2026-06-07 | watchlisted | WordPress.org API data + local validation | `data/top-100-popular-plugins.json` tracks current popular plugins for conflict review prioritization. | No universal compatibility claim; exact plugins require runtime verification. | 2026-06-07 | Refresh before release-sensitive claims with `npm run top-100-plugins:update`. |
| Ecosystem | Top-100 popular theme watchlist | Generated 2026-06-07 | watchlisted | WordPress.org Themes API data + local validation | `data/top-100-popular-themes.json` tracks current WordPress.org popular themes for layout/CSS/template conflict review prioritization. | No universal theme compatibility claim; exact themes require runtime verification. | 2026-06-07 | Refresh before release-sensitive claims with `npm run top-100-themes:update`. |
| Themes | Newspaper by tagDiv | Not verified | watchlisted | External premium theme watchlist + docs | Newspaper/tagDiv is tracked as a popular premium news/magazine theme target outside the WordPress.org Themes API. | Requires exact-version manual testing with tagDiv Composer, Cloud Library, cache/optimization, WooCommerce, AMP/mobile, and child theme status. | 2026-06-07 | Do not mark supported until runtime verified. |
| Classic/editor | WordPress core | Not verified | partial | Fixture + docs | Core API-first guidance and static scanner checks. | No runtime install in CI. | 2026-04-27 | Verify against the target WordPress version. |
| Classic/editor | Classic Editor | Not verified | experimental | Fixture + docs | Metabox fallback templates and scanner rules. | Real plugin behavior not tested. | 2026-04-27 | Manual verification required. |
| Classic/editor | Block Editor / Gutenberg | Not verified | partial | Fixture + docs | `block.json`, block assets, fallback guidance. | Editor runtime not tested. | 2026-04-27 | Verify current block editor docs. |
| SEO | Yoast SEO | Not verified | experimental | Docs only + adapter stub | Duplicate-output guard guidance. | No real plugin version tested. | 2026-04-27 | Verify Yoast developer docs before release work. |
| SEO | Rank Math | Not verified | experimental | Docs only + adapter stub | Optional adapter pattern. | Hooks/API versions can change. | 2026-04-27 | Manual rendered HTML verification required. |
| SEO | AIOSEO | Not verified | experimental | Docs only + adapter stub | Optional adapter pattern. | No real plugin version tested. | 2026-04-27 | Avoid duplicate schema/meta output. |
| SEO | SEOPress | Not verified | experimental | Docs only + adapter stub | Optional adapter pattern. | Minimum version unknown. | 2026-04-27 | Verify current hooks first. |
| SEO | The SEO Framework | Not verified | planned | Docs only | General compatibility notes. | No adapter template yet. | 2026-04-27 | Add real verification before claiming support. |
| Cache/performance | WP Rocket | Not verified | experimental | Docs only + adapter stub | Targeted purge placeholder. | Cache APIs and exclusions need version-specific docs. | 2026-04-27 | Do not purge all cache on normal requests. |
| Cache/performance | LiteSpeed Cache | Not verified | experimental | Docs only + adapter stub | ESI/private cache notes and targeted purge placeholder. | Hosting/cache layer behavior varies. | 2026-04-27 | Verify LSCWP API docs and real settings. |
| Cache/performance | W3 Total Cache | Not verified | experimental | Docs only + adapter stub | Safe fallback guidance. | Public API clarity varies by version. | 2026-04-27 | Prefer generic cache compatibility when unsure. |
| Cache/performance | Autoptimize | Not verified | experimental | Docs only + template | Asset enqueue compatibility guidance. | Minification/order issues need browser testing. | 2026-04-27 | Do not tell users to disable optimization first. |
| Themes | Astra | Not verified | experimental | Docs only + adapter stub | Optional hook adapter pattern. | Theme-specific hooks need current docs. | 2026-04-27 | Generic WordPress APIs first. |
| Themes | GeneratePress | Not verified | experimental | Docs only + adapter stub | Optional hook adapter pattern. | Theme version not tested. | 2026-04-27 | Manual frontend review required. |
| Themes | Kadence | Not verified | experimental | Docs only + adapter stub | Optional hook adapter pattern. | Theme version not tested. | 2026-04-27 | Avoid hardcoded breakpoints. |
| Themes | OceanWP | Not verified | planned | Docs only | Listed as target ecosystem. | No adapter yet. | 2026-04-27 | Use generic compatibility first. |
| Themes | Blocksy | Not verified | planned | Docs only | Listed as target ecosystem. | No adapter yet. | 2026-04-27 | Manual verification required. |
| Themes | Hello Elementor | Not verified | planned | Docs only | Listed as target ecosystem. | Builder/theme split needs testing. | 2026-04-27 | Avoid loading builder assets globally. |
| Themes | Divi theme | Not verified | planned | Docs only | Listed as target ecosystem. | Builder/theme internals can change. | 2026-04-27 | Use documented APIs only. |
| Themes | Default Twenty theme | Not verified | planned | Not verified | Candidate baseline theme. | No runtime screenshot/manual pass yet. | 2026-04-27 | Add WordPress runtime fixture. |
| Themes | Generic block theme | Not verified | planned | Not verified | Target for `theme.json`-friendly patterns. | No runtime editor/frontend pass. | 2026-04-27 | Add Playground demo later. |
| Page builders | Elementor | Not verified | experimental | Docs only + adapter stub | Optional adapter detection pattern. | Real Elementor install not tested. | 2026-04-27 | Load only when detected. |
| Page builders | Divi Builder | Not verified | experimental | Docs only + adapter stub | Optional adapter pattern. | Real builder install not tested. | 2026-04-27 | Avoid private internals. |

## Manual Verification Checklist

For each integration before marking it `supported`:

1. Install the target WordPress version.
2. Install and activate the exact plugin/theme/builder version.
3. Run the relevant plugin feature in admin, editor, frontend, REST/AJAX, and cron contexts as applicable.
4. Inspect rendered HTML for duplicate SEO meta/schema/canonical output.
5. Test public versus private output under cache/page-cache/CDN conditions.
6. Check browser console and network behavior.
7. Confirm no fatal errors when the integration is inactive.
8. Confirm assets are scoped and theme CSS is not globally overridden.
9. Update this matrix with version, verification type, date, and notes.

For top-100 plugin work, the watchlist alone only supports `watchlisted` or `baseline-safe` language. Mark an individual plugin `supported` only after exact versioned manual verification.

For top-100 theme work, the watchlist alone only supports `watchlisted` or `baseline-safe` language. Mark an individual theme `supported` only after exact versioned manual verification, including parent/child theme status.

## Why This Matrix Is Conservative

There is no universal WordPress compatibility claim. Third-party APIs, plugin settings, cache layers, builders, and themes change. `supported` requires evidence; `unknown` is better than pretending.
