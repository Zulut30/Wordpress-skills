# Plugin Dashboard Layout

Last reviewed: 2026-04-27

Use a plugin dashboard only when the user needs status, monitoring, troubleshooting, or next actions. Do not create a dashboard for settings that fit better under Settings API.

## Suggested Hierarchy

1. Page title and one-sentence purpose.
2. Status summary: connected/disconnected, sync health, last run, error count.
3. Primary next action: connect, configure, run sync, fix issue.
4. Focused cards for important metrics.
5. Troubleshooting section with safe links/actions.
6. Secondary documentation link.

## Example Structure

```text
Example Plugin
Short explanation of what this screen helps the admin do.

[Connected] Last sync: 12 minutes ago
[Run sync now]

Cards:
- Items imported
- Warnings
- Cache status

Troubleshooting:
- View logs
- Reconnect account
- Read documentation
```

Implementation notes:

- Paginate or lazy-load large data.
- Do not fetch remote status synchronously on every admin render.
- Scope dashboard CSS/JS by screen ID.
- Keep capability checks on actions.
- Announce async status changes when JS updates the screen.
