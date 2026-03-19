import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config/load.js';

describe('loadConfig', () => {
  it('uses defaults when no config exists', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'dev-doctor-flow-'));
    const result = loadConfig(cwd);

    expect(result.source).toBe('default');
    expect(result.config.flowNetwork).toBe('testnet');
  });

  it('loads explicit config file', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'dev-doctor-flow-'));
    const configPath = join(cwd, 'custom.json');

    writeFileSync(
      configPath,
      JSON.stringify({
        flowNetwork: 'emulator',
        flowAccessNode: 'http://127.0.0.1:8888',
        flowAccountAddress: '0x0000000000000001'
      })
    );

    const result = loadConfig(cwd, 'custom.json');

    expect(result.source).toBe('file');
    expect(result.config.flowNetwork).toBe('emulator');
  });
});
