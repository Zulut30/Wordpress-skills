<?php
/**
 * Main plugin service.
 *
 * @package DemoSkillPlugin
 */

namespace DemoSkillPlugin;

use DemoSkillPlugin\Admin\Settings_Page;
use DemoSkillPlugin\Rest\Demo_Controller;

class Plugin {
	private static ?self $instance = null;

	public static function instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function register(): void {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'rest_api_init', array( new Demo_Controller(), 'register_routes' ) );

		if ( is_admin() ) {
			( new Settings_Page() )->register();
		}
	}

	public function register_blocks(): void {
		register_block_type( DEMO_SKILL_PLUGIN_DIR . 'blocks/demo-dynamic' );
	}
}
