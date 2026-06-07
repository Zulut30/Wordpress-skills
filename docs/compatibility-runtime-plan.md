# Compatibility Runtime Plan

This plan turns the top-100 plugin and theme watchlists into concrete runtime verification batches.

Generated from plugin watchlist: 2026-06-07T14:36:30.870Z
Generated from theme watchlist: 2026-06-07T15:09:33.702Z

Status: `planned`. A scenario becomes `verified` only after exact versions and manual/runtime evidence are recorded in `docs/compatibility-matrix.md`.

## Scenario Matrix

| Scenario | Theme | Plugins | Blueprint | Primary risks |
|---|---|---|---|---|
| Baseline block theme | Twenty Twenty-Five (#1) | None | docs/playground-blueprints/baseline-block-theme.json | block theme, theme.json, frontend output, editor canvas |
| Elementor builder shell | Hello Elementor (#2) | Elementor Website Builder – more than just a page builder (#1) | docs/playground-blueprints/elementor-hello-elementor.json | page builder, builder assets, frontend wrappers, global CSS, editor context |
| WooCommerce on Astra | Astra (#3) | WooCommerce (#6) | docs/playground-blueprints/woocommerce-astra.json | commerce, cart/session data, checkout/account pages, emails, public cache |
| SEO plus cache on GeneratePress | GeneratePress (#14) | Yoast SEO – Advanced SEO with real-time guidance and built-in AI (#2), LiteSpeed Cache (#5) | docs/playground-blueprints/seo-cache-generatepress.json | SEO output, schema/canonical/meta, cache purge, minification, asset ordering |
| Popular forms on Blocksy | Blocksy (#10) | Contact Form 7 (#3), WPForms – Easy Form Builder for WordPress – Contact Forms, Payment Forms, Surveys, & More (#8) | docs/playground-blueprints/forms-blocksy.json | forms, nonces, submission lifecycle, email delivery, frontend CSS |
| Classic Editor fallback on OceanWP | OceanWP (#9) | Classic Editor (#4) | docs/playground-blueprints/classic-editor-oceanwp.json | Classic Editor, metabox fallback, admin assets, theme frontend CSS |
| Security and migration plugins on Kadence | Kadence (#5) | Wordfence Security – Firewall, Malware Scan, and Login Security (#11), All-in-One WP Migration and Backup (#10) | docs/playground-blueprints/security-migration-kadence.json | security hardening, firewall/login behavior, backup paths, export/import data, file operations |
| Newspaper / tagDiv premium manual pass | Newspaper (ThemeForest / tagDiv) | WooCommerce (#6), LiteSpeed Cache (#5) | docs/playground-blueprints/newspaper-manual-prep.json | premium theme, tagDiv Composer, Cloud Library, news layouts, ads, WooCommerce, mobile/AMP |

## Required Evidence

- WordPress version
- PHP version
- Theme version and child theme status
- Plugin versions and settings
- Activation order
- Screens or flows tested
- Known failures, warnings, screenshots, or logs

## Manual Flow Checklist

### Baseline block theme

- activation
- frontend page
- single post
- block editor
- logged-in and logged-out view

### Elementor builder shell

- builder editor load
- frontend builder page
- non-builder page
- asset scoping
- deactivation fallback

### WooCommerce on Astra

- shop archive
- product page
- cart
- checkout
- my account
- logged-in and logged-out view

### SEO plus cache on GeneratePress

- wp_head output
- single post schema
- archive metadata
- cached frontend
- asset dependency order

### Popular forms on Blocksy

- form render
- validation error
- successful submission
- logged-out cache
- mobile layout

### Classic Editor fallback on OceanWP

- classic post edit
- metabox save
- shortcode fallback
- frontend render
- block editor disabled flow

### Security and migration plugins on Kadence

- activation order
- admin screens
- export/import dry run
- login/admin access
- PHP log review

### Newspaper / tagDiv premium manual pass

- manual premium theme install
- tagDiv Composer editor
- homepage/category/single templates
- ads and schema output
- cached mobile frontend

## Notes

- Newspaper/tagDiv is a premium external target. The included Playground blueprint can prepare a site, but it cannot install paid theme files.
- Playground blueprints are smoke-test starting points, not a replacement for exact-version verification on a real site.
- Use `watchlisted` or `baseline-safe` language until a scenario has evidence.
