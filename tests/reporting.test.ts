import { describe, expect, it } from 'vitest';
import { buildReport } from '../src/reporting/generate.js';

describe('buildReport', () => {
  it('generates summary and markdown', () => {
    const report = buildReport({
      chain: 'flow',
      generatedAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
      checks: [
        { id: 'a', title: 'A', status: 'pass', message: 'ok' },
        { id: 'b', title: 'B', status: 'warn', message: 'warn' }
      ]
    });

    expect(report.summary.total).toBe(2);
    expect(report.summary.pass).toBe(1);
    expect(report.summary.warn).toBe(1);
    expect(report.markdown).toContain('# Flow Dev Doctor Report');
    expect(report.markdown).toContain('## Flow Onboarding Readiness');
  });
});
