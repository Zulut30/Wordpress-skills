<?php
/**
 * Plugin Name:       Sample Fixture Plugin
 * Description:       Small WordPress plugin fixture for testing the wordpress-plugin-dev skill and audit script.
 * Version:           0.1.0
 * Requires at least: 6.5
 * Requires PHP:      8.1
 * Author:            Fixture Author
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sample-fixture-plugin
 * Domain Path:       /languages
 *
 * @package SampleFixturePlugin
 */

defined( 'ABSPATH' ) || exit;

define( 'SAMPLE_FIXTURE_PLUGIN_VERSION', '0.1.0' );
define( 'SAMPLE_FIXTURE_PLUGIN_FILE', __FILE__ );
define( 'SAMPLE_FIXTURE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

require_once SAMPLE_FIXTURE_PLUGIN_DIR . 'src/Plugin.php';
require_once SAMPLE_FIXTURE_PLUGIN_DIR . 'src/Rest/Safe_Controller.php';
require_once SAMPLE_FIXTURE_PLUGIN_DIR . 'src/Admin/Settings_Page.php';

// Fixture-only intentionally unsafe examples. Do not copy this file into production plugins.
require_once SAMPLE_FIXTURE_PLUGIN_DIR . 'unsafe-example.php';

register_activation_hook(
	__FILE__,
	static function (): void {
		flush_rewrite_rules();
	}
);

register_deactivation_hook(
	__FILE__,
	static function (): void {
		flush_rewrite_rules();
	}
);

add_action(
	'plugins_loaded',
	static function (): void {
		SampleFixturePlugin\Plugin::instance()->register();
	}
);
