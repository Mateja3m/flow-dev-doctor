import { loadConfig } from '../config/load.js';
import type { DoctorCheck } from '../types.js';

export const accountCheck: DoctorCheck = {
  name: 'account',
  run(context) {
    try {
      const loaded = loadConfig(context.cwd, context.configPath);

      return Promise.resolve([
        {
          id: 'account.address',
          title: 'Flow account address configured',
          status: loaded.config.flowAccountAddress ? 'pass' : 'warn',
          message: loaded.config.flowAccountAddress
            ? `Configured account: ${loaded.config.flowAccountAddress}`
            : 'No flowAccountAddress configured.',
          recommendation: loaded.config.flowAccountAddress
            ? undefined
            : 'Set flowAccountAddress for deterministic account-related checks.'
        },
        {
          id: 'account.key',
          title: 'Private key handling',
          status: loaded.config.flowPrivateKey ? 'warn' : 'pass',
          message: loaded.config.flowPrivateKey
            ? 'A private key was found in local config.'
            : 'No private key found in config file.',
          recommendation: loaded.config.flowPrivateKey
            ? 'Prefer environment variables or secure secret stores over committing keys to config.'
            : undefined
        }
      ]);
    } catch (error) {
      return Promise.resolve([
        {
          id: 'account.load_error',
          title: 'Account configuration parsing',
          status: 'fail',
          message:
            error instanceof Error ? error.message : 'Unable to parse account configuration.',
          recommendation: 'Fix configuration format and rerun `flow-doctor doctor account`.'
        }
      ]);
    }
  }
};
