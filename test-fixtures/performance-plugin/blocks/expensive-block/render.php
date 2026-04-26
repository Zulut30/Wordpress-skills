<?php
/**
 * Fixture only. Do not copy into production.
 *
 * Intentionally expensive dynamic block render example for scanner tests.
 */

defined( 'ABSPATH' ) || exit;

$query = new WP_Query(
	array(
		'post_type'      => 'post',
		'posts_per_page' => -1,
	)
);

$items = array_map(
	static fn ( WP_Post $post ): string => '<li>' . esc_html( get_the_title( $post ) ) . '</li>',
	$query->posts
);

return '<ul class="performance-plugin-expensive-block">' . implode( '', $items ) . '</ul>';
