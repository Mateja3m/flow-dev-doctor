import { access } from 'node:fs/promises';
import { delimiter, resolve } from 'node:path';
import type { DoctorCheck, CheckResult } from '../types.js';

export const envCheck: DoctorCheck = {
  name: 'env',
  async run(context) {
    const checks: CheckResult[] = [];
    const nodeMajor = Number.parseInt(process.versions.node.split('.')[0] ?? '0', 10);

    checks.push({
      id: 'env.node',
      title: 'Node.js version',
      status: nodeMajor >= 20 ? 'pass' : 'fail',
      message: `Detected Node.js ${process.versions.node}`,
      recommendation: nodeMajor >= 20 ? undefined : 'Upgrade to Node.js 20 or newer.'
    });

    const flowCliPath = context.env.FLOW_CLI_PATH ?? 'flow';
    const hasFlowCli = await commandExists(flowCliPath);

    checks.push({
      id: 'env.flow_cli',
      title: 'Flow CLI availability',
      status: hasFlowCli ? 'pass' : 'warn',
      message: hasFlowCli
        ? `Flow CLI found via ${flowCliPath}`
        : 'Flow CLI was not found using FLOW_CLI_PATH or default command.',
      recommendation: hasFlowCli
        ? undefined
        : 'Install Flow CLI and set FLOW_CLI_PATH if it is not on PATH.'
    });

    const packageJsonPath = resolve(context.cwd, 'package.json');
    const hasPackageJson = await fileExists(packageJsonPath);

    checks.push({
      id: 'env.workspace',
      title: 'Workspace has package.json',
      status: hasPackageJson ? 'pass' : 'warn',
      message: hasPackageJson
        ? 'package.json exists in the current working directory.'
        : 'No package.json found in the current working directory.',
      recommendation: hasPackageJson
        ? undefined
        : 'Run commands from your Flow project root or initialize npm before onboarding checks.'
    });

    return checks;
  }
};

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function commandExists(commandPath: string): Promise<boolean> {
  if (commandPath.includes('/')) {
    return fileExists(commandPath);
  }

  const pathEnv = process.env.PATH;
  if (!pathEnv) {
    return false;
  }

  for (const part of pathEnv.split(delimiter)) {
    if (await fileExists(resolve(part, commandPath))) {
      return true;
    }
  }

  return false;
}
