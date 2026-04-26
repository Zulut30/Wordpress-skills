<?php
namespace DesignFixture;

defined( 'ABSPATH' ) || exit;

/**
 * Fixture only. Do not copy into production.
 */
final class BadFrontendOutput {
	public static function register(): void {
		add_shortcode( 'design_fixture_bad', array( __CLASS__, 'render_shortcode' ) );
	}

	public static function render_shortcode(): string {
		return '<div><div><div><form><input type="email" placeholder="Email"><button>Go</button></form></div><div><div><div><div><div>Content</div></div></div></div></div></div></div>';
	}
}
