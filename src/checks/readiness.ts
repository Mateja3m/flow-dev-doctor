import { loadConfig } from '../config/load.js';
import type { DoctorCheck } from '../types.js';
import { probeEndpoint, resolveAccessNode } from './support.js';

export const readinessCheck: DoctorCheck = {
  name: 'readiness',
  async run(context) {
    try {
      const loaded = loadConfig(context.cwd, context.configPath);
      const accountExists = Boolean(loaded.config.flowAccountAddress);
      const supportedNetwork =
        loaded.config.flowNetwork === 'emulator' || loaded.config.flowNetwork === 'testnet';
      const baseChecks = [
        {
          id: 'readiness.account',
          title: 'Account readiness',
          status: accountExists ? 'pass' : 'fail',
          message: accountExists
            ? `Configured account: ${loaded.config.flowAccountAddress}`
            : 'No flowAccountAddress configured for onboarding checks.',
          recommendation: accountExists
            ? undefined
            : 'Set flowAccountAddress before attempting Flow onboarding workflows.'
        },
        {
          id: 'readiness.network',
          title: 'Supported onboarding network',
          status: supportedNetwork ? 'pass' : 'warn',
          message: `Configured network: ${loaded.config.flowNetwork}`,
          recommendation: supportedNetwork
            ? undefined
            : 'Use emulator or testnet for onboarding validation instead of mainnet.'
        }
      ] as const;

      const endpointResult = resolveAccessNode(context);
      if ('id' in endpointResult) {
        return [
          ...baseChecks,
          endpointResult,
          {
            id: 'readiness.status',
            title: 'Transaction readiness',
            status: 'warn',
            message: 'One or more onboarding prerequisites are missing or degraded.',
            recommendation:
              'Resolve account, network, and access node issues before relying on workflow checks.'
          }
        ];
      }

      const accessNodeCheck = await probeEndpoint(endpointResult.endpoint, 'GET');
      const ready = accountExists && supportedNetwork && accessNodeCheck.reachable;

      return [
        ...baseChecks,
        {
          id: 'readiness.access_node',
          title: 'Access node readiness',
          status: accessNodeCheck.reachable ? 'pass' : 'fail',
          message: accessNodeCheck.reachable
            ? `Access node reachable at ${endpointResult.endpoint}`
            : `Access node not reachable at ${endpointResult.endpoint} (${accessNodeCheck.reason ?? 'unknown error'})`,
          recommendation: accessNodeCheck.reachable
            ? undefined
            : 'Verify the configured access node before running onboarding workflows.'
        },
        {
          id: 'readiness.status',
          title: 'Transaction readiness',
          status: ready ? 'pass' : 'warn',
          message: ready
            ? 'Core onboarding prerequisites are in place for bounded Flow workflow validation.'
            : 'One or more onboarding prerequisites are missing or degraded.',
          recommendation: ready
            ? undefined
            : 'Resolve account, network, and access node issues before relying on workflow checks.'
        }
      ];
    } catch (error) {
      return [
        {
          id: 'readiness.config',
          title: 'Readiness configuration',
          status: 'fail',
          message:
            error instanceof Error ? error.message : 'Unable to evaluate transaction readiness.',
          recommendation: 'Fix configuration parsing issues before running readiness diagnostics.'
        }
      ];
    }
  }
};
