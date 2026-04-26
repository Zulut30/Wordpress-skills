# Modern Plugin Tree

```text
plugin-slug/
|-- plugin-slug.php
|-- composer.json
|-- package.json
|-- readme.txt
|-- src/
|   |-- Plugin.php
|   |-- Admin/
|   |-- Rest/
|   |-- Blocks/
|   `-- Privacy/
|-- blocks/
|   `-- example/
|       |-- block.json
|       |-- render.php
|       `-- index.js
|-- tests/
|-- build/
`-- languages/
```

Use this when the plugin has REST endpoints, admin settings, and blocks. For smaller plugins, collapse `src/` into `includes/` and skip the build pipeline.
