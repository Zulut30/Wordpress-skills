# Compatibility Audit Explanation

This example is generated from `test-fixtures/compatibility-plugin/`.

## Input fixture

The fixture contains both safe and intentionally poor examples for:

- optional integration detection;
- Classic Editor metabox fallback;
- SEO head/schema output;
- cache purge behavior and public/private output;
- theme-friendly frontend CSS;
- Elementor-style page-builder adapter loading.

Files marked "Fixture only. Do not copy into production." intentionally contain compatibility smells for scanner coverage. They are minimal examples, not production patterns.

## Expected findings

The compatibility audit should report warnings or info findings for:

- direct third-party plugin includes;
- unguarded Yoast/Elementor-style references;
- purge-all cache behavior on `init`;
- user-specific frontend output without a cache strategy note;
- random/time-based cache busting;
- Classic Editor save handling without nonce/capability checks;
- duplicate SEO-relevant output in `wp_head`;
- broad frontend CSS selectors;
- direct theme file assumptions.

The scanner should not mark subjective theme/page-builder concerns as critical.

## Why this is heuristic

Static analysis cannot prove real compatibility with installed plugin/theme versions. It cannot render pages, inspect final HTML, validate cache behavior across hosting/CDN layers, or verify current third-party APIs.

Use the output as triage. Release-sensitive integration work still needs:

- current official docs verification;
- manual tests with actual plugin/theme versions;
- rendered HTML checks for duplicate SEO output;
- logged-in/logged-out cache checks;
- frontend visual checks in classic themes, block themes, and selected builders.

## Run locally

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/compatibility-plugin --compatibility
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/compatibility-plugin --compatibility --json
```
