import * as idoaCliKit from '@idoa/dev-doctor-cli-kit';
import * as idoaCore from '@idoa/dev-doctor-core';
import * as idoaReporter from '@idoa/dev-doctor-reporter';
import * as idoaTypes from '@idoa/dev-doctor-types';
import * as idoaUtils from '@idoa/dev-doctor-utils';
import type { CheckContext, CheckResult, DoctorCheck, DoctorRunResult } from '../types.js';

export interface IdoaModules {
  core: Record<string, unknown>;
  reporter: Record<string, unknown>;
  cliKit: Record<string, unknown>;
  types: Record<string, unknown>;
  utils: Record<string, unknown>;
}

export const idoaModules: IdoaModules = {
  core: idoaCore as Record<string, unknown>,
  reporter: idoaReporter as Record<string, unknown>,
  cliKit: idoaCliKit as Record<string, unknown>,
  types: idoaTypes as Record<string, unknown>,
  utils: idoaUtils as Record<string, unknown>
};

export async function runDiagnosticsWithCore(
  checks: DoctorCheck[],
  context: CheckContext
): Promise<DoctorRunResult> {
  const maybeRunDiagnostics = idoaModules.core['runDiagnostics'];

  if (typeof maybeRunDiagnostics === 'function') {
    try {
      const runDiagnostics = maybeRunDiagnostics as (input: {
        chain: 'flow';
        checks: DoctorCheck[];
        context: CheckContext;
      }) => Promise<unknown>;
      const result = await runDiagnostics({ chain: 'flow', checks, context });
      if (isDoctorRunResult(result)) {
        return result;
      }
    } catch (error) {
      const fallback = await runChecksLocally(checks, context);
      fallback.checks.unshift({
        id: 'core.runtime',
        title: 'Shared core execution',
        status: 'warn',
        message: toErrorMessage(error),
        recommendation: 'Using local fallback runner for this execution.'
      });
      return fallback;
    }
  }

  return runChecksLocally(checks, context);
}

async function runChecksLocally(
  checks: DoctorCheck[],
  context: CheckContext
): Promise<DoctorRunResult> {
  const results: CheckResult[] = [];

  for (const check of checks) {
    try {
      const checkResults = await check.run(context);
      results.push(...checkResults);
    } catch (error) {
      results.push({
        id: `check.${check.name}.runtime`,
        title: `Check ${check.name} runtime error`,
        status: 'fail',
        message: toErrorMessage(error),
        recommendation:
          'Review check logs and ensure local setup aligns with expected prerequisites.'
      });
    }
  }

  return {
    chain: 'flow',
    generatedAt: new Date().toISOString(),
    checks: results
  };
}

function toErrorMessage(error: unknown): string {
  const maybeSafeMessage = idoaModules.utils['safeErrorMessage'];
  if (typeof maybeSafeMessage === 'function') {
    const safeErrorMessage = maybeSafeMessage as (input: unknown) => unknown;
    const result = safeErrorMessage(error);
    if (typeof result === 'string' && result.length > 0) {
      return result;
    }
  }

  return error instanceof Error ? error.message : 'Unexpected error';
}

function isDoctorRunResult(value: unknown): value is DoctorRunResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<DoctorRunResult>;
  return (
    candidate.chain === 'flow' &&
    typeof candidate.generatedAt === 'string' &&
    Array.isArray(candidate.checks)
  );
}
