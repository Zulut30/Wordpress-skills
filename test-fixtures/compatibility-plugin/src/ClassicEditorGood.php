<?php
/**
 * Fixture only. Shows Classic Editor fallback with secure save flow.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'add_meta_boxes',
	static function () {
		add_meta_box(
			'compatibility_fixture_box',
			esc_html__( 'Compatibility Fixture', 'compatibility-fixture' ),
			'compatibility_fixture_render_metabox',
			'post',
			'side'
		);
	}
);

function compatibility_fixture_render_metabox( WP_Post $post ): void {
	$value = get_post_meta( $post->ID, '_compatibility_fixture_note', true );
	wp_nonce_field( 'compatibility_fixture_save', 'compatibility_fixture_nonce' );
	?>
	<p>
		<label for="compatibility-fixture-note"><?php esc_html_e( 'Note', 'compatibility-fixture' ); ?></label>
		<input id="compatibility-fixture-note" name="compatibility_fixture_note" type="text" value="<?php echo esc_attr( $value ); ?>" />
	</p>
	<?php
}

add_action( 'save_post', 'compatibility_fixture_save_metabox' );

function compatibility_fixture_save_metabox( int $post_id ): void {
	if ( ! isset( $_POST['compatibility_fixture_nonce'] ) || ! check_admin_referer( 'compatibility_fixture_save', 'compatibility_fixture_nonce' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$value = isset( $_POST['compatibility_fixture_note'] ) ? sanitize_text_field( wp_unslash( $_POST['compatibility_fixture_note'] ) ) : '';
	update_post_meta( $post_id, '_compatibility_fixture_note', $value );
}
