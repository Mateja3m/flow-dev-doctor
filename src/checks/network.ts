import type { DoctorCheck } from '../types.js';
import { probeEndpoint, resolveAccessNode } from './support.js';

export const networkCheck: DoctorCheck = {
  name: 'network',
  async run(context) {
    try {
      const endpointResult = resolveAccessNode(context);
      if ('id' in endpointResult) {
        return [endpointResult];
      }

      const probe = await probeEndpoint(endpointResult.endpoint);

      return [
        {
          id: 'network.endpoint',
          title: 'Access node reachability',
          status: probe.reachable ? 'pass' : 'warn',
          message: probe.reachable
            ? `Successfully reached ${endpointResult.endpoint}`
            : `Unable to reach ${endpointResult.endpoint} (${probe.reason ?? 'unknown error'})`,
          recommendation: probe.reachable
            ? undefined
            : 'Verify VPN/proxy settings, endpoint correctness, and local network policy.'
        }
      ];
    } catch (error) {
      return [
        {
          id: 'network.load_error',
          title: 'Network configuration parsing',
          status: 'fail',
          message:
            error instanceof Error ? error.message : 'Unable to parse network configuration.',
          recommendation: 'Fix configuration format and rerun `flow-doctor doctor network`.'
        }
      ];
    }
  }
};
