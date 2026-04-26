# Performance Audit Explanation

The performance audit examples come from:

```text
test-fixtures/performance-plugin/
```

The fixture includes:

- `src/SafeExamples.php` with scoped admin assets, bounded queries, transient TTL, and paginated REST behavior;
- `src/PerformanceSmells.php`, clearly marked fixture-only, with intentionally inefficient patterns;
- `blocks/expensive-block/render.php`, a fixture-only dynamic block render example with an unbounded query.

## Expected Findings

The scanner should report performance heuristics for:

- `flush_rewrite_rules()` outside activation/deactivation;
- admin assets without a screen check;
- `posts_per_page => -1`;
- missing `no_found_rows` reminders;
- query inside a loop;
- direct SQL `SELECT` without `LIMIT`;
- transient without expiration;
- dynamic block render query without cache;
- cron/background work without batching or lock indicators.

## Why Findings Are Heuristic

The scanner is static. It does not run WordPress, inspect real database size, know traffic patterns, or prove actual latency. Some findings need manual judgment and profiling before code changes.

## Use Locally

```bash
npm run performance:audit
npm run performance:audit:json
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs /path/to/plugin --performance
```

## What Still Needs Profiling

- Exact query cost on production-sized data.
- Object cache hit rate and persistence.
- Real asset transfer and browser execution cost.
- REST request volume and payload size.
- Hosting, theme, and other plugin interactions.
