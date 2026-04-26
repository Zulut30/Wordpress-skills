<?php
namespace DesignFixture;

defined( 'ABSPATH' ) || exit;

final class GoodAdminPage {
	public static function register(): void {
		add_action( 'admin_menu', array( __CLASS__, 'register_menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
	}

	public static function register_menu(): void {
		add_options_page(
			__( 'Design Fixture', 'design-fixture' ),
			__( 'Design Fixture', 'design-fixture' ),
			'manage_options',
			'design-fixture',
			array( __CLASS__, 'render' )
		);
	}

	public static function register_settings(): void {
		register_setting(
			'design_fixture',
			'design_fixture_options',
			array(
				'type'              => 'array',
				'sanitize_callback' => array( __CLASS__, 'sanitize_options' ),
				'default'           => array(
					'label' => '',
				),
			)
		);
	}

	public static function sanitize_options( $value ): array {
		$value = is_array( $value ) ? $value : array();

		return array(
			'label' => isset( $value['label'] ) ? sanitize_text_field( $value['label'] ) : '',
		);
	}

	public static function enqueue_assets( string $hook_suffix ): void {
		if ( 'settings_page_design-fixture' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_style(
			'design-fixture-admin',
			plugins_url( 'assets/good-admin.css', dirname( __DIR__ ) . '/design-plugin.php' ),
			array(),
			'0.1.0'
		);
	}

	public static function render(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.', 'design-fixture' ) );
		}

		$options = get_option( 'design_fixture_options', array( 'label' => '' ) );
		$label   = isset( $options['label'] ) ? (string) $options['label'] : '';
		?>
		<div class="wrap design-fixture-admin">
			<h1><?php echo esc_html__( 'Design Fixture Settings', 'design-fixture' ); ?></h1>
			<p class="description"><?php echo esc_html__( 'A good example with labels, save flow, and scoped assets.', 'design-fixture' ); ?></p>
			<?php settings_errors(); ?>
			<form method="post" action="options.php">
				<?php settings_fields( 'design_fixture' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">
							<label for="design-fixture-label"><?php echo esc_html__( 'Display label', 'design-fixture' ); ?></label>
						</th>
						<td>
							<input
								id="design-fixture-label"
								name="design_fixture_options[label]"
								type="text"
								value="<?php echo esc_attr( $label ); ?>"
								aria-describedby="design-fixture-label-help"
							/>
							<p id="design-fixture-label-help" class="description">
								<?php echo esc_html__( 'Shown in the frontend card example.', 'design-fixture' ); ?>
							</p>
						</td>
					</tr>
				</table>
				<?php submit_button( __( 'Save settings', 'design-fixture' ) ); ?>
			</form>
		</div>
		<?php
	}
}
