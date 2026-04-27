# Release And Packaging

This project supports source installs and a small versioned release archive.

## Build A Package

```bash
npm run package:skill
```

The script reads `package.json` and creates:

```text
packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz
packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz.sha256
```

The archive is generated locally and ignored by git. Attach it to a GitHub release instead of committing it.

## What The Archive Includes

- `skills/wordpress-plugin-dev/`
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- `package.json`
- `composer.json`
- `.codex-plugin/plugin.json`
- `.agents/plugins/marketplace.json`
- selected install, release, compatibility, demo, and example-output docs

## What The Archive Excludes

- `.git/`
- `node_modules/`
- `vendor/`
- synced install-target copies
- `test-fixtures/`
- `docs/reports/`
- local build/cache/log files

## Verify Checksums

After building, compare the printed SHA256 with the `.sha256` file:

```bash
cat packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz.sha256
```

On Windows PowerShell:

```powershell
Get-FileHash packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz -Algorithm SHA256
```

## Attach To GitHub Release

If `gh` is available:

```bash
gh release upload v0.1.0 packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz.sha256 --repo Zulut30/Wordpress-skills
```

If `gh` is unavailable, upload both files through the GitHub release UI. See [manual GitHub actions](github-manual-actions.md).

## Update The Version

1. Update `package.json`.
2. Update `.codex-plugin/plugin.json`.
3. Update `.agents/plugins/marketplace.json` if the plugin manifest is versioned there.
4. Update `CHANGELOG.md` and `RELEASE_NOTES.md`.
5. Run:

```bash
npm run release:check
```

Do not create a git tag or overwrite a published release without maintainer approval.

