# Coding Standards

Last reviewed: 2026-04-26

## Official Sources

- WordPress Coding Standards: https://developer.wordpress.org/coding-standards/
- PHP standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
- JavaScript standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/
- CSS standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/
- Inline documentation standards: https://developer.wordpress.org/coding-standards/inline-documentation-standards/
- WPCS: https://github.com/WordPress/WordPress-Coding-Standards

## Verify Current Docs First

Verify WPCS, PHPCompatibilityWP, and project PHPCS configuration before changing standards tooling.

## PHP Guidelines

- Prefix global functions, constants, hooks, option names, meta keys, and handles with the plugin slug or vendor namespace.
- Use namespaces and Composer autoload for medium and large plugins.
- Keep hook callbacks small; delegate to named methods.
- Return early on failed permission or nonce checks.
- Prefer WordPress wrappers for filesystem, HTTP, options, metadata, cron, scripts, and styles.
- Document public hooks with expected parameters and return values.

## JavaScript Guidelines

- Use `@wordpress/scripts` where a block/editor build pipeline is needed.
- Import WordPress packages by package name, not from internal paths.
- Keep editor code, frontend view code, and Interactivity API script modules separate.
- Treat server-provided settings as untrusted until validated in JS and enforced in PHP.

## CSS Guidelines

- Scope admin CSS to plugin screens or wrapper classes.
- Avoid broad selectors that affect WordPress admin globally.
- Respect WordPress admin color schemes and accessibility contrast.

## Tooling

- PHPCS with WPCS and PHPCompatibilityWP for PHP style and compatibility.
- ESLint/Prettier through `@wordpress/scripts` for JS and block projects.
- Plugin Check before release.
