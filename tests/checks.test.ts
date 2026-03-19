import { describe, expect, it } from 'vitest';
import { FLOW_CHECKS } from '../src/checks/index.js';

describe('FLOW_CHECKS', () => {
  it('includes expected Flow-specific checks', () => {
    expect(Object.keys(FLOW_CHECKS).sort()).toEqual([
      'account',
      'config',
      'env',
      'flowConfig',
      'network',
      'readiness',
      'workflow'
    ]);
  });
});
