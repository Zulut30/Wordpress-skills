# Interactivity API

Last reviewed: 2026-04-26

## Official Sources

- Interactivity API reference: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
- Directives and store reference: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/api-reference/
- `@wordpress/interactivity`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/
- Script modules: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/

## Verify Current Docs First

The Interactivity API and script module tooling are version-sensitive. Verify the target WordPress version, package docs, and `@wordpress/scripts` requirements before implementing or reviewing exact build flags.

## Use When

- A block needs frontend state, actions, side effects, or DOM updates without a full custom framework.
- Multiple blocks need coordinated frontend state.
- The interaction belongs to block markup and should integrate with WordPress block rendering.

## Baseline Pattern

- Mark support in `block.json` with the current documented interactivity support field.
- Use a frontend script module where current docs require it.
- Initialize a store with a unique namespace.
- Add directives in `render.php` or saved markup.
- Keep server-rendered markup valid and useful without JavaScript when practical.

## Review Points

- Verify WordPress minimum version supports the API used.
- Verify package imports and build flags against current docs.
- Escape server-rendered attributes and text before directives are added.
- Avoid storing sensitive data in frontend state.
- Keep state names, action names, and callbacks scoped to the plugin namespace.
