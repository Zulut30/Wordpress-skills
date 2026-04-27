# Compatibility Matrix

| Area | Integration | Status | Detection | What works | Risks | Docs verified | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Editor | Classic Editor | partial | `use_block_editor_for_post_type()` plus metabox fallback | metabox example | duplicate UI possible | 2026-04-27 | Fixture only. |
| SEO | Yoast SEO | experimental | `defined( 'WPSEO_VERSION' )` or `function_exists( 'YoastSEO' )` | guarded fallback | schema hooks need current docs | 2026-04-27 | Verify before release. |
| Cache | WP Rocket | experimental | `function_exists( 'rocket_clean_post' )` | targeted purge example | purge API version-sensitive | 2026-04-27 | Fixture only. |
| Builder | Elementor | experimental | `did_action( 'elementor/loaded' )` | guarded registration hook | widget API omitted | 2026-04-27 | Fixture only. |
