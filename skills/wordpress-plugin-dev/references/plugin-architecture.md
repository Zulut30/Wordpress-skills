# Plugin Architecture

Last reviewed: 2026-04-26

## Official Sources

- Plugin Handbook: https://developer.wordpress.org/plugins/
- Plugin basics: https://developer.wordpress.org/plugins/plugin-basics/
- Header requirements: https://developer.wordpress.org/plugins/plugin-basics/header-requirements/
- Activation/deactivation hooks: https://developer.wordpress.org/plugins/plugin-basics/activation-deactivation-hooks/
- Uninstall methods: https://developer.wordpress.org/plugins/plugin-basics/uninstall-methods/
- Composer docs: https://getcomposer.org/doc/

## Verify Current Docs First

Verify current header requirements, minimum supported PHP versions, and WordPress.org packaging expectations before release.

## Architecture Rules

- Keep the main plugin file as a bootstrap: metadata, constants, autoload, activation/deactivation hooks, and one call to start the plugin.
- Put behavior in namespaced classes or small include files.
- Register services on WordPress hooks; avoid heavy work during file load.
- Use dependency injection for services that need collaborators. Avoid global mutable state unless integrating with WordPress APIs that require it.
- Keep admin-only code behind `is_admin()` or admin hooks when practical.
- Separate storage, rendering, REST, admin UI, cron, and block registration.
- Use `register_activation_hook()` for one-time setup such as rewrite flushing after CPT registration. Do not perform remote calls or long migrations on every request.
- Use `register_deactivation_hook()` for cleanup of scheduled events and temporary state.
- Use `uninstall.php` or `register_uninstall_hook()` for irreversible data deletion, and only delete user data when the plugin clearly owns it or the user opted in.

## Suggested Layouts

Small plugin:

```text
plugin-slug.php
includes/
  functions.php
readme.txt
```

Medium plugin:

```text
plugin-slug.php
src/
  Plugin.php
  Admin/
  Rest/
  Blocks/
composer.json
readme.txt
```

Block plugin:

```text
plugin-slug.php
src/
blocks/
  example-block/
    block.json
    render.php
src-js/
build/
package.json
```

## Bootstrap Checklist

- Plugin header includes `Plugin Name`, `Description`, `Version`, `Requires at least`, `Requires PHP`, `Author`, `License`, and `Text Domain`.
- Direct access guard is present: `defined( 'ABSPATH' ) || exit;`.
- Constants use plugin slug prefix and point to file, directory, URL, version, and text domain.
- Composer autoload is loaded only if present; failure path is admin-visible but not fatal for frontend users when possible.
- Main class/service registration is idempotent.
- Activation/deactivation callbacks are static or functions available at registration time.
