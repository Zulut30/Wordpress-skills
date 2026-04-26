<?php
/**
 * Dynamic render template for sample-fixture-plugin/sample-block.
 *
 * @package SampleFixturePlugin
 *
 * @var array $attributes Block attributes.
 */

defined( 'ABSPATH' ) || exit;

$message = isset( $attributes['message'] ) ? sanitize_text_field( $attributes['message'] ) : '';

if ( '' === $message ) {
	$message = get_option( 'sample_fixture_plugin_message', '' );
}
?>
<p <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo esc_html( $message ); ?>
</p>
