<?php
namespace DesignFixture;

defined( 'ABSPATH' ) || exit;

final class GoodFrontendOutput {
	public static function register(): void {
		add_shortcode( 'design_fixture_good', array( __CLASS__, 'render_shortcode' ) );
	}

	public static function render_shortcode(): string {
		$title = __( 'Accessible frontend card', 'design-fixture' );

		ob_start();
		?>
		<article class="design-fixture-card">
			<h2 class="design-fixture-card__title"><?php echo esc_html( $title ); ?></h2>
			<p><?php echo esc_html__( 'This fixture output is semantic, escaped, and scoped.', 'design-fixture' ); ?></p>
		</article>
		<?php

		return (string) ob_get_clean();
	}
}
