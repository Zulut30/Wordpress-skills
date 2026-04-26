# WordPress.org Release

Last reviewed: 2026-04-26

## Official Sources

- WordPress.org Plugin Directory: https://developer.wordpress.org/plugins/wordpress-org/
- Plugin readme standard: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- Subversion release workflow: https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/
- Plugin assets: https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/
- Detailed plugin guidelines: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- Plugin Check: https://wordpress.org/plugins/plugin-check/

## Verify Current Docs First

Verify current WordPress.org guidelines, readme parser expectations, Plugin Check results, and SVN release workflow before publishing.

## Release Checklist

- Plugin header version matches the intended release.
- `readme.txt` has matching `Stable tag`.
- Changelog includes the release.
- Minimum WordPress and PHP versions are accurate.
- License is GPL-compatible.
- Build assets are present and source-only development files are excluded when appropriate.
- No secrets, local paths, test dumps, or node/composer caches are packaged.
- Plugin Check passes or known warnings are documented.
- Screenshots and assets follow current WordPress.org naming and size guidance.

## WordPress.org Notes

- WordPress.org uses SVN for plugin distribution.
- `trunk/` commonly holds development or stable code depending on project workflow.
- Tags represent releases and should be immutable after publication.
- The readme controls directory display metadata, sections, screenshots, and changelog.

## Packaging Advice

- Build in a clean workspace.
- Install production dependencies only if dependencies are shipped.
- Exclude `.git`, `node_modules`, caches, tests if not shipped, config secrets, logs, and local environment files.
- Keep source maps only when intentionally distributed.
