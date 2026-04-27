<?php
/**
 * Fixture only. Do not copy into production.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'add_meta_boxes',
	static function () {
		add_meta_box( 'compatibility_fixture_bad', 'Bad Fixture', 'compatibility_fixture_bad_metabox', 'post' );
	}
);

function compatibility_fixture_bad_metabox(): void {
	echo '<input name="bad_fixture_value" placeholder="Value">';
}

add_action(
	'save_post',
	static function ( int $post_id ) {
		if ( isset( $_POST['bad_fixture_value'] ) ) {
			update_post_meta( $post_id, '_bad_fixture_value', sanitize_text_field( wp_unslash( $_POST['bad_fixture_value'] ) ) );
		}
	}
);

add_filter( 'mce_buttons', 'compatibility_fixture_bad_mce_button' );

function compatibility_fixture_bad_mce_button( array $buttons ): array {
	$buttons[] = 'compatibility_fixture_bad';
	return $buttons;
}
