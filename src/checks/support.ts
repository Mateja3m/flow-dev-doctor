import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { loadConfig } from '../config/load.js';
import type { CheckContext, CheckResult } from '../types.js';

const flowJsonSchema = z.object({
  networks: z.record(z.string(), z.unknown()).optional(),
  accounts: z.record(z.string(), z.unknown()).optional(),
  contracts: z
    .record(z.string(), z.union([z.string(), z.record(z.string(), z.unknown())]))
    .optional()
});

export interface FlowJsonLoadResult {
  path: string;
  data: z.infer<typeof flowJsonSchema>;
}

export const NETWORK_DEFAULTS: Record<'emulator' | 'testnet' | 'mainnet', string> = {
  emulator: 'http://127.0.0.1:8888',
  testnet: 'https://rest-testnet.onflow.org',
  mainnet: 'https://rest-mainnet.onflow.org'
};

export function loadFlowJson(cwd: string): FlowJsonLoadResult | undefined {
  const path = resolve(cwd, 'flow.json');
  if (!existsSync(path)) {
    return undefined;
  }

  const content = readFileSync(path, 'utf8');
  const parsed = JSON.parse(content) as unknown;

  return {
    path,
    data: flowJsonSchema.parse(parsed)
  };
}

export function resolveAccessNode(
  context: CheckContext
): { endpoint: string; configValid: boolean } | CheckResult {
  try {
    const loaded = loadConfig(context.cwd, context.configPath);
    return {
      endpoint: loaded.config.flowAccessNode ?? NETWORK_DEFAULTS[loaded.config.flowNetwork],
      configValid: true
    };
  } catch (error) {
    return {
      id: 'config.load_error',
      title: 'Configuration parsing',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unable to parse configuration.',
      recommendation: 'Fix configuration format before running network-dependent checks.'
    };
  }
}

export async function probeEndpoint(
  url: string,
  method: 'GET' | 'HEAD' = 'GET',
  timeoutMs = 2500
): Promise<{ reachable: boolean; statusCode?: number; reason?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method,
        signal: controller.signal,
        headers: { accept: 'application/json' }
      });

      return {
        reachable: response.ok || response.status < 500,
        statusCode: response.status,
        reason: response.ok ? undefined : `status ${response.status}`
      };
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    return {
      reachable: false,
      reason: error instanceof Error ? error.message : 'unexpected failure'
    };
  }
}

export function hasFlowAccounts(value: z.infer<typeof flowJsonSchema> | undefined): boolean {
  return Boolean(value?.accounts && Object.keys(value.accounts).length > 0);
}

export function hasFlowNetwork(
  value: z.infer<typeof flowJsonSchema> | undefined,
  network: string
): boolean {
  return Boolean(value?.networks && Object.prototype.hasOwnProperty.call(value.networks, network));
}

export function hasValidContractMappings(
  value: z.infer<typeof flowJsonSchema> | undefined
): boolean {
  if (!value?.contracts) {
    return true;
  }

  return Object.values(value.contracts).every((contract) => {
    if (typeof contract === 'string') {
      return contract.trim().length > 0;
    }

    if (!contract || typeof contract !== 'object') {
      return false;
    }

    if (
      'source' in contract &&
      typeof contract.source === 'string' &&
      contract.source.trim().length > 0
    ) {
      return true;
    }

    if (
      'aliases' in contract &&
      typeof contract.aliases === 'object' &&
      contract.aliases !== null
    ) {
      return Object.values(contract.aliases).every(
        (address) => typeof address === 'string' && address.trim().length > 0
      );
    }

    if (
      'addresses' in contract &&
      typeof contract.addresses === 'object' &&
      contract.addresses !== null
    ) {
      return Object.values(contract.addresses).every(
        (address) => typeof address === 'string' && address.trim().length > 0
      );
    }

    return false;
  });
}
