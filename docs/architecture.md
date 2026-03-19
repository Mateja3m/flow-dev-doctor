# Architecture

## Goals

- keep Flow-specific checks local
- delegate common diagnostics plumbing to shared `@idoa/dev-doctor-*` packages
- support both human and JSON output

## Runtime Flow

1. CLI receives `doctor <group>` command.
2. Command layer selects check set.
3. Adapter attempts to run via shared `@idoa/dev-doctor-core` pipeline.
4. Fallback local runner executes checks if needed.
5. Reporting layer attempts shared `@idoa/dev-doctor-reporter`, then local markdown summary fallback.

## Extension Points

- add checks under `src/checks/`
- register in `src/checks/index.ts`
- add focused tests in `tests/`

## Safety Constraints

- no mutation of developer files during diagnostics
- time-bounded network probes
- explicit warning when risky key material is in config
