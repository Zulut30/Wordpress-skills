# Example Performance Audit Report

## Executive Summary

Risk score: `high`.

The plugin does useful work, but several hot paths run expensive operations without scope or cache. The highest-impact fixes are to remove work from normal frontend requests, bound REST/admin queries, and scope assets.

## Hot Paths

- Frontend `wp` and `wp_enqueue_scripts`.
- Admin settings/report screens.
- REST collection endpoint.
- Dynamic block render callback.
- Cron sync job.

## Findings

- `[High]` `src/PerformanceSmells.php:18` calls `flush_rewrite_rules()` from `init`.
  Fix: move rewrite flushing to activation/deactivation after rewrite-dependent objects are registered.
- `[High]` `src/PerformanceSmells.php:33` queries all posts with `posts_per_page => -1`.
  Fix: add pagination or a safe upper bound; use `fields => 'ids'` when only IDs are needed.
- `[Medium]` `src/PerformanceSmells.php:25` enqueues admin assets without a screen check.
  Fix: gate by `$hook_suffix` or `get_current_screen()->id`.
- `[Medium]` `blocks/expensive-block/render.php:9` runs a query during dynamic block render without cache.
  Fix: bound the query and cache safe rendered fragments with invalidation.

## Remediation Plan

1. Remove per-request setup work.
2. Scope frontend/admin assets.
3. Add pagination to REST/admin collections.
4. Add fragment cache for dynamic block output.
5. Add invalidation hooks for cached content.

## Measurement Plan

- Capture baseline with Query Monitor or server profiling on production-sized data.
- Compare request duration, query count, memory, REST payload size, and asset transfer size.
- Re-test with and without persistent object cache.

## Rollout Plan

- Add tests for output parity.
- Ship cache invalidation with the cache.
- Monitor slow requests and cache hit rate after deployment.
- Roll back cache layer changes if stale data appears.
