import { describe, expect, it } from 'vitest';
import { runCommand } from '../src/commands/run.js';

describe('runCommand', () => {
  it('runs single command group', async () => {
    const result = await runCommand('config', { format: 'human' });
    expect(result.chain).toBe('flow');
    expect(result.checks.length).toBeGreaterThan(0);
  });

  it('runs all checks when command is unknown', async () => {
    const result = await runCommand('all', { format: 'json' });
    expect(result.checks.length).toBeGreaterThan(2);
  });

  it('runs workflow checks', async () => {
    const result = await runCommand('workflow', { format: 'human' });
    expect(result.checks.some((check) => check.id.startsWith('workflow.'))).toBe(true);
  });

  it('runs grouped flow checks', async () => {
    const result = await runCommand('flow', { format: 'human' });
    expect(result.checks.some((check) => check.id.startsWith('flow.config.'))).toBe(true);
    expect(result.checks.some((check) => check.id.startsWith('readiness.'))).toBe(true);
    expect(result.checks.some((check) => check.id.startsWith('workflow.'))).toBe(true);
  });
});
