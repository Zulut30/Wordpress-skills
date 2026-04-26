=== Sample Fixture Plugin ===
Contributors: fixture-author
Tags: fixture, testing, blocks
Requires at least: 6.5
Tested up to: 6.8
Requires PHP: 8.1
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Small WordPress plugin fixture for testing the wordpress-plugin-dev skill and audit script.

== Description ==

This plugin is a local test fixture. It includes one safe REST endpoint, a Settings API page, one block.json block, and a separate fixture-only unsafe example file used to verify audit scanner output.

Do not publish this plugin to WordPress.org.

== Installation ==

1. Copy the folder to `/wp-content/plugins/sample-fixture-plugin`.
2. Activate the plugin in a local WordPress test site.

== Frequently Asked Questions ==

= Is unsafe-example.php production code? =

No. It is intentionally unsafe fixture code used only to test scanner findings.

== Changelog ==

= 0.1.0 =
* Initial fixture.
