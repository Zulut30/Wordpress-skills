# WordPress.org Release

Last reviewed: 2026-06-07

## Official Sources

- WordPress.org Plugin Directory: https://developer.wordpress.org/plugins/wordpress-org/
- Plugin readme standard: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- Subversion release workflow: https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/
- Plugin assets: https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/
- Detailed plugin guidelines: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- Plugin Check: https://wordpress.org/plugins/plugin-check/

## Verify Current Docs First

Release details are version-sensitive. Verify the current WordPress.org guidelines, readme parser expectations, asset naming/size rules, Plugin Check behavior, and SVN workflow before publishing or generating exact commands.

Do not run SVN release commands unless the user explicitly asks to publish and confirms the target plugin slug, version, credentials, and release source.

## Release Inputs

Collect these facts before release work:

- Plugin slug and WordPress.org SVN URL.
- Release version and previous released version.
- Minimum WordPress version, tested WordPress version, and minimum PHP version.
- Stable tag policy: tagged release is strongly preferred over using trunk as stable.
- Build command, production dependency policy, and files intentionally shipped.
- Whether assets in `/assets/` need updates for icons, banners, screenshots, or readme screenshot captions.
- Known Plugin Check, PHPCS, accessibility, performance, or compatibility warnings and their disposition.

## Metadata Consistency

Keep these values aligned before packaging:

- Main plugin file header `Version`.
- Main plugin file header `Requires at least`, `Tested up to` when present, `Requires PHP`, `Text Domain`, and license fields.
- `readme.txt` `Stable tag`.
- `readme.txt` `Requires at least`, `Tested up to`, `Requires PHP`, `Requires Plugins` when used, changelog, upgrade notice, and screenshots.
- Composer/npm package versions if the plugin uses them for build or release metadata.
- Built asset versions and generated `.asset.php` metadata when using `@wordpress/scripts`.

If any version value disagrees, stop and resolve it before release. A mismatched stable tag can cause WordPress.org to serve the wrong code.

## Preflight Checks

Run the strongest available local checks before touching SVN:

```bash
npm run release:check
composer validate
composer install --no-dev --prefer-dist --no-interaction
npm run lint:php:required
composer run lint
```

Adapt these commands to the target plugin. For a real plugin, also run its PHPUnit, JavaScript, build, end-to-end, or wp-env checks. Run Plugin Check in the supported local, wp-admin, WP-CLI, or CI path for the project and document unresolved findings.

If PHP, Composer, Node, WordPress, or Plugin Check is unavailable, report that clearly. Do not call the release ready.

## Build And Package

- Build from a clean Git checkout or clean release worktree.
- Run the production build before copying files to SVN.
- Ship production dependencies only when the plugin needs them at runtime.
- Exclude `.git`, `.github` when not intentionally shipped, `node_modules`, Composer dev dependencies, test fixtures, caches, logs, local config, secrets, source-only dev files, and generated archives.
- Include built JavaScript/CSS, PHP runtime dependencies, languages, templates, block metadata, and required assets.
- Keep the main plugin PHP file directly under SVN `trunk/`, not inside an extra nested plugin folder.
- Do not upload zip archives into SVN. SVN should contain individual release files.

For projects with a custom package script, verify the extracted package before release, not just the source checkout.

## SVN Release Flow

Use this as a guarded workflow outline, not an automatic command block:

1. Check out or update the WordPress.org SVN repository.
2. Replace the contents of `trunk/` with the verified release package contents.
3. Keep WordPress.org listing assets in `/assets/`, not inside the plugin runtime package unless the plugin also needs them.
4. Run `svn status` and inspect additions, deletions, and modifications.
5. Run `svn diff` for changed tracked files and review the release delta.
6. Add new files and remove deleted files intentionally.
7. Confirm `trunk/readme.txt` has the intended `Stable tag`.
8. Copy `trunk` to `tags/<version>` with SVN copy semantics.
9. Commit `trunk` and the new tag together with a clear release message.
10. Record the SVN revision and release version in project notes.

Avoid committing every development change to WordPress.org SVN. Treat SVN as the distribution channel for finished releases.

## Assets Directory

Use SVN `/assets/` for WordPress.org listing assets such as icons, banners, and screenshots. Verify current naming, dimensions, file formats, and retina variants in the official asset docs before changing them.

Do not confuse listing assets with plugin runtime assets. Listing assets do not need to be downloaded with every plugin install.

## Post-Release Verification

After the SVN commit:

- Wait for WordPress.org processing and check the plugin page, version, changelog, screenshots, and download.
- Install or update the plugin from WordPress.org on a clean test site.
- Confirm the downloaded zip contains the expected version and files.
- Watch release confirmation emails, support forums, fatal error reports, and update availability.
- If a release is bad, do not rewrite tags casually. Prepare a new fixed release unless maintainers explicitly choose another recovery path.

## Common Release Blockers

- Missing or inconsistent stable tag.
- Main plugin file not at the root of `trunk/`.
- Development files, secrets, caches, test dumps, or archives shipped to users.
- Built assets missing from the package.
- Runtime Composer dependencies omitted or dev dependencies shipped unintentionally.
- License or third-party dependency compatibility unclear.
- Plugin Check warnings ignored without rationale.
- Security, escaping, nonce, capability, privacy, accessibility, or i18n regressions.

## Agent Behavior

- Preserve the target project's release process when it is already documented and safe.
- Prefer generating a release checklist over running publication commands.
- If asked to publish, stop before SVN commit and summarize the exact changes, target slug, version, and checks run.
- Keep credentials out of commands, logs, docs, and examples.
- Treat WordPress.org policy compliance as a release blocker, not optional polish.
