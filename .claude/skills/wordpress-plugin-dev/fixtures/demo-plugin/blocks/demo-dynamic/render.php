<?php
/**
 * Render callback for the demo dynamic block.
 *
 * @package DemoSkillPlugin
 */

$message = isset( $attributes['message'] ) ? sanitize_text_field( $attributes['message'] ) : get_option( 'demo_skill_plugin_message', '' );
?>
<p <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo esc_html( $message ); ?>
</p>
