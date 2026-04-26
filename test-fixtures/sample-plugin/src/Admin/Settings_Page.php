<?php
/**
 * Settings page for fixture plugin.
 *
 * @package SampleFixturePlugin
 */

namespace SampleFixturePlugin\Admin;

defined( 'ABSPATH' ) || exit;

final class Settings_Page {
	private const OPTION = 'sample_fixture_plugin_message';
	private const PAGE_SLUG = 'sample-fixture-plugin';
	private const CAPABILITY = 'manage_options';

	public function register(): void {
		add_action( 'admin_menu', array( $this, 'add_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	public function add_page(): void {
		add_options_page(
			__( 'Sample Fixture Plugin', 'sample-fixture-plugin' ),
			__( 'Sample Fixture', 'sample-fixture-plugin' ),
			self::CAPABILITY,
			self::PAGE_SLUG,
			array( $this, 'render' )
		);
	}

	public function register_settings(): void {
		register_setting(
			self::PAGE_SLUG,
			self::OPTION,
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
				'show_in_rest'      => false,
			)
		);
	}

	public function render(): void {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'sample-fixture-plugin' ) );
		}

		$value = get_option( self::OPTION, '' );
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="post">
				<?php settings_fields( self::PAGE_SLUG ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">
							<label for="sample-fixture-message"><?php esc_html_e( 'Message', 'sample-fixture-plugin' ); ?></label>
						</th>
						<td>
							<input id="sample-fixture-message" class="regular-text" type="text" name="<?php echo esc_attr( self::OPTION ); ?>" value="<?php echo esc_attr( $value ); ?>" />
						</td>
					</tr>
				</table>
				<?php submit_button( __( 'Save settings', 'sample-fixture-plugin' ) ); ?>
			</form>
		</div>
		<?php
	}
}
