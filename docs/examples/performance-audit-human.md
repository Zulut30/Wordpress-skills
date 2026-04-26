# Performance Audit Human Output

Command:

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/performance-plugin --performance
```

Representative output, with the local workspace path normalized:

```text
WordPress Plugin Audit
Target: test-fixtures/performance-plugin
Limitation: This is a heuristic scanner for agent review triage, not a security or performance oracle. It can miss vulnerabilities and bottlenecks and produce false positives; verify findings manually against current WordPress docs, profiling, and project context.

Summary:
- Main plugin file: performance-plugin.php
- PHP files scanned: 4
- block.json files scanned: 1
- Performance findings: 18
- Findings: 0 error, 9 warning, 11 info

Findings:
- [WARNING] blocks/expensive-block/render.php:10 performance.blocks.dynamic-render-query-without-cache
  Dynamic block render code runs a query without obvious caching.
  Why it matters: Dynamic block render callbacks can run on every page view where the block appears.
  Remediation: Bound the query and add fragment caching with invalidation when output is safe to cache.
  Confidence: medium
- [WARNING] blocks/expensive-block/render.php:13 performance.query.unbounded-post-query
  Query requests all matching posts with -1.
  Why it matters: Unbounded post queries can load large datasets and exhaust memory on production sites.
  Remediation: Add pagination or a safe upper bound. Use fields => ids when only IDs are needed.
  Confidence: high
- [WARNING] src/PerformanceSmells.php:17 performance.assets.admin-enqueue-without-screen-check
  admin_enqueue_scripts callback has no obvious screen check.
  Why it matters: Admin assets loaded on every wp-admin screen slow unrelated admin workflows.
  Remediation: Gate by $hook_suffix or get_current_screen()->id before enqueueing plugin-specific assets.
  Confidence: medium
- [WARNING] src/PerformanceSmells.php:23 performance.hooks.flush-rewrite-rules-on-request
  flush_rewrite_rules() appears outside activation/deactivation/uninstall context.
  Why it matters: Flushing rewrite rules is expensive and writes rewrite state; it should not run on normal requests.
  Remediation: Move rewrite flushing to activation/deactivation or a versioned migration after rewrite-dependent objects are registered.
  Confidence: high
- [WARNING] src/PerformanceSmells.php:34 performance.query.unbounded-post-query
  Query requests all matching posts with -1.
  Why it matters: Unbounded post queries can load large datasets and exhaust memory on production sites.
  Remediation: Add pagination or a safe upper bound. Use fields => ids when only IDs are needed.
  Confidence: high
- [WARNING] src/PerformanceSmells.php:42 performance.cache.transient-without-expiration
  set_transient() appears without an expiration argument.
  Why it matters: Non-expiring transients can persist indefinitely and may be autoloaded when stored in options.
  Remediation: Add an explicit TTL and an invalidation strategy.
  Confidence: medium
- [WARNING] src/PerformanceSmells.php:51 performance.query.query-inside-loop
  WP_Query/get_posts appears inside a loop.
  Why it matters: Queries inside loops often create N+1 query patterns.
  Remediation: Prefetch data, batch IDs, prime caches, or move the query outside the loop.
  Confidence: medium
- [WARNING] src/PerformanceSmells.php:64 performance.query.direct-select-without-limit
  Direct SQL SELECT has no obvious LIMIT.
  Why it matters: Unbounded SQL can scan and return too many rows on production data.
  Remediation: Add LIMIT/OFFSET or use a paginated WordPress API. Keep using $wpdb->prepare() for variables.
  Confidence: medium
```

The full command output also includes informational reminders for block render safety, `no_found_rows`, asset strategy, response shape, and cron locking.
