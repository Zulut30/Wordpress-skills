<?php
/**
 * Fixture only. Server-rendered fallback for block/editor compatibility.
 *
 * @var array $attributes Block attributes.
 */

defined( 'ABSPATH' ) || exit;

?>
<section <?php echo get_block_wrapper_attributes( array( 'class' => 'compatibility-fixture-card' ) ); ?>>
	<h2><?php esc_html_e( 'Compatibility fixture', 'compatibility-fixture' ); ?></h2>
</section>
