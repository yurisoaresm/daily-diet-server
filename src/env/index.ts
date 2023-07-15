import { config } from 'dotenv';
import { z } from 'zod';

switch (process.env.NODE_ENV) {
  case 'development':
    config({ path: '.env.development' });
    break;
  case 'test':
    config({ path: '.env.test' });
    break;
  default:
    config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['pg', 'sqlite']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3000),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('⚠️ Invalid environment variables', _env.error.format());

  throw new Error('Invalid environment variables');
}

export const env = _env.data;
