import { buildReport } from '../reporting/generate.js';
import type { DoctorRunResult, OutputFormat } from '../types.js';

export function renderOutput(result: DoctorRunResult, format: OutputFormat): string {
  if (format === 'json') {
    return JSON.stringify(
      {
        result,
        report: buildReport(result)
      },
      null,
      2
    );
  }

  const report = buildReport(result);
  const lines = [
    `Flow Dev Doctor (${result.generatedAt})`,
    `Checks: ${report.summary.total} | Pass: ${report.summary.pass} | Warn: ${report.summary.warn} | Fail: ${report.summary.fail} | Skip: ${report.summary.skip}`,
    ''
  ];

  for (const check of result.checks) {
    lines.push(`[${check.status.toUpperCase()}] ${check.title}`);
    lines.push(`  ${check.message}`);
    if (check.recommendation) {
      lines.push(`  Next step: ${check.recommendation}`);
    }
  }

  return lines.join('\n');
}
