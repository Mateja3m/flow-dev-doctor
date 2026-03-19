#!/usr/bin/env node
import { runDoctor } from './commands/doctor.js';

async function main(): Promise<void> {
  const [, , group, ...rest] = process.argv;

  if (group !== 'doctor') {
    process.stderr.write(
      'Usage: flow-doctor doctor <env|config|account|network|workflow|flow|report> [--json] [--config <path>]\n'
    );
    process.exitCode = 1;
    return;
  }

  try {
    process.exitCode = await runDoctor(rest);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown CLI error';
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

void main();
