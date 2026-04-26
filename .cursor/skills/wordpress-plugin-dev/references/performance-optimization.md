# Performance Optimization for WordPress Plugins

Last reviewed: 2026-04-27

## Purpose

Use this reference when an agent needs to find performance smells, improve plugin architecture, optimize queries/caching/assets/REST/admin/block behavior, write safer and faster code, or produce a practical performance audit report.

This is plugin-focused guidance. It does not replace profiling, load testing, hosting analysis, or a real production observability review.

## Core Principles

1. Measure before optimizing.
2. Fix high-impact bottlenecks before micro-optimizations.
3. Do not trade security or correctness for speed.
4. Avoid work on every request unless absolutely necessary.
5. Scope hooks, assets, queries, admin code, and REST responses.
6. Cache expensive operations with clear TTL and invalidation strategy.
7. Prefer WordPress APIs over custom low-level code.
8. Optimize frontend, admin, REST, and editor paths separately.
9. Keep generated blocks and assets lean.
10. Document performance assumptions and what still needs profiling.

## Official Sources

- Title: WordPress Performance Optimization
  Official URL: https://developer.wordpress.org/advanced-administration/performance/optimization/
  Use it for: Broad WordPress performance factors, measurement mindset, caching, database tuning, and autoloaded options context.
  Verify online: Before making version-sensitive hosting, caching, database, or autoload recommendations.
  Agent notes: Treat this as broad context; plugin remediation should still point to specific code paths.

- Title: WordPress Core Performance Team Handbook
  Official URL: https://make.wordpress.org/performance/handbook/
  Use it for: Current Core performance team practices, project context, and performance-focused WordPress initiatives.
  Verify online: Before citing current Core performance priorities or team practices.
  Agent notes: Use for orientation, not as a substitute for code-specific profiling.

- Title: Plugin Developer Handbook
  Official URL: https://developer.wordpress.org/plugins/
  Use it for: Plugin API routing and official plugin development concepts.
  Verify online: Before release-sensitive or version-sensitive plugin guidance.
  Agent notes: Pair with narrower references for exact APIs.

- Title: Plugin Best Practices
  Official URL: https://developer.wordpress.org/plugins/plugin-basics/best-practices/
  Use it for: General plugin architecture and behavior expectations.
  Verify online: Before changing lifecycle behavior or release-facing recommendations.
  Agent notes: Use to support avoiding global side effects and unnecessary work.

- Title: `wp_enqueue_script()`
  Official URL: https://developer.wordpress.org/reference/functions/wp_enqueue_script/
  Use it for: Script handles, dependencies, versions, footer loading, and loading strategy support.
  Verify online: Before using newer script loading strategy details.
  Agent notes: Keep handles scoped and dependencies explicit.

- Title: `set_transient()`
  Official URL: https://developer.wordpress.org/reference/functions/set_transient/
  Use it for: Transient storage, expiration, key limits, and behavior with external object cache.
  Verify online: Before relying on current transient hook behavior or key limits.
  Agent notes: Prefer expirations for plugin caches that are not needed on every request.

- Title: `get_transient()`
  Official URL: https://developer.wordpress.org/reference/functions/get_transient/
  Use it for: Cache miss behavior and strict false checks.
  Verify online: Before changing cache miss handling.
  Agent notes: Treat `false` as the cache miss sentinel; cached values may be empty arrays, `0`, or empty strings.

- Title: `wp_cache_get()`
  Official URL: https://developer.wordpress.org/reference/functions/wp_cache_get/
  Use it for: Object cache lookup, cache groups, and the `$found` flag.
  Verify online: Before using advanced object-cache parameters.
  Agent notes: Use `$found` to distinguish misses from falsey cached values.

- Title: `wp_cache_set()`
  Official URL: https://developer.wordpress.org/reference/functions/wp_cache_set/
  Use it for: Object cache writes, cache groups, and expirations.
  Verify online: Before relying on persistent cache behavior.
  Agent notes: Object cache persistence depends on the hosting/cache layer.

- Title: `WP_Query`
  Official URL: https://developer.wordpress.org/reference/classes/wp_query/
  Use it for: Query parameters, pagination, return fields, cache behavior, and query reset rules.
  Verify online: Before using less common query flags or version-sensitive parameters.
  Agent notes: Bound results, avoid unnecessary totals, and reset post data when using loops.

- Title: `register_rest_route()`
  Official URL: https://developer.wordpress.org/reference/functions/register_rest_route/
  Use it for: REST route registration, args, namespace/versioning, and `permission_callback`.
  Verify online: Before changing REST route behavior.
  Agent notes: Performance fixes must preserve permissions and validation.

- Title: Block Metadata
  Official URL: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
  Use it for: `block.json`, asset fields, render metadata, and conditional block asset loading behavior.
  Verify online: Before using newer metadata fields such as script modules or asset collections.
  Agent notes: Prefer metadata-driven registration and block-scoped frontend assets.

## Performance Audit Workflow

1. Identify plugin type:
   - frontend plugin;
   - admin plugin;
   - Gutenberg/block plugin;
   - WooCommerce/ecommerce plugin;
   - membership/content plugin;
   - integration/API plugin;
   - background/cron-heavy plugin.

2. Identify hot paths:
   - every frontend request;
   - every admin request;
   - editor load;
   - REST endpoint;
   - AJAX handler;
   - block render;
   - cron job;
   - activation/deactivation;
   - import/export tasks.

3. Inspect:
   - hooks;
   - asset loading;
   - queries;
   - options and autoload behavior;
   - cache/transients;
   - REST payloads;
   - block render callbacks;
   - cron schedules;
   - external HTTP calls;
   - custom tables;
   - filesystem operations.

4. Classify findings:
   - critical performance risk;
   - high;
   - medium;
   - low;
   - informational.

5. Produce a remediation plan:
   - quick wins;
   - safe refactors;
   - profiling needed;
   - caching strategy;
   - release/testing plan.

## Common Performance Smells

### Hooks

Smells:

- Expensive logic on `plugins_loaded`, `init`, `wp`, or `admin_init` without scoping.
- Heavy logic running on every request.
- Unscoped `pre_get_posts`.
- `flush_rewrite_rules()` on every request.
- Scheduling cron on every request.
- Remote calls inside request lifecycle without cache.

Fixes:

- Gate by `is_admin()`, `wp_doing_ajax()`, REST request context, screen ID, post type, route, capability, or feature state.
- Move setup to activation or versioned migrations.
- Cache expensive results with invalidation.
- Use lazy loading for services and data.
- Make cron scheduling idempotent with `wp_next_scheduled()`.

### Assets

Smells:

- Frontend JS/CSS enqueued globally when only one page, shortcode, or block needs it.
- Admin assets loaded on every admin screen.
- Editor assets loaded unnecessarily.
- Missing dependencies or versioning.
- No `defer`/`async` strategy when suitable.
- Large bundles for small UI.

Fixes:

- Enqueue on target screens only.
- Use `block.json` asset fields for block assets.
- Use generated `.asset.php` dependencies and versions.
- Use script loading strategy where safe and verified for the target WordPress version.
- Split admin, editor, frontend, and view assets.
- Avoid hardcoded asset URLs.
- Keep block frontend JS minimal.

### Database And WP_Query

Smells:

- `WP_Query` with `posts_per_page => -1` on large datasets.
- Missing `no_found_rows` when pagination is not needed.
- Retrieving full post objects when only IDs are needed.
- Expensive `meta_query`/`tax_query` without constraints.
- Repeated queries inside loops.
- Direct SQL without `LIMIT`.
- Custom tables without indexes.
- Option/meta lookups repeated without cache.
- N+1 queries.

Fixes:

- Use `fields => 'ids'` when possible.
- Set `no_found_rows => true` when pagination is not needed.
- Limit results and paginate.
- Prefetch or prime caches where appropriate.
- Cache query results carefully.
- Add indexes for custom tables.
- Avoid querying inside render loops.
- Use WordPress APIs first.

### Options And Autoload

Smells:

- Huge options autoloaded on every request.
- Large arrays stored in a single option.
- Options used as logs.
- Frequent `update_option()` on every request.
- Transients without expiration for data not needed globally.
- No cache invalidation plan.

Fixes:

- Split large data.
- Avoid autoload for rarely used data where possible.
- Use expiring transients.
- Use object cache for runtime or persistent caching where appropriate.
- Invalidate on content/settings changes.
- Avoid writing options during normal page views.

### Transients And Object Cache

Smells:

- Caching user-specific/private data globally.
- Transient keys too broad.
- No TTL.
- No invalidation.
- Caching errors forever.
- Cache stampede risk for expensive operations.

Fixes:

- Include context in cache keys.
- Add TTL.
- Handle `false` cache misses strictly.
- Use `wp_cache_get()`/`wp_cache_set()` with cache groups when appropriate.
- Invalidate on hooks.
- Use short TTL for external API failures.
- Avoid leaking private data.

### REST API

Smells:

- Unpaginated responses.
- Returning large payloads.
- Expensive queries per request.
- No fields/shape control.
- No caching for public expensive endpoints.
- `permission_callback` too broad.
- Heavy work processed synchronously.

Fixes:

- Paginate.
- Validate args.
- Limit fields.
- Use schema.
- Cache public safe responses.
- Require auth/capability where needed.
- Return `WP_Error` for invalid or expensive requests.
- Move heavy jobs to async/cron where suitable.

### AJAX

Smells:

- `admin-ajax.php` used for high-volume frontend endpoints.
- No nonce/capability check.
- Full page/data recomputation on each request.
- No rate limiting or cache where suitable.

Fixes:

- Prefer REST API for modern frontend APIs when suitable.
- Validate and sanitize.
- Cache safe responses.
- Keep payloads small.

### Gutenberg / Block Rendering

Smells:

- Dynamic block render callback runs heavy queries on every page view.
- Frontend assets loaded globally for blocks not present.
- `render.php` outputs unescaped data.
- Remote data fetched during render.
- Large editor bundles.
- Unstable attribute shape causing extra client work.

Fixes:

- Register blocks via `block.json`.
- Use server-side registration.
- Let WordPress enqueue block assets conditionally where possible.
- Cache expensive render output with invalidation.
- Avoid remote calls in render.
- Keep attributes minimal.
- Split editor and view scripts.

### Admin UI

Smells:

- Heavy dashboard widgets loaded everywhere.
- Admin tables without pagination.
- Expensive counts on every admin load.
- Settings screens doing remote calls synchronously.
- Assets loaded across `wp-admin`.

Fixes:

- Screen-specific loading.
- Lazy-load expensive data.
- Paginate.
- Cache counts.
- Use background jobs for sync/import.
- Add admin notices only when needed.

### Cron And Background Jobs

Smells:

- Duplicate schedules.
- Long-running cron tasks.
- No locking.
- No batching.
- No retry/backoff.
- Many rows/options updated in one request.

Fixes:

- Schedule on activation.
- Check `wp_next_scheduled()`.
- Batch work.
- Use locks/transients.
- Make jobs idempotent.
- Add observability/logging carefully.
- Avoid writing logs into autoloaded options.

### External HTTP API

Smells:

- Remote API calls on every page view.
- No timeout.
- No caching.
- No failure fallback.
- Large response processing synchronously.

Fixes:

- Set a reasonable timeout.
- Cache successful responses.
- Short-cache failures.
- Process heavy sync in cron.
- Avoid blocking frontend render.

### Filesystem

Smells:

- Directory scans on every request.
- Large files read during normal page views.
- Logs written synchronously.
- Unbounded cache/log files.

Fixes:

- Cache directory scans.
- Perform scans on activation or explicit admin action.
- Rotate/limit logs.
- Avoid filesystem work on hot paths.

## Performance Code Patterns

### Scoped Admin Enqueue With Screen ID

```php
add_action(
	'admin_enqueue_scripts',
	static function ( string $hook_suffix ): void {
		if ( 'settings_page_{{PLUGIN_SLUG}}' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_script(
			'{{PLUGIN_SLUG}}-admin',
			plugins_url( 'build/admin.js', {{VENDOR_NAMESPACE}}\PLUGIN_FILE ),
			array( 'wp-components', 'wp-i18n' ),
			'{{PLUGIN_VERSION}}',
			array( 'strategy' => 'defer' )
		);
	}
);
```

### Frontend Conditional Enqueue

```php
add_action(
	'wp_enqueue_scripts',
	static function (): void {
		if ( ! is_singular() || ! has_shortcode( (string) get_post()->post_content, '{{PLUGIN_SLUG}}' ) ) {
			return;
		}

		wp_enqueue_style(
			'{{PLUGIN_SLUG}}-frontend',
			plugins_url( 'build/frontend.css', {{VENDOR_NAMESPACE}}\PLUGIN_FILE ),
			array(),
			'{{PLUGIN_VERSION}}'
		);
	}
);
```

### Optimized WP_Query

```php
$limit = min( 20, max( 1, absint( $request['limit'] ?? 10 ) ) );

$query = new WP_Query(
	array(
		'post_type'              => '{{PLUGIN_SLUG}}_item',
		'post_status'            => 'publish',
		'posts_per_page'         => $limit,
		'fields'                 => 'ids',
		'no_found_rows'          => true,
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
	)
);
```

### Expiring Transient With Invalidation

```php
function {{PLUGIN_SLUG}}_get_public_items(): array {
	$key = '{{PLUGIN_SLUG}}_public_items_v1';
	$cached = get_transient( $key );

	if ( false !== $cached ) {
		return is_array( $cached ) ? $cached : array();
	}

	$items = {{PLUGIN_SLUG}}_query_public_items();
	set_transient( $key, $items, 10 * MINUTE_IN_SECONDS );

	return $items;
}

add_action( 'save_post_{{PLUGIN_SLUG}}_item', static fn (): bool => delete_transient( '{{PLUGIN_SLUG}}_public_items_v1' ) );
```

### Object Cache With Found Flag

```php
$cache_key = '{{PLUGIN_SLUG}}_item_' . absint( $post_id );
$item = wp_cache_get( $cache_key, '{{CACHE_GROUP}}', false, $found );

if ( ! $found ) {
	$item = {{PLUGIN_SLUG}}_load_item( $post_id );
	wp_cache_set( $cache_key, $item, '{{CACHE_GROUP}}', 10 * MINUTE_IN_SECONDS );
}
```

### Paginated REST Endpoint

```php
register_rest_route(
	'{{PLUGIN_SLUG}}/v1',
	'/items',
	array(
		'methods'             => WP_REST_Server::READABLE,
		'callback'            => '{{PLUGIN_SLUG}}_rest_get_items',
		'permission_callback' => '__return_true',
		'args'                => array(
			'page'     => array( 'sanitize_callback' => 'absint', 'default' => 1 ),
			'per_page' => array( 'sanitize_callback' => 'absint', 'default' => 10 ),
		),
	)
);
```

### Dynamic Block Fragment Cache

```php
$item_id = absint( $attributes['itemId'] ?? 0 );
if ( ! $item_id ) {
	return '';
}

$cache_key = '{{PLUGIN_SLUG}}_block_' . $item_id;
$html = get_transient( $cache_key );
if ( false !== $html ) {
	return (string) $html;
}

$title = get_the_title( $item_id );
$html  = '<div class="{{PLUGIN_SLUG}}-item">' . esc_html( $title ) . '</div>';
set_transient( $cache_key, $html, 10 * MINUTE_IN_SECONDS );

return $html;
```

### Cron Scheduling On Activation

```php
register_activation_hook(
	{{VENDOR_NAMESPACE}}\PLUGIN_FILE,
	static function (): void {
		if ( ! wp_next_scheduled( '{{PLUGIN_SLUG}}_sync' ) ) {
			wp_schedule_event( time() + MINUTE_IN_SECONDS, 'hourly', '{{PLUGIN_SLUG}}_sync' );
		}
	}
);
```

### External HTTP Call With Timeout And Cache

```php
$cache_key = '{{PLUGIN_SLUG}}_remote_status_v1';
$cached = get_transient( $cache_key );
if ( false !== $cached ) {
	return is_array( $cached ) ? $cached : array();
}

$response = wp_remote_get(
	'https://api.example.com/status',
	array(
		'timeout' => 3,
	)
);

if ( is_wp_error( $response ) ) {
	set_transient( $cache_key, array(), MINUTE_IN_SECONDS );
	return array();
}

$data = json_decode( wp_remote_retrieve_body( $response ), true );
$data = is_array( $data ) ? $data : array();
set_transient( $cache_key, $data, 10 * MINUTE_IN_SECONDS );

return $data;
```

## Performance Review Checklist

### Must Fix

- Expensive code on every request.
- Global assets loaded unnecessarily.
- Unbounded queries.
- Unpaginated REST/admin responses.
- `flush_rewrite_rules()` on every request.
- Duplicate cron schedules.
- External API call during page render without cache/fallback.
- Large autoloaded options.
- Dynamic block heavy render without cache/limits.

### Should Fix

- Missing `no_found_rows`.
- Retrieving full objects when IDs suffice.
- Admin assets not scoped by screen.
- Large JS/CSS bundles.
- Cache without invalidation.
- Repeated `get_option()`/meta calls in loops.

### Nice To Have

- Benchmark notes.
- Query Monitor screenshots or manual profile notes.
- Performance budgets.
- CI smoke checks.
- Fixture coverage.

## Agent Response Format

```text
Executive summary
Performance risk score: low|medium|high|critical

Hot paths inspected
- frontend requests
- admin screens
- REST endpoints
- block render callbacks

Findings
- [High] file.php:42 Unbounded WP_Query on frontend render.
  Why it matters: This can load many post objects and block page rendering.
  Suggested fix: Add pagination/limit, fields => ids, and cache safe output.

Measurement plan
- Capture baseline with Query Monitor or server logs.
- Measure query count, request duration, memory, transferred assets, and cache hit rate.

Safe rollout plan
- Add tests for output parity.
- Ship cache invalidation with the optimization.
- Monitor errors and slow requests after deployment.

Requires profiling
- Exact query cost on production-sized data.
- Object cache hit rate.

Do not optimize yet
- Low-frequency admin-only code unless profiling shows impact.
```
