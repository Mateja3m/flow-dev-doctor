# Flow Dev Doctor

Flow Dev Doctor is a focused PoC for Flow developer diagnostics and onboarding.

## Problem

Flow builders lose time during onboarding because local assumptions are often implicit: toolchain versions, missing config, account setup gaps, and endpoint access issues.

## Solution

`@idoa/dev-doctor-flow` provides a TypeScript CLI wrapper (`flow-doctor`) that runs a small set of checks and always emits structured diagnostics in both human and JSON formats.

## Install

```bash
npm i -g @idoa/dev-doctor-flow
```

## Why This Fits Flow

- prioritizes Flow onboarding pain points
- validates common Flow local setup assumptions
- keeps checks practical for emulator/testnet workflows
- avoids deep protocol-specific behavior in the PoC phase

## Current PoC Status

- shared reusable core integration exists via `@idoa/dev-doctor-*`
- Flow-specific wrapper checks exist (`env`, `config`, `account`, `network`, `workflow`)
- Flow-specific wrapper checks exist (`env`, `config`, `account`, `network`, `flowConfig`, `workflow`, `readiness`)
- report output supports text + JSON
- demo app exists with sample command/report output

## Features

- environment readiness checks
- Flow config validation
- `flow.json` deep validation
- account readiness checks
- access-node reachability checks
- bounded workflow/testnet-faucet readiness check (non-transactional placeholder)
- transaction readiness validation without transaction execution
- report generation for troubleshooting and CI consumption

## CLI Commands

```bash
flow-doctor doctor env
flow-doctor doctor config
flow-doctor doctor account
flow-doctor doctor network
flow-doctor doctor flow
flow-doctor doctor workflow
flow-doctor doctor report
flow-doctor doctor report --json
```

Optional:

```bash
flow-doctor doctor report --config flow-doctor.config.json
```

Minimal config example:

```json
{
  "flowNetwork": "testnet",
  "flowAccessNode": "https://rest-testnet.onflow.org",
  "flowFaucetUrl": "https://faucet.flow.com/fund-account",
  "flowAccountAddress": "0x0000000000000001"
}
```

## Example Output

Plain text:

```text
Flow Dev Doctor (2026-03-18T08:00:00.000Z)
Checks: 8 | Pass: 4 | Warn: 2 | Fail: 1 | Skip: 1

## Flow Onboarding Readiness
- flow.json accounts: [PASS] flow.json defines 1 account entries.
- Faucet availability: [WARN] No faucet endpoint configured for this workspace.
- Transaction readiness: [WARN] One or more onboarding prerequisites are missing or degraded.

[FAIL] flow.json contracts mapping
  One or more contract mappings are missing a valid source or address mapping.
[WARN] Faucet availability
  No faucet endpoint configured for this workspace.
[SKIP] Sample transaction workflow (bounded)
  Placeholder validation only: this PoC confirms prerequisites but does not submit a real transaction.
```

JSON:

```json
{
  "result": {
    "chain": "flow",
    "generatedAt": "2026-03-18T08:00:00.000Z",
    "checks": [
      {
        "id": "workflow.faucet",
        "title": "Faucet availability",
        "status": "warn",
        "message": "No faucet endpoint configured for this workspace."
      },
      {
        "id": "readiness.status",
        "title": "Transaction readiness",
        "status": "warn",
        "message": "One or more onboarding prerequisites are missing or degraded."
      }
    ]
  },
  "report": {
    "summary": {
      "total": 8,
      "pass": 4,
      "warn": 2,
      "fail": 1,
      "skip": 1
    }
  }
}
```

## Architecture (Shared Core + Flow Adapter)

- shared packages:
  - `@idoa/dev-doctor-core`
  - `@idoa/dev-doctor-types`
  - `@idoa/dev-doctor-utils`
  - `@idoa/dev-doctor-reporter`
  - `@idoa/dev-doctor-cli-kit`
- Flow wrapper:
  - Flow-specific checks in `src/checks/`
  - adapter boundary in `src/adapters/idoa.ts`

The wrapper defers generic behavior to shared packages and uses a local fallback runner for resilience.

## Local Development

```bash
npm install
npm run build
npm run typecheck
npm run lint
```

## Demo

```bash
npm run demo:dev
```
