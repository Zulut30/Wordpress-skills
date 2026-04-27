# Compatibility Audit Human Output

Generated from:

`ash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/compatibility-plugin --compatibility
`

Output:

`	ext
WordPress Plugin Audit
Target: D:\wp-skill\test-fixtures\compatibility-plugin
Limitation: This is a heuristic scanner for agent review triage, not a security, performance, accessibility, design, or compatibility oracle. It can miss issues and produce false positives; verify findings manually against current WordPress docs, profiling, real UI review, third-party docs, and real integration tests.

Summary:
- Main plugin file: compatibility-plugin.php
- PHP files scanned: 14
- block.json files scanned: 1
- Compatibility findings: 31
- Findings: 0 error, 31 warning, 11 info

Findings:
- [WARNING] assets/bad-global-theme-breaker.css:1 compatibility.theme.global-frontend-css
  Frontend stylesheet contains broad/global selectors.
  Why it matters: Global CSS can break active themes, block themes, and page-builder layouts.
  Remediation: Scope CSS under a plugin wrapper or block class and avoid resets.
  Confidence: medium
- [WARNING] assets/bad-global-theme-breaker.css:6 compatibility.theme.global-frontend-css
  Frontend stylesheet contains broad/global selectors.
  Why it matters: Global CSS can break active themes, block themes, and page-builder layouts.
  Remediation: Scope CSS under a plugin wrapper or block class and avoid resets.
  Confidence: medium
- [WARNING] assets/bad-global-theme-breaker.css:7 compatibility.theme.global-frontend-css
  Frontend stylesheet contains broad/global selectors.
  Why it matters: Global CSS can break active themes, block themes, and page-builder layouts.
  Remediation: Scope CSS under a plugin wrapper or block class and avoid resets.
  Confidence: medium
- [WARNING] assets/bad-global-theme-breaker.css:8 compatibility.theme.global-frontend-css
  Frontend stylesheet contains broad/global selectors.
  Why it matters: Global CSS can break active themes, block themes, and page-builder layouts.
  Remediation: Scope CSS under a plugin wrapper or block class and avoid resets.
  Confidence: medium
- [WARNING] composer.json:1 build.composer-missing-lint-script
  composer.json does not define a PHP lint script.
  Remediation: Add a lint or lint:php script that runs PHPCS with WPCS.
- [WARNING] package.json:1 build.package-json-missing-lint:js
  package.json is missing scripts.lint:js.
  Remediation: Add a lint:js script when the plugin ships block/editor JavaScript.
- [WARNING] package.json:1 build.package-json-missing-style-lint
  package.json is missing a CSS/style lint script.
  Remediation: Add lint:css or lint:style using wp-scripts lint-style when the plugin has CSS or SCSS.
- [WARNING] src/BadIntegrationExamples.php:12 compatibility.optional-dependency.direct-plugin-include
  Code includes files from another plugin directory.
  Why it matters: Directly including third-party plugin files is fragile and can fatal when paths or versions change.
  Remediation: Use feature detection and documented public APIs/hooks instead of requiring third-party plugin internals.
  Confidence: high
- [WARNING] src/BadIntegrationExamples.php:16 compatibility.optional-dependency.unguarded-reference
  Yoast SEO appears to be referenced without nearby feature detection.
  Why it matters: Optional integrations can fatal or misbehave when the plugin/theme/builder is inactive or changes APIs.
  Remediation: Move integration code into an adapter and guard it with class_exists(), function_exists(), defined(), did_action(), or a documented detection method.
  Confidence: medium
- [WARNING] src/BadIntegrationExamples.php:17 compatibility.optional-dependency.unguarded-reference
  Elementor appears to be referenced without nearby feature detection.
  Why it matters: Optional integrations can fatal or misbehave when the plugin/theme/builder is inactive or changes APIs.
  Remediation: Move integration code into an adapter and guard it with class_exists(), function_exists(), defined(), did_action(), or a documented detection method.
  Confidence: medium
- [WARNING] src/BadIntegrationExamples.php:17 compatibility.builder.unguarded-builder-reference
  Page-builder-specific code appears without a dependency guard.
  Why it matters: Builder adapters should not load when the builder is inactive.
  Remediation: Move code into an optional adapter and detect Elementor/Divi through documented signals.
  Confidence: medium
- [WARNING] src/CacheBad.php:11 compatibility.cache.purge-all-on-request
  Full cache purge appears in a normal request hook or broad callback.
  Why it matters: Purging all cache during normal requests can destroy site performance and conflict with cache plugins.
  Remediation: Purge only affected URLs/posts on content/settings changes or explicit admin maintenance actions.
  Confidence: high
- [WARNING] src/CacheBad.php:12 compatibility.cache.purge-all-on-request
  Full cache purge appears in a normal request hook or broad callback.
  Why it matters: Purging all cache during normal requests can destroy site performance and conflict with cache plugins.
  Remediation: Purge only affected URLs/posts on content/settings changes or explicit admin maintenance actions.
  Confidence: high
- [WARNING] src/CacheBad.php:18 compatibility.cache.user-specific-public-output
  Frontend output may include user-specific data without a cache compatibility note.
  Why it matters: User-specific data can leak through public page caches if not isolated.
  Remediation: Separate private fragments, set no-cache behavior where appropriate, or document a private/ESI strategy.
  Confidence: medium
- [WARNING] src/CacheBad.php:24 compatibility.cache.random-cache-busting
  Asset or URL cache busting appears to use random/time-based values.
  Why it matters: Random query strings defeat browser/CDN/cache optimization and can fight performance plugins.
  Remediation: Use plugin version, filemtime during development, or generated asset metadata.
  Confidence: medium
- [WARNING] src/ClassicEditorBad.php:16 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [WARNING] src/ClassicEditorBad.php:20 compatibility.editor.metabox-save-missing-security
  Classic Editor metabox save flow lacks an obvious nonce and capability check.
  Why it matters: Classic fallbacks must preserve the same security posture as block/editor saves.
  Remediation: Add wp_verify_nonce()/check_admin_referer(), current_user_can(), sanitization, and escaping.
  Confidence: medium
- [WARNING] src/ElementorBad.php:9 compatibility.optional-dependency.unguarded-reference
  Elementor appears to be referenced without nearby feature detection.
  Why it matters: Optional integrations can fatal or misbehave when the plugin/theme/builder is inactive or changes APIs.
  Remediation: Move integration code into an adapter and guard it with class_exists(), function_exists(), defined(), did_action(), or a documented detection method.
  Confidence: medium
- [WARNING] src/ElementorBad.php:9 compatibility.builder.unguarded-builder-reference
  Page-builder-specific code appears without a dependency guard.
  Why it matters: Builder adapters should not load when the builder is inactive.
  Remediation: Move code into an optional adapter and detect Elementor/Divi through documented signals.
  Confidence: medium
- [WARNING] src/SeoBad.php:11 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [WARNING] src/SeoBad.php:11 compatibility.seo.unconditional-head-output
  SEO-relevant head output appears without an SEO plugin guard.
  Why it matters: Manual title, canonical, meta, social, or schema output can duplicate SEO plugin output.
  Remediation: Add an SEO output guard, use documented SEO plugin hooks, and fallback only when no SEO plugin handles the concern.
  Confidence: medium
- [WARNING] src/SeoBad.php:12 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [WARNING] src/SeoBad.php:12 compatibility.seo.unconditional-head-output
  SEO-relevant head output appears without an SEO plugin guard.
  Why it matters: Manual title, canonical, meta, social, or schema output can duplicate SEO plugin output.
  Remediation: Add an SEO output guard, use documented SEO plugin hooks, and fallback only when no SEO plugin handles the concern.
  Confidence: medium
- [WARNING] src/SeoBad.php:13 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [WARNING] src/SeoBad.php:13 compatibility.seo.unconditional-head-output
  SEO-relevant head output appears without an SEO plugin guard.
  Why it matters: Manual title, canonical, meta, social, or schema output can duplicate SEO plugin output.
  Remediation: Add an SEO output guard, use documented SEO plugin hooks, and fallback only when no SEO plugin handles the concern.
  Confidence: medium
- [WARNING] src/SeoBad.php:14 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [WARNING] src/SeoBad.php:14 compatibility.seo.unconditional-head-output
  SEO-relevant head output appears without an SEO plugin guard.
  Why it matters: Manual title, canonical, meta, social, or schema output can duplicate SEO plugin output.
  Remediation: Add an SEO output guard, use documented SEO plugin hooks, and fallback only when no SEO plugin handles the concern.
  Confidence: medium
- [WARNING] src/SeoBad.php:15 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [WARNING] src/SeoBad.php:15 compatibility.seo.unconditional-head-output
  SEO-relevant head output appears without an SEO plugin guard.
  Why it matters: Manual title, canonical, meta, social, or schema output can duplicate SEO plugin output.
  Remediation: Add an SEO output guard, use documented SEO plugin hooks, and fallback only when no SEO plugin handles the concern.
  Confidence: medium
- [WARNING] src/ThemeBad.php:11 security.output-without-obvious-escaping
  Output statement does not include an obvious escaping function.
  Remediation: Escape late with esc_html(), esc_attr(), esc_url(), wp_kses(), or another context-appropriate escaping API.
- [WARNING] src/ThemeBad.php:16 compatibility.theme.theme-file-assumption
  Code appears to depend on theme files or paths.
  Why it matters: Plugins should not assume a theme file structure or edit/include theme internals.
  Remediation: Use public hooks, templates, blocks, or documented theme APIs instead.
  Confidence: medium
- [INFO] assets/bad-global-theme-breaker.css:2 compatibility.theme.important-review
  Stylesheet uses !important.
  Why it matters: Specificity fights are a common source of theme and builder conflicts.
  Remediation: Reduce specificity conflicts through scoped selectors and component classes.
  Confidence: low
- [INFO] assets/bad-global-theme-breaker.css:9 compatibility.theme.important-review
  Stylesheet uses !important.
  Why it matters: Specificity fights are a common source of theme and builder conflicts.
  Remediation: Reduce specificity conflicts through scoped selectors and component classes.
  Confidence: low
- [INFO] assets/bad-global-theme-breaker.css:9 compatibility.theme.fixed-width-review
  CSS uses a fixed pixel width.
  Why it matters: Fixed widths can break responsive themes and builder columns.
  Remediation: Use max-width, minmax(), flex/grid, and logical properties where practical.
  Confidence: low
- [INFO] blocks/compatibility-block/block.json:1 blocks.dynamic-render-reminder
  Dynamic block render output should be validated and escaped.
  Remediation: Treat attributes as untrusted in render.php or render callbacks; validate, sanitize, authorize if needed, and escape late.
- [INFO] src/ClassicEditorBad.php:28 compatibility.editor.tinymce-assets-not-scoped
  TinyMCE/editor integration has no obvious screen or editor-context guard.
  Why it matters: Classic editor assets loaded globally can slow wp-admin and conflict with block editor screens.
  Remediation: Gate TinyMCE assets by screen ID, post type, and editor context.
  Confidence: low
- [INFO] src/SeoBad.php:11 compatibility.seo.output-not-filterable
  SEO-relevant output is not obviously filterable.
  Why it matters: SEO integrations often need project-specific overrides without editing plugin code.
  Remediation: Expose documented filters around fallback SEO output and document when they run.
  Confidence: low
- [INFO] src/SeoBad.php:12 compatibility.seo.output-not-filterable
  SEO-relevant output is not obviously filterable.
  Why it matters: SEO integrations often need project-specific overrides without editing plugin code.
  Remediation: Expose documented filters around fallback SEO output and document when they run.
  Confidence: low
- [INFO] src/SeoBad.php:13 compatibility.seo.output-not-filterable
  SEO-relevant output is not obviously filterable.
  Why it matters: SEO integrations often need project-specific overrides without editing plugin code.
  Remediation: Expose documented filters around fallback SEO output and document when they run.
  Confidence: low
- [INFO] src/SeoBad.php:14 compatibility.seo.output-not-filterable
  SEO-relevant output is not obviously filterable.
  Why it matters: SEO integrations often need project-specific overrides without editing plugin code.
  Remediation: Expose documented filters around fallback SEO output and document when they run.
  Confidence: low
- [INFO] src/SeoBad.php:15 compatibility.seo.output-not-filterable
  SEO-relevant output is not obviously filterable.
  Why it matters: SEO integrations often need project-specific overrides without editing plugin code.
  Remediation: Expose documented filters around fallback SEO output and document when they run.
  Confidence: low
- [INFO] src/ThemeBad.php:11 compatibility.theme.frontend-markup-without-wrapper-class
  Frontend markup has no obvious scoped wrapper class.
  Why it matters: Wrapper classes help scope CSS without overriding theme elements globally.
  Remediation: Add a plugin or block wrapper class and keep markup semantic.
  Confidence: low
`
