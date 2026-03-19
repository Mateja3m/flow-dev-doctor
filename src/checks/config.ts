import { DEFAULT_CONFIG_FILES, loadConfig } from '../config/load.js';
import type { DoctorCheck } from '../types.js';

export const configCheck: DoctorCheck = {
  name: 'config',
  run(context) {
    try {
      const loaded = loadConfig(context.cwd, context.configPath);
      const { config } = loaded;

      return Promise.resolve([
        {
          id: 'config.source',
          title: 'Config source',
          status: loaded.source === 'file' ? 'pass' : 'warn',
          message:
            loaded.source === 'file'
              ? `Loaded configuration from ${loaded.path}`
              : `No config file found (${DEFAULT_CONFIG_FILES.join(', ')}). Using safe defaults.`,
          recommendation:
            loaded.source === 'file'
              ? undefined
              : 'Create flow-doctor.config.json to make team defaults explicit.'
        },
        {
          id: 'config.network',
          title: 'Flow network target',
          status: 'pass',
          message: `Configured network: ${config.flowNetwork}`
        },
        {
          id: 'config.access_node',
          title: 'Flow access node endpoint',
          status: config.flowAccessNode ? 'pass' : 'warn',
          message: config.flowAccessNode
            ? `Using configured access node: ${config.flowAccessNode}`
            : 'No access node configured; defaults may differ by local tooling.',
          recommendation: config.flowAccessNode
            ? undefined
            : 'Set flowAccessNode to a project-approved endpoint for reproducible diagnostics.'
        }
      ]);
    } catch (error) {
      return Promise.resolve([
        {
          id: 'config.load_error',
          title: 'Configuration parsing',
          status: 'fail',
          message: error instanceof Error ? error.message : 'Unable to parse configuration.',
          recommendation: 'Fix configuration format and rerun `flow-doctor doctor config`.'
        }
      ]);
    }
  }
};
