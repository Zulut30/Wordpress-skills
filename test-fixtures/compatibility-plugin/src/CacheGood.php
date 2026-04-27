<?php
/**
 * Fixture only. Shows targeted cache invalidation notes.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'save_post',
	static function ( int $post_id ) {
		delete_transient( 'compatibility_fixture_post_' . absint( $post_id ) );

		if ( function_exists( 'rocket_clean_post' ) ) {
			rocket_clean_post( $post_id );
		}
	}
);
