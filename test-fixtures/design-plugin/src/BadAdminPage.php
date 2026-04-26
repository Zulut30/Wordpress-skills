<?php
namespace DesignFixture;

defined( 'ABSPATH' ) || exit;

/**
 * Fixture only. Do not copy into production.
 */
final class BadAdminPage {
	public static function register(): void {
		add_action( 'admin_menu', array( __CLASS__, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
	}

	public static function register_menu(): void {
		add_menu_page(
			'Bad Design Fixture',
			'Bad Design',
			'manage_options',
			'bad-design-fixture',
			array( __CLASS__, 'render' )
		);
	}

	public static function enqueue_assets(): void {
		wp_enqueue_style(
			'bad-design-fixture-admin',
			plugins_url( 'assets/bad-admin.css', dirname( __DIR__ ) . '/design-plugin.php' ),
			array(),
			'0.1.0'
		);
	}

	public static function render(): void {
		?>
		<form method="post">
			<input type="text" name="api_key" placeholder="Key" required>
			<input type="checkbox" name="danger_mode" value="1">
			<button type="submit">Submit</button>
			<div class="notice notice-error is-dismissible">
				<p>Something went wrong.</p>
			</div>
		</form>
		<?php
	}
}
