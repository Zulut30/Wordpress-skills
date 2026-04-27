<?php
/**
 * Fixture only. Do not copy into production.
 */

defined( 'ABSPATH' ) || exit;

function compatibility_fixture_bad_elementor_boot(): void {
	\Elementor\Plugin::instance()->widgets_manager;
}

add_action(
	'wp_enqueue_scripts',
	static function () {
		wp_enqueue_style( 'compatibility-fixture-elementor', plugins_url( 'assets/elementor.css', __DIR__ ), array(), '0.1.0' );
	}
);
