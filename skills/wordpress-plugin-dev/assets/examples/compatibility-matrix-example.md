# Compatibility Matrix Example

This is an example, not a claim that every integration is supported.

| Area | Integration | Status | Detection | What works | Risks | Docs verified | Notes |
|---|---|---|---|---|---|---|---|
| Editor | Classic Editor | partial | `use_block_editor_for_post_type()` + metabox fallback | basic post meta editing | block/sidebar parity needs tests | 2026-04-27 | supported only for configured post types |
| Editor | Block Editor | supported | `block.json` + server registration | dynamic block render | newer metadata fields need docs verification | 2026-04-27 | server-rendered fallback exists |
| SEO | Yoast SEO | experimental | `WPSEO_VERSION` / class guard | planned schema adapter | duplicate schema if fallback not guarded | no | verify current Schema API |
| SEO | Rank Math | planned | `RANK_MATH_VERSION` | none yet | hook names unverified | no | docs first |
| Cache | WP Rocket | planned | `WP_ROCKET_VERSION` / function guard | targeted post purge planned | over-purge risk | no | no hard dependency |
| Cache | LiteSpeed Cache | experimental | `LSCWP_V` / class guard | purge hook placeholder | nonce/private cache risk | no | verify ESI/private docs |
| Theme | Astra | unknown | theme slug | generic CSS only | placement unknown | no | test manually |
| Theme | GeneratePress | unknown | theme slug | generic CSS only | placement unknown | no | test manually |
| Theme | Kadence | unknown | theme slug | generic CSS only | placement unknown | no | test manually |
| Builder | Elementor | experimental | `did_action( 'elementor/loaded' )` | optional adapter skeleton | widget API needs verification | no | do not load if absent |
| Builder | Divi | planned | `ET_Builder_Element` | none yet | internals risk | no | use documented hooks only |
