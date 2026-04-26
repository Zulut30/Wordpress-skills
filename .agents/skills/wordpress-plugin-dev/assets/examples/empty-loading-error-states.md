# Empty, Loading, Error, And Success States

Last reviewed: 2026-04-27

Every UI workflow should define what the user sees before data exists, while work is happening, when it succeeds, and when it fails.

## Empty

```text
No items imported yet.
Import your first item to preview how it will appear on the site.
[Import items]
```

## Loading

```text
Importing items...
Keep this page open. This may take a minute for large catalogs.
```

Implementation:

- Disable duplicate-submit actions.
- Prefer background jobs for long work.
- Announce meaningful status changes to screen readers.

## Success

```text
Settings saved.
Your changes are now active on the frontend.
```

## Error

```text
Import failed.
The remote service did not respond. Check the connection and try again.
[Retry] [View troubleshooting]
```

Do not expose raw stack traces, tokens, secrets, or remote response bodies.
