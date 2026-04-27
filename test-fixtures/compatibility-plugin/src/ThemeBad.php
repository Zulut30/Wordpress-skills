<?php
/**
 * Fixture only. Do not copy into production.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'astra_header_before',
	static function () {
		echo '<div>Unscoped theme fixture</div>';
	}
);

function compatibility_fixture_bad_theme_include(): void {
	require get_template_directory() . '/inc/internal-layout.php';
}
