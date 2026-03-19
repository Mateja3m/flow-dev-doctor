import { z } from 'zod';

export const flowConfigSchema = z.object({
  flowNetwork: z.enum(['emulator', 'testnet', 'mainnet']).default('testnet'),
  flowAccessNode: z.string().url().optional(),
  flowFaucetUrl: z.string().url().optional(),
  flowAccountAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{16}$/, 'Expected Flow account in 0x-prefixed 16-hex format')
    .optional(),
  flowPrivateKey: z.string().min(32).optional()
});

export type FlowDoctorConfig = z.infer<typeof flowConfigSchema>;
