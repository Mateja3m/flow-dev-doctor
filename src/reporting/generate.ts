import { idoaModules } from '../adapters/idoa.js';
import type { DoctorRunResult } from '../types.js';

export interface ReportOutput {
  summary: {
    total: number;
    pass: number;
    warn: number;
    fail: number;
    skip: number;
  };
  markdown: string;
}

export function buildReport(result: DoctorRunResult): ReportOutput {
  const maybeGenerateReport = idoaModules.reporter['generateReport'];
  if (typeof maybeGenerateReport === 'function') {
    const generateReport = maybeGenerateReport as (input: DoctorRunResult) => unknown;
    const sharedReport = generateReport(result);
    if (isReportOutput(sharedReport)) {
      return sharedReport;
    }
  }

  const summary = summarize(result);
  const onboardingChecks = [
    selectCheck(result, [
      'flow.config.parse',
      'flow.config.file',
      'flow.config.accounts',
      'flow.config.contracts'
    ]),
    selectCheck(result, ['workflow.faucet', 'workflow.faucet_endpoint']),
    selectCheck(result, ['readiness.status', 'readiness.config'])
  ].filter((value): value is NonNullable<typeof value> => Boolean(value));

  const markdown = [
    '# Flow Dev Doctor Report',
    '',
    `Generated at: ${result.generatedAt}`,
    '',
    `- Total checks: ${summary.total}`,
    `- Pass: ${summary.pass}`,
    `- Warn: ${summary.warn}`,
    `- Fail: ${summary.fail}`,
    `- Skip: ${summary.skip}`,
    '',
    '## Flow Onboarding Readiness',
    ...onboardingChecks.map(
      (check) => `- ${check.title}: [${check.status.toUpperCase()}] ${check.message}`
    ),
    '',
    '## Checks',
    ...result.checks.map(
      (check) => `- [${check.status.toUpperCase()}] ${check.title}: ${check.message}`
    )
  ].join('\n');

  return { summary, markdown };
}

function selectCheck(result: DoctorRunResult, ids: string[]) {
  return result.checks.find((check) => ids.includes(check.id));
}

function summarize(result: DoctorRunResult): ReportOutput['summary'] {
  return result.checks.reduce(
    (acc, check) => {
      acc.total += 1;
      acc[check.status] += 1;
      return acc;
    },
    { total: 0, pass: 0, warn: 0, fail: 0, skip: 0 }
  );
}

function isReportOutput(value: unknown): value is ReportOutput {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ReportOutput>;
  return Boolean(candidate.summary && typeof candidate.markdown === 'string');
}
