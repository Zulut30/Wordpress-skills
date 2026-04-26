# Blocks And Gutenberg

Last reviewed: 2026-04-26

## Official Sources

- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- `block.json` fundamentals: https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-json/
- Block metadata reference: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
- Block registration: https://developer.wordpress.org/block-editor/getting-started/fundamentals/registration-of-a-block/
- Dynamic blocks: https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/creating-dynamic-blocks/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- `@wordpress/create-block`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/

## Verify Current Docs First

Verify current `block.json` schema fields, API version, metadata collection behavior, and `@wordpress/scripts` flags before giving exact commands or release gates.

## Block Rules

- Use `block.json` as the source of truth for block metadata.
- Use `apiVersion` supported by the target WordPress version.
- Use a stable namespace: `plugin-slug/block-name`.
- Set `textdomain` to the plugin text domain.
- Register server-side using `register_block_type()` for each block or metadata collection APIs when appropriate.
- Keep generated `build/` files in the release artifact if the plugin is distributed without a build step.

## Static vs Dynamic

- Static block: content is saved into post content and changes only when the post is edited.
- Dynamic block: frontend output comes from PHP render callback or `render.php`, useful for server state, queries, permissions, or markup that may evolve.
- Dynamic blocks should validate attributes and escape rendered output.

## Build Pipeline

- Use `@wordpress/scripts` for common build, start, lint, and format tasks.
- Keep source in `src/` or block directories and output in `build/`.
- Commit build output when distributing through WordPress.org unless the release process builds it before packaging.
- Do not enqueue editor bundles on the frontend unless needed.

## Block Review Checklist

- `block.json` has schema, namespace, title, category, textdomain, attributes, and asset fields.
- PHP registration path is correct and runs on `init`.
- Attribute values are validated and escaped in render callbacks.
- Frontend assets load only when needed.
- Editor UI has accessible labels and keyboard-friendly controls.
