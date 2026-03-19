export type OutputFormat = 'human' | 'json';

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'skip';

export interface CheckResult {
  id: string;
  title: string;
  status: CheckStatus;
  message: string;
  recommendation?: string;
  meta?: Record<string, unknown>;
}

export interface CheckContext {
  cwd: string;
  env: NodeJS.ProcessEnv;
  configPath?: string;
}

export interface DoctorCheck {
  name: string;
  run: (context: CheckContext) => Promise<CheckResult[]>;
}

export interface DoctorRunResult {
  chain: 'flow';
  generatedAt: string;
  checks: CheckResult[];
}

export interface CliOptions {
  format: OutputFormat;
  configPath?: string;
}
