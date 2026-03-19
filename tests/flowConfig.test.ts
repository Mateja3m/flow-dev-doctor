import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { flowConfigCheck } from '../src/checks/flowConfig.js';

describe('flowConfigCheck', () => {
  it('fails when flow.json has no accounts', async () => {
    const cwd = mkdtempSync(join(tmpdir(), 'dev-doctor-flow-json-'));
    writeFileSync(
      join(cwd, 'flow.json'),
      JSON.stringify({
        networks: { testnet: 'testnet' },
        accounts: {},
        contracts: { Example: './cadence/Example.cdc' }
      })
    );

    const results = await flowConfigCheck.run({ cwd, env: process.env });

    expect(results.find((check) => check.id === 'flow.config.accounts')?.status).toBe('fail');
  });

  it('fails when contract mapping is invalid', async () => {
    const cwd = mkdtempSync(join(tmpdir(), 'dev-doctor-flow-json-'));
    writeFileSync(
      join(cwd, 'flow.json'),
      JSON.stringify({
        networks: { testnet: 'testnet' },
        accounts: { testnet: { address: '0x0000000000000001' } },
        contracts: { Example: {} }
      })
    );

    const results = await flowConfigCheck.run({ cwd, env: process.env });

    expect(results.find((check) => check.id === 'flow.config.contracts')?.status).toBe('fail');
  });
});
