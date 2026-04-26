# Optimized Dynamic Block

## Before

```php
$query = new WP_Query(
	array(
		'post_type'      => 'event',
		'posts_per_page' => -1,
	)
);
```

Problem: every render can load all matching posts.

## After

```php
$cache_key = 'acme_events_block_' . md5( wp_json_encode( $attributes ) );
$html      = get_transient( $cache_key );

if ( false !== $html ) {
	return (string) $html;
}

$query = new WP_Query(
	array(
		'post_type'      => 'event',
		'post_status'    => 'publish',
		'posts_per_page' => 5,
		'fields'         => 'ids',
		'no_found_rows'  => true,
	)
);

$items = array_map(
	static fn ( int $id ): string => '<li>' . esc_html( get_the_title( $id ) ) . '</li>',
	array_map( 'absint', $query->posts )
);

$html = '<ul>' . implode( '', $items ) . '</ul>';
set_transient( $cache_key, $html, 10 * MINUTE_IN_SECONDS );

return $html;
```

Invalidate the cache on the content hooks that affect the rendered output.
