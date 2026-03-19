import { loadConfig } from '../config/load.js';
import type { DoctorCheck } from '../types.js';
import { probeEndpoint } from './support.js';

export const workflowCheck: DoctorCheck = {
  name: 'workflow',
  async run(context) {
    try {
      const loaded = loadConfig(context.cwd, context.configPath);
      const { config } = loaded;

      const networkReady = config.flowNetwork === 'testnet' || config.flowNetwork === 'emulator';
      const faucetConfigured = Boolean(config.flowFaucetUrl);
      const faucetProbe =
        config.flowNetwork === 'testnet' && config.flowFaucetUrl
          ? await probeEndpoint(config.flowFaucetUrl, 'HEAD', 2000)
          : undefined;

      const faucetStatus =
        config.flowNetwork !== 'testnet'
          ? 'skip'
          : !faucetConfigured
            ? 'warn'
            : faucetProbe?.reachable
              ? 'pass'
              : 'fail';

      return [
        {
          id: 'workflow.network_mode',
          title: 'Test workflow network mode',
          status: networkReady ? 'pass' : 'warn',
          message: `Configured network is ${config.flowNetwork}`,
          recommendation: networkReady
            ? undefined
            : 'Use testnet or emulator for onboarding and faucet-oriented workflow checks.'
        },
        {
          id: 'workflow.faucet',
          title: 'Faucet availability',
          status: faucetStatus,
          message:
            config.flowNetwork !== 'testnet'
              ? 'Faucet availability is only checked for testnet workflows.'
              : !faucetConfigured
                ? 'No faucet endpoint configured for this workspace.'
                : faucetProbe?.reachable
                  ? `Faucet endpoint responded to HEAD request: ${config.flowFaucetUrl}`
                  : `Faucet endpoint did not respond successfully: ${config.flowFaucetUrl} (${faucetProbe?.reason ?? 'unknown error'})`,
          recommendation:
            config.flowNetwork !== 'testnet'
              ? undefined
              : !faucetConfigured
                ? 'Add flowFaucetUrl in flow-doctor.config.json for consistent testnet funding workflow guidance.'
                : faucetProbe?.reachable
                  ? undefined
                  : 'Verify the faucet URL or testnet service status before onboarding new developers.'
        },
        {
          id: 'workflow.faucet_endpoint',
          title: 'Faucet configuration hint',
          status: config.flowNetwork === 'testnet' && !faucetConfigured ? 'warn' : 'pass',
          message: faucetConfigured
            ? `Faucet endpoint configured: ${config.flowFaucetUrl}`
            : 'No faucet endpoint configured for this workspace.',
          recommendation:
            config.flowNetwork === 'testnet' && !faucetConfigured
              ? 'Add flowFaucetUrl in flow-doctor.config.json for consistent testnet funding workflow guidance.'
              : undefined
        },
        {
          id: 'workflow.sample_flow',
          title: 'Sample transaction workflow (bounded)',
          status: 'skip',
          message:
            'Placeholder validation only: this PoC confirms prerequisites but does not submit a real transaction.',
          recommendation:
            'Use this as an extension point for a future optional dry-run against emulator or testnet.'
        }
      ];
    } catch (error) {
      return [
        {
          id: 'workflow.config_error',
          title: 'Workflow configuration load',
          status: 'fail',
          message:
            error instanceof Error ? error.message : 'Unable to parse workflow configuration.',
          recommendation: 'Fix configuration format and retry workflow diagnostics.'
        }
      ];
    }
  }
};
