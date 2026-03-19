import type { DoctorCheck } from '../types.js';
import { accountCheck } from './account.js';
import { configCheck } from './config.js';
import { envCheck } from './env.js';
import { flowConfigCheck } from './flowConfig.js';
import { networkCheck } from './network.js';
import { readinessCheck } from './readiness.js';
import { workflowCheck } from './workflow.js';

export const FLOW_CHECKS: Record<string, DoctorCheck> = {
  env: envCheck,
  config: configCheck,
  account: accountCheck,
  flowConfig: flowConfigCheck,
  network: networkCheck,
  readiness: readinessCheck,
  workflow: workflowCheck
};

export function flowChecks(): DoctorCheck[] {
  return [flowConfigCheck, workflowCheck, readinessCheck];
}

export function allChecks(): DoctorCheck[] {
  return Object.values(FLOW_CHECKS);
}
