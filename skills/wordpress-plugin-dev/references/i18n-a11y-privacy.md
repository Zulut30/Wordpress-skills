# Internationalization, Accessibility, Privacy

Last reviewed: 2026-04-26

## Official Sources

- Internationalization: https://developer.wordpress.org/apis/internationalization/
- Plugin internationalization: https://developer.wordpress.org/plugins/internationalization/
- Accessibility standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/
- Plugin privacy: https://developer.wordpress.org/plugins/privacy/
- Personal data exporters: https://developer.wordpress.org/plugins/privacy/adding-the-personal-data-exporter-to-your-plugin/
- Personal data erasers: https://developer.wordpress.org/plugins/privacy/adding-the-personal-data-eraser-to-your-plugin/

## Verify Current Docs First

Verify current translation extraction tooling, JavaScript i18n setup, and privacy hooks before changing release automation.

## I18n

- Use the plugin text domain consistently.
- Wrap user-facing PHP strings in translation functions.
- Use translator comments for placeholders.
- Do not concatenate translatable sentence fragments.
- Use JavaScript i18n helpers for editor and block UI.
- Keep `Text Domain` and `Domain Path` header values consistent with translation files when used.

## Accessibility

- Use semantic HTML before custom ARIA.
- Provide labels for form controls.
- Ensure keyboard access for interactive controls.
- Keep focus states visible.
- Maintain sufficient contrast.
- Announce async status changes when users need feedback.
- Do not rely on color alone to convey state.

## Privacy

- Identify whether the plugin stores personal data, sends data externally, sets cookies, tracks users, or logs IP/user identifiers.
- Add exporter and eraser callbacks when storing personal data.
- Provide privacy policy text suggestions when appropriate.
- Make external services explicit in admin settings and documentation.
- Delete or anonymize personal data only according to user settings, legal requirements, and plugin ownership.
