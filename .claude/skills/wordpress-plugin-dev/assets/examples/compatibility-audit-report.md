# Compatibility Audit Report Example

## Executive Summary

Compatibility risk is medium. The plugin has safe block output and scoped frontend CSS in most paths, but it also contains an unguarded Elementor reference, duplicate SEO schema output, and cache purge-all behavior during `init`.

## Detected Ecosystem

| Area | Detection | Status |
|---|---|---|
| Classic Editor | metabox fallback present | partial |
| Block Editor | `block.json` present | partial |
| SEO plugins | direct Yoast/Rank Math references | experimental |
| Cache plugins | generic cache hooks only | partial |
| Theme compatibility | scoped wrapper mostly present | partial |
| Page builders | Elementor reference found | experimental |

## Compatibility Matrix

| Area | Integration | Status | Detection | What works | Risks | Docs verified | Notes |
|---|---|---|---|---|---|---|---|
| Editor | Classic Editor | partial | metabox callback | basic save | duplicate field logic | yes | needs parity test |
| Editor | Block Editor | partial | `block.json` | block render | classic fallback docs incomplete | yes | server render OK |
| SEO | Yoast SEO | experimental | constant/class guard planned | none yet | duplicate JSON-LD | no | verify schema API |
| Cache | LiteSpeed Cache | planned | none | none | public nonce caching | no | verify ESI docs |
| Theme | Astra | unknown | no adapter | generic CSS | visual placement unknown | no | manual test |
| Builder | Elementor | experimental | unguarded reference found | none | fatal if inactive | no | isolate adapter |

## Prioritized Findings

- P1: Move page-builder code behind dependency detection.
- P1: Add SEO output guard before printing JSON-LD or meta tags.
- P2: Replace purge-all on `init` with targeted invalidation hooks.
- P2: Add a documented Classic Editor / Block Editor fallback matrix.

## Manual Test Plan

- Test Classic Editor save flow with nonce/capability checks.
- Test Block Editor render and frontend output.
- Inspect rendered HTML for duplicate title/meta/canonical/schema.
- Test logged-in and logged-out cache behavior.
- Test one classic theme, one block theme, and any claimed builder integrations.
