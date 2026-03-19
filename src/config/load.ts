import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { flowConfigSchema, type FlowDoctorConfig } from './schema.js';

export const DEFAULT_CONFIG_FILES = ['flow-doctor.config.json', '.flow-doctor.json'] as const;

export interface ConfigLoadResult {
  config: FlowDoctorConfig;
  path?: string;
  source: 'default' | 'file';
}

export function loadConfig(cwd: string, explicitPath?: string): ConfigLoadResult {
  if (explicitPath) {
    return fromFile(resolve(cwd, explicitPath));
  }

  for (const file of DEFAULT_CONFIG_FILES) {
    const fullPath = resolve(cwd, file);
    if (existsSync(fullPath)) {
      return fromFile(fullPath);
    }
  }

  return {
    config: flowConfigSchema.parse({}),
    source: 'default'
  };
}

function fromFile(path: string): ConfigLoadResult {
  const content = readFileSync(path, 'utf8');
  const raw = JSON.parse(content) as unknown;
  return {
    config: flowConfigSchema.parse(raw),
    path,
    source: 'file'
  };
}
