# Source Layout

- `checks/`: Flow-specific check units only.
- `commands/`: CLI command orchestration and rendering.
- `adapters/`: compatibility layer for shared `@idoa/dev-doctor-*` packages.
- `config/`: zod schemas and config loading.
- `reporting/`: report summarization and markdown output.

Keep generic logic in shared packages and avoid copy-pasting reusable pipeline behavior.
