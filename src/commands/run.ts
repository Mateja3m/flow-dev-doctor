import { allChecks, flowChecks, FLOW_CHECKS } from '../checks/index.js';
import { runDiagnosticsWithCore } from '../adapters/idoa.js';
import type { CliOptions, DoctorRunResult } from '../types.js';

export async function runCommand(command: string, options: CliOptions): Promise<DoctorRunResult> {
  if (command === 'flow') {
    return runDiagnosticsWithCore(flowChecks(), {
      cwd: process.cwd(),
      env: process.env,
      configPath: options.configPath
    });
  }

  const check = FLOW_CHECKS[command];
  const selectedChecks = check ? [check] : allChecks();

  return runDiagnosticsWithCore(selectedChecks, {
    cwd: process.cwd(),
    env: process.env,
    configPath: options.configPath
  });
}
