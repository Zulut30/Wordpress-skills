<?php
/**
 * Plugin Name: Design Fixture Plugin
 * Description: Fixture plugin for WordPress Plugin Dev Skill design/UX/UI audit checks.
 * Version: 0.1.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Text Domain: design-fixture
 * License: MIT
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/src/GoodAdminPage.php';
require_once __DIR__ . '/src/BadAdminPage.php';
require_once __DIR__ . '/src/GoodFrontendOutput.php';
require_once __DIR__ . '/src/BadFrontendOutput.php';

add_action( 'plugins_loaded', static function () {
	DesignFixture\GoodAdminPage::register();
	DesignFixture\BadAdminPage::register();
	DesignFixture\GoodFrontendOutput::register();
	DesignFixture\BadFrontendOutput::register();
} );
