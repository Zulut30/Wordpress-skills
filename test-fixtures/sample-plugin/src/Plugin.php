<?php
/**
 * Main plugin coordinator.
 *
 * @package SampleFixturePlugin
 */

namespace SampleFixturePlugin;

use SampleFixturePlugin\Admin\Settings_Page;
use SampleFixturePlugin\Rest\Safe_Controller;

defined( 'ABSPATH' ) || exit;

final class Plugin {
	private static ?self $instance = null;

	public static function instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function register(): void {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );

		if ( is_admin() ) {
			( new Settings_Page() )->register();
		}
	}

	public function register_blocks(): void {
		register_block_type( SAMPLE_FIXTURE_PLUGIN_DIR . 'blocks/sample-block' );
	}

	public function register_rest_routes(): void {
		( new Safe_Controller() )->register_routes();
	}

	private function __construct() {}
}
