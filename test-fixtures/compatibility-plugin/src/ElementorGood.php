<?php
/**
 * Fixture only. Shows guarded page-builder integration.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'plugins_loaded',
	static function () {
		if ( ! did_action( 'elementor/loaded' ) || ! class_exists( '\Elementor\Plugin' ) ) {
			return;
		}

		add_action( 'elementor/widgets/register', 'compatibility_fixture_register_elementor_widget' );
	}
);

function compatibility_fixture_register_elementor_widget(): void {
	// Widget registration intentionally omitted from fixture.
}
