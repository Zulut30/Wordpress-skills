# WordPress Playground Blueprints

These blueprints are smoke-test starting points for compatibility work. They use the official Playground Blueprint schema and WordPress.org plugin/theme resources where possible.

Run local validation:

```bash
npm run playground:check
```

## Included Blueprints

- `baseline-block-theme.json`: Twenty Twenty-Five baseline for block theme and editor checks.
- `elementor-hello-elementor.json`: Elementor with Hello Elementor.
- `woocommerce-astra.json`: WooCommerce with Astra.
- `seo-cache-generatepress.json`: Yoast SEO and LiteSpeed Cache with GeneratePress.
- `forms-blocksy.json`: Contact Form 7 and WPForms Lite with Blocksy.
- `classic-editor-oceanwp.json`: Classic Editor with OceanWP.
- `security-migration-kadence.json`: Wordfence and All-in-One WP Migration with Kadence.
- `newspaper-manual-prep.json`: Manual prep checklist environment for Newspaper/tagDiv. It does not install paid theme files.

## Limits

- A blueprint run is not a compatibility claim.
- Premium themes such as Newspaper require manual installation from the user's licensed package.
- Record exact versions and outcomes in `docs/compatibility-matrix.md` before using `supported` language.
