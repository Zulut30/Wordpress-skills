<?php
/**
 * Fixture only. Shows theme-friendly scoped output.
 */

defined( 'ABSPATH' ) || exit;

add_shortcode(
	'compatibility_fixture_card',
	static function () {
		return '<section class="compatibility-fixture-card"><h2>' . esc_html__( 'Fixture card', 'compatibility-fixture' ) . '</h2></section>';
	}
);
