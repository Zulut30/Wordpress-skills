<?php
/**
 * Plugin Name:       Demo Skill Plugin
 * Description:       Fixture plugin for the WordPress Plugin Dev skill.
 * Version:           0.1.0
 * Requires at least: 6.5
 * Requires PHP:      8.1
 * Author:            Skill Fixture
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       demo-skill-plugin
 *
 * @package DemoSkillPlugin
 */

defined( 'ABSPATH' ) || exit;

define( 'DEMO_SKILL_PLUGIN_VERSION', '0.1.0' );
define( 'DEMO_SKILL_PLUGIN_FILE', __FILE__ );
define( 'DEMO_SKILL_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

require_once DEMO_SKILL_PLUGIN_DIR . 'src/Plugin.php';
require_once DEMO_SKILL_PLUGIN_DIR . 'src/Rest/Demo_Controller.php';
require_once DEMO_SKILL_PLUGIN_DIR . 'src/Admin/Settings_Page.php';

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
		DemoSkillPlugin\Plugin::instance()->register();
	}
);
