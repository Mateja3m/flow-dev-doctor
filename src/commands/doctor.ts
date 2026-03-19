import { renderOutput } from './output.js';
import { runCommand } from './run.js';
import type { CliOptions } from '../types.js';

const COMMANDS = new Set(['env', 'config', 'account', 'network', 'workflow', 'flow', 'report']);

export async function runDoctor(argv: string[]): Promise<number> {
  const { command, options } = parseDoctorArgs(argv);

  const selected = command === 'report' ? 'all' : command;
  const result = await runCommand(selected, options);
  const output = renderOutput(result, options.format);
  process.stdout.write(`${output}\n`);

  const hasFailures = result.checks.some((check) => check.status === 'fail');
  return hasFailures ? 1 : 0;
}

function parseDoctorArgs(argv: string[]): { command: string; options: CliOptions } {
  const command = argv[0];
  if (!command || !COMMANDS.has(command)) {
    throw new Error(
      'Usage: flow-doctor doctor <env|config|account|network|workflow|flow|report> [--json] [--config <path>]'
    );
  }

  const options: CliOptions = { format: 'human' };

  for (let i = 1; i < argv.length; i += 1) {
    const part = argv[i];

    if (part === '--json') {
      options.format = 'json';
      continue;
    }

    if (part === '--config') {
      const path = argv[i + 1];
      if (!path) {
        throw new Error('Missing value for --config');
      }
      options.configPath = path;
      i += 1;
      continue;
    }
  }

  return { command, options };
}
