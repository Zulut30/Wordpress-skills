# Onboarding Flow

Last reviewed: 2026-04-27

Use onboarding only when setup is genuinely multi-step or confusing. Keep it optional where possible.

## Three-Step Flow

1. Configure
   - Choose safe defaults.
   - Explain only required settings.
   - Link to advanced settings instead of forcing them.
2. Connect/import
   - Ask for credentials or import source only when needed.
   - Validate and show clear errors.
   - Do not store secrets without explaining where/how.
3. Verify
   - Show setup status.
   - Offer a preview or test action.
   - Provide finish/back/skip paths.

## Behavior

- Back should preserve entered values.
- Skip should be honest and reversible.
- Finish should explain what changed.
- Destructive or irreversible setup actions require confirmation.
- Headings, progress text, and actions must be keyboard accessible.

Avoid dark patterns: do not hide skip, force account creation unless required, or use guilt-based copy.
