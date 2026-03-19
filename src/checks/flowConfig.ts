import { loadConfig } from '../config/load.js';
import type { DoctorCheck } from '../types.js';
import {
  hasFlowAccounts,
  hasFlowNetwork,
  hasValidContractMappings,
  loadFlowJson
} from './support.js';

export const flowConfigCheck: DoctorCheck = {
  name: 'flowConfig',
  run(context) {
    try {
      const flowJson = loadFlowJson(context.cwd);
      if (!flowJson) {
        return Promise.resolve([
          {
            id: 'flow.config.file',
            title: 'flow.json presence',
            status: 'warn',
            message: 'No flow.json found in the current working directory.',
            recommendation:
              'Add flow.json to make Flow project configuration explicit for onboarding.'
          }
        ]);
      }

      let targetNetwork = 'testnet';
      try {
        targetNetwork = loadConfig(context.cwd, context.configPath).config.flowNetwork;
      } catch {
        targetNetwork = 'testnet';
      }

      return Promise.resolve([
        {
          id: 'flow.config.accounts',
          title: 'flow.json accounts',
          status: hasFlowAccounts(flowJson.data) ? 'pass' : 'fail',
          message: hasFlowAccounts(flowJson.data)
            ? `flow.json defines ${Object.keys(flowJson.data.accounts ?? {}).length} account entries.`
            : 'flow.json does not define any accounts.',
          recommendation: hasFlowAccounts(flowJson.data)
            ? undefined
            : 'Add at least one account entry to flow.json for local onboarding workflows.'
        },
        {
          id: 'flow.config.contracts',
          title: 'flow.json contracts mapping',
          status: hasValidContractMappings(flowJson.data) ? 'pass' : 'fail',
          message: hasValidContractMappings(flowJson.data)
            ? 'Contract mappings are structurally valid.'
            : 'One or more contract mappings are missing a valid source or address mapping.',
          recommendation: hasValidContractMappings(flowJson.data)
            ? undefined
            : 'Use non-empty string source paths or valid address mappings for every contract.'
        },
        {
          id: 'flow.config.network',
          title: 'flow.json target network',
          status: hasFlowNetwork(flowJson.data, targetNetwork) ? 'pass' : 'warn',
          message: hasFlowNetwork(flowJson.data, targetNetwork)
            ? `flow.json includes network configuration for ${targetNetwork}.`
            : `flow.json does not define the configured network ${targetNetwork}.`,
          recommendation: hasFlowNetwork(flowJson.data, targetNetwork)
            ? undefined
            : 'Add the expected network to flow.json or align flow-doctor config with the project target.'
        }
      ]);
    } catch (error) {
      return Promise.resolve([
        {
          id: 'flow.config.parse',
          title: 'flow.json parsing',
          status: 'fail',
          message: error instanceof Error ? error.message : 'Unable to parse flow.json safely.',
          recommendation: 'Fix flow.json structure and rerun `flow-doctor doctor flow`.'
        }
      ]);
    }
  }
};
