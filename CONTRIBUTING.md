# Contributing

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
npm run typecheck
npm run test
```

## Development Rules

- use TypeScript strict mode
- keep comments minimal and meaningful
- avoid duplicating generic logic from shared `@idoa/dev-doctor-*` packages
- add or update tests for behavior changes

## Pull Requests

Include:

- problem statement
- implementation summary
- test evidence (`npm run test`, `npm run lint`)
- any follow-up scope
