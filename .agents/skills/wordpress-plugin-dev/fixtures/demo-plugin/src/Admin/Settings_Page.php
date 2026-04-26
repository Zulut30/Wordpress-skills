<?php
/**
 * Demo settings page.
 *
 * @package DemoSkillPlugin
 */

namespace DemoSkillPlugin\Admin;

class Settings_Page {
	private const OPTION = 'demo_skill_plugin_message';

	public function register(): void {
		add_action( 'admin_menu', array( $this, 'add_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	public function add_page(): void {
		add_options_page(
			__( 'Demo Skill Plugin', 'demo-skill-plugin' ),
			__( 'Demo Skill Plugin', 'demo-skill-plugin' ),
			'manage_options',
			'demo-skill-plugin',
			array( $this, 'render' )
		);
	}

	public function register_settings(): void {
		register_setting(
			'demo-skill-plugin',
			self::OPTION,
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			)
		);
	}

	public function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'demo-skill-plugin' ) );
		}
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="post">
				<?php settings_fields( 'demo-skill-plugin' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">
							<label for="demo-skill-plugin-message"><?php esc_html_e( 'Message', 'demo-skill-plugin' ); ?></label>
						</th>
						<td>
							<input id="demo-skill-plugin-message" class="regular-text" type="text" name="<?php echo esc_attr( self::OPTION ); ?>" value="<?php echo esc_attr( get_option( self::OPTION, '' ) ); ?>" />
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
