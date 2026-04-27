<?php
/**
 * Fixture only. Do not copy into production.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'init',
	static function () {
		rocket_clean_domain();
		wp_cache_flush();
	}
);

function compatibility_fixture_bad_public_fragment(): string {
	wp_nonce_field( 'compatibility_fixture_frontend', 'compatibility_fixture_nonce' );
	return '<div>Hello user ' . get_current_user_id() . '</div>';
}

add_action(
	'wp_enqueue_scripts',
	static function () {
		wp_enqueue_script( 'compatibility-fixture-random', plugins_url( 'assets/example.js', __DIR__ ), array(), time(), true );
	}
);
